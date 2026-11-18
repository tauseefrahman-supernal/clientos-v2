import "server-only";
import { randomUUID } from "node:crypto";
import { all, check, db } from "@/lib/data/db";
import {
  applyPlan, callChunks, chapterChunks, estimateTokens, planOwner, vaultChunks,
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
  skipped: number;         // new or changed rows not embedded because their owner is not usable
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
  const [accounts, files, chapters, calls, links, stored, unembedded, storedLinks] = await Promise.all([
    all("accounts", "id,name", (q) => q.order("id")),
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
  const projectName = new Map(accounts.map((a) => [a.id as string, a.name as string]));
  for (const c of chapters) want.set(ownerKey("chapter", c.id), chapterChunks({ ...(c as Omit<ChapterRow, "project">), project: projectName.get(c.account_id) ?? "" }));
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

// One index run at a time in this server process. There is no database lock: no advisory-lock RPC exists and
// this task adds no migration, so two server processes could still overlap; the next run removes any duplicates.
const G = globalThis as unknown as { __clientosIndexing?: boolean };

/**
 * Re-chunks every vault file, chapter, call summary and call body; embeds only new or changed text of usable owners,
 * refreshes usable, labels, dates, speakers and project links on the rest, and removes leftovers. Safety writes
 * (removals, usable = false, dropped links) go first, so a failed embedding run never leaves hidden chunks searchable.
 * With dryRun, reads only: counts what would be embedded and estimates tokens as chars / 4.
 */
export async function indexPending(opts: { dryRun?: boolean } = {}): Promise<IndexResult> {
  if (!opts.dryRun && G.__clientosIndexing) throw new Error("An index run is already in progress.");
  if (!opts.dryRun) G.__clientosIndexing = true;
  try {
    const p = await plan(new Date());
    const usable = p.embed.filter((r) => r.usable);
    const byLayer: Record<string, number> = {};
    for (const r of usable) byLayer[r.layer] = (byLayer[r.layer] ?? 0) + 1;
    const summary = { byLayer, kept: p.kept, removed: p.remove.length, patched: p.patch.length, linked: p.link.length, unlinked: p.unlink.length };
    if (opts.dryRun) return { chunks: usable.length, skipped: p.embed.length - usable.length, tokens: estimateTokens(usable.map((r) => r.body)), dryRun: true, ...summary };

    const run = embedder();
    const out = await applyPlan(p, {
      embed: (texts) => run(texts, "document"),
      insert: async (items) => {
        check(await db().from("chunks").insert(items.map((x) => toRow(x.row, x.id, x.vector))), "insert chunks");
        const linkRows = items.flatMap((x) => x.row.accounts.map((a) => ({ chunk_id: x.id, account_id: a })));
        if (linkRows.length) check(await db().from("chunk_accounts").insert(linkRows), "link chunks");
      },
      remove: async (ids) => { check(await db().from("chunks").delete().in("id", ids), "remove chunks"); },
      patch: async (x) => { check(await db().from("chunks").update(x.fields).eq("id", x.id), "update chunk"); },
      link: async (rows) => { check(await db().from("chunk_accounts").upsert(rows, { onConflict: "chunk_id,account_id", ignoreDuplicates: true }), "link chunks"); },
      unlink: async (rows) => { for (const u of rows) check(await db().from("chunk_accounts").delete().eq("chunk_id", u.chunk_id).eq("account_id", u.account_id), "unlink chunk"); },
      newId: randomUUID,
    });
    return { chunks: out.embedded, skipped: out.skipped, tokens: out.tokens, dryRun: false, ...summary };
  } finally {
    if (!opts.dryRun) G.__clientosIndexing = false;
  }
}
