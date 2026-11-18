// Granola source client: normalizes a note into a SourceCall and lists notes (without transcripts).
// The note owner's private notes (private_notes_text / private_notes_markdown) are never read or carried.
// Importable by node --test: no "server-only", and the API key is read lazily inside the network functions.
import type { SourceCall, Turn } from "../types.ts";
import {
  type FetchLike, type ListResult, type SourceDeps, type TranscriptResult, MAX_PAGES, RateLimitedError, SourceHttpError,
  addPeople, asArray, defaultFetch, iso, obj, readJson, str, tryNormalize, uuidIn,
} from "./shared.ts";

/** A note's web link: web_url, or url / share_url when a response names it that way. */
const webUrl = (n: Record<string, unknown>) => str(n.web_url) ?? str(n.url) ?? str(n.share_url) ?? null;

export const GRANOLA_BASE = "https://public-api.granola.ai/v1";
export const GRANOLA_PAGE_SIZE = 30;

/** A start_time in seconds: an ISO time (epoch seconds) or a number of seconds; null when neither. */
function startSeconds(v: unknown): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  const s = str(v);
  if (!s) return null;
  if (/^\d+(\.\d+)?$/.test(s.trim())) return Number(s);
  const ms = Date.parse(s);
  return Number.isNaN(ms) ? null : ms / 1000;
}

/** Granola transcript entries to turns, start in seconds from the first timed turn; null when none. */
export function granolaTurns(v: unknown): Turn[] | null {
  const entries = asArray(v).map(obj).filter((t): t is Record<string, unknown> => !!t);
  if (!entries.length) return null;
  const times = entries.map((t) => startSeconds(t.start_time));
  const first = times.find((sec) => sec !== null) ?? null;
  return entries.map((t, i) => {
    const sp = obj(t.speaker) ?? {};
    const sec = times[i];
    return {
      speaker: str(sp.name) ?? str(sp.attribution) ?? str(sp.source) ?? "Unknown",
      start: sec === null || first === null ? null : Math.round((sec - first) * 1000) / 1000,
      text: typeof t.text === "string" ? t.text : "",
    };
  });
}

/** One Granola note to a SourceCall. Throws when it has no id or no usable date. Private notes are never copied. */
export function normalizeGranola(raw: unknown): SourceCall {
  const n = obj(raw);
  const id = str(n?.id);
  if (!n || !id) throw new Error("Granola note has no id");
  const cal = obj(n.calendar_event);
  const participants = addPeople([], asArray(n.attendees).map((p) => obj(p) ?? {}));
  addPeople(participants, asArray(cal?.invitees).map((p) => obj(p) ?? {}));
  const owner = obj(n.owner);
  if (owner) addPeople(participants, [owner]);
  const metAt = iso(cal?.scheduled_start_time) ?? iso(n.created_at);
  if (!metAt) throw new Error("Granola note has no usable date");
  return {
    provider: "granola",
    externalId: id,
    title: str(n.title) ?? str(cal?.event_title) ?? "Untitled call",
    metAt,
    participants,
    url: webUrl(n) ?? "",
    sourceSummary: str(n.summary_markdown) ?? str(n.summary_text) ?? "",
    turns: granolaTurns(n.transcript),
  };
}

function deps(d?: SourceDeps): { fetch: FetchLike; key: string } {
  const key = d && "key" in d ? d.key : process.env.GRANOLA_API_KEY;
  if (!key) throw new Error("GRANOLA_API_KEY is not set");
  return { fetch: d?.fetch ?? defaultFetch(), key };
}

/**
 * Lists live notes updated at or after `since` (all when null), starting at `cursor`. Calls come back with
 * `turns: null`; fetch each with fetchGranolaTranscript. Deleted notes are dropped. The updated-since filter
 * is applied here, client-side, because the public API's server-side filter is unconfirmed.
 * Pages until done; on HTTP 429 returns what it has with the cursor to resume from and rateLimited true.
 * Items that fail to normalize are skipped and counted. Stops if the API hands back the same cursor again.
 */
export async function listGranola(since: string | null, cursor: string | null, d?: SourceDeps): Promise<ListResult> {
  const { fetch, key } = deps(d);
  const sinceMs = since ? Date.parse(since) : NaN;
  const calls: SourceCall[] = [];
  let next = cursor, skipped = 0;
  for (let page = 0; page < MAX_PAGES; page++) {
    const url = new URL(`${GRANOLA_BASE}/notes`);
    url.searchParams.set("page_size", String(GRANOLA_PAGE_SIZE));
    if (next) url.searchParams.set("cursor", next);
    const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${key}` } });
    if (res.status === 429) return { calls, cursor: next, rateLimited: true, skipped };
    if (!res.ok) throw new SourceHttpError("Granola", res.status);
    const body = obj(await readJson("Granola", res)) ?? {};
    for (const item of asArray(body.notes ?? body.data ?? body.items)) {
      const note = obj(item);
      if (!note) { skipped++; continue; }
      if (note.deleted_at) continue;
      if (!Number.isNaN(sinceMs)) {
        const upd = Date.parse(str(note.updated_at) ?? str(note.created_at) ?? "");
        if (!Number.isNaN(upd) && upd < sinceMs) continue;
      }
      const call = tryNormalize(normalizeGranola, note);
      if (call) calls.push({ ...call, turns: null }); else skipped++;
    }
    const more = body.hasMore ?? body.has_more;
    const prev = next;
    next = str(body.cursor) ?? str(body.next_cursor);
    if (!more || !next || next === prev) return { calls, cursor: null, rateLimited: false, skipped };
  }
  return { calls, cursor: next, rateLimited: false, skipped };
}

/**
 * One note's transcript: ready (with the note's web link and any web UUID in it), not_ready (empty or still
 * processing) or gone (404). Throws RateLimitedError on 429.
 */
export async function fetchGranolaTranscript(noteId: string, d?: SourceDeps): Promise<TranscriptResult> {
  const { fetch, key } = deps(d);
  const res = await fetch(`${GRANOLA_BASE}/notes/${encodeURIComponent(noteId)}?include=transcript`, { headers: { Authorization: `Bearer ${key}` } });
  if (res.status === 404) return { status: "gone" };
  if (res.status === 429) throw new RateLimitedError("Granola");
  if (!res.ok) throw new SourceHttpError("Granola", res.status);
  const note = obj(await readJson("Granola", res));
  if (note?.deleted_at) return { status: "gone" };
  const turns = granolaTurns(note?.transcript);
  if (!turns) return { status: "not_ready" };
  const url = note ? webUrl(note) : null;
  const webId = uuidIn(url);
  return { status: "ready", turns, ...(url ? { url } : {}), ...(webId ? { webId } : {}) };
}
