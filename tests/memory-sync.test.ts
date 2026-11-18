import { test } from "node:test";
import assert from "node:assert/strict";
import {
  absorbAltUrls, decodeCursor, encodeCursor, goneIsFinal, listingStart, rowForCall, runSyncWith, speakersOf,
  type Snapshot, type StoredRow, type SyncDeps, type SyncStore,
} from "../lib/memory/sync-core.ts";
import type { PlannedCall } from "../lib/memory/plan-sync.ts";
import type { ScreenResult } from "../lib/memory/screen.ts";
import type { ListResult, TranscriptResult } from "../lib/memory/sources/shared.ts";
import type { SourceCall, Turn } from "../lib/memory/types.ts";
import { turnsToBody } from "../lib/memory/index-rules.ts";
import { applyCuts } from "../lib/memory/screen.ts";
import { fathomCallId } from "../lib/memory/sources/index.ts";

const NOW = "2026-11-18T12:00:00.000Z";
const NOW_MS = Date.parse(NOW);
const DAY = 24 * 60 * 60 * 1000;
const TURNS: Turn[] = [
  { speaker: "Ann", start: 0, text: "Hello there" },
  { speaker: "Bob", start: 5, text: "Salary talk" },
  { speaker: "Ann", start: 9, text: "Back to the roadmap" },
];

// ---------------------------------------------------------------- pure helpers

test("fathomCallId reads the call id from a Fathom call link only", () => {
  assert.equal(fathomCallId("https://fathom.video/calls/905219245"), "905219245");
  assert.equal(fathomCallId("https://fathom.video/calls/12?tab=x"), "12");
  assert.equal(fathomCallId("https://fathom.video/share/abc"), null);
  assert.equal(fathomCallId("https://example.com/calls/12"), null);
  assert.equal(fathomCallId(null), null);
});

test("cursor encoding round-trips cursor and since; anything else restarts", () => {
  const text = encodeCursor("c2", "2026-11-01T00:00:00.000Z");
  assert.deepEqual(decodeCursor(text), { cursor: "c2", since: "2026-11-01T00:00:00.000Z" });
  assert.deepEqual(decodeCursor(encodeCursor("c3", null)), { cursor: "c3", since: null });
  assert.equal(decodeCursor(null), null);
  assert.equal(decodeCursor("not json"), null);
  assert.equal(decodeCursor(JSON.stringify({ since: "x" })), null);
});

test("listingStart: resume a saved cursor with its since, else last run minus 3 days, else everything", () => {
  assert.deepEqual(listingStart(undefined, NOW_MS), { since: null, cursor: null, resumed: false });
  assert.deepEqual(listingStart({ cursor: null, lastRunAt: "2026-11-10T00:00:00.000Z" }, NOW_MS),
    { since: "2026-11-07T00:00:00.000Z", cursor: null, resumed: false });
  assert.deepEqual(listingStart({ cursor: encodeCursor("c9", "2026-11-05T00:00:00.000Z"), lastRunAt: "2026-11-10T00:00:00.000Z" }, NOW_MS),
    { since: "2026-11-05T00:00:00.000Z", cursor: "c9", resumed: true });
});

test("goneIsFinal: only for calls more than 2 days old", () => {
  assert.equal(goneIsFinal(new Date(NOW_MS - 3 * DAY).toISOString(), NOW_MS), true);
  assert.equal(goneIsFinal(new Date(NOW_MS - 1 * DAY).toISOString(), NOW_MS), false);
  assert.equal(goneIsFinal("not a date", NOW_MS), false);
});

test("speakersOf lists each named speaker once, in order", () => {
  assert.deepEqual(speakersOf([...TURNS, { speaker: "", start: 1, text: "[cut]" }]), ["Ann", "Bob"]);
});

function planned(over: Partial<PlannedCall> = {}): PlannedCall {
  return {
    externalKey: "granola:g1", provider: "granola", externalId: "g1", title: "Weekly", metAt: "2026-11-17T10:00:00.000Z",
    participants: [{ name: "Ann", email: "ann@x.com" }], url: "https://notes.granola.ai/d/g1", altUrl: null,
    sourceSummary: "Source summary", turns: TURNS, status: "pending", dropBody: false, isNew: true, ...over,
  };
}

