// Pure rules for Stella's retrieval tools: input validation, result formatting, the per-project call digest
// in her header, the tool budget and the context-editing config. No "server-only" import, so node --test
// can load it; lib/stella/agent.ts and lib/memory/search.ts wire it to the database.
import { isUsable, splitHeader } from "../memory/index-rules.ts";
import type { Layer, SearchHit } from "../memory/types.ts";

export const MAX_TOOL_CALLS = 8;          // per answer; then one final answer turn without tools
export const KEEP_TOOL_USES = 4;          // older tool results are cleared from her context
export const DEFAULT_RESULTS = 6;
export const MAX_RESULTS = 12;
export const EXCERPT_CHARS = 600;
export const DIGEST_LINES = 10;
export const DIGEST_DAYS = 30;
export const FULL_CALL_CHARS = 150_000;   // read_call full: true, cut beyond this

type Invalid = { error: string };
type Args = Record<string, unknown>;
const obj = (x: unknown): Args => (x && typeof x === "object" ? (x as Args) : {});
const text = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);
const limitOf = (v: unknown) => {
  const n = Math.floor(Number(v));
  return Number.isFinite(n) && v !== undefined && v !== null && v !== "" ? Math.min(MAX_RESULTS, Math.max(1, n)) : DEFAULT_RESULTS;
};
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** YYYY-MM-DD or a full ISO timestamp, as ISO; undefined when absent. */
function dateArg(v: unknown, name: string): string | undefined | Invalid {
  if (v === undefined || v === null || v === "") return undefined;
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}([T ][\d:.]+(Z|[+-]\d{2}:?\d{2})?)?$/.test(v.trim())) return { error: `${name} must be a date like 2026-11-01` };
  const t = Date.parse(/^\d{4}-\d{2}-\d{2}$/.test(v.trim()) ? `${v.trim()}T00:00:00Z` : v.trim());
  return Number.isNaN(t) ? { error: `${name} is not a valid date` } : new Date(t).toISOString();
}
const isInvalid = (x: unknown): x is Invalid => !!x && typeof x === "object" && "error" in x;

export function parseSearchContext(input: unknown): { query: string; project?: string; limit: number } | Invalid {
  const a = obj(input);
  const query = text(a.query);
  if (!query) return { error: "query must be a non-empty string" };
  return { query, project: text(a.project) ?? undefined, limit: limitOf(a.limit) };
}

export type CallDepth = "summaries" | "transcripts";
export function parseSearchCalls(input: unknown): { query: string; project?: string; depth: CallDepth; since?: string; until?: string; speakers?: string[]; limit: number } | Invalid {
  const a = obj(input);
  const query = text(a.query);
  if (!query) return { error: "query must be a non-empty string" };
  if (a.depth !== "summaries" && a.depth !== "transcripts") return { error: 'depth must be "summaries" or "transcripts"' };
  const since = dateArg(a.since, "since"), until = dateArg(a.until, "until");
  if (isInvalid(since)) return since;
  if (isInvalid(until)) return until;
  if (since && until && since >= until) return { error: "since must be before until" };
  const speakers = Array.isArray(a.speakers) ? a.speakers.map(text).filter((s): s is string => !!s).slice(0, 10) : [];
  return { query, project: text(a.project) ?? undefined, depth: a.depth, since, until, speakers: speakers.length ? speakers : undefined, limit: limitOf(a.limit) };
}

export function parseReadCall(input: unknown): { id: string; around?: string; full: boolean } | Invalid {
  const a = obj(input);
  const id = text(a.id)?.replace(/^call:/, "");
  if (!id || !UUID.test(id)) return { error: "id must be a call id from search_calls (call:…)" };
  return { id, around: text(a.around) ?? undefined, full: a.full === true };
}

export function parseSearchExpertise(input: unknown): { query: string; limit: number } | Invalid {
  const a = obj(input);
  const query = text(a.query);
  if (!query) return { error: "query must be a non-empty string" };
  return { query, limit: limitOf(a.limit) };
}

// ---------------------------------------------------------------- formatting

const STOP = new Set("the a an and or of to in on for with is are was were be by at as it its this that from what why how who when which did does do about".split(" "));
export const terms = (s: string) => s.toLowerCase().split(/[^\p{L}\p{N}$%]+/u).filter((w) => w.length > 1 && !STOP.has(w));

/** At most `max` characters of text, around the first query word found; the start when none is. */
export function excerpt(body: string, query: string, max = EXCERPT_CHARS): string {
  const t = body.trim();
  if (t.length <= max) return t;
  const lower = t.toLowerCase();
  const at = Math.min(...terms(query).map((w) => lower.indexOf(w)).filter((i) => i >= 0), Infinity);
  if (!Number.isFinite(at)) return `${t.slice(0, max - 1)}…`;
  const start = Math.max(0, Math.min(at - Math.floor(max / 3), t.length - max + 2));
  const end = Math.min(t.length, start + max - 2);
  return `${start > 0 ? "…" : ""}${t.slice(start, end)}${end < t.length ? "…" : ""}`.slice(0, max);
}

const noPart = (label: string) => label.replace(/ \(part \d+( of \d+)?\)$/, "");
const day = (iso: string | null | undefined) => (iso ? iso.slice(0, 10) : null);

/** The id read_source or read_call takes for a hit (vault and chapter hits carry their project). */
export function sourceIdFor(h: Pick<SearchHit, "slug" | "layer" | "label" | "transcriptId">): string {
  if (h.transcriptId) return `call:${h.transcriptId}`;
  const label = noPart(h.label);
  if (h.layer === "vault") { const m = /^File (.*)\.md$/.exec(label); return `${h.slug}|file:${m ? m[1] : label}`; }
  if (h.layer === "chapter") { const m = /^Book, chapter (\d+):/.exec(label); return `${h.slug}|chapter:${m ? Number(m[1]) - 1 : 0}`; }
  return `${h.slug}|${label}`;
}

