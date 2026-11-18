import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { getAccount, listAccounts } from "@/lib/data";
import { check, db, dbEnabled } from "@/lib/data/db";
import { relatedByIndustry } from "@/lib/data/related";
import { currentAccess } from "@/lib/auth/access";
import { buildExport, type ExportPart } from "@/lib/export";
import { accountMaps, callsById, searchChunks } from "@/lib/memory/search";
import { keepHit } from "./tool-rules";
import { callWindow } from "@/lib/memory/search-rules";
import type { Layer, SearchHit } from "@/lib/memory/types";
import { listSources, readSource } from "./corpus";
import { resolveRefs, splitEvidence, stripHistory, type Evidence, type KnownSource } from "./evidence";
import {
  allotCalls, callDigest, callLabel, callVisible, contextManagement, finalTurnNote, formatHit, matchSuggestions, parseReadCall,
  parseSearchCalls, parseSearchContext, parseSearchExpertise, DIGEST_DAYS, DIGEST_LINES, FULL_CALL_CHARS, SKIPPED, SUGGESTED, type FormattedHit, type SuggestionRow,
} from "./tool-rules";

// Stella: answers questions about one project, several, or all of them, from their vaults, books
// and research, with the evidence for each answer; writes documents and compiles exports. Manual streaming tool
// loop so every text delta, tool call and document reaches the browser.

export const MODEL = "claude-opus-5-5";
const MAX_TURNS = 10;   // model turns; tool calls are capped separately at MAX_TOOL_CALLS

const RULES = `You are Stella, the strategy agent inside ClientOS at Supernal, an AI services firm. Strategists ask you about one client project, several, or all of them; the projects in scope are listed below, each with a digest of its calls from the last 30 days.

How you work:
- Answer only from what the tools and the project header give you. Search before you answer anything factual; read a source or a call when an excerpt is not enough. With several projects in scope, search each one that matters (pass project) or all at once (leave project out).
- Your memory has layers, cheapest first: the project header (always there), the vault and book (search_context), call summaries (search_calls with depth "summaries"), and transcript passages (search_calls with depth "transcripts", then read_call). Escalation rule: answer from the highest layer that is enough; go to summaries when the vault is silent or stale; go to transcripts for exact wording, who said what, or when summaries are vague; widen the date range when the question is historical or results are thin. Newer sources win; name the change and its date. Label suggested vault facts as unconfirmed.
- Search results lean to recent calls unless you pass since or until; pass a date range for "when did", "why did they" or "first time" questions. Every result carries its date and a match strength from 0 to 100; low strengths mean thin results.
- You have at most 8 lookups (tool calls) per answer, and older tool results are cleared from your context as you go, so note what you need from each result before moving on.
- search_context also returns facts suggested from calls that no strategist has confirmed yet, labelled "${SUGGESTED}". Say in the prose that such a fact is unconfirmed, and use its source label as given.
- Keep source labels out of the prose of a chat answer. End every factual answer with one fenced code block tagged evidence holding a JSON array, one entry per key point: {"point": the point in a few words, "source": the source label exactly as the tool gave it, e.g. "File Technical Strategy/Feature-Rationale.md", "Heritage · Book, chapter 2: Why they bought" or "Call: Weekly sync, 2026-11-12", "quote": a short quote from that source, at most 200 characters}. Nothing comes after the block. No evidence block when the reply only announces a document. Where it matters (disagreements, changes over time, dates), refer to a source in plain words in the prose, for example "the 3 Mar kickoff call". A claim you cannot source does not go in the answer. When comparing projects, say which project each fact belongs to.
- When sources disagree, say so and give both, each with its own evidence entry, and say which is newer. Never pick one silently.
- Call transcripts are raw speech: report what was said in your own words, and quote only short exact phrases when the wording matters.
- If the sources do not hold the answer, say what is missing and where it would likely be found (a meeting, Linear, Account OS, Drive). Do not guess.
- "Why" questions usually have several causes. Give each one, in order of weight.
- Write plainly for a busy strategist: lead with the answer, short paragraphs or a short list, no preamble, no closing summary. Use each project's own names for people, products and documents.
- Files the strategist attached to their message are in the message itself; use them and say so when you do. They are not in the vault unless the strategist saves them.
- When asked for a document (a brief, a proposal section, a summary, meeting prep, a one-pager), write it with create_document rather than in the reply, then reply in one or two lines saying what it holds. Documents leave ClientOS, so they cite inline instead: every factual claim followed by its source label in square brackets, exactly as the tool gave it, e.g. [File Technical Strategy/Feature-Rationale.md]; a claim you cannot cite does not go in.
- When asked to export or pull together context from projects (their vault files, book, artifacts), use compile_export: it assembles the material itself, so do not retype it.
- You cannot change the vault. If the strategist asks for a change, draft it as a document and say it needs their approval; they can save a document to a project's vault themselves.`;