test("rowForCall: clean stores the body, cuts, speakers and fills an empty summary", () => {
  const row = rowForCall(planned(), { kind: "screened", result: { verdict: "clean", cuts: [] }, turns: TURNS }, { summaryEmpty: true, now: NOW });
  assert.equal(row.body, turnsToBody(TURNS));
  assert.deepEqual(row.cuts, []);
  assert.deepEqual(row.speakers, ["Ann", "Bob"]);
  assert.equal(row.summary, "Source summary");
  assert.equal(row.status, "pending");
  assert.equal(row.pulled_at, NOW);
  assert.equal(row.synced_at, NOW);
  const kept = rowForCall(planned(), { kind: "screened", result: { verdict: "clean", cuts: [] }, turns: TURNS }, { summaryEmpty: false, now: NOW });
  assert.equal("summary" in kept, false);
});

test("rowForCall: cut stores the cut body and never the source summary", () => {
  const cuts = [{ from: 1, to: 1, reason: "personnel" as const }];
  const row = rowForCall(planned(), { kind: "screened", result: { verdict: "cut", cuts }, turns: TURNS }, { summaryEmpty: true, now: NOW });
  assert.equal(row.body, turnsToBody(applyCuts(TURNS, cuts)));
  assert.doesNotMatch(String(row.body), /Salary/);
  assert.deepEqual(row.cuts, cuts);
  assert.equal("summary" in row, false);
});

test("rowForCall: personnel is a title-only row; error and metadata leave body alone", () => {
  const p = rowForCall(planned(), { kind: "screened", result: { verdict: "personnel", cuts: [] }, turns: TURNS }, { summaryEmpty: true, now: NOW });
  assert.equal(p.status, "personnel");
  assert.equal(p.body, null);
  assert.equal(p.summary, "");
  assert.deepEqual(p.cuts, []);
  const e = rowForCall(planned(), { kind: "screened", result: { verdict: "error" }, turns: TURNS }, { summaryEmpty: true, now: NOW });
  assert.equal("body" in e, false);
  assert.equal("summary" in e, false);
  assert.equal(e.status, "pending");
  const m = rowForCall(planned({ isNew: false, status: "keep", altUrl: null, url: "" }), { kind: "meta" }, { summaryEmpty: true, now: NOW });
  assert.equal("status" in m, false);
  assert.equal("alt_url" in m, false);
  assert.equal("url" in m, false);
  assert.equal(m.title, "Weekly");
  const g = rowForCall(planned({ isNew: false }), { kind: "final-gone" }, { summaryEmpty: true, now: NOW });
  assert.equal(g.status, "failed");
  assert.equal("body" in g, false);
});

const stored = (over: Partial<StoredRow> = {}): StoredRow => ({
  id: "t-old", provider: "granola", externalId: "old", goneAt: null, status: "pending", altUrl: null,
  hasBody: false, summaryEmpty: false, metAt: "2026-10-01T00:00:00.000Z", ...over,
});

test("absorbAltUrls: a Fathom call already stored as a Granola row's alt link becomes that row", () => {
  const fathom: SourceCall & { altUrl: string | null } = {
    provider: "fathom", externalId: "777", fetchId: "rec-777", title: "Call", metAt: NOW, participants: [],
    url: "https://fathom.video/calls/777", sourceSummary: "s", turns: TURNS, altUrl: null,
  };
  const rows = [stored({ id: "t-g", externalId: "g-uuid", altUrl: "https://fathom.video/calls/777" })];
  const [out] = absorbAltUrls([fathom], rows);
  assert.equal(out.provider, "granola");
  assert.equal(out.externalId, "g-uuid");
  assert.equal(out.altUrl, "https://fathom.video/calls/777");
  assert.deepEqual(out.fetchFrom, { provider: "fathom", id: "rec-777" });
  // A Fathom call that has its own row stays itself.
  const own = absorbAltUrls([fathom], [...rows, stored({ id: "t-f", provider: "fathom", externalId: "777" })]);
  assert.equal(own[0].provider, "fathom");
  // When the Granola call is listed too, the Fathom copy is dropped (its turns kept as a fallback).
  const granola = { ...fathom, provider: "granola" as const, externalId: "g-uuid", fetchId: undefined, url: "https://notes.granola.ai/d/g-uuid", turns: null, title: "Other title", metAt: "2026-11-01T00:00:00.000Z" };
  const both = absorbAltUrls([granola, fathom], rows);
  assert.equal(both.length, 1);
  assert.equal(both[0].externalId, "g-uuid");
  assert.equal(both[0].altUrl, "https://fathom.video/calls/777");
  assert.deepEqual(both[0].turns, TURNS);
});

