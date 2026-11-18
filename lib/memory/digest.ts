import "server-only";
import { check, db, updateFile } from "@/lib/data/db";
import { invalidate } from "@/lib/data";
import { costOf, DIGEST_MODEL, digestSelection, estimateRun, SpendGate, type Digest, type Dollars } from "./digest-rules.ts";
import {
  appendUnderSection, buildOutline, DigestQueue, DIGEST_SCHEMA, DIGEST_SYSTEM, DIGEST_SYSTEM_BLOCKS, fmtDate, fromCallLine, headingsOf, runDigest, slimOutline,
  type AskMessage, type AskReply, type CallForDigest, type CallUsage, type DigestDeps, type DigestOutcome, type ProjectForDigest, type SuggestionRow,
} from "./digest-core.ts";

// Call digests against Supabase and Claude: a 5 to 8 line summary per call, a headline per linked project, and
// suggested vault facts kept pending in clientos.vault_suggestions until a strategist accepts or rejects them.
// Reads only the stored (screened) body; never writes into vault_files except through an accepted suggestion.
// Cost: the system prompt and each project's slim vault outline form a cached prefix (cache_control on the outline),
// calls run grouped by project so the cache stays warm, and maxDollars caps actual spend during a run.

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;

const MAX_TOKENS = 16000;
/** The digest route stops starting calls after this, so a run ends well inside the route's 300 s limit. */
const TIME_BUDGET_MS = 270_000;
const LAST_START_MS = 150_000;
const CONCURRENCY = 3;
const PAGE = 200;

/** Output tokens per call measured by the last run of at least MEASURE_MIN_CALLS calls in this process (in memory only). */
let measuredOutput: number | null = null;
const MEASURE_MIN_CALLS = 5;
/**
 * Below this many characters of system prompt + outline (about 600 tokens), the prefix may be under Opus 5.5's 512-token
 * cache minimum: the run warns and the estimate prices it as plain input.
 */
const MIN_CACHE_CHARS = 2400;

const sortIds = (ids: string[]) => [...new Set(ids)].sort();

// ---------------------------------------------------------------- outlines

/**
 * Each project's slim vault outline, loaded once per run, so every call of the same projects sends identical bytes.
 * Only active files (not hidden, archived or deleted), filtered by slimOutline; files with a pending or accepted suggestion stay.
 */
function outlineSource(log: (l: string) => void) {
  const cache = new Map<string, ProjectForDigest>();
  const chars = new Map<string, number>();
  return {
    chars,
    async projects(accountIds: string[]): Promise<ProjectForDigest[]> {
      const ids = sortIds(accountIds);
      const missing = ids.filter((id) => !cache.has(id));
      if (missing.length) {
        const [accts, files, accepted] = await Promise.all([
          db().from("accounts").select("id,slug,name").in("id", missing).then((r) => check(r, "read projects") as Row[]),
          db().from("vault_files").select("account_id,path,content").in("account_id", missing).eq("state", "active").order("path").then((r) => check(r, "read vault outline") as Row[]),
          db().from("vault_suggestions").select("account_id,file_path").in("account_id", missing).in("status", ["pending", "accepted"]).then((r) => check(r, "read suggestions") as Row[]),
        ]);
        for (const a of accts) {
          const took = new Set(accepted.filter((s) => s.account_id === a.id).map((s) => s.file_path as string));
          const p: ProjectForDigest = {
            slug: a.slug, name: a.name ?? a.slug, accountId: a.id,
            files: slimOutline(files.filter((f) => f.account_id === a.id).map((f) => ({ path: f.path, headings: headingsOf(f.content ?? ""), hasSuggestion: took.has(f.path) }))),
          };
          cache.set(a.id, p);
          const n = buildOutline([p]).length;
          chars.set(p.slug, n);
          log(`outline ${p.slug}: ${n} characters, ${p.files.length} files`);
        }
      }
      return ids.map((id) => cache.get(id)).filter((p): p is ProjectForDigest => !!p);
    },
  };
}
type Outlines = ReturnType<typeof outlineSource>;

// ---------------------------------------------------------------- wiring

