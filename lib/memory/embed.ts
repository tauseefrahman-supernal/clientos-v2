import "server-only";
import { randomUUID } from "node:crypto";
import { all, check, db } from "@/lib/data/db";
import {
  batches, callChunks, chapterChunks, estimateTokens, planOwner, vaultChunks,
  type CallRow, type ChapterRow, type ChunkRow, type ExistingChunk, type OwnerPlan, type VaultFileRow,
} from "./index-rules.ts";
import { voyageEmbedder, type EmbedKind } from "./voyage.ts";

// Embeds Stella's memory with Voyage and keeps clientos.chunks in line with its owners: vault files,
// book chapters, call summaries and call bodies. Change detection is by text: every run re-chunks each
// owner and compares with the stored chunks (layer + seq + body); only new or changed text is embedded.

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;

const LAYERS = ["vault", "chapter", "summary", "transcript"];
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const embedder = () => voyageEmbedder({ key: process.env.VOYAGE_API_KEY, fetch: fetch as never, sleep });

/** Voyage embeddings (voyage-3.5, 1024 dimensions), in batches of 128, in input order. */
export async function embed(texts: string[], kind: EmbedKind): Promise<number[][]> {
  return (await embedder()(texts, kind)).vectors;
}

export interface IndexResult {
  chunks: number;          // chunks embedded (or, in a dry run, that would be)
  tokens: number;          // Voyage's count, or chars / 4 in a dry run
  dryRun: boolean;
  byLayer: Record<string, number>;
  kept: number;            // stored chunks whose text was unchanged
  removed: number;
  patched: number;         // unchanged text, other columns (usable, label, date, speakers) refreshed
  linked: number;
  unlinked: number;
}

const ownerKey = (type: string, id: string) => `${type}:${id}`;

/** Every owner's wanted chunks and stored chunks, planned. Reads only. */
async function plan(now: Date) {
  const [files, chapters, calls, links, stored, unembedded, storedLinks] = await Promise.all([
    all("vault_files", "id,account_id,path,content,state,shown", (q) => q.order("id")),
    all("book_chapters", "id,account_id,sort,title,body,sources", (q) => q.order("id")),
    // Calls that can yield chunks: a body, or a digested summary. Personnel rows never carry a body.
    all("transcripts", "id,title,met_at,status,summary,body,gone_at,speakers", (q) => q.neq("status", "personnel").or("body.not.is.null,status.eq.digested").order("id")),
    all("transcript_accounts", "transcript_id,account_id", (q) => q.order("transcript_id").order("account_id")),
    all("chunks", "id,layer,seq,label,body,met_at,speakers,usable,account_id,transcript_id,vault_file_id,chapter_id", (q) => q.in("layer", LAYERS).not("embedding", "is", null).order("id")),
    all("chunks", "id", (q) => q.in("layer", LAYERS).is("embedding", null).order("id")),
    all("chunk_accounts", "chunk_id,account_id", (q) => q.order("chunk_id").order("account_id")),
  ]);

  const accountsOf = new Map<string, string[]>();
  for (const l of links) accountsOf.set(l.transcript_id, [...(accountsOf.get(l.transcript_id) ?? []), l.account_id]);

  const want = new Map<string, ChunkRow[]>();
  for (const f of files as VaultFileRow[]) want.set(ownerKey("file", f.id), vaultChunks(f, now));
  for (const c of chapters as ChapterRow[]) want.set(ownerKey("chapter", c.id), chapterChunks(c));
  for (const t of calls) {
    const accounts = accountsOf.get(t.id) ?? [];
    // A call linked to no project is not searchable by anyone but admins; it is indexed once it is linked.
    want.set(ownerKey("transcript", t.id), accounts.length ? callChunks({ ...(t as Omit<CallRow, "accounts">), accounts }, now) : []);
  }

  const linksOf = new Map<string, string[]>();
  for (const l of storedLinks) linksOf.set(l.chunk_id, [...(linksOf.get(l.chunk_id) ?? []), l.account_id]);
  const have = new Map<string, ExistingChunk[]>();
  for (const c of stored as Row[]) {
    const key = c.transcript_id ? ownerKey("transcript", c.transcript_id) : c.vault_file_id ? ownerKey("file", c.vault_file_id) : c.chapter_id ? ownerKey("chapter", c.chapter_id) : null;
    if (!key) { unembedded.push({ id: c.id }); continue; } // no owner: remove
    have.set(key, [...(have.get(key) ?? []), {
      id: c.id, layer: c.layer, seq: c.seq, label: c.label, body: c.body, metAt: c.met_at, speakers: c.speakers ?? [],
      usable: c.usable, accountId: c.account_id, accounts: linksOf.get(c.id) ?? [],
    }]);
  }

  const total: OwnerPlan = { embed: [], remove: unembedded.map((r) => r.id as string), patch: [], link: [], unlink: [] };
  let kept = 0;
  for (const key of new Set([...want.keys(), ...have.keys()])) {
    const w = want.get(key) ?? [], h = have.get(key) ?? [];
    const p = planOwner(w, h);
    total.embed.push(...p.embed); total.remove.push(...p.remove); total.patch.push(...p.patch); total.link.push(...p.link); total.unlink.push(...p.unlink);
    kept += w.length - p.embed.length;
  }
  return { ...total, kept };
}

