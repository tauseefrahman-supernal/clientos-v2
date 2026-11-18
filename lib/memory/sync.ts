import "server-only";
import { all, check, db } from "@/lib/data/db";
import { screenCall, type Cut } from "./screen.ts";
import { fetchTranscript, listFathom, listGranola } from "./sources/index.ts";
import { askMentionModel, runSyncWith, type Row, type Snapshot, type SyncOptions, type SyncResult, type SyncStore } from "./sync-core.ts";

// Pulls calls from Granola and Fathom into clientos.transcripts: lists what changed, merges duplicates, matches
// projects, screens each new transcript, stores the cut body, links projects and marks calls gone. The decisions
// live in sync-core.ts; this file is the database and the real sources.

const BATCH = 100;
const chunked = <T,>(xs: T[], n = BATCH) => Array.from({ length: Math.ceil(xs.length / n) }, (_, i) => xs.slice(i * n, i * n + n));

export const dbSyncStore: SyncStore = {
  async load(): Promise<Snapshot> {
    const [rows, withBody, emptySummary, overrides, rules, accounts, state] = await Promise.all([
      all("transcripts", "id,provider,external_id,gone_at,status,alt_url,met_at,title,url,pulled_at", (q) => q.order("id")),
      all("transcripts", "id", (q) => q.not("body", "is", null).order("id")),
      all("transcripts", "id", (q) => q.eq("summary", "").order("id")),
      all("transcript_overrides", "transcript_id,account_id,action,at", (q) => q.order("at").order("id")),
      all("match_rules", "account_id,kind,value", (q) => q.order("account_id").order("kind").order("value")),
      all("accounts", "id,slug,name", (q) => q.order("id")),
      all("sync_state", "provider,cursor,last_run_at"),
    ]);
    const bodies = new Set(withBody.map((r) => r.id as string));
    const empty = new Set(emptySummary.map((r) => r.id as string));
    return {
      rows: rows.map((r) => ({
        id: r.id, provider: r.provider, externalId: r.external_id, goneAt: r.gone_at ?? null, status: r.status,
        altUrl: r.alt_url ?? null, hasBody: bodies.has(r.id), summaryEmpty: empty.has(r.id), metAt: r.met_at ?? null,
        title: r.title ?? "", url: r.url ?? null, pulledAt: r.pulled_at ?? null,
      })),
      overrides: overrides.map((o) => ({ transcriptId: o.transcript_id, accountId: o.account_id ?? null, action: o.action })),
      rules: rules.map((r) => ({ accountId: r.account_id, kind: r.kind, value: r.value })),
      accounts: accounts.map((a) => ({ id: a.id, slug: a.slug, name: a.name })),
      state: new Map(state.map((s) => [s.provider as string, { cursor: s.cursor ?? null, lastRunAt: s.last_run_at ?? null }])),
    };
  },

  async saveState(provider, patch) {
    check(await db().from("sync_state").upsert({ provider, ...patch }, { onConflict: "provider" }), "save sync state");
  },

  async dropBodies(ids) {
    for (const part of chunked(ids)) {
      check(await db().from("chunks").delete().in("transcript_id", part), "remove personnel chunks");
      check(await db().from("transcripts").update({ body: null, cuts: [], status: "personnel", summary: "", speakers: [] }).in("id", part), "drop personnel bodies");
      check(await db().from("transcript_accounts").update({ headline: "" }).in("transcript_id", part), "blank personnel headlines");
    }
  },

  async unlink(pairs) {
    for (const p of pairs)
      check(await db().from("transcript_accounts").delete().eq("transcript_id", p.transcriptId).eq("account_id", p.accountId), "unlink call");
  },

  async writeCalls(rows) {
    // A bulk upsert sends the union of the rows' columns, nulling any a row lacks; so batch rows by their column set.
    const groups = new Map<string, Row[]>();
    for (const r of rows) {
      const sig = Object.keys(r).sort().join(",");
      if (!groups.has(sig)) groups.set(sig, []);
      groups.get(sig)!.push(r);
    }
    const out: { id: string; provider: string; externalId: string }[] = [];
    for (const group of groups.values())
      for (const part of chunked(group)) {
        const got = check(await db().from("transcripts").upsert(part, { onConflict: "provider,external_id" }).select("id,provider,external_id"), "write calls") as Row[];
        for (const r of got) out.push({ id: r.id as string, provider: r.provider as string, externalId: r.external_id as string });
      }
    return out;
  },

  async clearPersonnel(ids) {
    for (const part of chunked(ids)) {
      check(await db().from("chunks").delete().in("transcript_id", part), "remove personnel chunks");
      check(await db().from("transcript_accounts").update({ headline: "" }).in("transcript_id", part), "blank personnel headlines");
    }
  },

  async rekey(id, provider, externalId, altUrl) {
    check(await db().from("transcripts").update({ provider, external_id: externalId, ...(altUrl ? { alt_url: altUrl } : {}) }).eq("id", id), "re-identify call");
  },

  async fold(fromId, toId) {
    // Links: the kept row's existing links win, but an empty headline takes the duplicate's; overrides and vault
    // suggestions move across; the kept row's empty url / alt_url are filled; then the duplicate goes (its chunks cascade).
    const [links, kept, pair] = await Promise.all([
      db().from("transcript_accounts").select("account_id,headline,source").eq("transcript_id", fromId),
      db().from("transcript_accounts").select("account_id,headline").eq("transcript_id", toId),
      db().from("transcripts").select("id,url,alt_url").in("id", [fromId, toId]),
    ]);
    const fromLinks = check(links, "read duplicate links") as Row[];
    const keptLinks = new Map((check(kept, "read kept links") as Row[]).map((l) => [l.account_id as string, (l.headline as string) ?? ""]));
    const fresh = fromLinks.filter((l) => !keptLinks.has(l.account_id as string));
    if (fresh.length)
      check(await db().from("transcript_accounts").upsert(fresh.map((l) => ({ transcript_id: toId, account_id: l.account_id, headline: l.headline, source: l.source })), { onConflict: "transcript_id,account_id", ignoreDuplicates: true }), "move duplicate links");
    for (const l of fromLinks)
      if (keptLinks.has(l.account_id as string) && !keptLinks.get(l.account_id as string) && l.headline)
        check(await db().from("transcript_accounts").update({ headline: l.headline }).eq("transcript_id", toId).eq("account_id", l.account_id).eq("headline", ""), "carry duplicate headline");
    check(await db().from("transcript_overrides").update({ transcript_id: toId }).eq("transcript_id", fromId), "move duplicate overrides");
    check(await db().from("vault_suggestions").update({ transcript_id: toId }).eq("transcript_id", fromId), "move duplicate suggestions");
    const rows = check(pair, "read duplicate pair") as Row[];
    const from = rows.find((r) => r.id === fromId), to = rows.find((r) => r.id === toId);
    const fill: Row = {};
    if (to && from && !to.url && from.url) fill.url = from.url;
    if (to && from && !to.alt_url && from.alt_url) fill.alt_url = from.alt_url;
    // Links are filled on the kept row before the duplicate goes, so nothing is lost if the delete fails.
    if (Object.keys(fill).length) check(await db().from("transcripts").update(fill).eq("id", toId), "fill kept call links");
    check(await db().from("transcripts").delete().eq("id", fromId), "delete duplicate call");
  },


  async link(rows) {
    const toRow = (l: { transcriptId: string; accountId: string; source: string }) => ({ transcript_id: l.transcriptId, account_id: l.accountId, source: l.source });
    const auto = rows.filter((l) => l.source === "auto").map(toRow);
    const manual = rows.filter((l) => l.source === "manual").map(toRow);
    for (const part of chunked(auto))
      check(await db().from("transcript_accounts").upsert(part, { onConflict: "transcript_id,account_id", ignoreDuplicates: true }), "link calls");
    for (const part of chunked(manual))
      check(await db().from("transcript_accounts").upsert(part, { onConflict: "transcript_id,account_id" }), "link calls by hand");
  },

  async setKind(ids, kind) {
    for (const part of chunked(ids)) check(await db().from("transcripts").update({ kind }).in("id", part), "set call kind");
  },

  async readScreened(ids) {
    const out = new Map<string, { body: string | null; cuts: Cut[] }>();
    for (const part of chunked(ids)) {
      const rows = check(await db().from("transcripts").select("id,body,cuts").in("id", part), "read stored screens") as Row[];
      for (const r of rows) out.set(r.id as string, { body: (r.body as string) ?? null, cuts: Array.isArray(r.cuts) ? (r.cuts as Cut[]) : [] });
    }
    return out;
  },

  async setGone(ids, at) {
    for (const part of chunked(ids)) check(await db().from("transcripts").update({ gone_at: at }).in("id", part), "mark gone");
  },
};

let running = false;
let lastPreviewAt: number | null = null;

/**
 * One sync run against the real sources and database. Stops starting new work after ~270 s and says when more
 * remains. `since` and `onlySlugs` make an ad-hoc run that leaves sync_state alone and never marks calls gone.
 * `repairOnly` folds stored duplicates and does nothing else. `rescreen` (with onlySlugs) screens stored calls again.
 * `preview` lists everything and reports what a full run would do without writing; a full (gone-marking) run is
 * refused unless a complete preview ran in this process within the hour, or `confirmFull` is passed.
 */
export async function runSync(opts: SyncOptions = {}): Promise<SyncResult> {
  if (running) throw new Error("A memory sync is already in progress.");
  running = true;
  try {
    return await runSyncWith(opts, {
      store: dbSyncStore,
      list: (provider, since, cursor) => (provider === "granola" ? listGranola(since, cursor) : listFathom(since, cursor)),
      fetchTranscript: (provider, id) => fetchTranscript(provider, id),
      screen: screenCall,
      askMention: askMentionModel,
      now: () => Date.now(),
      previews: { last: () => lastPreviewAt, mark: (at) => { lastPreviewAt = at; } },
    });
  } finally {
    running = false;
  }
}