async function loadCall(id: string, outlines: Outlines): Promise<CallForDigest | null> {
  const t = check(await db().from("transcripts").select("id,title,met_at,status,body").eq("id", id).maybeSingle(), "read call") as Row | null;
  if (!t) return null;
  const links = check(await db().from("transcript_accounts").select("account_id").eq("transcript_id", id), "read call projects") as Row[];
  return {
    id: t.id, title: t.title ?? "", metAt: t.met_at ?? null, status: t.status, body: t.body ?? null,
    projects: await outlines.projects(links.map((l) => l.account_id as string)),
  };
}

async function ask(messages: AskMessage[], opts: { signal?: AbortSignal; onStart?: () => void } = {}): Promise<AskReply> {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();
  // No sampling parameters: a JSON schema fixes the shape, low effort keeps thinking short. The system blocks and the
  // outline block (cache_control) are the cached prefix; the call's own text follows the breakpoint.
  const stream = client.messages.stream({
    model: DIGEST_MODEL,
    max_tokens: MAX_TOKENS,
    system: DIGEST_SYSTEM_BLOCKS,
    messages,
    output_config: { effort: "low", format: { type: "json_schema", schema: DIGEST_SCHEMA as unknown as Record<string, unknown> } },
  }, { signal: opts.signal });
  // message_start comes once the prompt is read, so the cache entry exists: other calls of the project may start.
  if (opts.onStart) { const start = opts.onStart; stream.on("streamEvent", (ev) => { if (ev.type === "message_start") start(); }); }
  const m = await stream.finalMessage();
  return {
    stopReason: m.stop_reason,
    text: m.content.map((b) => (b.type === "text" ? b.text : "")).join(""),
    usage: { input: m.usage.input_tokens, output: m.usage.output_tokens, cacheRead: m.usage.cache_read_input_tokens ?? 0, cacheWrite: m.usage.cache_creation_input_tokens ?? 0 },
  };
}

async function existing(accountIds: string[]): Promise<SuggestionRow[]> {
  if (!accountIds.length) return [];
  const rows = check(await db().from("vault_suggestions").select("account_id,file_path,section,text").in("account_id", accountIds).in("status", ["pending", "accepted", "rejected"]), "read suggestions") as Row[];
  return rows.map((r) => ({ accountId: r.account_id, filePath: r.file_path, section: r.section ?? "", text: r.text }));
}

function writer(metAtOf: Map<string, string | null>) {
  return async (w: Parameters<DigestDeps["write"]>[0]) => {
    // Suggestions and headlines first, the call's summary and status last: a failure part-way leaves the call
    // undigested, and a rerun skips suggestions already stored.
    if (w.suggestions.length) {
      const metAt = metAtOf.get(w.transcriptId) ?? null;
      check(await db().from("vault_suggestions").insert(w.suggestions.map((s) => ({
        account_id: s.accountId, file_path: s.filePath, section: s.section || null, text: s.text, transcript_id: w.transcriptId, met_at: metAt, status: "pending",
      }))), "add suggestions");
    }
    // A headline on a link a person made by hand is theirs; only automatic links get the digest's headline.
    for (const h of w.headlines) check(await db().from("transcript_accounts").update({ headline: h.headline }).eq("transcript_id", w.transcriptId).eq("account_id", h.accountId).neq("source", "manual"), "set headline");
    check(await db().from("transcripts").update({ summary: w.summary, status: "digested" }).eq("id", w.transcriptId), "save summary");
  };
}

async function markFailed(id: string) {
  check(await db().from("transcripts").update({ status: "failed" }).eq("id", id).in("status", ["pending", "failed"]), "mark failed");
}

function deps(log: string[], outlines: Outlines, deadline?: number): DigestDeps {
  const metAtOf = new Map<string, string | null>();
  return {
    deadline,
    load: async (id) => { const c = await loadCall(id, outlines); if (c) metAtOf.set(c.id, c.metAt); return c; },
    ask,
    existing,
    write: writer(metAtOf),
    markFailed: (id) => markFailed(id),
    log: (l) => { log.push(l); console.log(`[digest] ${l}`); },
  };
}

function logger(log: string[]) {
  return (l: string) => { log.push(l); console.log(`[digest] ${l}`); };
}