// Frameworks Stella always carries: how a vault is structured and what "product" means.
const FRAMEWORKS = ["Context-Model", "Product-Suite"];
function frameworks(): string {
  const dir = join(process.cwd(), "templates", "stella", "Frameworks");
  return FRAMEWORKS.map((n) => join(dir, `${n}.md`)).filter(existsSync).map((p) => readFileSync(p, "utf8")).join("\n\n---\n\n");
}

const projectParam = { type: "string", description: "Project name or slug from the projects in scope. Leave out to cover every project in scope." };

const tools: Anthropic.Tool[] = [
  {
    name: "search_context",
    description: "Search the vault files (the core Sales, Deal, Technical and Delivery Strategy templates filled for each project, plus files added for it) and book chapters of the projects in scope, by meaning and by words. Also returns pending facts suggested from calls, labelled as unconfirmed. Returns ranked excerpts with a source id, label, project and match strength. Use specific queries (names, products, numbers).",
    input_schema: { type: "object", properties: { query: { type: "string", description: "What to look for, in plain words" }, project: projectParam, limit: { type: "integer", description: "Results to return, 1 to 12. Default 6." } }, required: ["query"], additionalProperties: false },
    eager_input_streaming: true,
  },
  {
    name: "search_calls",
    description: "Search the calls (Granola and Fathom meetings) of the projects in scope. depth \"summaries\" searches each call's 5 to 8 line summary: the timeline of what happened. depth \"transcripts\" searches the transcript passages: exact words and who said what. Results lean to recent calls unless you pass since or until. Each result has the call id, title, date, speakers, project, link and an excerpt; open one with read_call.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "What to look for, in plain words" },
        project: projectParam,
        depth: { type: "string", enum: ["summaries", "transcripts"] },
        since: { type: "string", description: "Only calls on or after this date, YYYY-MM-DD" },
        until: { type: "string", description: "Only calls before this date, YYYY-MM-DD" },
        speakers: { type: "array", items: { type: "string" }, description: "Only passages where one of these people speaks; use names exactly as earlier results gave them" },
        limit: { type: "integer", description: "Results to return, 1 to 12. Default 6." },
      },
      required: ["query", "depth"],
      additionalProperties: false,
    },
    eager_input_streaming: true,
  },
  {
    name: "read_call",
    description: "Read one call by the id search_calls returned (call:…). By default returns its summary. Pass around (a phrase from an excerpt) to get the stretch of transcript around it, about 3,000 characters. Pass full: true only when the strategist explicitly asked for the whole transcript.",
    input_schema: { type: "object", properties: { id: { type: "string" }, around: { type: "string", description: "A phrase from the transcript to centre on" }, full: { type: "boolean", description: "The whole transcript; only when the strategist asked for it" } }, required: ["id"], additionalProperties: false },
    eager_input_streaming: true,
  },
  {
    name: "read_source",
    description: "Read one vault file or book chapter in full by the id that search_context, list_sources or search_expertise returned.",
    input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"], additionalProperties: false },
    eager_input_streaming: true,
  },
  {
    name: "list_sources",
    description: "List every source (vault files, book chapters, account summaries) of one project in scope, with ids and labels.",
    input_schema: { type: "object", properties: { project: projectParam }, additionalProperties: false },
    eager_input_streaming: true,
  },
  {
    name: "search_expertise",
    description: "Search the delivered projects outside the current scope (their vaults, books and call summaries), with projects in the same industry ranked first. Use it when scoping a deal, or when the strategist asks how a similar client was handled. Results are labelled with the project name; read a file or chapter in full with read_source using its id. Never present another client's facts as this project's.",
    input_schema: { type: "object", properties: { query: { type: "string" }, limit: { type: "integer", description: "1 to 12. Default 6." } }, required: ["query"], additionalProperties: false },
    eager_input_streaming: true,
  },
  {
    name: "create_document",
    description: "Write a document the strategist can download, print or save to a project's vault: a brief, meeting prep, a proposal section, a one-pager, a comparison. Markdown, starting with a # title. Cite every factual claim inline with its source label in square brackets, exactly as the tool gave it, e.g. [File Technical Strategy/Feature-Rationale.md].",
    input_schema: { type: "object", properties: { title: { type: "string" }, content: { type: "string", description: "The full document in markdown" }, project: { type: "string", description: "The project it is about, if one" } }, required: ["title", "content"], additionalProperties: false },
    eager_input_streaming: true,
  },
  {
    name: "compile_export",
    description: "Assemble an export document from projects' own material: overview, filled vault files (optionally only some groups), book chapters and artifact list. Use for 'export', 'pull together', 'give me everything on'. The document is built from the vault directly; you get back its size, not its text.",
    input_schema: {
      type: "object",
      properties: {
        projects: { type: "array", items: { type: "string" }, description: "Project names or slugs; leave out for every project in scope" },
        parts: { type: "array", items: { type: "string", enum: ["overview", "vault", "book", "artifacts"] }, description: "Default overview, vault and book" },
        groups: { type: "array", items: { type: "string", enum: ["Sales Strategy", "Deal Strategy", "Technical Strategy", "Delivery Strategy"] }, description: "Vault groups to include; default all" },
        title: { type: "string" },
      },
      additionalProperties: false,
    },
    eager_input_streaming: true,
  },
];

