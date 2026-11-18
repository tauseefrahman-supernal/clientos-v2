// Granola source client: normalizes a note into a SourceCall and lists notes (without transcripts).
// The note owner's private notes (private_notes_text / private_notes_markdown) are never read or carried.
// Importable by node --test: no "server-only", and the API key is read lazily inside the network functions.
import type { SourceCall, Turn } from "../types.ts";
import {
  type FetchLike, type ListResult, type SourceDeps, MAX_PAGES, SourceHttpError,
  addPeople, asArray, defaultFetch, iso, obj, str,
} from "./shared.ts";

export const GRANOLA_BASE = "https://public-api.granola.ai/v1";
export const GRANOLA_PAGE_SIZE = 30;

/** Granola transcript entries to turns, start in seconds from the first timed turn; null when none. */
export function granolaTurns(v: unknown): Turn[] | null {
  const entries = asArray(v).map(obj).filter((t): t is Record<string, unknown> => !!t);
  if (!entries.length) return null;
  const times = entries.map((t) => { const s = str(t.start_time); const ms = s ? Date.parse(s) : NaN; return Number.isNaN(ms) ? null : ms; });
  const first = times.find((ms) => ms !== null) ?? null;
  return entries.map((t, i) => {
    const sp = obj(t.speaker) ?? {};
    const ms = times[i];
    return {
      speaker: str(sp.name) ?? str(sp.attribution) ?? str(sp.source) ?? "Unknown",
      start: ms === null || first === null ? null : (ms - first) / 1000,
      text: typeof t.text === "string" ? t.text : "",
    };
  });
}

/** One Granola note to a SourceCall. Throws when it has no id. Private notes are never copied. */
export function normalizeGranola(raw: unknown): SourceCall {
  const n = obj(raw);
  const id = str(n?.id);
  if (!n || !id) throw new Error("Granola note has no id");
  const cal = obj(n.calendar_event);
  const participants = addPeople([], asArray(n.attendees).map((p) => obj(p) ?? {}));
  addPeople(participants, asArray(cal?.invitees).map((p) => obj(p) ?? {}));
  const owner = obj(n.owner);
  if (owner) addPeople(participants, [owner]);
  return {
    provider: "granola",
    externalId: id,
    title: str(n.title) ?? str(cal?.event_title) ?? "Untitled call",
    metAt: iso(cal?.scheduled_start_time) ?? iso(n.created_at) ?? new Date(0).toISOString(),
    participants,
    url: str(n.web_url) ?? "",
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
 */
export async function listGranola(since: string | null, cursor: string | null, d?: SourceDeps): Promise<ListResult> {
  const { fetch, key } = deps(d);
  const sinceMs = since ? Date.parse(since) : NaN;
  const calls: SourceCall[] = [];
  let next = cursor;
  for (let page = 0; page < MAX_PAGES; page++) {
    const url = new URL(`${GRANOLA_BASE}/notes`);
    url.searchParams.set("page_size", String(GRANOLA_PAGE_SIZE));
    if (next) url.searchParams.set("cursor", next);
    const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${key}` } });
    if (res.status === 429) return { calls, cursor: next, rateLimited: true };
    if (!res.ok) throw new SourceHttpError("Granola", res.status);
    const body = obj(await res.json()) ?? {};
    for (const item of asArray(body.notes ?? body.data ?? body.items)) {
      const note = obj(item);
      if (!note || note.deleted_at) continue;
      if (!Number.isNaN(sinceMs)) {
        const upd = Date.parse(str(note.updated_at) ?? str(note.created_at) ?? "");
        if (!Number.isNaN(upd) && upd < sinceMs) continue;
      }
      calls.push({ ...normalizeGranola(note), turns: null });
    }
    const more = body.hasMore ?? body.has_more;
    next = str(body.cursor) ?? str(body.next_cursor);
    if (!more || !next) return { calls, cursor: null, rateLimited: false };
  }
  return { calls, cursor: next, rateLimited: false };
}

/** One note's transcript; null when Granola has none (404 or empty). 429 and other errors throw. */
export async function fetchGranolaTranscript(noteId: string, d?: SourceDeps): Promise<Turn[] | null> {
  const { fetch, key } = deps(d);
  const res = await fetch(`${GRANOLA_BASE}/notes/${encodeURIComponent(noteId)}?include=transcript`, { headers: { Authorization: `Bearer ${key}` } });
  if (res.status === 404) return null;
  if (!res.ok) throw new SourceHttpError("Granola", res.status);
  return granolaTurns(obj(await res.json())?.transcript);
}