/** Digests one call. Throws when the call is skipped or fails (a failure also marks it 'failed'). */
export async function digestCall(transcriptId: string): Promise<Digest> {
  const log: string[] = [];
  const r = await runDigest(transcriptId, deps(log, outlineSource(logger(log))));
  if (!r.ok) throw new Error(r.reason);
  return r.digest;
}

// ---------------------------------------------------------------- batches

/**
 * since (ISO) narrows to calls met on or after it; the default is the last 30 days. transcriptIds picks calls directly,
 * at any date, for on-demand digests of older calls (not combined with onlySlugs or since). Older calls keep their
 * one-liner and stay searchable by transcript.
 */
export type DigestOptions = { onlySlugs?: string[]; limit?: number; retryFailed?: boolean; outputTokens?: number; since?: string; transcriptIds?: string[] };
type Candidate = { id: string; chars: number; metAt: string; group: string; accountIds: string[] };

/** Calls waiting for a digest (the newest, when a limit applies), with their body length and linked projects. total counts every match, before the limit. */
async function candidates(o: DigestOptions, log: (l: string) => void): Promise<{ list: Candidate[]; total: number; window: string }> {
  const statuses = o.retryFailed ? ["pending", "failed"] : ["pending"];
  const sel = digestSelection(o, new Date());
  log(`window: ${sel.label}`);
  const since = sel.kind === "window" ? sel.since : null;
  const byDate = (a: Row, b: Row) => String(b.met_at ?? "").localeCompare(String(a.met_at ?? "")) || String(a.id).localeCompare(String(b.id));
  let rows: Row[] = [];
  let total: number;
  if (sel.kind === "ids") {
    for (let i = 0; i < sel.ids.length; i += PAGE)
      rows.push(...check(await db().from("transcripts").select("id,met_at,body").in("id", sel.ids.slice(i, i + PAGE)).in("status", statuses).not("body", "is", null), "read calls") as Row[]);
    rows = rows.filter((r) => (r.body ?? "").trim()).sort(byDate);
    if (rows.length < sel.ids.length) log(`${rows.length} of ${sel.ids.length} chosen calls are waiting (${statuses.join(" or ")}, with a stored body); the rest are skipped`);
    total = rows.length;
    rows = rows.slice(0, o.limit ?? rows.length);
  } else if (o.onlySlugs) {
    const accts = check(await db().from("accounts").select("id,slug").in("slug", o.onlySlugs), "read projects") as Row[];
    const missing = o.onlySlugs.filter((s) => !accts.some((a) => a.slug === s));
    if (missing.length) throw new Error(`Unknown project: ${missing.join(", ")}`);
    const links = check(await db().from("transcript_accounts").select("transcript_id").in("account_id", accts.map((a) => a.id)), "read call links") as Row[];
    const ids = [...new Set(links.map((l) => l.transcript_id as string))];
    for (let i = 0; i < ids.length; i += PAGE)
      rows.push(...check(await db().from("transcripts").select("id,met_at,body").in("id", ids.slice(i, i + PAGE)).in("status", statuses).not("body", "is", null).gte("met_at", since!), "read calls") as Row[]);
    rows = rows.filter((r) => (r.body ?? "").trim()).sort(byDate);
    total = rows.length;
    rows = rows.slice(0, o.limit ?? rows.length);
  } else {
    const { count } = await db().from("transcripts").select("id", { count: "exact", head: true }).in("status", statuses).not("body", "is", null).gte("met_at", since!);
    for (let from = 0; rows.length < (o.limit ?? Infinity); from += PAGE) {
      const page = check(await db().from("transcripts").select("id,met_at,body").in("status", statuses).not("body", "is", null).gte("met_at", since!)
        .order("met_at", { ascending: false, nullsFirst: false }).order("id").range(from, from + PAGE - 1), "read calls") as Row[];
      for (const r of page) if ((r.body ?? "").trim() && rows.length < (o.limit ?? Infinity)) rows.push(r);
      if (page.length < PAGE) break;
    }
    total = Math.max(count ?? rows.length, rows.length);
  }
  const accountsOf = new Map<string, string[]>();
  const ids = rows.map((r) => r.id as string);
  for (let i = 0; i < ids.length; i += PAGE) {
    const links = check(await db().from("transcript_accounts").select("transcript_id,account_id").in("transcript_id", ids.slice(i, i + PAGE)), "read call links") as Row[];
    for (const l of links) accountsOf.set(l.transcript_id, [...(accountsOf.get(l.transcript_id) ?? []), l.account_id]);
  }
  const list = rows.map((r) => { const a = sortIds(accountsOf.get(r.id) ?? []); return { id: r.id as string, chars: (r.body as string).length, metAt: String(r.met_at ?? ""), group: a.join(","), accountIds: a }; });
  return { list, total, window: sel.label };
}