// ---------------------------------------------------------------- end to end against fakes

class FakeStore implements SyncStore {
  rows: (Record<string, unknown> & { id: string })[] = [];
  links: { transcriptId: string; accountId: string; source: string }[] = [];
  state = new Map<string, { cursor: string | null; last_run_at: string | null; last_error: string | null }>();
  goneCalls: { ids: string[]; at: string | null }[] = [];
  chunkDeletes: string[] = [];
  kinds: { ids: string[]; kind: string }[] = [];
  overrides: Snapshot["overrides"] = [];
  rules: Snapshot["rules"] = [{ accountId: "a-we", kind: "keyword", value: "emblem" }, { accountId: "a-br", kind: "keyword", value: "breakr" }];
  accounts = [{ id: "a-we", slug: "world-emblem", name: "World Emblem" }, { id: "a-br", slug: "breakr", name: "Breakr" }];
  private n = 0;

  seed(row: Record<string, unknown>) { this.rows.push({ id: `t${++this.n}`, status: "pending", body: null, summary: "", gone_at: null, alt_url: null, ...row }); }
  row(provider: string, externalId: string) { return this.rows.find((r) => r.provider === provider && r.external_id === externalId); }

  async load(): Promise<Snapshot> {
    return {
      rows: this.rows.map((r) => ({
        id: r.id, provider: r.provider as string, externalId: r.external_id as string, goneAt: (r.gone_at as string) ?? null,
        status: r.status as string, altUrl: (r.alt_url as string) ?? null, hasBody: r.body != null, summaryEmpty: !r.summary,
        metAt: (r.met_at as string) ?? null,
      })),
      overrides: this.overrides, rules: this.rules, accounts: this.accounts,
      state: new Map([...this.state].map(([p, s]) => [p, { cursor: s.cursor, lastRunAt: s.last_run_at }])),
    };
  }
  async saveState(provider: string, patch: Record<string, unknown>) {
    const cur = this.state.get(provider) ?? { cursor: null, last_run_at: null, last_error: null };
    this.state.set(provider, { ...cur, ...patch });
  }
  async dropBodies(ids: string[]) {
    for (const r of this.rows) if (ids.includes(r.id)) Object.assign(r, { body: null, cuts: [], status: "personnel", summary: "" });
    this.chunkDeletes.push(...ids);
  }
  async unlink(pairs: { transcriptId: string; accountId: string }[]) {
    this.links = this.links.filter((l) => !pairs.some((p) => p.transcriptId === l.transcriptId && p.accountId === l.accountId));
  }
  async writeCalls(rows: Record<string, unknown>[]) {
    return rows.map((w) => {
      let r = this.row(w.provider as string, w.external_id as string);
      if (!r) { r = { id: `t${++this.n}`, status: "pending", body: null, summary: "", gone_at: null, alt_url: null }; this.rows.push(r); }
      Object.assign(r, w);
      return { id: r.id, provider: r.provider as string, externalId: r.external_id as string };
    });
  }
  async deleteChunks(ids: string[]) { this.chunkDeletes.push(...ids); }
  async link(rows: { transcriptId: string; accountId: string; source: "auto" | "manual" }[]) {
    for (const l of rows) if (!this.links.some((x) => x.transcriptId === l.transcriptId && x.accountId === l.accountId)) this.links.push(l);
  }
  async setKind(ids: string[], kind: string) { this.kinds.push({ ids, kind }); for (const r of this.rows) if (ids.includes(r.id)) r.kind = kind; }
  async setGone(ids: string[], at: string | null) { this.goneCalls.push({ ids, at }); for (const r of this.rows) if (ids.includes(r.id)) r.gone_at = at; }
}

function call(over: Partial<SourceCall> = {}): SourceCall {
  return {
    provider: "granola", externalId: "g1", title: "World Emblem weekly", metAt: "2026-11-10T10:00:00.000Z",
    participants: [{ name: "Ann", email: "ann@x.com" }], url: "https://notes.granola.ai/d/g1", sourceSummary: "We talked roadmap",
    turns: null, ...over,
  };
}

interface Fakes {
  granola?: ListResult | (() => Promise<ListResult>);
  fathom?: ListResult | (() => Promise<ListResult>);
  transcript?: (provider: string, id: string) => Promise<TranscriptResult>;
  screen?: (c: SourceCall) => Promise<ScreenResult>;
  mention?: (q: { title: string; summary: string; project: string }) => Promise<boolean>;
  clock?: () => number;
}

