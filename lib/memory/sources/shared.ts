// Helpers shared by the Fathom and Granola source clients. Pure, no "server-only", no env reads.
import type { SourceCall, Turn } from "../types.ts";

/** The slice of fetch the source clients use, so tests can pass a fake. */
export type FetchLike = (url: string, init: { headers: Record<string, string> }) =>
  Promise<{ ok: boolean; status: number; json: () => Promise<unknown> }>;

/** Fetch and key for a source client; both default to the real ones when left out. */
export interface SourceDeps { fetch?: FetchLike; key?: string | undefined }

/**
 * One listing run. `cursor` non-null means there is more to fetch (rate limit or page cap); `skipped` counts
 * items that could not be normalized (no id, no usable date, malformed).
 */
export interface ListResult { calls: SourceCall[]; cursor: string | null; rateLimited: boolean; skipped: number }

/** One transcript fetch: ready with turns, not ready yet (empty or still processing), or gone (404). */
export type TranscriptResult = { status: "ready"; turns: Turn[] } | { status: "not_ready" } | { status: "gone" };

/** Safety cap on pages per list call; hitting it returns the cursor so the caller can carry on. */
export const MAX_PAGES = 200;

/** Normalizes one item, counting it as skipped instead of throwing when it can't be. */
export function tryNormalize(normalize: (raw: unknown) => SourceCall, raw: unknown): SourceCall | null {
  try { return normalize(raw); } catch { return null; }
}

export type Obj = Record<string, unknown>;
export const obj = (v: unknown): Obj | null => (v && typeof v === "object" && !Array.isArray(v) ? (v as Obj) : null);
export const str = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v : null);

/** A parseable date as a full ISO string, else null. */
export function iso(v: unknown): string | null {
  const s = str(v);
  if (!s) return null;
  const t = Date.parse(s);
  return Number.isNaN(t) ? null : new Date(t).toISOString();
}

/** Adds people in order, skipping any whose email (case-insensitive) is already present. */
export function addPeople(into: SourceCall["participants"], people: { name?: unknown; email?: unknown }[]) {
  const seen = new Set(into.map((p) => p.email?.toLowerCase()).filter(Boolean));
  for (const p of people) {
    const email = str(p.email);
    const name = str(p.name) ?? email;
    if (!name) continue;
    if (email) {
      if (seen.has(email.toLowerCase())) continue;
      seen.add(email.toLowerCase());
    }
    into.push({ name, email });
  }
  return into;
}

export const asArray = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

/** HTTP failure with the status only; response bodies never go into messages. */
export class SourceHttpError extends Error {
  status: number;
  constructor(source: string, status: number, detail?: string) {
    super(`${source} request failed: HTTP ${status}${detail ? ` (${detail})` : ""}`);
    this.name = "SourceHttpError";
    this.status = status;
  }
}

/** Thrown by transcript fetches on HTTP 429; the caller should back off and retry later. */
export class RateLimitedError extends SourceHttpError {
  constructor(source: string) { super(source, 429); this.name = "RateLimitedError"; }
}
export const isRateLimited = (e: unknown): e is RateLimitedError => e instanceof RateLimitedError;

/** Parses a JSON body; a non-JSON body becomes a SourceHttpError with the status and "invalid JSON", never its content. */
export async function readJson(source: string, res: { status: number; json: () => Promise<unknown> }): Promise<unknown> {
  try { return await res.json(); } catch { throw new SourceHttpError(source, res.status, "invalid JSON"); }
}

export const defaultFetch = (): FetchLike => fetch as unknown as FetchLike;
