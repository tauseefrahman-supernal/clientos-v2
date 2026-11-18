// Pure rules for indexing Stella's memory: the stored call body format, which owners are usable,
// the chunk rows each owner should have, and the plan that brings stored chunks in line with them.
// No "server-only" import, so node --test can load it directly.
import { chunkText, chunkTurns } from "./chunk.ts";
import type { Layer, Turn } from "./types.ts";

/** Days a call that left Granola or Fathom stays searchable. */
export const GONE_GRACE_DAYS = 14;
export const EMBED_BATCH = 128;

// ---------------------------------------------------------------- call body format

const pad = (n: number) => String(n).padStart(2, "0");
const stamp = (s: number) => `[${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(Math.floor(s % 60))}]`;
const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();

/** The stored body: one turn per line, "[hh:mm:ss] Speaker: text"; no stamp when the source has no time, no label for a marker. */
export function turnsToBody(turns: Turn[]): string {
  return turns
    .map((t) => ({ ...t, text: oneLine(t.text), speaker: oneLine(t.speaker) }))
    .filter((t) => t.text)
    .map((t) => `${t.start === null ? "" : stamp(t.start) + " "}${t.speaker ? `${t.speaker}: ` : ""}${t.text}`)
    .join("\n");
}

const LINE = /^(?:\[(\d+):(\d{2}):(\d{2})\]\s+)?(?:([^:\[\]\n]{1,80}?):\s)?(.*)$/;

/** Parses a body written by turnsToBody back into turns. A line without a label is a speakerless turn. */
export function bodyToTurns(body: string): Turn[] {
  const out: Turn[] = [];
  for (const raw of body.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const m = LINE.exec(line)!;
    const start = m[1] !== undefined ? Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) : null;
    out.push({ speaker: (m[4] ?? "").trim(), start, text: m[5].trim() });
  }
  return out;
}

// ---------------------------------------------------------------- usable

export interface UsableFacts { state?: string | null; shown?: boolean | null; sensitive?: boolean | null; status?: string | null; goneAt?: string | null }

/** False when the owner is hidden, archived, deleted or sensitive, a personnel call, or gone for more than 14 days. */
export function isUsable(o: UsableFacts, now: Date): boolean {
  if (o.state && o.state !== "active") return false;
  if (o.shown === false || o.sensitive === true) return false;
  if (o.status === "personnel") return false;
  if (o.goneAt && now.getTime() - Date.parse(o.goneAt) > GONE_GRACE_DAYS * 86_400_000) return false;
  return true;
}

// ---------------------------------------------------------------- batching

export function batches<T>(xs: T[], size = EMBED_BATCH): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < xs.length; i += size) out.push(xs.slice(i, i + size));
  return out;
}

/** A rough token count for a dry run: four characters a token. */
export function estimateTokens(texts: string[]): number {
  return Math.ceil(texts.reduce((n, t) => n + t.length, 0) / 4);
}

// ---------------------------------------------------------------- chunk rows per owner

export type OwnerType = "file" | "chapter" | "transcript";

/** One chunk as it should be stored. accounts are the projects it is linked to in chunk_accounts. */
export interface ChunkRow {
  layer: Layer; ownerType: OwnerType; ownerId: string; accountId: string | null; seq: number;
  label: string; body: string; metAt: string | null; speakers: string[]; usable: boolean; accounts: string[];
}

export interface VaultFileRow { id: string; account_id: string; path: string; content: string; state: string; shown: boolean | null }
export interface ChapterRow { id: string; account_id: string; sort: number; title: string; body: string; sources: string[] | null; project: string }
export interface CallRow {
  id: string; title: string; met_at: string | null; status: string; summary: string | null; body: string | null;
  gone_at: string | null; speakers: unknown; accounts: string[];
}

const part = (label: string, seq: number, n: number) => (n > 1 ? `${label} (part ${seq + 1} of ${n})` : label);

/**
 * Every stored chunk body starts with a one-line header naming its owner (a call's title and date, a file's path,
 * a chapter's project and title), so embeddings and full-text search see it and a rename re-embeds.
 */
export const withHeader = (header: string, text: string) => `${oneLine(header)}\n${text}`;
/** Splits a stored chunk body into its header line and its text; use the text, not the body, for bodyToTurns. */
export function splitHeader(body: string): { header: string; text: string } {
  const i = body.indexOf("\n");
  return i === -1 ? { header: body, text: "" } : { header: body.slice(0, i), text: body.slice(i + 1) };
}

