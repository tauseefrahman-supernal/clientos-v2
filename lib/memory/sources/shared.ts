// Helpers shared by the Fathom and Granola source clients. Pure, no "server-only", no env reads.
import type { SourceCall, Turn } from "../types.ts";

/** The slice of fetch the source clients use, so tests can pass a fake. */
export type FetchLike = (url: string, init: { headers: Record<string, string> }) =>
  Promise<{ ok: boolean; status: number; json: () => Promise<unknown>; headers?: { get(name: string): string | null } }>;

/**
 * Fetch and key for a source client; both default to the real ones when left out. `sleep` and `now` default to a
 * real timer and Date.now (tests inject them). `deadline` (epoch ms): a listing never starts a rate-limit wait that
 * would end after it, and returns rateLimited instead.
 */
export interface SourceDeps {
  fetch?: FetchLike;
  key?: string | undefined;
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
  deadline?: number;
}

/** Rate-limit waits while listing: default when Retry-After is absent, cap per wait, and waits per listing call. */
export const RETRY_DEFAULT_MS = 30_000;
export const RETRY_CAP_MS = 65_000;
export const MAX_RATE_WAITS = 6;

/** Retry-After (seconds or an HTTP date) in ms, clamped to [0, RETRY_CAP_MS]; RETRY_DEFAULT_MS when absent or unreadable. */
export function retryAfterMs(header: string | null | undefined, now: number): number {
  const h = header?.trim();
  let ms = RETRY_DEFAULT_MS;
  if (h) {
    if (/^\d+(\.\d+)?$/.test(h)) ms = Number(h) * 1000;
    else { const t = Date.parse(h); if (!Number.isNaN(t)) ms = t - now; }
  }
  return Math.min(RETRY_CAP_MS, Math.max(0, ms));
}

/**
 * Returns a function to call on each listing 429: it waits per Retry-After and resolves true (retry the same page),
 * or resolves false without waiting when the waits are used up or the wait would end after the deadline.
 */
export function rateLimitWaiter(d?: SourceDeps) {
  const sleep = d?.sleep ?? ((ms: number) => new Promise<void>((r) => setTimeout(r, ms)));
  const now = d?.now ?? Date.now;
  let waits = 0;
  return async (res: { headers?: { get(name: string): string | null } }): Promise<boolean> => {
    if (waits >= MAX_RATE_WAITS) return false;
    const t = now();
    const ms = retryAfterMs(res.headers?.get("retry-after"), t);
    if (d?.deadline !== undefined && t + ms > d.deadline) return false;
    waits++;
    await sleep(ms);
    return true;
  };
}

/**
 * One listing run. `cursor` non-null means there is more to fetch (rate limit or page cap); `skipped` counts
 * items that could not be normalized (no id, no usable date, malformed).
 */
export interface ListResult { calls: SourceCall[]; cursor: string | null; rateLimited: boolean; skipped: number }

/** One transcript fetch: ready with turns, not ready yet (empty or still processing), or gone (404). */
export type TranscriptResult =
  | { status: "ready"; turns: Turn[]; url?: string; webId?: string }
  | { status: "not_ready" }
  | { status: "gone" };

/** The first UUID in a string (Granola web links carry the note's web UUID), else undefined. */
export function uuidIn(v: unknown): string | undefined {
  const m = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.exec(typeof v === "string" ? v : "");
  return m ? m[0].toLowerCase() : undefined;
}

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
