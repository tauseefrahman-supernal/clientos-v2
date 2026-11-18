// Fathom source client: normalizes a meeting into a SourceCall and lists meetings with their transcripts.
// Importable by node --test: no "server-only", and the API key is read lazily inside the network functions.
import type { SourceCall, Turn } from "../types.ts";
import {
  type FetchLike, type ListResult, type SourceDeps, MAX_PAGES, SourceHttpError,
  addPeople, asArray, defaultFetch, iso, obj, str,
} from "./shared.ts";

export const FATHOM_BASE = "https://api.fathom.ai/external/v1";

/** "HH:MM:SS" (or "MM:SS") to seconds; null when it isn't one. */
export function hmsToSeconds(v: unknown): number | null {
  const s = str(v);
  if (!s || !/^\d+(:\d{1,2}){1,2}$/.test(s.trim())) return null;
  return s.trim().split(":").reduce((acc, part) => acc * 60 + Number(part), 0);
}

/** Fathom transcript entries to turns; null when there are none. */
export function fathomTurns(v: unknown): Turn[] | null {
  const turns = asArray(v).map(obj).filter((t): t is Record<string, unknown> => !!t).map((t) => ({
    speaker: str(obj(t.speaker)?.display_name) ?? "Unknown",
    start: hmsToSeconds(t.timestamp),
    text: typeof t.text === "string" ? t.text : "",
  }));
  return turns.length ? turns : null;
}

function summaryText(v: unknown): string {
  if (typeof v === "string") return v;
  const o = obj(v);
  if (!o) return "";
  return str(o.markdown_formatted) ?? str(o.markdown) ?? str(o.text) ?? "";
}

/** One Fathom meeting (from /meetings) to a SourceCall. Throws when it has no recording id. */
export function normalizeFathom(raw: unknown): SourceCall {
  const m = obj(raw);
  const id = m?.recording_id;
  if (!m || (typeof id !== "number" && !str(id))) throw new Error("Fathom meeting has no recording_id");
  const participants = addPeople([], asArray(m.calendar_invitees).map((p) => obj(p) ?? {}));
  const rec = obj(m.recorded_by);
  if (rec) addPeople(participants, [rec]);
  return {
    provider: "fathom",
    externalId: String(id),
    title: str(m.title) ?? str(m.meeting_title) ?? "Untitled call",
    metAt: iso(m.recording_start_time) ?? iso(m.scheduled_start_time) ?? iso(m.created_at) ?? new Date(0).toISOString(),
    participants,
    url: str(m.share_url) ?? str(m.url) ?? "",
    sourceSummary: summaryText(m.default_summary),
    turns: fathomTurns(m.transcript),
  };
}

function deps(d?: SourceDeps): { fetch: FetchLike; key: string } {
  const key = d && "key" in d ? d.key : process.env.FATHOM_API_KEY;
  if (!key) throw new Error("FATHOM_API_KEY is not set");
  return { fetch: d?.fetch ?? defaultFetch(), key };
}

/**
 * Lists meetings created after `since` (all when null), transcripts included, starting at `cursor`.
 * Pages until done; on HTTP 429 returns what it has with the cursor to resume from and rateLimited true.
 */
export async function listFathom(since: string | null, cursor: string | null, d?: SourceDeps): Promise<ListResult> {
  const { fetch, key } = deps(d);
  const calls: SourceCall[] = [];
  let next = cursor;
  for (let page = 0; page < MAX_PAGES; page++) {
    const url = new URL(`${FATHOM_BASE}/meetings`);
    url.searchParams.set("include_transcript", "true");
    if (since) url.searchParams.set("created_after", since);
    if (next) url.searchParams.set("cursor", next);
    const res = await fetch(url.toString(), { headers: { "X-Api-Key": key } });
    if (res.status === 429) return { calls, cursor: next, rateLimited: true };
    if (!res.ok) throw new SourceHttpError("Fathom", res.status);
    const body = obj(await res.json()) ?? {};
    for (const item of asArray(body.items)) calls.push(normalizeFathom(item));
    next = str(body.next_cursor);
    if (!next) return { calls, cursor: null, rateLimited: false };
  }
  return { calls, cursor: next, rateLimited: false };
}

/** One recording's transcript; null when Fathom has none (404 or empty). 429 and other errors throw. */
export async function fetchFathomTranscript(recordingId: string, d?: SourceDeps): Promise<Turn[] | null> {
  const { fetch, key } = deps(d);
  const res = await fetch(`${FATHOM_BASE}/recordings/${encodeURIComponent(recordingId)}/transcript`, { headers: { "X-Api-Key": key } });
  if (res.status === 404) return null;
  if (!res.ok) throw new SourceHttpError("Fathom", res.status);
  return fathomTurns(obj(await res.json())?.transcript);
}