export type StellaDocument = { id: string; title: string; content: string; projects: string[]; kind: "written" | "export" };

/** visible: every project the person may see (null for admins); names covers those projects. */
type Scope = { slugs: string[]; all: boolean; names: Map<string, string>; visible: Set<string> | null };
type ToolResult = { ok: boolean; content: string; summary: string; sources?: KnownSource[] };

/** Admins with every project in scope search without listing project ids. */
const searchAll = (scope: Scope, which: string[]) => scope.all && scope.visible === null && which.length === scope.slugs.length;

/** Hits as Stella sees them, with the sources the evidence panel resolves against. */
async function present(hits: SearchHit[], query: string, names: Map<string, string>, prefix: boolean): Promise<{ items: FormattedHit[]; sources: KnownSource[] }> {
  const calls = await callsById(hits.map((h) => h.transcriptId).filter((x): x is string => !!x));
  const items = hits.map((h) => {
    const c = h.transcriptId ? calls.get(h.transcriptId) : undefined;
    return formatHit(h, { query, project: names.get(h.slug) ?? h.slug, prefix, call: c ? { title: c.title, url: c.url ?? c.alt_url, metAt: c.met_at } : undefined });
  });
  return { items, sources: items.map((f, i) => ({ label: f.label, slug: hits[i].slug, id: f.id, url: f.link, at: f.date })) };
}

/** Pending vault facts suggested from calls, for the projects searched. */
async function suggestions(which: string[], all: boolean, query: string, names: Map<string, string>, prefix: boolean, limit: number) {
  const maps = await accountMaps();
  let q = db().from("vault_suggestions").select("id,account_id,file_path,text,met_at,transcript_id").eq("status", "pending");
  if (!all) q = q.in("account_id", which.map((s) => maps.bySlug.get(s)).filter((x): x is string => !!x));
  const rows = check(await q.limit(1000), "read suggested facts") as SuggestionRow[];
  return matchSuggestions(rows, query, limit).flatMap((r) => {
    const slug = maps.byId.get(r.account_id);
    if (!slug || (!all && !which.includes(slug))) return [];
    const label = `${prefix ? `${names.get(slug) ?? slug} · ` : ""}${SUGGESTED}: File ${r.file_path}.md${r.met_at ? `, ${r.met_at.slice(0, 10)}` : ""}`;
    return [{ item: { label, project: names.get(slug) ?? slug, file: r.file_path, date: r.met_at?.slice(0, 10) ?? null, call: r.transcript_id ? `call:${r.transcript_id}` : null, text: r.text }, source: { label, slug, id: `file:${r.file_path}` } }];
  });
}

function resolve(scope: Scope, key: unknown): string | null {
  if (typeof key !== "string" || !key.trim()) return null;
  const k = key.trim().toLowerCase();
  for (const s of scope.slugs) if (s === k || scope.names.get(s)?.toLowerCase() === k) return s;
  for (const s of scope.slugs) if (scope.names.get(s)?.toLowerCase().includes(k) || s.includes(k)) return s;
  return null;
}

