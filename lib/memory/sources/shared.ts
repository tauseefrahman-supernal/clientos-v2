// Helpers shared by the Fathom and Granola source clients. Pure, no "server-only", no env reads.
import type { SourceCall } from "../types.ts";

/** The slice of fetch the source clients use, so tests can pass a fake. */
export type FetchLike = (url: string, init: { headers: Record<string, string> }) =>
  Promise<{ ok: boolean; status: number; json: () => Promise<unknown> }>;

/** Fetch and key for a source client; both default to the real ones when left out. */
export interface SourceDeps { fetch?: FetchLike; key?: string | undefined }

export interface ListResult { calls: SourceCall[]; cursor: string | null; rateLimited: boolean }

/** Safety cap on pages per list call; hitting it returns the cursor so the caller can carry on. */
export const MAX_PAGES = 200;

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
  constructor(source: string, status: number) {
    super(`${source} request failed: HTTP ${status}`);
    this.status = status;
  }
}

export const defaultFetch = (): FetchLike => fetch as unknown as FetchLike;
