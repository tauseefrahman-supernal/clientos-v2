import "server-only";
import { db, check } from "@/lib/data/db";
import { embed } from "./embed.ts";
import { keepHit } from "@/lib/stella/tool-rules";
import type { Layer, SearchHit } from "./types.ts";

// Stella's retrieval: one hybrid query (pgvector + full text, fused, recency-weighted) over clientos.search_chunks.
// Deny by default: only chunks linked to the given projects are searched. The caller passes slugs the person may
// see (already filtered by canSee); allProjects is honoured only for an admin whose scope is every project.

/* eslint-disable @typescript-eslint/no-explicit-any */

export type { Layer, SearchHit };

export interface SearchOpts {
  slugs: string[];
  query: string;
  layers: Layer[];
  since?: string;
  until?: string;
  speakers?: string[];
  k?: number;
  /** Admins with every project in scope: search all projects without listing them. */
  allProjects?: boolean;
}

/** A call a hit came from, for titles, dates and links. */
export interface CallInfo { id: string; title: string; met_at: string | null; url: string | null; alt_url: string | null; status: string; gone_at: string | null }

const G = globalThis as unknown as { __clientosEmbedWarned?: boolean; __clientosAccountIds?: { at: number; bySlug: Map<string, string>; byId: Map<string, string> } };

/** slug <-> accounts.id, refreshed every minute. */
export async function accountMaps(): Promise<{ bySlug: Map<string, string>; byId: Map<string, string> }> {
  const c = G.__clientosAccountIds;
  if (c && Date.now() - c.at < 60_000) return c;
  const rows = check(await db().from("accounts").select("id,slug"), "read accounts") as { id: string; slug: string }[];
  const next = { at: Date.now(), bySlug: new Map(rows.map((r) => [r.slug, r.id])), byId: new Map(rows.map((r) => [r.id, r.slug])) };
  G.__clientosAccountIds = next;
  return next;
}

/** The query's embedding, or null (full-text only) when Voyage is unavailable; logged once per server process. */
async function queryVector(query: string): Promise<number[] | null> {
  try {
    return (await embed([query], "query"))[0] ?? null;
  } catch (e) {
    if (!G.__clientosEmbedWarned) {
      G.__clientosEmbedWarned = true;
      console.warn(`[search] embedding failed, searching full text only: ${e instanceof Error ? e.message : String(e)}`);
    }
    return null;
  }
}

/** The calls behind some hits, by id. */
export async function callsById(ids: string[]): Promise<Map<string, CallInfo>> {
  if (!ids.length) return new Map();
  const rows = check(await db().from("transcripts").select("id,title,met_at,url,alt_url,status,gone_at").in("id", [...new Set(ids)]), "read calls") as CallInfo[];
  return new Map(rows.map((r) => [r.id, r]));
}

/**
 * Hybrid search over the given projects. Empty slugs (and no allProjects) returns []. Hits from a personnel call,
 * or a call gone from its source for more than 14 days, are dropped here too, even before the next index run
 * marks their chunks unusable. Each hit's excerpt is the chunk body (header line included; format with splitHeader).
 */
export async function searchChunks(opts: SearchOpts): Promise<SearchHit[]> {
  const query = opts.query.trim();
  if (!query || (!opts.slugs.length && !opts.allProjects)) return [];
  const maps = await accountMaps();
  const ids = opts.slugs.map((s) => maps.bySlug.get(s)).filter((x): x is string => !!x);
  if (!ids.length && !opts.allProjects) return [];
  const k = Math.min(30, Math.max(1, opts.k ?? 6));
  const vector = await queryVector(query);
  const rows = check(await db().rpc("search_chunks", {
    q_embedding: vector ? JSON.stringify(vector) : null,
    q_text: query,
    account_ids: opts.allProjects ? null : ids,
    layers: opts.layers.length ? opts.layers : null,
    since: opts.since ?? null,
    until: opts.until ?? null,
    speakers: opts.speakers?.length ? opts.speakers : null,
    k: k + 4, // room for hits dropped below
    all_projects: !!opts.allProjects,
  }), "search chunks") as any[];

  const calls = await callsById(rows.map((r) => r.transcript_id).filter(Boolean));
  const now = new Date();
  const allowed = new Set(ids);
  const out: SearchHit[] = [];
  for (const r of rows) {
    if (r.transcript_id && !keepHit(calls.get(r.transcript_id), now)) continue;
    if (!opts.allProjects && !allowed.has(r.account_id)) continue; // belt and braces: the SQL already filters
    const slug = maps.byId.get(r.account_id);
    if (!slug) continue;
    out.push({
      chunkId: r.chunk_id, transcriptId: r.transcript_id ?? null, slug, layer: r.layer, label: r.label,
      excerpt: r.body ?? "", metAt: r.met_at ?? null, speakers: r.speakers ?? [], score: Number(r.score) || 0,
    });
    if (out.length >= k) break;
  }
  return out;
}