async function runTool(scope: Scope, name: string, input: unknown, emit: (d: StellaDocument) => void): Promise<ToolResult> {
  const args = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const multi = scope.slugs.length > 1;
  const pick = (project: unknown = args.project): string[] | { error: string } => {
    if (project === undefined || project === "") return scope.slugs;
    const one = resolve(scope, project);
    return one ? [one] : { error: `No project "${String(project)}" in scope. In scope: ${scope.slugs.map((x) => scope.names.get(x)).join(", ")}.` };
  };
  const where = (which: string[]) => (which.length === 1 && multi ? ` in ${scope.names.get(which[0])}` : "");

  if (name === "search_context") {
    const p = parseSearchContext(input);
    if ("error" in p) return { ok: false, content: p.error, summary: "invalid search" };
    const which = pick(p.project);
    if ("error" in which) return { ok: false, content: which.error, summary: "unknown project" };
    const all = searchAll(scope, which);
    const [hits, pending] = await Promise.all([
      searchChunks({ slugs: which, query: p.query, layers: ["vault", "chapter"], k: p.limit, allProjects: all }),
      suggestions(which, all, p.query, scope.names, multi, 3),
    ]);
    const { items, sources } = await present(hits, p.query, scope.names, multi);
    const content = items.length || pending.length ? JSON.stringify({ results: items, ...(pending.length ? { suggested_unconfirmed: pending.map((x) => x.item) } : {}) }) : "No matches in the vault or book. Try other words, or search_calls.";
    return { ok: true, content, summary: `searched “${p.query}”${where(which)} · ${items.length} hits${pending.length ? `, ${pending.length} unconfirmed` : ""}`, sources: [...sources, ...pending.map((x) => x.source)] };
  }
  if (name === "search_calls") {
    const p = parseSearchCalls(input);
    if ("error" in p) return { ok: false, content: p.error, summary: "invalid search" };
    const which = pick(p.project);
    if ("error" in which) return { ok: false, content: which.error, summary: "unknown project" };
    const layers: Layer[] = p.depth === "summaries" ? ["summary"] : ["transcript"];
    const hits = await searchChunks({ slugs: which, query: p.query, layers, since: p.since, until: p.until, speakers: p.speakers, k: p.limit, allProjects: searchAll(scope, which) });
    const { items, sources } = await present(hits, p.query, scope.names, multi);
    const range = p.since || p.until ? ` ${p.since?.slice(0, 10) ?? "…"} to ${p.until?.slice(0, 10) ?? "now"}` : "";
    return { ok: true, content: items.length ? JSON.stringify(items) : `No matching call ${p.depth}${range}. Try other words, widen the dates${p.depth === "summaries" ? ', or depth "transcripts"' : ""}.`, summary: `searched call ${p.depth} for “${p.query}”${where(which)}${range} · ${items.length} hits`, sources };
  }
  if (name === "read_call") {
    const p = parseReadCall(input);
    if ("error" in p) return { ok: false, content: p.error, summary: "invalid read" };
    const notFound: ToolResult = { ok: false, content: `No call with id call:${p.id} that you can read. Use an id from search_calls.`, summary: "call not found" };
    const call = check(await db().from("transcripts").select("id,title,met_at,url,alt_url,status,gone_at,summary,body,speakers").eq("id", p.id).maybeSingle(), "read call") as
      { id: string; title: string; met_at: string | null; url: string | null; alt_url: string | null; status: string; gone_at: string | null; summary: string | null; body: string | null; speakers: unknown } | null;
    if (!call || !keepHit(call, new Date())) return notFound;
    const maps = await accountMaps();
    const links = check(await db().from("transcript_accounts").select("account_id").eq("transcript_id", p.id), "read call projects") as { account_id: string }[];
    const linked = links.map((l) => maps.byId.get(l.account_id)).filter((x): x is string => !!x);
    if (!callVisible(linked, scope.visible)) return notFound;
    const slug = linked.find((x) => scope.slugs.includes(x)) ?? linked.find((x) => scope.visible === null || scope.visible.has(x)) ?? scope.slugs[0];
    const base = callLabel(call.title, call.met_at);
    const label = multi || !scope.slugs.includes(slug) ? `${scope.names.get(slug) ?? slug} · ${base}` : base;
    const link = [call.url, call.alt_url].find((u) => !!u && /^https?:\/\//i.test(u)) ?? null;
    const body = call.body ?? "";
    let part: Record<string, string>;
    if (p.full) part = { transcript: body.length > FULL_CALL_CHARS ? `${body.slice(0, FULL_CALL_CHARS)}\n[transcript cut at ${FULL_CALL_CHARS} characters]` : body || "No transcript is stored for this call." };
    else if (p.around) part = { transcript_window: body ? callWindow(body, p.around) : "No transcript is stored for this call." };
    else part = call.summary?.trim() ? { summary: call.summary.trim() } : { summary: "No summary yet.", transcript_start: body ? callWindow(body, "") : "No transcript is stored for this call." };
    const speakers = Array.isArray(call.speakers) ? call.speakers.map((x) => (typeof x === "string" ? x : (x as { name?: string })?.name)).filter((x): x is string => !!x) : [];
    const content = JSON.stringify({ id: `call:${call.id}`, label, title: call.title, date: call.met_at?.slice(0, 10) ?? null, speakers, projects: linked.filter((x) => scope.visible === null || scope.visible.has(x)).map((x) => scope.names.get(x) ?? x), link, ...part });
    return { ok: true, content, summary: `read ${base}${p.full ? " (whole transcript)" : p.around ? ` around “${p.around}”` : ""}`, sources: [{ label, slug, id: `call:${call.id}`, url: link, at: call.met_at?.slice(0, 10) ?? null }] };
  }
  if (name === "read_source") {
    if (typeof args.id !== "string") return { ok: false, content: "id must be a string", summary: "invalid read" };
    const [other, inner] = args.id.includes("|") ? args.id.split("|", 2) : [scope.slugs[0], args.id];
    const s = await readSource(other, inner);
    const label = s && (other !== scope.slugs[0] || multi) ? `${(await getAccount(other))?.account.name ?? other} · ${s.label}` : s?.label;
    return s ? { ok: true, content: JSON.stringify({ id: args.id, label, text: s.text }), summary: `read ${label}`, sources: [{ label: label ?? s.label, slug: other, id: inner }] } : { ok: false, content: `No source with id ${args.id}. Call list_sources.`, summary: "source not found" };
  }
  if (name === "list_sources") {
    const which = pick();
    if ("error" in which) return { ok: false, content: which.error, summary: "unknown project" };
    const slug = which[0];
    const l = (await listSources(slug)).map((x) => multi ? { id: `${slug}|${x.id}`, label: `${scope.names.get(slug)} · ${x.label}` } : x);
    return { ok: true, content: JSON.stringify(l), summary: `listed ${l.length} sources${multi ? ` in ${scope.names.get(slug)}` : ""}`, sources: l.map((x) => ({ label: x.label, slug, id: x.id })) };
  }
  if (name === "search_expertise") {
    const p = parseSearchExpertise(input);
    if ("error" in p) return { ok: false, content: p.error, summary: "invalid search" };
    const inScope = new Set(scope.slugs);
    const visible = await listAccounts();                       // only projects this person may see
    const others = visible.filter((b) => b.account.stage === "delivery" && !inScope.has(b.account.slug));
    const me = visible.find((b) => b.account.slug === scope.slugs[0]);
    const same = new Set(me ? relatedByIndustry(me, visible).map((r) => r.bundle.account.slug) : []);
    const names = new Map(visible.map((b) => [b.account.slug, b.account.name]));
    const raw = await searchChunks({ slugs: others.map((b) => b.account.slug), query: p.query, layers: ["vault", "chapter", "summary"], k: Math.min(30, p.limit * 2) });
    const hits = raw.map((h) => ({ ...h, score: h.score * (same.has(h.slug) ? 1.5 : 1) })).sort((a, b) => b.score - a.score).slice(0, p.limit);
    const { items, sources } = await present(hits, p.query, names, true);
    const out = items.map((f, i) => ({ ...f, sameIndustry: same.has(hits[i].slug) }));
    return { ok: true, content: out.length ? JSON.stringify(out) : "No matches in other projects.", summary: `searched other projects for “${p.query}” · ${out.length} hits`, sources };
  }
  if (name === "create_document") {
    if (typeof args.title !== "string" || typeof args.content !== "string" || !args.content.trim()) return { ok: false, content: "title and content (markdown) are required", summary: "invalid document" };
    const proj = resolve(scope, args.project);
    const doc: StellaDocument = { id: crypto.randomUUID(), title: args.title.trim(), content: args.content, projects: proj ? [proj] : scope.slugs.length <= 3 ? scope.slugs : [], kind: "written" };
    emit(doc);
    return { ok: true, content: `Document "${doc.title}" created (${doc.content.length} characters). It is shown to the strategist with download and save options.`, summary: `wrote “${doc.title}”` };
  }
  if (name === "compile_export") {
    const keys = Array.isArray(args.projects) && args.projects.length ? args.projects : scope.slugs;
    const slugs = keys.map((k) => resolve(scope, k)).filter((x): x is string => !!x);
    if (!slugs.length) return { ok: false, content: `None of those projects are in scope. In scope: ${scope.slugs.map((x) => scope.names.get(x)).join(", ")}.`, summary: "unknown project" };
    const bundles = (await Promise.all(slugs.map((x) => getAccount(x)))).filter((b): b is NonNullable<typeof b> => !!b);
    const groupNames = ["Sales Strategy", "Deal Strategy", "Technical Strategy", "Delivery Strategy"];
    const groups = Array.isArray(args.groups) ? args.groups.map((g) => groupNames.indexOf(String(g))).filter((n) => n >= 0) : undefined;
    const parts = Array.isArray(args.parts) ? (args.parts.filter((p) => ["overview", "vault", "book", "artifacts"].includes(String(p))) as ExportPart[]) : [];
    const out = buildExport(bundles, { parts, groups, title: typeof args.title === "string" ? args.title : undefined });
    emit({ id: crypto.randomUUID(), title: out.title, content: out.markdown, projects: slugs, kind: "export" });
    return { ok: true, content: `Export "${out.title}" built: ${out.stats.projects} projects, ${out.stats.files} vault files, ${out.stats.chapters} book chapters, ${Math.round(out.markdown.length / 1000)}k characters. It is shown to the strategist with download and save options.`, summary: `compiled “${out.title}”` };
  }
  return { ok: false, content: `Unknown tool ${name}`, summary: "unknown tool" };
}

/** Each project's calls of the last 30 days (headline, title, date), for the header digest. No model call. */
async function recentCalls(slugs: string[]): Promise<Map<string, { metAt: string | null; headline: string | null; title: string }[]>> {
  const out = new Map<string, { metAt: string | null; headline: string | null; title: string }[]>();
  if (!dbEnabled()) return out;
  try {
    const maps = await accountMaps();
    const ids = slugs.map((s) => maps.bySlug.get(s)).filter((x): x is string => !!x);
    if (!ids.length) return out;
    const since = new Date(Date.now() - DIGEST_DAYS * 86_400_000).toISOString();
    const rows = check(await db().from("transcript_accounts").select("account_id,headline,transcripts!inner(title,met_at,status,gone_at)")
      .in("account_id", ids).gte("transcripts.met_at", since).limit(1000), "read recent calls") as unknown as
      { account_id: string; headline: string | null; transcripts: { title: string; met_at: string | null; status: string; gone_at: string | null } }[];
    const now = new Date();
    for (const r of rows) {
      const slug = maps.byId.get(r.account_id);
      if (!slug || !keepHit(r.transcripts, now)) continue;
      out.set(slug, [...(out.get(slug) ?? []), { metAt: r.transcripts.met_at, headline: r.headline, title: r.transcripts.title }]);
    }
  } catch (e) {
    console.error("[stella] recent calls for the header failed:", e);   // the header goes out without the digest
  }
  return out;
}

function digestBlock(rows: { metAt: string | null; headline: string | null; title: string }[] | undefined, max: number, indent = ""): string {
  const lines = callDigest(rows ?? [], new Date(), max);
  return lines.length ? `${indent}Calls in the last 30 days:\n${lines.map((l) => indent + l).join("\n")}` : `${indent}Calls in the last 30 days: none recorded.`;
}

async function projectHeader(slug: string, calls: Map<string, { metAt: string | null; headline: string | null; title: string }[]>): Promise<string> {
  const b = (await getAccount(slug))!;
  const a = b.account;
  const who = a.stage === "sales"
    ? `The deal: ${a.name}, in sales at stage ${a.deal?.stage}. Value ${a.deal?.value || "not set"}. Owner ${a.deal?.owner || "not set"}. Next step: ${a.deal?.nextStep || "none recorded"}. This deal is being scoped: most of its files are still empty templates. Use search_expertise to bring in what similar delivered projects learned, and label it as theirs.`
    : `The account: ${a.name}, in delivery. Strategist: ${a.strategist}. Pod: ${a.pod}. MRR ${a.mrr || "unknown"}, ${a.closedCount} closed deals worth ${a.closedValue || "unknown"}. Health ${a.health ? `${a.health.score} (${a.health.band})` : "not scored"}.`;
  return `${who}
Industry: ${a.industry || "not set"}. Squad: ${a.squad || "not set"}.
Book chapters: ${b.book.map((c, i) => `${i + 1}. ${c.title}`).join("; ") || "none yet"}.
Vault files: ${b.files.filter((f) => f.state === "active").map((f) => f.path).join("; ")}.
${digestBlock(calls.get(slug), DIGEST_LINES)}`;
}

async function scopeHeader(scope: Scope): Promise<string> {
  const calls = await recentCalls(scope.slugs);
  if (scope.slugs.length === 1) return `Project in scope (slug ${scope.slugs[0]}):
${await projectHeader(scope.slugs[0], calls)}`;
  // Several projects: the full 10 lines each for a few, 3 each for a wide scope, so the header stays small.
  const lines = scope.slugs.length <= 3 ? DIGEST_LINES : 3;
  const rows = await Promise.all(scope.slugs.map(async (slug) => {
    const a = (await getAccount(slug))!.account;
    const state = a.stage === "sales" ? `in sales, ${a.deal?.stage ?? ""}${a.deal?.value ? `, ${a.deal.value}` : ""}` : `in delivery${a.health ? `, health ${a.health.score} ${a.health.band}` : ""}${a.mrr ? `, MRR ${a.mrr}` : ""}`;
    return `- ${a.name} (slug ${slug}): ${state}; industry ${a.industry || "not set"}; squad ${a.squad || "not set"}
${digestBlock(calls.get(slug), lines, "  ")}`;
  }));
  return `${scope.all ? "Every project is in scope" : `${scope.slugs.length} projects are in scope`}. Search across them, or pass project to search one.
${rows.join("\n")}`;
}

export type StellaEvent =
  | { type: "text"; delta: string }
  | { type: "tool"; name: string; summary: string }
  /** The text streamed since the last reset was working notes before a tool call, not the answer. */
  | { type: "reset" }
  | { type: "document"; doc: StellaDocument }
  /** Where the answer's points came from, split off the end of the answer text; sent once, before done. */
  | { type: "evidence"; items: Evidence[] }
  | { type: "done"; stop: string; usage: { input: number; output: number; cacheRead: number } }
  | { type: "error"; message: string };

export type Attachment = { name: string; kind: "text" | "pdf"; text?: string; data?: string };
export type Turn = { role: "user" | "assistant"; content: string; attachments?: Attachment[] };

function userContent(t: Turn): Anthropic.Beta.BetaMessageContentParam {
  if (!t.attachments?.length) return t.content;
  const blocks: Anthropic.Beta.BetaContentBlockParam[] = [];
  for (const a of t.attachments) {
    if (a.kind === "pdf" && a.data) blocks.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: a.data }, title: a.name });
    else if (a.text) blocks.push({ type: "text", text: `Attached file: ${a.name}\n\n${a.text}` });
  }
  blocks.push({ type: "text", text: t.content });
  return blocks;
}