function deps(store: FakeStore, f: Fakes = {}) {
  const seen = { listed: [] as { provider: string; since: string | null; cursor: string | null }[], fetched: [] as string[], screened: [] as string[], mentions: [] as string[] };
  const empty: ListResult = { calls: [], cursor: null, rateLimited: false, skipped: 0 };
  const d: SyncDeps = {
    store,
    list: async (provider, since, cursor) => {
      seen.listed.push({ provider, since, cursor });
      const r = provider === "granola" ? f.granola : f.fathom;
      return typeof r === "function" ? r() : (r ?? empty);
    },
    fetchTranscript: async (provider, id) => { seen.fetched.push(`${provider}:${id}`); return f.transcript ? f.transcript(provider, id) : { status: "ready", turns: TURNS }; },
    screen: async (c) => { seen.screened.push(`${c.provider}:${c.externalId}`); return f.screen ? f.screen(c) : { verdict: "clean", cuts: [] }; },
    askMention: async (q) => { seen.mentions.push(q.title); return f.mention ? f.mention(q) : false; },
    now: f.clock ?? (() => NOW_MS),
  };
  return { d, seen };
}

test("a rate-limited run marks nothing gone and keeps its cursor", async () => {
  const store = new FakeStore();
  store.seed({ provider: "granola", external_id: "old", met_at: "2026-10-01T00:00:00.000Z" });
  const { d } = deps(store, { granola: { calls: [call()], cursor: "next", rateLimited: true, skipped: 0 } });
  const out = await runSyncWith({}, d);
  assert.equal(out.rateLimited, true);
  assert.equal(out.gone, 0);
  assert.equal(store.row("granola", "old")!.gone_at, null);
  assert.deepEqual(decodeCursor(store.state.get("granola")!.cursor), { cursor: "next", since: null });
  assert.equal(store.state.get("granola")!.last_run_at ?? null, null);
});

test("a complete full listing marks an absent stored call gone and advances last_run_at", async () => {
  const store = new FakeStore();
  store.seed({ provider: "granola", external_id: "old", met_at: "2026-10-01T00:00:00.000Z" });
  const { d } = deps(store, { granola: { calls: [call()], cursor: null, rateLimited: false, skipped: 0 } });
  const out = await runSyncWith({}, d);
  assert.equal(out.gone, 1);
  assert.equal(store.row("granola", "old")!.gone_at, NOW);
  assert.equal(store.state.get("granola")!.last_run_at, NOW);
  assert.equal(store.state.get("granola")!.cursor, null);
});

test("an incremental listing (since set) never marks calls gone", async () => {
  const store = new FakeStore();
  store.seed({ provider: "granola", external_id: "old", met_at: "2026-10-01T00:00:00.000Z" });
  store.state.set("granola", { cursor: null, last_run_at: "2026-11-15T00:00:00.000Z", last_error: null });
  store.state.set("fathom", { cursor: null, last_run_at: "2026-11-15T00:00:00.000Z", last_error: null });
  const { d, seen } = deps(store, { granola: { calls: [call()], cursor: null, rateLimited: false, skipped: 0 } });
  const out = await runSyncWith({}, d);
  assert.equal(seen.listed[0].since, "2026-11-12T00:00:00.000Z");
  assert.equal(out.gone, 0);
  assert.equal(store.row("granola", "old")!.gone_at, null);
});

test("a new Granola call is fetched, screened clean, stored with its body and linked", async () => {
  const store = new FakeStore();
  const { d, seen } = deps(store, { granola: { calls: [call()], cursor: null, rateLimited: false, skipped: 0 } });
  const out = await runSyncWith({}, d);
  assert.deepEqual(seen.fetched, ["granola:g1"]);
  const r = store.row("granola", "g1")!;
  assert.equal(r.body, turnsToBody(TURNS));
  assert.equal(r.status, "pending");
  assert.equal(r.summary, "We talked roadmap");
  assert.deepEqual(store.links, [{ transcriptId: r.id, accountId: "a-we", source: "auto" }]);
  assert.equal(out.added, 1);
});

