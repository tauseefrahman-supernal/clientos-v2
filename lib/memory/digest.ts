import "server-only";
import { check, db, updateFile } from "@/lib/data/db";
import { invalidate } from "@/lib/data";
import { DIGEST_MODEL, estimateCost, INPUT_PER_M, OUTPUT_PER_M, type Digest } from "./digest-rules.ts";
import {
  appendUnderSection, DIGEST_SCHEMA, DIGEST_SYSTEM, fmtDate, fromCallLine, headingsOf, runDigest,
  type AskMessage, type AskReply, type CallForDigest, type DigestDeps, type DigestOutcome, type SuggestionRow,
} from "./digest-core.ts";

// Call digests against Supabase and Claude: a 5 to 8 line summary per call, a headline per linked project, and
// suggested vault facts kept pending in clientos.vault_suggestions until a strategist accepts or rejects them.
// Reads only the stored (screened) body; never writes into vault_files except through an accepted suggestion.

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;

const MAX_TOKENS = 16000;
/** The digest route stops starting calls after this, so a run ends well inside the route's 300 s limit. */
const TIME_BUDGET_MS = 270_000;
const LAST_START_MS = 150_000;
const CONCURRENCY = 3;
const PAGE = 200;

// ---------------------------------------------------------------- wiring

async function loadCall(id: string): Promise<CallForDigest | null> {
  const t = check(await db().from("transcripts").select("id,title,met_at,status,body").eq("id", id).maybeSingle(), "read call") as Row | null;
  if (!t) return null;
  const links = check(await db().from("transcript_accounts").select("account_id,accounts(slug,name)").eq("transcript_id", id).order("account_id"), "read call projects") as Row[];
  const ids = links.map((l) => l.account_id as string);
  // Only files Stella may use: deleted, archived and hidden files are left out.
  const files = ids.length ? check(await db().from("vault_files").select("account_id,path,content").in("account_id", ids).eq("state", "active").order("path"), "read vault outline") as Row[] : [];
  return {
    id: t.id, title: t.title ?? "", metAt: t.met_at ?? null, status: t.status, body: t.body ?? null,
    projects: links.filter((l) => l.accounts).map((l) => ({
      slug: l.accounts.slug, name: l.accounts.name ?? l.accounts.slug, accountId: l.account_id,
      files: files.filter((f) => f.account_id === l.account_id).map((f) => ({ path: f.path, headings: headingsOf(f.content ?? "") })),
    })),
  };
}

async function ask(messages: AskMessage[]): Promise<AskReply> {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();
  // No sampling parameters: a JSON schema fixes the shape, low effort keeps thinking short.
  const m = await client.messages.stream({
    model: DIGEST_MODEL,
    max_tokens: MAX_TOKENS,
    system: DIGEST_SYSTEM,
    messages,
    output_config: { effort: "low", format: { type: "json_schema", schema: DIGEST_SCHEMA as unknown as Record<string, unknown> } },
  }).finalMessage();
  return {
    stopReason: m.stop_reason,
    text: m.content.map((b) => (b.type === "text" ? b.text : "")).join(""),
    usage: { input: m.usage.input_tokens, output: m.usage.output_tokens },
  };
}

async function existing(accountIds: string[]): Promise<SuggestionRow[]> {
  if (!accountIds.length) return [];
  const rows = check(await db().from("vault_suggestions").select("account_id,file_path,section,text").in("account_id", accountIds).in("status", ["pending", "accepted"]), "read suggestions") as Row[];
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
    for (const h of w.headlines) check(await db().from("transcript_accounts").update({ headline: h.headline }).eq("transcript_id", w.transcriptId).eq("account_id", h.accountId), "set headline");
    check(await db().from("transcripts").update({ summary: w.summary, status: "digested" }).eq("id", w.transcriptId), "save summary");
  };
}

async function markFailed(id: string) {
  check(await db().from("transcripts").update({ status: "failed" }).eq("id", id).in("status", ["pending", "failed"]), "mark failed");
}

function deps(log: string[]): DigestDeps {
  const metAtOf = new Map<string, string | null>();
  return {
    load: async (id) => { const c = await loadCall(id); if (c) metAtOf.set(c.id, c.metAt); return c; },
    ask,
    existing,
    write: writer(metAtOf),
    markFailed: (id) => markFailed(id),
    log: (l) => { log.push(l); console.log(`[digest] ${l}`); },
  };
}

/** Digests one call. Throws when the call is skipped or fails (a failure also marks it 'failed'). */
export async function digestCall(transcriptId: string): Promise<Digest> {
  const log: string[] = [];
  const r = await runDigest(transcriptId, deps(log));
  if (!r.ok) throw new Error(r.reason);
  return r.digest;
}

// ---------------------------------------------------------------- batches

export type DigestOptions = { onlySlugs?: string[]; limit?: number; retryFailed?: boolean };