/** The calls in the order they will run (grouped by project, newest group first, newest call first) and their estimate. */
async function planRun(o: DigestOptions, outlines: Outlines, log: (l: string) => void) {
  const { list, total, window } = await candidates(o, log);
  const newest = new Map<string, string>();
  for (const c of list) if ((newest.get(c.group) ?? "") < c.metAt) newest.set(c.group, c.metAt);
  const ordered = [...list].sort((a, b) =>
    (newest.get(b.group) ?? "").localeCompare(newest.get(a.group) ?? "") || a.group.localeCompare(b.group) || b.metAt.localeCompare(a.metAt) || a.id.localeCompare(b.id));
  const stable = new Map<string, number>();
  for (const g of new Set(ordered.map((c) => c.group))) {
    const c = ordered.find((x) => x.group === g)!;
    const projects = await outlines.projects(c.accountIds);
    const n = DIGEST_SYSTEM.length + buildOutline(projects).length;
    stable.set(g, n);
    if (n < MIN_CACHE_CHARS) log(`warning: the cached prefix for ${projects.map((p) => p.slug).join(" + ") || "unlinked calls"} is ${n} characters, under ${MIN_CACHE_CHARS}; caching may not engage, so its calls are estimated at the plain input price`);
  }
  const outputTokens = o.outputTokens ?? measuredOutput ?? undefined;
  const est = estimateRun(ordered.map((c) => {
    const n = stable.get(c.group) ?? 0;
    return { chars: c.chars, group: c.group, stableChars: n, cacheable: n >= MIN_CACHE_CHARS };
  }), { outputTokens });
  return { list: ordered, total, est, window };
}

/** What digesting the waiting calls would cost, counted as the real requests are sent. Reads only. */
export async function estimatePending(o: DigestOptions) {
  const log: string[] = [];
  const outlines = outlineSource(logger(log));
  const { total, est, window } = await planRun(o, outlines, logger(log));
  return {
    calls: est.calls, inputTokens: est.inputTokens, cacheWriteTokens: est.cacheWriteTokens, cacheReadTokens: est.cacheReadTokens,
    outputTokens: est.outputTokens, dollars: est.dollars, model: DIGEST_MODEL, waiting: total, window,
    outputTokensPerCall: est.calls ? est.outputTokens / est.calls : (o.outputTokens ?? measuredOutput ?? null),
    outputTokensSource: o.outputTokens !== undefined ? "given" : measuredOutput !== null ? "measured by the last run" : "default",
    outlineChars: Object.fromEntries(outlines.chars),
    log,
  };
}

export type DigestRun = {
  digested: number; failed: number; skipped: number; more: boolean; remaining: number; stoppedAtCap: boolean;
  dollarsEstimated: number;
  /** By part from measured usage; estimated is the dollars counted at estimate for billed-but-unmeasured calls (in total). */
  dollarsActual: Dollars & { estimated: number };
  usage: CallUsage;
  averages: (CallUsage & { calls: number; dollars: number }) | null;
  outlineChars: Record<string, number>;
  log: string[];
} | { refused: string; dollarsEstimated: number };

let running = false;

/**
 * Digests waiting calls, a few at a time, inside the route's time budget. Refused when the estimate is over maxDollars;
 * during the run, a call starts only while actual spend plus every in-flight call's estimate stays within maxDollars.
 */