const toRow = (r: ChunkRow, id: string, vector: number[]) => ({
  id, layer: r.layer, owner_type: r.ownerType, owner_id: r.ownerId, account_id: r.accountId, seq: r.seq, label: r.label, body: r.body,
  met_at: r.metAt, speakers: r.speakers, usable: r.usable, embedding: JSON.stringify(vector),
  transcript_id: r.ownerType === "transcript" ? r.ownerId : null,
  vault_file_id: r.ownerType === "file" ? r.ownerId : null,
  chapter_id: r.ownerType === "chapter" ? r.ownerId : null,
});

/**
 * Re-chunks every vault file, chapter, call summary and call body; embeds only new or changed text,
 * refreshes usable, labels, dates, speakers and project links on the rest, and removes leftovers.
 * With dryRun, reads only: counts what would be embedded and estimates tokens as chars / 4.
 */
export async function indexPending(opts: { dryRun?: boolean } = {}): Promise<IndexResult> {
  const p = await plan(new Date());
  const byLayer: Record<string, number> = {};
  for (const r of p.embed) byLayer[r.layer] = (byLayer[r.layer] ?? 0) + 1;
  const summary = { byLayer, kept: p.kept, removed: p.remove.length, patched: p.patch.length, linked: p.link.length, unlinked: p.unlink.length };
  if (opts.dryRun) return { chunks: p.embed.length, tokens: estimateTokens(p.embed.map((r) => r.body)), dryRun: true, ...summary };

  const run = embedder();
  let tokens = 0, embedded = 0;
  // Insert new chunks batch by batch, so a failure part-way keeps what was embedded; old versions are removed after.
  for (const batch of batches(p.embed)) {
    const out = await run(batch.map((r) => r.body), "document");
    tokens += out.tokens;
    const rows = batch.map((r, i) => toRow(r, randomUUID(), out.vectors[i]));
    check(await db().from("chunks").insert(rows), "insert chunks");
    const linkRows = rows.flatMap((row, i) => batch[i].accounts.map((a) => ({ chunk_id: row.id, account_id: a })));
    for (const lb of batches(linkRows, 500)) check(await db().from("chunk_accounts").insert(lb), "link chunks");
    embedded += batch.length;
  }
  for (const u of p.patch) check(await db().from("chunks").update(u.fields).eq("id", u.id), "update chunk");
  for (const lb of batches(p.link, 500)) check(await db().from("chunk_accounts").upsert(lb, { onConflict: "chunk_id,account_id", ignoreDuplicates: true }), "link chunks");
  for (const u of p.unlink) check(await db().from("chunk_accounts").delete().eq("chunk_id", u.chunk_id).eq("account_id", u.account_id), "unlink chunk");
  for (const ids of batches(p.remove, 200)) check(await db().from("chunks").delete().in("id", ids), "remove chunks");
  return { chunks: embedded, tokens, dryRun: false, ...summary };
}