test("a personnel screen result stores a title-only row with no body or summary", async () => {
  const store = new FakeStore();
  const { d, seen } = deps(store, {
    granola: { calls: [call({ sourceSummary: "Talked about Breakr hiring" })], cursor: null, rateLimited: false, skipped: 0 },
    screen: async () => ({ verdict: "personnel", cuts: [] }),
  });
  await runSyncWith({}, d);
  const r = store.row("granola", "g1")!;
  assert.equal(r.status, "personnel");
  assert.equal(r.body, null);
  assert.equal(r.summary, "");
  assert.equal(r.title, "World Emblem weekly");
  assert.deepEqual(seen.mentions, []); // personnel calls get no mention checks
});

test("an error screen leaves the call pending with no body", async () => {
  const store = new FakeStore();
  const { d } = deps(store, { granola: { calls: [call()], cursor: null, rateLimited: false, skipped: 0 }, screen: async () => ({ verdict: "error" }) });
  const out = await runSyncWith({}, d);
  const r = store.row("granola", "g1")!;
  assert.equal(r.status, "pending");
  assert.equal(r.body, null);
  assert.equal(out.pending, 1);
});

test("a seeded Granola row with a Fathom alt link absorbs the Fathom copy", async () => {
  const store = new FakeStore();
  store.seed({ provider: "granola", external_id: "g-seed", met_at: "2026-11-10T10:00:00.000Z", alt_url: "https://fathom.video/calls/777", summary: "seeded" });
  const fathom = call({ provider: "fathom", externalId: "777", fetchId: "rec-777", url: "https://fathom.video/calls/777", turns: TURNS });
  const { d, seen } = deps(store, { fathom: { calls: [fathom], cursor: null, rateLimited: false, skipped: 0 } });
  const out = await runSyncWith({ since: "2026-11-01T00:00:00.000Z" }, d);
  assert.equal(store.row("fathom", "777"), undefined);
  const r = store.row("granola", "g-seed")!;
  assert.equal(r.alt_url, "https://fathom.video/calls/777");
  assert.equal(r.body, turnsToBody(TURNS));
  assert.equal(r.summary, "seeded");
  assert.equal(out.added, 0);
  assert.equal(out.updated, 1);
  assert.deepEqual(seen.fetched, []);
});

test("a Fathom call without turns is re-fetched by its recording id", async () => {
  const store = new FakeStore();
  const fathom = call({ provider: "fathom", externalId: "888", fetchId: "rec-888", url: "https://fathom.video/calls/888" });
  const { d, seen } = deps(store, { fathom: { calls: [fathom], cursor: null, rateLimited: false, skipped: 0 } });
  await runSyncWith({}, d);
  assert.deepEqual(seen.fetched, ["fathom:rec-888"]);
});

test("a 429 on a transcript stops fetching for the run; calls stay pending; the run finishes", async () => {
  const store = new FakeStore();
  let n = 0;
  const { d, seen } = deps(store, {
    granola: { calls: [call(), call({ externalId: "g2", title: "World Emblem two", metAt: "2026-11-11T10:00:00.000Z", url: "u2" })], cursor: null, rateLimited: false, skipped: 0 },
    transcript: async () => { n++; const { RateLimitedError } = await import("../lib/memory/sources/shared.ts"); throw new RateLimitedError("Granola"); },
  });
  const out = await runSyncWith({}, d);
  assert.equal(n, 1);
  assert.equal(seen.screened.length, 0);
  assert.equal(out.rateLimited, true);
  assert.equal(out.pending, 2);
  assert.equal(store.row("granola", "g1")!.body, null);
  assert.equal(store.row("granola", "g2")!.status, "pending");
  assert.equal(store.state.get("granola")!.last_run_at ?? null, null); // not advanced: calls were left over
});

test("transcript not_ready stays pending; gone is final only after 2 days", async () => {
  const store = new FakeStore();
  const old = call({ externalId: "gold", title: "World Emblem old", metAt: "2026-11-10T10:00:00.000Z", url: "uo" });
  const fresh = call({ externalId: "gnew", title: "World Emblem new", metAt: "2026-11-17T10:00:00.000Z", url: "un" });
  const nr = call({ externalId: "gnr", title: "World Emblem nr", metAt: "2026-11-17T12:00:00.000Z", url: "ur" });
  const { d } = deps(store, {
    granola: { calls: [old, fresh, nr], cursor: null, rateLimited: false, skipped: 0 },
    transcript: async (_p, id) => (id === "gnr" ? { status: "not_ready" } : { status: "gone" }),
  });
  await runSyncWith({}, d);
  assert.equal(store.row("granola", "gold")!.status, "failed");
  assert.equal(store.row("granola", "gnew")!.status, "pending");
  assert.equal(store.row("granola", "gnr")!.status, "pending");
});