export function vaultChunks(f: VaultFileRow, now: Date): ChunkRow[] {
  const pieces = chunkText(f.content ?? "");
  const usable = isUsable({ state: f.state, shown: f.shown }, now);
  return pieces.map((p) => ({
    layer: "vault", ownerType: "file", ownerId: f.id, accountId: f.account_id, seq: p.seq,
    label: part(`File ${f.path}.md`, p.seq, pieces.length), body: withHeader(`File: ${f.path}`, p.text), metAt: null, speakers: [], usable, accounts: [f.account_id],
  }));
}

export function chapterChunks(c: ChapterRow): ChunkRow[] {
  const text = (c.sources ?? []).length ? `${c.body}\n\nSources: ${c.sources!.join("; ")}` : c.body;
  const pieces = chunkText(text ?? "");
  return pieces.map((p) => ({
    layer: "chapter", ownerType: "chapter", ownerId: c.id, accountId: c.account_id, seq: p.seq,
    label: part(`Book, chapter ${c.sort + 1}: ${c.title}`, p.seq, pieces.length), body: withHeader(`Book: ${c.project} — ${c.title}`, p.text), metAt: null, speakers: [], usable: true, accounts: [c.account_id],
  }));
}

/** Names from the call's speakers field: strings, or objects with a name. */
function speakerNames(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  const out: string[] = [];
  for (const s of v) {
    const name = typeof s === "string" ? s : s && typeof s === "object" && typeof (s as { name?: unknown }).name === "string" ? (s as { name: string }).name : "";
    if (name.trim() && !out.includes(name.trim())) out.push(name.trim());
  }
  return out;
}

/** A digested call's summary (one chunk) and the body of a digested or pending call (speaker-turn chunks). */
export function callChunks(c: CallRow, now: Date): ChunkRow[] {
  if (c.status === "personnel") return [];
  const usable = isUsable({ status: c.status, goneAt: c.gone_at }, now);
  const date = c.met_at ? c.met_at.slice(0, 10) : "undated";
  const base = { ownerType: "transcript" as const, ownerId: c.id, accountId: null, metAt: c.met_at, usable, accounts: c.accounts };
  const turns = c.body && c.body.trim() && (c.status === "digested" || c.status === "pending") ? bodyToTurns(c.body) : [];
  const out: ChunkRow[] = [];
  if (c.status === "digested" && c.summary && c.summary.trim()) {
    let speakers = speakerNames(c.speakers);
    if (!speakers.length) for (const t of turns) if (t.speaker && !speakers.includes(t.speaker)) speakers = [...speakers, t.speaker];
    out.push({ ...base, layer: "summary", seq: 0, label: `Call summary: ${c.title}, ${date}`, body: `${c.title} (${date})\n\n${c.summary.trim()}`, speakers });
  }
  const pieces = chunkTurns(turns);
  for (const p of pieces) out.push({ ...base, layer: "transcript", seq: p.seq, label: part(`Call: ${c.title}, ${date}`, p.seq, pieces.length), body: withHeader(`Call: ${c.title}, ${date}`, p.text), speakers: p.speakers });
  return out;
}

// ---------------------------------------------------------------- plan against stored chunks

/** A stored chunk of one owner, with the projects it is linked to. */
export interface ExistingChunk {
  id: string; layer: string; seq: number | null; label: string; body: string; metAt: string | null;
  speakers: string[]; usable: boolean; accountId: string | null; accounts: string[];
}

/** A row to embed and insert; replaces is the stored chunk it supersedes, removed once the new one is in. */
export type EmbedItem = ChunkRow & { replaces?: string };

export interface OwnerPlan {
  embed: EmbedItem[];                                    // new or changed text: embed and insert
  remove: string[];                                      // stored chunks to delete (left over, duplicates)
  patch: { id: string; fields: Record<string, unknown> }[]; // same text, other columns changed
  link: { chunk_id: string; account_id: string }[];
  unlink: { chunk_id: string; account_id: string }[];
}

const sameTime = (a: string | null, b: string | null) => (a === null || b === null ? a === b : Date.parse(a) === Date.parse(b));
const sameList = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => x === b[i]);