export async function digestPending(o: DigestOptions & { maxDollars: number }): Promise<DigestRun> {
  // One run at a time in this process, so two runs never digest the same call twice.
  if (running) throw new Error("A digest run is already in progress.");
  running = true;
  try { return await digestBatch(o); } finally { running = false; }
}

async function digestBatch(o: DigestOptions & { maxDollars: number }): Promise<DigestRun> {
  const t0 = Date.now();
  const log: string[] = [];
  const outlines = outlineSource(logger(log));
  const { list, total, est } = await planRun(o, outlines, logger(log));
  if (est.dollars > o.maxDollars) return { refused: `The estimate for ${est.calls} calls is $${est.dollars.toFixed(2)}, over maxDollars $${o.maxDollars}.`, dollarsEstimated: est.dollars };
  // Model calls still running at the budget's end are aborted; those calls stay pending for the next run.
  const d = deps(log, outlines, t0 + TIME_BUDGET_MS);
  const gate = new SpendGate(o.maxDollars);
  const usage: CallUsage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };
  const tally = { digested: 0, failed: 0, skipped: 0, leftPending: 0, asked: 0 };
  /** Dollars counted at their estimate because a model call was billed but its usage never came back (aborted or errored). */
  let estimated = 0;
  // A project's first call starts alone; its other calls start once its answer has begun (the cache entry exists).
  // Meanwhile free workers take other projects' first calls.
  const queue = new DigestQueue(list);
  let stoppedAtCap = false;
  const capLog = (what: string, e: number) => d.log(`stopped at the spending cap: $${gate.spent.toFixed(2)} spent and $${gate.reserved.toFixed(2)} in flight; ${what} (about $${e.toFixed(2)}) would pass maxDollars $${o.maxDollars}`);
  const worker = async () => {
    for (;;) {
      // Checked again after every wait.
      if (stoppedAtCap || Date.now() - t0 >= LAST_START_MS) return;
      const i = queue.next();
      if (i === "done") return;
      if (i === "wait") { await queue.changed(); continue; }
      const item = list[i], e = est.perCall[i];
      if (!gate.tryReserve(e)) { stoppedAtCap = true; capLog("the next call", e); return; }
      queue.take(i);
      let reservedTotal = e;
      const hooks = {
        onStart: () => queue.warmed(item.group),
        // A retry costs about as much again: reserve it before it starts, or leave the call pending.
        beforeRetry: () => {
          if (gate.tryReserve(e)) { reservedTotal += e; return true; }
          stoppedAtCap = true; capLog("a retry", e);
          return false;
        },
      };
      let r: DigestOutcome | null = null;
      try { r = await runDigest(item.id, d, hooks); }
      catch (err) { d.log(`error on ${item.id}: ${err instanceof Error ? err.message : String(err)}`); }
      finally { queue.warmed(item.group); }
      const u = r?.usage ?? { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };
      const measured = costOf(u).total;
      // Billed but unmeasured (aborted, errored, or thrown): count it at its estimate, never at $0.
      const charged = !r || (!r.ok && r.unmeasured) ? Math.max(measured, e) : measured;
      estimated += charged - measured;
      gate.settle(reservedTotal, charged);
      usage.input += u.input; usage.output += u.output; usage.cacheRead += u.cacheRead; usage.cacheWrite += u.cacheWrite;
      if (u.input + u.output + u.cacheRead + u.cacheWrite > 0) tally.asked++;
      if (!r) { tally.failed++; continue; }
      if (r.ok) tally.digested++; else if (r.failed) tally.failed++; else { tally.skipped++; if (r.leftPending) tally.leftPending++; }
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  const remaining = total - queue.started + tally.leftPending;
  const n = tally.asked;
  const averages = n ? { calls: n, input: usage.input / n, cacheRead: usage.cacheRead / n, cacheWrite: usage.cacheWrite / n, output: usage.output / n, dollars: costOf(usage).total / n } : null;
  if (averages && n >= MEASURE_MIN_CALLS) measuredOutput = averages.output;
  const measuredCost = costOf(usage);
  return {
    digested: tally.digested, failed: tally.failed, skipped: tally.skipped, more: remaining > 0, remaining, stoppedAtCap,
    dollarsEstimated: est.dollars, dollarsActual: { ...measuredCost, estimated, total: measuredCost.total + estimated }, usage, averages,
    outlineChars: Object.fromEntries(outlines.chars), log,
  };
}

// ---------------------------------------------------------------- suggestions in the vault

export type PendingSuggestion = { id: string; section: string; text: string; callTitle: string; callDate: string };

/** Pending suggestions for one vault file, oldest call first. */
export async function pendingSuggestions(accountSlug: string, path: string): Promise<PendingSuggestion[]> {
  const a = check(await db().from("accounts").select("id").eq("slug", accountSlug).maybeSingle(), "read project") as Row | null;
  if (!a) return [];
  const rows = check(await db().from("vault_suggestions").select("id,section,text,met_at,transcripts(title,met_at)")
    .eq("account_id", a.id).eq("file_path", path).eq("status", "pending").order("met_at", { ascending: true, nullsFirst: true }).order("id"), "read suggestions") as Row[];
  return rows.map((r) => ({ id: r.id, section: r.section ?? "", text: r.text, callTitle: r.transcripts?.title ?? "A call", callDate: fmtDate(r.met_at ?? r.transcripts?.met_at ?? null) }));
}

/** The project slug a suggestion belongs to, for the permission check. */
export async function suggestionProject(id: string): Promise<string | null> {
  const r = check(await db().from("vault_suggestions").select("accounts(slug)").eq("id", id).maybeSingle(), "read suggestion") as Row | null;
  return r?.accounts?.slug ?? null;
}

/** The body of the template an empty file shows (lib/data/render.ts fileMarkdown), preferring this project's own copy. */
async function templateBody(accountId: string, category: string | null, name: string | null): Promise<string> {
  if (!category || !name) return "";
  const rows = check(await db().from("templates").select("body,only_account_id").eq("category_slug", category).eq("name", name), "read template") as Row[];
  const t = rows.find((r) => r.only_account_id === accountId) ?? rows.find((r) => !r.only_account_id) ?? rows[0];
  return (t?.body as string | undefined) ?? "";
}

/**
 * Accept appends the text under its section (creating the section at the end if missing) with a source line, as a
 * normal versioned save; reject only marks it. The caller checks canAssign on the project first.
 */
export async function decideSuggestion(id: string, accept: boolean, by: string): Promise<void> {
  const s = check(await db().from("vault_suggestions").select("id,account_id,file_path,section,text,status,met_at,transcripts(title,met_at)").eq("id", id).maybeSingle(), "read suggestion") as Row | null;
  if (!s) throw new Error("No such suggestion.");
  if (s.status !== "pending") return;
  const decided = { status: accept ? "accepted" : "rejected", decided_by: by, decided_at: new Date().toISOString() };
  // Claim it first, so two clicks never append twice.
  const claimed = check(await db().from("vault_suggestions").update(decided).eq("id", id).eq("status", "pending").select("id"), "decide suggestion") as Row[];
  if (!claimed.length || !accept) return;
  try {
    const source = fromCallLine(s.transcripts?.title ?? "untitled", s.met_at ?? s.transcripts?.met_at ?? null);
    // Saved only if nobody saved the file since it was read; on a clash, read it again and try once more.
    let saved = false;
    for (let attempt = 0; attempt < 2 && !saved; attempt++) {
      const f = check(await db().from("vault_files").select("content,state,updated_at,category_slug,template_name").eq("account_id", s.account_id).eq("path", s.file_path).maybeSingle(), "read file") as Row | null;
      if (!f || f.state === "deleted") throw new Error("That file is no longer in the vault.");
      // An empty file shows its template's text; the fact goes into that text, as shown, not into a blank file.
      const base = f.content ? f.content : await templateBody(s.account_id, f.category_slug, f.template_name);
      const content = appendUnderSection(base, s.section ?? "", s.text, source);
      saved = await updateFile(s.account_id, s.file_path, { content }, by, { ifUpdatedAt: f.updated_at ?? null });
    }
    if (!saved) throw new Error("The file was changed by someone else while saving. Try again.");
  } catch (e) {
    await db().from("vault_suggestions").update({ status: "pending", decided_by: null, decided_at: null }).eq("id", id);
    throw e;
  }
  invalidate();
}