test("a stored pending call that already has a body is not re-screened", async () => {
  const store = new FakeStore();
  store.seed({ provider: "granola", external_id: "g1", body: "[00:00:00] Ann: hi", met_at: "2026-11-10T10:00:00.000Z" });
  const { d, seen } = deps(store, { granola: { calls: [call()], cursor: null, rateLimited: false, skipped: 0 } });
  await runSyncWith({}, d);
  assert.deepEqual(seen.fetched, []);
  assert.deepEqual(seen.screened, []);
  assert.equal(store.row("granola", "g1")!.body, "[00:00:00] Ann: hi");
});

test("mention matches ask the model; yes links the call as multi, no does not", async () => {
  const store = new FakeStore();
  const a = call({ externalId: "m1", title: "Monday sync", sourceSummary: "Breakr came up at length", url: "u1" });
  const b = call({ externalId: "m2", title: "Tuesday sync", metAt: "2026-11-11T10:00:00.000Z", sourceSummary: "breakr in passing", url: "u2" });
  const { d, seen } = deps(store, {
    granola: { calls: [a, b], cursor: null, rateLimited: false, skipped: 0 },
    mention: async (q) => q.title === "Monday sync",
  });
  await runSyncWith({}, d);
  assert.deepEqual(seen.mentions.sort(), ["Monday sync", "Tuesday sync"]);
  const m1 = store.row("granola", "m1")!, m2 = store.row("granola", "m2")!;
  assert.deepEqual(store.links, [{ transcriptId: m1.id, accountId: "a-br", source: "auto" }]);
  assert.equal(m1.kind, "multi");
  assert.notEqual(m2.kind, "multi");
});

test("onlySlugs restricts the run to calls matching those projects and never marks gone or moves state", async () => {
  const store = new FakeStore();
  store.seed({ provider: "granola", external_id: "old", met_at: "2026-10-01T00:00:00.000Z" });
  const other = call({ externalId: "g9", title: "Breakr weekly", sourceSummary: "", url: "u9" });
  const { d, seen } = deps(store, { granola: { calls: [call(), other], cursor: null, rateLimited: false, skipped: 0 } });
  const out = await runSyncWith({ since: "2026-11-01T00:00:00.000Z", onlySlugs: ["world-emblem"] }, d);
  assert.deepEqual(seen.screened, ["granola:g1"]);
  assert.equal(store.row("granola", "g9"), undefined);
  assert.equal(out.gone, 0);
  assert.equal(store.state.size, 0);
  assert.equal(seen.listed[0].since, "2026-11-01T00:00:00.000Z");
});

test("the time budget stops screening cleanly and reports that more remains", async () => {
  const store = new FakeStore();
  let t = NOW_MS;
  const calls = [call(), call({ externalId: "g2", title: "World Emblem 2", metAt: "2026-11-11T10:00:00.000Z", url: "u2" })];
  const { d, seen } = deps(store, {
    granola: { calls, cursor: null, rateLimited: false, skipped: 0 },
    screen: async () => { t += 200_000; return { verdict: "clean", cuts: [] }; },
    clock: () => t,
  });
  const out = await runSyncWith({ budgetMs: 150_000 }, d);
  assert.equal(seen.screened.length, 1);
  assert.equal(out.more, true);
  assert.equal(out.pending, 1);
  assert.ok(store.row("granola", "g2")); // still stored, as pending
  assert.equal(store.state.get("granola")!.last_run_at ?? null, null);
  assert.ok(out.log.some((l) => /more remains/i.test(l)));
});

test("a personnel override drops a stored body before anything else", async () => {
  const store = new FakeStore();
  store.seed({ provider: "granola", external_id: "p1", body: "secret", status: "pending", summary: "s", met_at: "2026-11-10T10:00:00.000Z" });
  const id = store.row("granola", "p1")!.id;
  store.overrides = [{ transcriptId: id, accountId: null, action: "personnel" }];
  const { d } = deps(store, {});
  await runSyncWith({}, d);
  const r = store.row("granola", "p1")!;
  assert.equal(r.body, null);
  assert.equal(r.status, "personnel");
  assert.ok(store.chunkDeletes.includes(id));
});