export const callLabel = (title: string, metAt: string | null) => `Call: ${title}, ${day(metAt) ?? "undated"}`;

/** Maximum fused score: rank 1 in both the vector and the full-text list. */
const TOP = 2 / 61;

export interface FormattedHit {
  id: string; label: string; layer: Layer; project: string; date: string | null; speakers: string[];
  link: string | null; strength: number; excerpt: string;
}

/** One search result as Stella sees it. prefix: label it with the project (several projects in scope). */
export function formatHit(h: SearchHit, ctx: { query: string; project: string; prefix: boolean; call?: { title: string; url: string | null; metAt: string | null } }): FormattedHit {
  const isCall = !!h.transcriptId;
  const base = isCall ? callLabel(ctx.call?.title ?? noPart(h.label).replace(/^Call( summary)?: /, "").replace(/, (\d{4}-\d{2}-\d{2}|undated)$/, ""), ctx.call?.metAt ?? h.metAt) : noPart(h.label);
  return {
    id: sourceIdFor(h),
    label: ctx.prefix ? `${ctx.project} · ${base}` : base,
    layer: h.layer,
    project: ctx.project,
    date: day(ctx.call?.metAt ?? h.metAt),
    speakers: h.speakers ?? [],
    link: isCall && ctx.call?.url && /^https?:\/\//i.test(ctx.call.url) ? ctx.call.url : null,
    strength: Math.max(0, Math.min(100, Math.round((h.score / TOP) * 100))),
    excerpt: excerpt(splitHeader(h.excerpt).text, ctx.query),
  };
}

/** Whether a call's hits may be shown: not a personnel call, not gone from the source for more than 14 days. */
export function keepHit(call: { status?: string | null; gone_at?: string | null } | undefined, now: Date): boolean {
  return !!call && isUsable({ status: call.status ?? null, goneAt: call.gone_at ?? null }, now);
}

/** A call is readable when it is linked to a project the person can see; admins (visible null) see every call. */
export function callVisible(linked: string[], visible: Set<string> | null): boolean {
  return visible === null || linked.some((s) => visible.has(s));
}

/** The "last 30 days" lines for one project's header: newest first, headline else title, at most `max` lines. */
export function callDigest(rows: { metAt: string | null; headline: string | null; title: string }[], now: Date, max = DIGEST_LINES): string[] {
  const from = now.getTime() - DIGEST_DAYS * 86_400_000;
  const recent = rows.filter((r) => r.metAt && Date.parse(r.metAt) >= from).sort((a, b) => Date.parse(b.metAt!) - Date.parse(a.metAt!));
  const line = (r: (typeof recent)[number]) => `- ${day(r.metAt)}: ${(r.headline?.trim() || r.title).replace(/\s+/g, " ").slice(0, 200)}`;
  if (recent.length <= max) return recent.map(line);
  const shown = recent.slice(0, Math.max(0, max - 1)).map(line);
  return [...shown, `- …and ${recent.length - shown.length} more call${recent.length - shown.length === 1 ? "" : "s"} (search_calls)`];
}

// ---------------------------------------------------------------- budget and context

/** How many of the requested tool calls may run, given how many ran already this answer. */
/**
 * What read_call returns by default: the call's summary once it is digested. Before that the stored summary can be a
 * source one-liner or another project's seeded line, so it is never returned; the visible projects' headlines are.
 */
export function callOverview(call: { status: string | null; summary: string | null }, headlines: { project: string; headline: string | null }[]): { summary: string; headlines?: { project: string; headline: string }[] } {
  const summary = call.status === "digested" ? (call.summary ?? "").trim() : "";
  if (summary) return { summary };
  const heads = headlines.map((h) => ({ project: h.project, headline: (h.headline ?? "").trim() })).filter((h) => h.headline);
  return heads.length ? { summary: "No summary yet.", headlines: heads } : { summary: "No summary yet." };
}

export function allotCalls(used: number, requested: number, max = MAX_TOOL_CALLS): { run: number; skip: number; exhausted: boolean } {
  const run = Math.max(0, Math.min(requested, max - used));
  return { run, skip: requested - run, exhausted: used + run >= max };
}

export const SKIPPED = "Not run: the lookup budget for this answer is used up. Answer from what you have.";
export const finalTurnNote = () => `You have used all ${MAX_TOOL_CALLS} lookups for this answer. Answer now from what the tools returned; say what is still missing and where it would be found.`;

/** Anthropic context editing: clear tool results older than the last 4 tool uses. */
export function contextManagement() {
  return {
    edits: [{
      type: "clear_tool_uses_20250919" as const,
      trigger: { type: "tool_uses" as const, value: KEEP_TOOL_USES + 1 },
      keep: { type: "tool_uses" as const, value: KEEP_TOOL_USES },
    }],
  };
}

// ---------------------------------------------------------------- pending vault facts

export interface SuggestionRow { id: string; account_id: string; file_path: string; text: string; met_at: string | null; transcript_id: string | null }

/** Pending suggested facts that share words with the query, most shared words first, then newest. */
export function matchSuggestions<T extends SuggestionRow>(rows: T[], query: string, limit: number): T[] {
  const q = new Set(terms(query));
  if (!q.size) return [];
  return rows
    .map((r) => { const w = new Set(terms(`${r.text} ${r.file_path}`)); return { r, n: [...q].filter((x) => w.has(x)).length }; })
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n || Date.parse(b.r.met_at ?? "1970") - Date.parse(a.r.met_at ?? "1970"))
    .slice(0, limit)
    .map((x) => x.r);
}

export const SUGGESTED = "Suggested from a call — unconfirmed";