/**
 * Brings one owner's stored chunks in line with the rows it should have. Chunks match on layer and seq;
 * a match with the same text keeps its embedding and only has its other columns and links refreshed.
 */
export function planOwner(want: ChunkRow[], have: ExistingChunk[]): OwnerPlan {
  const plan: OwnerPlan = { embed: [], remove: [], patch: [], link: [], unlink: [] };
  const stored = new Map<string, ExistingChunk>();
  for (const h of have) {
    const key = `${h.layer}:${h.seq}`;
    if (stored.has(key)) plan.remove.push(h.id);
    else stored.set(key, h);
  }
  for (const w of want) {
    const key = `${w.layer}:${w.seq}`;
    const h = stored.get(key);
    stored.delete(key);
    if (!h || h.body !== w.body) {
      plan.embed.push(h ? { ...w, replaces: h.id } : w);
      continue;
    }
    const fields: Record<string, unknown> = {};
    if (h.usable !== w.usable) fields.usable = w.usable;
    if (h.label !== w.label) fields.label = w.label;
    if (!sameTime(h.metAt, w.metAt)) fields.met_at = w.metAt;
    if (!sameList(h.speakers, w.speakers)) fields.speakers = w.speakers;
    if (h.accountId !== w.accountId) fields.account_id = w.accountId;
    if (Object.keys(fields).length) plan.patch.push({ id: h.id, fields });
    for (const a of w.accounts) if (!h.accounts.includes(a)) plan.link.push({ chunk_id: h.id, account_id: a });
    for (const a of h.accounts) if (!w.accounts.includes(a)) plan.unlink.push({ chunk_id: h.id, account_id: a });
  }
  for (const h of stored.values()) plan.remove.push(h.id);
  return plan;
}

// ---------------------------------------------------------------- applying a plan

export type Patch = OwnerPlan["patch"][number];
export type Link = OwnerPlan["link"][number];

/** The writes applyPlan makes, injected so the order can be tested without a database or Voyage. */
export interface ApplyDeps {
  embed: (texts: string[]) => Promise<{ vectors: number[][]; tokens: number }>;
  insert: (items: { id: string; row: ChunkRow; vector: number[] }[]) => Promise<void>; // chunks and their project links
  remove: (ids: string[]) => Promise<void>;
  patch: (p: Patch) => Promise<void>;
  link: (rows: Link[]) => Promise<void>;
  unlink: (rows: Link[]) => Promise<void>;
  newId: () => string;
}

/**
 * Applies a plan, safety first, so a failed or cut-off embedding run never leaves private or stale chunks searchable:
 * 1. remove left-over chunks, and the stored versions of rows that are no longer usable (those are not re-embedded);
 *    set usable = false where it changed; drop project links that went;
 * 2. embed usable new or changed rows in batches of 128, inserting each batch and then removing the versions it replaced;
 * 3. the remaining patches (usable again, labels, dates, speakers) and new project links.
 */
export async function applyPlan(p: Pick<OwnerPlan, "embed" | "remove" | "patch" | "link" | "unlink">, deps: ApplyDeps): Promise<{ embedded: number; tokens: number; skipped: number }> {
  const unusable = p.embed.filter((r) => !r.usable);
  const toEmbed = p.embed.filter((r) => r.usable);
  const safeRemove = [...p.remove, ...unusable.flatMap((r) => (r.replaces ? [r.replaces] : []))];
  for (const ids of batches(safeRemove, 200)) await deps.remove(ids);
  const hide = p.patch.filter((x) => x.fields.usable === false);
  for (const x of hide) await deps.patch(x);
  for (const rows of batches(p.unlink, 500)) await deps.unlink(rows);

  let embedded = 0, tokens = 0;
  for (const batch of batches(toEmbed)) {
    const out = await deps.embed(batch.map((r) => r.body));
    tokens += out.tokens;
    await deps.insert(batch.map((row, i) => ({ id: deps.newId(), row, vector: out.vectors[i] })));
    const replaced = batch.flatMap((r) => (r.replaces ? [r.replaces] : []));
    if (replaced.length) await deps.remove(replaced);
    embedded += batch.length;
  }

  for (const x of p.patch) if (x.fields.usable !== false) await deps.patch(x);
  for (const rows of batches(p.link, 500)) await deps.link(rows);
  return { embedded, tokens, skipped: unusable.length };
}