/** Ask Stella. scope: project slugs, or ["*"] for every project. */
export async function* askStella(scopeIn: string[], history: Turn[]): AsyncGenerator<StellaEvent> {
  const client = new Anthropic();
  const everyone = await listAccounts();
  const names = new Map(everyone.map((b) => [b.account.slug, b.account.name]));
  const all = scopeIn.includes("*");
  const slugs = all ? everyone.map((b) => b.account.slug) : scopeIn.filter((x) => names.has(x));
  if (!slugs.length) { yield { type: "error", message: "Choose at least one project." }; return; }
  const access = await currentAccess();
  const scope: Scope = { slugs, all, names, visible: access.slugs };
  const messages: Anthropic.Beta.BetaMessageParam[] = stripHistory(history).map((m): Anthropic.Beta.BetaMessageParam => ({ role: m.role, content: m.role === "user" ? userContent(m) : m.content }));
  const system: Anthropic.Beta.BetaTextBlockParam[] = [
    { type: "text", text: `${RULES}\n\n# Your frameworks\n\n${frameworks()}`, cache_control: { type: "ephemeral" } },
    { type: "text", text: await scopeHeader(scope), cache_control: { type: "ephemeral" } },
  ];
  const docs: StellaDocument[] = [];
  const known: KnownSource[] = [];   // every source a tool returned this turn, to resolve evidence labels
  let said = "";                     // the answer text since the last reset
  const usage = { input: 0, output: 0, cacheRead: 0 };

  let used = 0;                      // tool calls run for this answer
  let final = false;                 // the lookup budget is spent: one last turn, no tools
  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 64000,
      system,
      tools,
      ...(final ? { tool_choice: { type: "none" as const } } : {}),
      messages,
      output_config: { effort: "medium" },
      // Context editing clears tool results older than the last few tool uses as she works.
      context_management: contextManagement(),
      betas: ["server-side-fallback-2026-07-01", "context-management-2025-06-27"],
      fallbacks: "default",
    });

    const queue: string[] = [];
    stream.on("text", (d) => queue.push(d));
    let message: Anthropic.Beta.BetaMessage | null = null;
    let failure: unknown = null;
    const done = stream.finalMessage().then((m) => { message = m; }, (e) => { failure = e; });
    while (!message && !failure) {
      await Promise.race([done, new Promise((r) => setTimeout(r, 60))]);
      while (queue.length) { const d = queue.shift()!; said += d; yield { type: "text", delta: d }; }
    }
    while (queue.length) { const d = queue.shift()!; said += d; yield { type: "text", delta: d }; }
    if (failure) {
      yield { type: "error", message: failure instanceof Anthropic.APIError ? `Claude API error ${failure.status}: ${failure.message}` : String(failure) };
      return;
    }
    const m = message as unknown as Anthropic.Beta.BetaMessage;
    usage.input += m.usage.input_tokens; usage.output += m.usage.output_tokens; usage.cacheRead += m.usage.cache_read_input_tokens ?? 0;

    if (m.stop_reason === "refusal") { yield { type: "text", delta: "\n\nI can’t help with that request." }; yield { type: "done", stop: "refusal", usage }; return; }
    const calls = m.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");
    if (!calls.length || m.stop_reason === "end_turn") {
      const { evidence } = splitEvidence(said);
      if (evidence.length) yield { type: "evidence", items: resolveRefs(evidence, known) };
      yield { type: "done", stop: String(m.stop_reason), usage };
      return;
    }
    if (m.stop_reason === "max_tokens") { yield { type: "error", message: "The answer ran past its length limit." }; return; }

    yield { type: "reset" };
    said = "";
    messages.push({ role: "assistant", content: m.content });
    const budget = allotCalls(used, calls.length);
    used += budget.run;
    const results: Anthropic.Beta.BetaToolResultBlockParam[] = await Promise.all(calls.map(async (c, i) => {
      let r: ToolResult;
      if (i >= budget.run) r = { ok: false, content: SKIPPED, summary: "skipped: lookup budget used up" };
      else {
        try { r = await runTool(scope, c.name, c.input, (d) => docs.push(d)); }
        catch (e) { console.error(`[stella] ${c.name} failed:`, e); r = { ok: false, content: `The lookup failed: ${e instanceof Error ? e.message : String(e)}`, summary: `${c.name} failed` }; }
      }
      if (r.sources) known.push(...r.sources);
      return { type: "tool_result", tool_use_id: c.id, content: r.content, is_error: !r.ok, _summary: r.summary } as Anthropic.Beta.BetaToolResultBlockParam & { _summary: string };
    }));
    for (const r of results as (Anthropic.Beta.BetaToolResultBlockParam & { _summary: string })[]) { yield { type: "tool", name: calls.find((c) => c.id === r.tool_use_id)!.name, summary: r._summary }; delete (r as { _summary?: string })._summary; }
    while (docs.length) yield { type: "document", doc: docs.shift()! };
    final = budget.exhausted;
    messages.push({ role: "user", content: final ? [...results, { type: "text", text: finalTurnNote() }] : results });
  }
  yield { type: "error", message: "Stopped after too many lookups. Ask a narrower question." };
}