/** Calls waiting for a digest, newest first, with their body length. total counts every match, before the limit. */
async function candidates(o: DigestOptions): Promise<{ list: { id: string; chars: number }[]; total: number }> {
  const statuses = o.retryFailed ? ["pending", "failed"] : ["pending"];
  const byDate = (a: Row, b: Row) => String(b.met_at ?? "").localeCompare(String(a.met_at ?? "")) || String(a.id).localeCompare(String(b.id));
  if (o.onlySlugs) {
    const accts = check(await db().from("accounts").select("id,slug").in("slug", o.onlySlugs), "read projects") as Row[];
    const missing = o.onlySlugs.filter((s) => !accts.some((a) => a.slug === s));
    if (missing.length) throw new Error(`Unknown project: ${missing.join(", ")}`);
    const links = check(await db().from("transcript_accounts").select("transcript_id").in("account_id", accts.map((a) => a.id)), "read call links") as Row[];
    const ids = [...new Set(links.map((l) => l.transcript_id as string))];
    const rows: Row[] = [];
    for (let i = 0; i < ids.length; i += PAGE)
      rows.push(...check(await db().from("transcripts").select("id,met_at,body").in("id", ids.slice(i, i + PAGE)).in("status", statuses).not("body", "is", null), "read calls") as Row[]);
    const ok = rows.filter((r) => (r.body ?? "").trim()).sort(byDate);
    return { list: ok.slice(0, o.limit ?? ok.length).map((r) => ({ id: r.id, chars: r.body.length })), total: ok.length };
  }
  const { count } = await db().from("transcripts").select("id", { count: "exact", head: true }).in("status", statuses).not("body", "is", null);
  const list: { id: string; chars: number }[] = [];
  for (let from = 0; list.length < (o.limit ?? Infinity); from += PAGE) {
    const rows = check(await db().from("transcripts").select("id,met_at,body").in("status", statuses).not("body", "is", null)
      .order("met_at", { ascending: false, nullsFirst: false }).order("id").range(from, from + PAGE - 1), "read calls") as Row[];
    for (const r of rows) if ((r.body ?? "").trim() && list.length < (o.limit ?? Infinity)) list.push({ id: r.id, chars: r.body.length });
    if (rows.length < PAGE) break;
  }
  return { list, total: Math.max(count ?? list.length, list.length) };
}

/** What digesting the waiting calls would cost. Reads only. */
export async function estimatePending(o: DigestOptions) {
  const { list, total } = await candidates(o);
  return { ...estimateCost(list), model: DIGEST_MODEL, waiting: total };
}

export type DigestRun = {
  digested: number; failed: number; skipped: number; more: boolean; remaining: number;
  dollarsEstimated: number; dollarsActual: number; log: string[];
} | { refused: string; dollarsEstimated: number };

/** Digests waiting calls, a few at a time, inside the route's time budget. Refused when the estimate is over maxDollars. */
export async function digestPending(o: DigestOptions & { maxDollars: number }): Promise<DigestRun> {
  const t0 = Date.now();
  const { list, total } = await candidates(o);
  const est = estimateCost(list);
  if (est.dollars > o.maxDollars) return { refused: `The estimate for ${est.calls} calls is $${est.dollars.toFixed(2)}, over maxDollars $${o.maxDollars}.`, dollarsEstimated: est.dollars };
  const log: string[] = [];
  const d = deps(log);
  const tally = { digested: 0, failed: 0, skipped: 0, input: 0, output: 0 };
  let next = 0;
  const worker = async () => {
    while (next < list.length && Date.now() - t0 < LAST_START_MS) {
      const { id } = list[next++];
      let r: DigestOutcome;
      try { r = await runDigest(id, d); } catch (e) { d.log(`error on ${id}: ${e instanceof Error ? e.message : String(e)}`); tally.failed++; continue; }
      tally.input += r.usage.input; tally.output += r.usage.output;
      if (r.ok) tally.digested++; else if (r.failed) tally.failed++; else tally.skipped++;
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  const remaining = total - next;
  if (Date.now() - t0 > TIME_BUDGET_MS) log.push(`ran past the ${TIME_BUDGET_MS / 1000} s budget`);
  return {
    digested: tally.digested, failed: tally.failed, skipped: tally.skipped, more: remaining > 0, remaining,
    dollarsEstimated: est.dollars, dollarsActual: (tally.input / 1e6) * INPUT_PER_M + (tally.output / 1e6) * OUTPUT_PER_M, log,
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
    const f = check(await db().from("vault_files").select("content,state").eq("account_id", s.account_id).eq("path", s.file_path).maybeSingle(), "read file") as Row | null;
    if (!f || f.state === "deleted") throw new Error("That file is no longer in the vault.");
    const content = appendUnderSection(f.content ?? "", s.section ?? "", s.text, fromCallLine(s.transcripts?.title ?? "untitled", s.met_at ?? s.transcripts?.met_at ?? null));
    await updateFile(s.account_id, s.file_path, { content }, by);
  } catch (e) {
    await db().from("vault_suggestions").update({ status: "pending", decided_by: null, decided_at: null }).eq("id", id);
    throw e;
  }
  invalidate();
}
