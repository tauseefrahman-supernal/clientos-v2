import { test } from "node:test";
import assert from "node:assert/strict";
import {
  absorbAltUrls, absorbStored, uniqueTwin, markerMinutes, applyNotPersonnel, decodeCursor, encodeCursor, goneIsFinal, listingStart, PreviewRequiredError, rowForCall, runSyncWith,
  sameMeetingAs, seededPairs, speakersOf, type Snapshot, type StoredRow, type SyncDeps, type SyncStore,
} from "../lib/memory/sync-core.ts";
import type { PlannedCall } from "../lib/memory/plan-sync.ts";
import type { ScreenResult } from "../lib/memory/screen.ts";
import type { ListResult, TranscriptResult } from "../lib/memory/sources/shared.ts";
import type { SourceCall, Turn } from "../lib/memory/types.ts";
import { recordingShown, turnsToBody } from "../lib/memory/index-rules.ts";
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
  hasBody: false, summaryEmpty: false, metAt: "2026-10-01T00:00:00.000Z", title: "Old call", url: null, ...over,
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
  links: { transcriptId: string; accountId: string; source: string; headline?: string }[] = [];
  events: string[] = [];
  writes = 0;
  state = new Map<string, { cursor: string | null; last_run_at: string | null; last_error: string | null }>();
  goneCalls: { ids: string[]; at: string | null }[] = [];
  chunkDeletes: string[] = [];
  kinds: { ids: string[]; kind: string }[] = [];
  overrides: Snapshot["overrides"] = [];
  rules: Snapshot["rules"] = [{ accountId: "a-we", kind: "keyword", value: "emblem" }, { accountId: "a-br", kind: "keyword", value: "breakr" }];
  accounts = [{ id: "a-we", slug: "world-emblem", name: "World Emblem" }, { id: "a-br", slug: "breakr", name: "Breakr" }];
  private n = 0;

  seed(row: Record<string, unknown>) { const r = { id: `t${++this.n}`, status: "pending", body: null, summary: "", gone_at: null, alt_url: null, title: "Seeded", url: null, participants: [], ...row }; this.rows.push(r); return r; }
  row(provider: string, externalId: string) { return this.rows.find((r) => r.provider === provider && r.external_id === externalId); }

  async load(): Promise<Snapshot> {
    return {
      rows: this.rows.map((r) => ({
        id: r.id, provider: r.provider as string, externalId: r.external_id as string, goneAt: (r.gone_at as string) ?? null,
        status: r.status as string, altUrl: (r.alt_url as string) ?? null, hasBody: r.body != null, summaryEmpty: !r.summary,
        metAt: (r.met_at as string) ?? null, title: (r.title as string) ?? "", url: (r.url as string) ?? null, pulledAt: (r.pulled_at as string) ?? null,
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
    this.writes++;
    for (const r of this.rows) if (ids.includes(r.id)) Object.assign(r, { body: null, cuts: [], status: "personnel", summary: "" });
    for (const l of this.links) if (ids.includes(l.transcriptId)) l.headline = "";
    this.chunkDeletes.push(...ids);
  }
  async unlink(pairs: { transcriptId: string; accountId: string }[]) {
    this.links = this.links.filter((l) => !pairs.some((p) => p.transcriptId === l.transcriptId && p.accountId === l.accountId));
  }
  async writeCalls(rows: Record<string, unknown>[]) {
    this.writes++;
    this.events.push(`write:${rows.length}`);
    return rows.map((w) => {
      let r = this.row(w.provider as string, w.external_id as string);
      if (!r) { r = { id: `t${++this.n}`, status: "pending", body: null, summary: "", gone_at: null, alt_url: null }; this.rows.push(r); }
      Object.assign(r, w);
      return { id: r.id, provider: r.provider as string, externalId: r.external_id as string };
    });
  }
  async clearPersonnel(ids: string[]) {
    this.chunkDeletes.push(...ids);
    for (const l of this.links) if (ids.includes(l.transcriptId)) l.headline = "";
  }
  async rekey(id: string, provider: string, externalId: string, altUrl: string | null) {
    this.writes++;
    const r = this.rows.find((x) => x.id === id)!;
    Object.assign(r, { provider, external_id: externalId }, altUrl ? { alt_url: altUrl } : {});
  }
  async fold(fromId: string, toId: string) {
    this.writes++;
    this.events.push(`fold:${fromId}>${toId}`);
    for (const l of this.links.filter((x) => x.transcriptId === fromId)) {
      const kept = this.links.find((x) => x.transcriptId === toId && x.accountId === l.accountId);
      if (!kept) this.links.push({ ...l, transcriptId: toId });
      else if (!kept.headline && l.headline) kept.headline = l.headline;
    }
    this.links = this.links.filter((x) => x.transcriptId !== fromId);
    const from = this.rows.find((x) => x.id === fromId), to = this.rows.find((x) => x.id === toId);
    if (from && to) { if (!to.url && from.url) to.url = from.url; if (!to.alt_url && from.alt_url) to.alt_url = from.alt_url; }
    this.rows = this.rows.filter((x) => x.id !== fromId);
  }
  async link(rows: { transcriptId: string; accountId: string; source: "auto" | "manual" }[]) {
    for (const l of rows) if (!this.links.some((x) => x.transcriptId === l.transcriptId && x.accountId === l.accountId)) this.links.push(l);
  }
  async setKind(ids: string[], kind: string) { this.kinds.push({ ids, kind }); for (const r of this.rows) if (ids.includes(r.id)) r.kind = kind; }
  async readScreened(ids: string[]) {
    return new Map(this.rows.filter((r) => ids.includes(r.id)).map((r) => [r.id, { body: (r.body as string) ?? null, cuts: (r.cuts as never[]) ?? [] }]));
  }
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
  previews?: SyncDeps["previews"];
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
    screen: async (c) => { seen.screened.push(`${c.provider}:${c.externalId}`); store.events.push(`screen:${c.externalId}`); return f.screen ? f.screen(c) : { verdict: "clean", cuts: [] }; },
    askMention: async (q) => { seen.mentions.push(q.title); return f.mention ? f.mention(q) : false; },
    now: f.clock ?? (() => NOW_MS),
    previews: f.previews ?? { last: () => NOW_MS, mark: () => {} },
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
  assert.equal(store.state.get("granola")?.last_run_at ?? null, null);
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
  assert.equal(store.state.get("granola")?.last_run_at ?? null, null); // not advanced: calls were left over
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
  assert.equal(store.state.get("granola")?.last_run_at ?? null, null);
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

// ---------------------------------------------------------------- fix round 1

test("a run stopped mid-apply holds its cursor back, so the next run re-lists the unapplied calls", async () => {
  const store = new FakeStore();
  const saved = encodeCursor("c1", "2026-11-01T00:00:00.000Z");
  store.state.set("granola", { cursor: saved, last_run_at: "2026-11-04T00:00:00.000Z", last_error: null });
  let t = NOW_MS;
  const calls = [call(), call({ externalId: "g2", title: "World Emblem 2", metAt: "2026-11-11T10:00:00.000Z", url: "u2" })];
  const first = deps(store, {
    granola: { calls, cursor: "c2", rateLimited: false, skipped: 0 },
    screen: async () => { t += 200_000; return { verdict: "clean", cuts: [] }; },
    clock: () => t,
  });
  const out = await runSyncWith({ budgetMs: 150_000 }, first.d);
  assert.equal(out.more, true);
  assert.equal(store.state.get("granola")!.cursor, saved);                    // not advanced to c2
  assert.equal(store.state.get("granola")!.last_run_at, "2026-11-04T00:00:00.000Z");
  const second = deps(store, { granola: { calls, cursor: null, rateLimited: false, skipped: 0 } });
  await runSyncWith({}, second.d);
  assert.deepEqual(second.seen.listed[0], { provider: "granola", since: "2026-11-01T00:00:00.000Z", cursor: "c1" });
  assert.deepEqual(second.seen.screened, ["granola:g2"]);                     // g1 already has its body
  assert.equal(store.state.get("granola")!.cursor, null);
});

test("a completed run saves the cursor the listing ended on", async () => {
  const store = new FakeStore();
  const { d } = deps(store, { granola: { calls: [call()], cursor: "next", rateLimited: true, skipped: 0 } });
  await runSyncWith({}, d);
  assert.deepEqual(decodeCursor(store.state.get("granola")!.cursor), { cursor: "next", since: null });
});

test("the retry pass picks up a stranded Granola row (not Fathom), keeping its title and people", async () => {
  const store = new FakeStore();
  const g = store.seed({ provider: "granola", external_id: "stranded", title: "Kept title", met_at: "2026-11-05T10:00:00.000Z", participants: [{ name: "Zed", email: null }] });
  store.seed({ provider: "fathom", external_id: "999", met_at: "2026-11-05T10:00:00.000Z" });
  store.seed({ provider: "granola", external_id: "gone1", gone_at: "2026-11-10T00:00:00.000Z" });
  for (const p of ["granola", "fathom"]) store.state.set(p, { cursor: null, last_run_at: "2026-11-15T00:00:00.000Z", last_error: null });
  const { d, seen } = deps(store, {});
  await runSyncWith({}, d);
  assert.deepEqual(seen.fetched, ["granola:stranded"]);
  assert.equal(g.body, turnsToBody(TURNS));
  assert.equal(g.title, "Kept title");
  assert.deepEqual(g.participants, [{ name: "Zed", email: null }]);
  assert.equal(g.met_at, "2026-11-05T10:00:00.000Z");
});

test("the retry pass is bounded by the time budget and skipped for onlySlugs runs", async () => {
  const store = new FakeStore();
  store.seed({ provider: "granola", external_id: "s1", met_at: "2026-11-05T10:00:00.000Z" });
  const trial = deps(store, {});
  await runSyncWith({ since: "2026-11-01T00:00:00.000Z", onlySlugs: ["world-emblem"] }, trial.d);
  assert.deepEqual(trial.seen.fetched, []);
  let t = NOW_MS;
  const late = deps(store, { clock: () => (t += 100_000) });
  await runSyncWith({ budgetMs: 150_000, confirmFull: true }, late.d);
  assert.deepEqual(late.seen.fetched, []);
});

test("(i) a listed Granola call whose Fathom link is a stored Fathom row takes that row over in place", async () => {
  const store = new FakeStore();
  const f = store.seed({ provider: "fathom", external_id: "555", title: "Fathom title", url: "https://fathom.video/calls/555", met_at: "2026-11-10T10:00:00.000Z" });
  store.links.push({ transcriptId: f.id, accountId: "a-br", source: "manual", headline: "kept" });
  // Listed in both sources: the merge keeps the Granola call with the Fathom link as its altUrl.
  const g = call({ externalId: "g-new" });
  const fathomCopy = call({ provider: "fathom", externalId: "555", fetchId: "r555", url: "https://fathom.video/calls/555", title: "World Emblem weekly" });
  const { d } = deps(store, { granola: { calls: [g], cursor: null, rateLimited: false, skipped: 0 }, fathom: { calls: [fathomCopy], cursor: null, rateLimited: false, skipped: 0 } });
  const out = await runSyncWith({}, d);
  assert.equal(store.rows.length, 1);
  assert.equal(f.provider, "granola");
  assert.equal(f.external_id, "g-new");
  assert.equal(f.alt_url, "https://fathom.video/calls/555");
  assert.equal(f.title, "Fathom title");
  assert.ok(store.links.some((l) => l.transcriptId === f.id && l.accountId === "a-br" && l.headline === "kept"));
  assert.equal(out.gone, 0);
  assert.ok(out.log.some((l) => /is now Granola call g-new/.test(l)));
});

test("(ii) same title within 10 minutes absorbs across providers, Granola as the row identity", async () => {
  const store = new FakeStore();
  const g = store.seed({ provider: "granola", external_id: "g-old", title: "Ops Review", met_at: "2026-11-10T10:00:00.000Z", participants: [{ name: "Kept", email: null }] });
  const fr = store.seed({ provider: "fathom", external_id: "321", title: "Board call", url: "https://fathom.video/calls/321", met_at: "2026-11-12T09:00:00.000Z" });
  const fathomCopy = call({ provider: "fathom", externalId: "777", fetchId: "r777", title: "ops review!", metAt: "2026-11-10T10:06:00.000Z", url: "https://fathom.video/calls/777", turns: TURNS, participants: [{ name: "New", email: "n@x.com" }] });
  const granolaNew = call({ externalId: "g-board", title: "Board  Call", metAt: "2026-11-12T09:04:00.000Z", url: "https://notes.granola.ai/d/g-board" });
  const { d } = deps(store, { granola: { calls: [granolaNew], cursor: null, rateLimited: false, skipped: 0 }, fathom: { calls: [fathomCopy], cursor: null, rateLimited: false, skipped: 0 } });
  await runSyncWith({}, d);
  assert.equal(store.rows.length, 2);
  assert.equal(g.alt_url, "https://fathom.video/calls/777");
  assert.equal(g.title, "Ops Review");
  assert.equal(g.met_at, "2026-11-10T10:00:00.000Z");
  assert.deepEqual(g.participants, [{ name: "Kept", email: null }]);
  assert.equal(g.body, turnsToBody(TURNS));
  assert.equal(fr.provider, "granola");
  assert.equal(fr.external_id, "g-board");
  assert.equal(fr.alt_url, "https://fathom.video/calls/321");
  assert.equal(sameMeetingAs({ title: "A", metAt: "2026-11-10T10:00:00Z" }, { title: "a", metAt: "2026-11-10T10:11:00Z" }), false);
});

test("a seeded pair folds: the Fathom row's links move to the Granola row (existing link wins) and the Fathom row goes", async () => {
  const store = new FakeStore();
  const g = store.seed({ provider: "granola", external_id: "g1x", alt_url: "https://fathom.video/calls/42", met_at: "2026-10-10T10:00:00.000Z" });
  const f = store.seed({ provider: "fathom", external_id: "42", met_at: "2026-10-10T10:00:00.000Z" });
  store.links.push({ transcriptId: g.id, accountId: "a-we", source: "auto", headline: "granola" });
  store.links.push({ transcriptId: f.id, accountId: "a-we", source: "manual", headline: "fathom" });
  store.links.push({ transcriptId: f.id, accountId: "a-br", source: "auto", headline: "br" });
  assert.deepEqual(seededPairs([stored({ id: g.id, externalId: "g1x", altUrl: "https://fathom.video/calls/42" }), stored({ id: f.id, provider: "fathom", externalId: "42" })]).folds.map((x) => [x.fromId, x.toId]), [[f.id, g.id]]);
  for (const p of ["granola", "fathom"]) store.state.set(p, { cursor: null, last_run_at: "2026-11-15T00:00:00.000Z", last_error: null });
  const out = await runSyncWith({}, deps(store, { transcript: async () => ({ status: "not_ready" }) }).d);
  assert.equal(store.row("fathom", "42"), undefined);
  assert.deepEqual(store.links.map((l) => [l.transcriptId, l.accountId, l.headline]).sort(), [[g.id, "a-br", "br"], [g.id, "a-we", "granola"]]);
  assert.ok(out.log.some((l) => /folded a duplicate Fathom row/.test(l)));
});

test("personnel calls lose their project headlines, by screen and by override", async () => {
  const store = new FakeStore();
  const a = store.seed({ provider: "granola", external_id: "g1", met_at: "2026-11-10T10:00:00.000Z" });
  const b = store.seed({ provider: "granola", external_id: "p2", body: "x", met_at: "2026-11-09T10:00:00.000Z" });
  store.links.push({ transcriptId: a.id, accountId: "a-we", source: "auto", headline: "secret a" });
  store.links.push({ transcriptId: b.id, accountId: "a-we", source: "auto", headline: "secret b" });
  store.overrides = [{ transcriptId: b.id, accountId: null, action: "personnel" }];
  const { d } = deps(store, { granola: { calls: [call()], cursor: null, rateLimited: false, skipped: 0 }, screen: async () => ({ verdict: "personnel", cuts: [] }) });
  await runSyncWith({ confirmFull: true }, d);
  assert.deepEqual(store.links.map((l) => l.headline), ["", ""]);
});

test("recordingShown hides personnel calls and calls gone for more than 14 days", () => {
  const now = new Date(NOW);
  assert.equal(recordingShown({ status: "pending", gone_at: null }, now), true);
  assert.equal(recordingShown({ status: "personnel", gone_at: null }, now), false);
  assert.equal(recordingShown({ status: "digested", gone_at: new Date(NOW_MS - 15 * DAY).toISOString() }, now), false);
  assert.equal(recordingShown({ status: "digested", gone_at: new Date(NOW_MS - 13 * DAY).toISOString() }, now), true);
});

test("preview lists what a full run would mark gone and writes nothing, calls no model", async () => {
  const store = new FakeStore();
  store.seed({ provider: "granola", external_id: "old", title: "Left the company", met_at: "2026-10-01T00:00:00.000Z" });
  let marked: number | null = null;
  const { d, seen } = deps(store, {
    granola: { calls: [call({ sourceSummary: "breakr" })], cursor: null, rateLimited: false, skipped: 0 },
    previews: { last: () => marked, mark: (at) => { marked = at; } },
  });
  const out = await runSyncWith({ preview: true }, d);
  assert.deepEqual(out.preview!.wouldMarkGone, [{ title: "Left the company", provider: "granola", metAt: "2026-10-01T00:00:00.000Z" }]);
  assert.equal(out.preview!.new, 1);
  assert.equal(store.writes, 0);
  assert.equal(store.state.size, 0);
  assert.deepEqual(seen.screened, []);
  assert.deepEqual(seen.mentions, []);
  assert.deepEqual(seen.fetched, []);
  assert.equal(marked, NOW_MS);
  // With that preview recorded, the full run is allowed.
  const run = await runSyncWith({}, d);
  assert.equal(run.gone, 1);
});

test("a full run without a recent preview is refused unless confirmFull", async () => {
  const store = new FakeStore();
  const stale = { last: () => NOW_MS - 2 * 60 * 60 * 1000, mark: () => {} };
  await assert.rejects(runSyncWith({}, deps(store, { previews: stale }).d), (e) => e instanceof PreviewRequiredError);
  await assert.rejects(runSyncWith({ full: true }, deps(store, { previews: { last: () => null, mark: () => {} } }).d), (e) => e instanceof PreviewRequiredError);
  assert.equal(store.writes, 0);
  const ok = await runSyncWith({ confirmFull: true }, deps(store, { previews: stale }).d);
  assert.equal(ok.more, false);
  // Incremental and ad-hoc runs need no preview.
  for (const p of ["granola", "fathom"]) store.state.set(p, { cursor: null, last_run_at: "2026-11-15T00:00:00.000Z", last_error: null });
  await runSyncWith({}, deps(store, { previews: stale }).d);
});

test("absorbing a Fathom copy keeps the row's title, date and people; refreshes keep a stored title", () => {
  const p = { externalKey: "granola:g1", provider: "granola" as const, externalId: "g1", title: "Fathom title", metAt: NOW, participants: [{ name: "X", email: null }], url: "", altUrl: "https://fathom.video/calls/1", sourceSummary: "", turns: null, status: "keep" as const, dropBody: false, isNew: false };
  const a = rowForCall(p, { kind: "meta" }, { summaryEmpty: false, now: NOW, storedTitle: "Granola title", absorbed: true });
  assert.equal(a.title, "Granola title");
  assert.equal("met_at" in a, false);
  assert.equal("participants" in a, false);
  const r = rowForCall(p, { kind: "meta" }, { summaryEmpty: false, now: NOW, storedTitle: "" });
  assert.equal(r.title, "Fathom title");
  assert.equal(r.met_at, NOW);
});

test("with under 45 s left, queued writes are flushed before each screen call", async () => {
  const store = new FakeStore();
  let t = NOW_MS;
  const calls = [call(), call({ externalId: "g2", title: "World Emblem 2", metAt: "2026-11-11T10:00:00.000Z", url: "u2" })];
  const { d } = deps(store, {
    granola: { calls, cursor: null, rateLimited: false, skipped: 0 },
    screen: async () => { t += 40_000; return { verdict: "clean", cuts: [] }; },
    clock: () => t,
  });
  await runSyncWith({ budgetMs: 80_000 }, d);
  assert.deepEqual(store.events.slice(0, 3), ["screen:g1", "write:1", "screen:g2"]);
});

test("absorbStored leaves the input rows untouched", () => {
  const rows = [stored({ id: "f", provider: "fathom", externalId: "9", url: "https://fathom.video/calls/9" })];
  const out = absorbStored([{ ...call({ externalId: "gx" }), altUrl: "https://fathom.video/calls/9" }], rows);
  assert.equal(rows[0].provider, "fathom");
  assert.equal(out.rows[0].provider, "granola");
  assert.equal(out.rekeys.length, 1);
});

// ---------------------------------------------------------------- fix round 2

test("an onlySlugs run folds no seeded pair and logs no rekey it did not apply", async () => {
  const store = new FakeStore();
  store.seed({ provider: "granola", external_id: "g1x", alt_url: "https://fathom.video/calls/42", met_at: "2026-10-10T10:00:00.000Z" });
  store.seed({ provider: "fathom", external_id: "42", met_at: "2026-10-10T10:00:00.000Z" });
  const f = store.seed({ provider: "fathom", external_id: "555", title: "Fathom title", url: "https://fathom.video/calls/555", met_at: "2026-11-10T10:00:00.000Z" });
  // A Breakr call that would rekey the stored Fathom row, filtered out by onlySlugs.
  const g = { ...call({ externalId: "g-br", title: "Breakr weekly", sourceSummary: "" }), altUrl: "https://fathom.video/calls/555" };
  const fathomCopy = call({ provider: "fathom", externalId: "555", fetchId: "r555", url: "https://fathom.video/calls/555", title: "Breakr weekly", sourceSummary: "" });
  const { d } = deps(store, { granola: { calls: [g], cursor: null, rateLimited: false, skipped: 0 }, fathom: { calls: [fathomCopy], cursor: null, rateLimited: false, skipped: 0 } });
  const out = await runSyncWith({ since: "2026-11-01T00:00:00.000Z", onlySlugs: ["world-emblem"] }, d);
  assert.ok(store.row("fathom", "42"));
  assert.equal(f.provider, "fathom");
  assert.equal(store.writes, 0);
  assert.ok(!out.log.some((l) => /folded|is now Granola/.test(l)));
});

// ---------------------------------------------------------------- fix round 3: Granola public ids vs web UUIDs

const UUID = "a42e472a-1152-4517-a0df-3982a134c884";

test("a listed Granola note (public id) takes over the row seeded under its web UUID: same title, within 15 minutes", async () => {
  const store = new FakeStore();
  const seeded = store.seed({ provider: "granola", external_id: UUID, title: "World Emblem weekly", met_at: "2026-11-10T10:00:00.000Z", url: `https://notes.granola.ai/d/${UUID}`, summary: "seeded" });
  store.links.push({ transcriptId: seeded.id, accountId: "a-we", source: "auto", headline: "kept headline" });
  const other = store.seed({ provider: "granola", external_id: "not_other", title: "World Emblem weekly", met_at: "2026-11-10T10:20:00.000Z" }); // 6 min from the listed call, 20 from the seeded row
  const listed = call({ externalId: "not_orlk1vdjfkhixj", metAt: "2026-11-10T10:14:00.000Z", url: "" });
  const { d } = deps(store, {
    granola: { calls: [listed], cursor: null, rateLimited: false, skipped: 0 },
    transcript: async () => ({ status: "ready", turns: TURNS, url: `https://notes.granola.ai/d/${UUID}`, webId: UUID }),
  });
  const out = await runSyncWith({ since: "2026-11-01T00:00:00.000Z" }, d);
  assert.equal(seeded.external_id, "not_orlk1vdjfkhixj");
  assert.equal(seeded.body, turnsToBody(TURNS));
  assert.equal(seeded.url, `https://notes.granola.ai/d/${UUID}`);           // stored url kept
  assert.deepEqual(store.links, [{ transcriptId: seeded.id, accountId: "a-we", source: "auto", headline: "kept headline" }]);
  assert.equal(other.external_id, "not_other");                              // a public-id row is never a target
  assert.equal(store.rows.length, 2);
  assert.equal(out.added, 0);
  assert.ok(out.log.some((l) => /is now Granola note not_orlk1vdjfkhixj/.test(l)));
  assert.ok(out.log.some((l) => l.includes(`has web id ${UUID}`)));
});

test("no Granola rekey past 15 minutes, nor under onlySlugs when the call is filtered out", async () => {
  const store = new FakeStore();
  const seeded = store.seed({ provider: "granola", external_id: UUID, title: "Breakr weekly", met_at: "2026-11-10T10:00:00.000Z" });
  const far = call({ externalId: "not_far", title: "Breakr weekly", metAt: "2026-11-10T10:16:00.000Z", sourceSummary: "" });
  await runSyncWith({ since: "2026-11-01T00:00:00.000Z", onlySlugs: ["world-emblem"] }, deps(store, { granola: { calls: [far, call({ externalId: "not_near", title: "Breakr weekly", metAt: "2026-11-10T10:01:00.000Z", sourceSummary: "" })], cursor: null, rateLimited: false, skipped: 0 } }).d);
  assert.equal(seeded.external_id, UUID);
  assert.equal(store.writes, 0);
  await runSyncWith({ since: "2026-11-01T00:00:00.000Z" }, deps(store, { granola: { calls: [far], cursor: null, rateLimited: false, skipped: 0 } }).d);
  assert.equal(seeded.external_id, UUID);
  assert.ok(store.row("granola", "not_far"));
});

test("a fetched Granola web link fills a row stored without a url", async () => {
  const store = new FakeStore();
  const { d } = deps(store, {
    granola: { calls: [call({ externalId: "not_new", url: "" })], cursor: null, rateLimited: false, skipped: 0 },
    transcript: async () => ({ status: "ready", turns: TURNS, url: "https://notes.granola.ai/d/x" }),
  });
  await runSyncWith({ since: "2026-11-01T00:00:00.000Z" }, d);
  assert.equal(store.row("granola", "not_new")!.url, "https://notes.granola.ai/d/x");
});

function duplicatePair(store: FakeStore) {
  const kept = store.seed({ provider: "granola", external_id: "not_x", title: "Ops Review", met_at: "2026-11-10T10:00:00.000Z", body: "[00:00:00] Ann: hi", url: null });
  const dup = store.seed({ provider: "granola", external_id: UUID, title: "ops review", met_at: "2026-11-10T10:12:00.000Z", url: `https://notes.granola.ai/d/${UUID}`, alt_url: "https://fathom.video/calls/5" });
  store.links.push({ transcriptId: kept.id, accountId: "a-we", source: "auto", headline: "" });
  store.links.push({ transcriptId: dup.id, accountId: "a-we", source: "manual", headline: "UUID headline" });
  store.links.push({ transcriptId: dup.id, accountId: "a-br", source: "auto", headline: "br" });
  store.links.push({ transcriptId: kept.id, accountId: "a-xx", source: "auto", headline: "own" });
  return { kept, dup };
}

test("seededPairs pairs a public-id Granola row with its web-UUID twin (within 15 minutes) and keeps the public-id row", () => {
  const rows = [
    stored({ id: "k", externalId: "not_x", title: "Ops Review", metAt: "2026-11-10T10:00:00.000Z" }),
    stored({ id: "u", externalId: UUID, title: "ops review", metAt: "2026-11-10T10:12:00.000Z" }),
    stored({ id: "u2", externalId: "b42e472a-1152-4517-a0df-3982a134c884", title: "Ops Review", metAt: "2026-11-10T10:16:00.000Z" }),
  ];
  const out = seededPairs(rows);
  assert.deepEqual(out.folds.map((f) => [f.fromId, f.toId, f.kind]), [["u", "k", "granola-id"]]);
  assert.deepEqual(out.rows.map((r) => r.id), ["k", "u2"]);
});

test("a full run folds a web-UUID duplicate into the public-id row, carrying links, an empty headline and links", async () => {
  const store = new FakeStore();
  const { kept, dup } = duplicatePair(store);
  for (const p of ["granola", "fathom"]) store.state.set(p, { cursor: null, last_run_at: "2026-11-15T00:00:00.000Z", last_error: null });
  const out = await runSyncWith({}, deps(store, {}).d);
  assert.equal(store.rows.find((r) => r.id === dup.id), undefined);
  assert.deepEqual(store.links.map((l) => [l.accountId, l.source, l.headline]).sort(), [["a-br", "auto", "br"], ["a-we", "auto", "UUID headline"], ["a-xx", "auto", "own"]]);
  assert.ok(store.links.every((l) => l.transcriptId === kept.id));
  assert.equal(kept.url, `https://notes.granola.ai/d/${UUID}`);
  assert.equal(kept.alt_url, "https://fathom.video/calls/5");
  assert.equal(kept.body, "[00:00:00] Ann: hi");
  assert.ok(out.log.some((l) => /web UUID into "Ops Review"/.test(l)));
});

test("repairOnly folds duplicates and does nothing else", async () => {
  const store = new FakeStore();
  const { kept, dup } = duplicatePair(store);
  store.seed({ provider: "granola", external_id: "g-old", alt_url: "https://fathom.video/calls/42", met_at: "2026-10-10T10:00:00.000Z" });
  store.seed({ provider: "fathom", external_id: "42", met_at: "2026-10-10T10:00:00.000Z" });
  store.seed({ provider: "granola", external_id: "stranded", met_at: "2026-11-05T10:00:00.000Z" });
  const { d, seen } = deps(store, {
    granola: { calls: [call()], cursor: null, rateLimited: false, skipped: 0 },
    previews: { last: () => null, mark: () => {} },
  });
  const out = await runSyncWith({ repairOnly: true }, d);
  assert.deepEqual(seen.listed, []);
  assert.deepEqual(seen.fetched, []);
  assert.deepEqual(seen.screened, []);
  assert.deepEqual(seen.mentions, []);
  assert.equal(store.writes, 2);                     // two folds, nothing more
  assert.equal(store.state.size, 0);
  assert.equal(store.events.length, 2);
  assert.ok(store.events.every((e) => e.startsWith("fold:")));
  assert.equal(store.rows.find((r) => r.id === dup.id), undefined);
  assert.equal(store.row("fathom", "42"), undefined);
  assert.ok(store.rows.find((r) => r.id === kept.id));
  assert.ok(out.log.some((l) => /repair: 2 duplicate rows folded/.test(l)));
});

// ---------------------------------------------------------------- fix round 4: one-to-one matches only

const UUID2 = "b42e472a-1152-4517-a0df-3982a134c884";

test("uniqueTwin: one candidate and no rival peer is a match; two either way is ambiguous", () => {
  const at = (m: number) => new Date(Date.parse("2026-11-10T10:00:00.000Z") + m * 60_000).toISOString();
  const item = { title: "T3", metAt: at(0) };
  assert.equal(uniqueTwin(item, [{ title: "T3", metAt: at(5) }], [item]).kind, "match");
  assert.equal(uniqueTwin(item, [{ title: "T3", metAt: at(5) }, { title: "t3", metAt: at(-5) }], [item]).kind, "ambiguous");
  assert.equal(uniqueTwin(item, [{ title: "T3", metAt: at(5) }], [item, { title: "T3", metAt: at(10) }]).kind, "ambiguous");
  assert.equal(uniqueTwin(item, [{ title: "T3", metAt: at(30) }], [item]).kind, "none");
});

test("back-to-back same-title stored rows, each with a twin, are not folded (ambiguous, logged)", async () => {
  const store = new FakeStore();
  const a = store.seed({ provider: "granola", external_id: "not_a", title: "T3", met_at: "2026-11-10T10:00:00.000Z", body: "a" });
  const b = store.seed({ provider: "granola", external_id: "not_b", title: "T3", met_at: "2026-11-10T10:10:00.000Z", body: "b" });
  store.seed({ provider: "granola", external_id: UUID, title: "T3", met_at: "2026-11-10T10:01:00.000Z" });
  store.seed({ provider: "granola", external_id: UUID2, title: "T3", met_at: "2026-11-10T10:11:00.000Z" });
  const out = await runSyncWith({ repairOnly: true }, deps(store, {}).d);
  assert.equal(store.rows.length, 4);
  assert.equal(store.writes, 0);
  assert.ok(a && b);
  assert.ok(out.log.some((l) => l.startsWith("ambiguous match skipped: T3 2026-11-10 10:")));
  assert.ok(out.log.some((l) => /repair: 0 duplicate rows folded/.test(l)));
});

test("back-to-back same-title listed calls never rekey seeded UUID rows", async () => {
  const store = new FakeStore();
  const u1 = store.seed({ provider: "granola", external_id: UUID, title: "World Emblem T3", met_at: "2026-11-10T10:02:00.000Z" });
  const u2 = store.seed({ provider: "granola", external_id: UUID2, title: "World Emblem T3", met_at: "2026-11-10T10:12:00.000Z" });
  const c1 = call({ externalId: "not_1", title: "World Emblem T3", metAt: "2026-11-10T10:00:00.000Z", url: "u1" });
  const c2 = call({ externalId: "not_2", title: "World Emblem T3", metAt: "2026-11-10T10:10:00.000Z", url: "u2" });
  const out = await runSyncWith({ since: "2026-11-01T00:00:00.000Z" }, deps(store, { granola: { calls: [c1, c2], cursor: null, rateLimited: false, skipped: 0 } }).d);
  assert.equal(u1.external_id, UUID);
  assert.equal(u2.external_id, UUID2);
  assert.ok(out.log.some((l) => l.startsWith("ambiguous match skipped: World Emblem T3")));
});

test("a listed Fathom call between two same-title Granola rows is not absorbed into either", () => {
  const rows = [
    stored({ id: "g1", externalId: "ga", title: "T3", metAt: "2026-11-10T10:00:00.000Z" }),
    stored({ id: "g2", externalId: "gb", title: "T3", metAt: "2026-11-10T10:08:00.000Z" }),
  ];
  const f = { ...call({ provider: "fathom", externalId: "77", title: "T3", metAt: "2026-11-10T10:04:00.000Z", url: "https://fathom.video/calls/77" }), altUrl: null };
  const out = absorbStored([f], rows);
  assert.equal(out.calls[0].provider, "fathom");
  assert.ok(out.notes.some((n) => n.text.startsWith("ambiguous match skipped: T3")));
  // And a listed Granola call between two same-title Fathom rows rekeys neither.
  const frows = [
    stored({ id: "f1", provider: "fathom", externalId: "1", title: "T4", metAt: "2026-11-10T10:00:00.000Z" }),
    stored({ id: "f2", provider: "fathom", externalId: "2", title: "T4", metAt: "2026-11-10T10:08:00.000Z" }),
  ];
  const g = { ...call({ externalId: "gx", title: "T4", metAt: "2026-11-10T10:04:00.000Z" }), altUrl: null };
  assert.equal(absorbStored([g], frows).rekeys.length, 0);
});

test("a fold never deletes the row holding the body when the kept row has none", () => {
  const rows = [
    stored({ id: "k", externalId: "not_x", title: "Ops", metAt: "2026-11-10T10:00:00.000Z", hasBody: false }),
    stored({ id: "u", externalId: UUID, title: "Ops", metAt: "2026-11-10T10:05:00.000Z", hasBody: true }),
    stored({ id: "g", externalId: "gq", altUrl: "https://fathom.video/calls/9", hasBody: false }),
    stored({ id: "f", provider: "fathom", externalId: "9", hasBody: true }),
  ];
  const out = seededPairs(rows);
  assert.deepEqual(out.folds, []);
  assert.equal(out.skipped.length, 2);
  assert.ok(out.skipped.every((x) => /the row to delete holds the body/.test(x)));
});

// ---------------------------------------------------------------- rescreen

const OLD_CUTS = [{ from: 0, to: 1, reason: "personnel" as const }];
const OLD_BODY = turnsToBody(applyCuts(TURNS, OLD_CUTS));

function rescreenStore() {
  const store = new FakeStore();
  const r = store.seed({ provider: "granola", external_id: "g1", title: "World Emblem weekly", met_at: "2026-11-10T10:00:00.000Z", body: OLD_BODY, cuts: OLD_CUTS, status: "digested", summary: "digest" });
  store.links.push({ transcriptId: r.id, accountId: "a-we", source: "auto", headline: "WE headline" });
  return { store, r };
}
const listing = { granola: { calls: [call()], cursor: null, rateLimited: false, skipped: 0 } };
const TRIAL = { since: "2026-11-01T00:00:00.000Z", onlySlugs: ["world-emblem"], rescreen: true };

test("markerMinutes sums the minutes in cut markers", () => {
  assert.equal(markerMinutes("a\n[personnel section removed, 3 min]\nb\n[private details removed, 2 min]"), 5);
  assert.equal(markerMinutes(null), 0);
});

test("rescreen re-reads the call and replaces its body, cuts and status", async () => {
  const { store, r } = rescreenStore();
  const newCuts = [{ from: 2, to: 2, reason: "private" as const }];
  const { d, seen } = deps(store, { ...listing, screen: async () => ({ verdict: "cut", cuts: newCuts }) });
  const out = await runSyncWith(TRIAL, d);
  assert.deepEqual(seen.fetched, ["granola:g1"]);
  assert.equal(r.body, turnsToBody(applyCuts(TURNS, newCuts)));
  assert.deepEqual(r.cuts, newCuts);
  assert.equal(r.status, "pending");
  assert.deepEqual(out.rescreen, { rescreenBefore: NOW, rescreened: 1, cutsBefore: 1, cutsAfter: 1, minutesCutBefore: markerMinutes(OLD_BODY), minutesCutAfter: markerMinutes(String(r.body)), personnel: 0, errors: 0 });
  assert.ok(markerMinutes(OLD_BODY) > 0);
});

test("rescreen: a screen error keeps the stored body and cuts", async () => {
  const { store, r } = rescreenStore();
  const { d } = deps(store, { ...listing, screen: async () => ({ verdict: "error" }) });
  const out = await runSyncWith(TRIAL, d);
  assert.equal(r.body, OLD_BODY);
  assert.deepEqual(r.cuts, OLD_CUTS);
  assert.equal(r.status, "digested");
  assert.equal(out.rescreen!.errors, 1);
  assert.ok(out.log.some((l) => /screen error .*stored body kept/.test(l)));
});

test("rescreen: a personnel verdict makes a title-only row and blanks its headlines", async () => {
  const { store, r } = rescreenStore();
  const { d } = deps(store, { ...listing, screen: async () => ({ verdict: "personnel", cuts: [] }) });
  const out = await runSyncWith(TRIAL, d);
  assert.equal(r.status, "personnel");
  assert.equal(r.body, null);
  assert.equal(store.links[0].headline, "");
  assert.ok(store.chunkDeletes.includes(r.id));
  assert.equal(out.rescreen!.personnel, 1);
});

test("rescreen: manual overrides win over the screen", async () => {
  // personnel by hand: not screened at all
  let { store, r } = rescreenStore();
  store.overrides = [{ transcriptId: r.id, accountId: null, action: "personnel" }];
  let x = deps(store, listing);
  await runSyncWith(TRIAL, x.d);
  assert.deepEqual(x.seen.screened, []);
  assert.equal(r.status, "personnel");
  // not personnel by hand: a stored personnel row is screened, and a personnel verdict is not applied
  ({ store, r } = rescreenStore());
  Object.assign(r, { body: null, cuts: [], status: "personnel" });
  store.overrides = [{ transcriptId: r.id, accountId: null, action: "not_personnel" }];
  x = deps(store, { ...listing, screen: async () => ({ verdict: "personnel", cuts: [] }) });
  await runSyncWith(TRIAL, x.d);
  assert.deepEqual(x.seen.screened, ["granola:g1"]);
  assert.equal(r.status, "pending");
  assert.equal(r.body, turnsToBody(TURNS));
});

test("rescreen is refused without onlySlugs, and ordinary runs never rescreen", async () => {
  const { store, r } = rescreenStore();
  await assert.rejects(runSyncWith({ rescreen: true }, deps(store, listing).d), /rescreen needs onlySlugs/);
  const x = deps(store, listing);
  const out = await runSyncWith({ since: "2026-11-01T00:00:00.000Z", onlySlugs: ["world-emblem"] }, x.d);
  assert.deepEqual(x.seen.screened, []);
  assert.equal(r.body, OLD_BODY);
  assert.equal(out.rescreen, undefined);
});

// ---------------------------------------------------------------- rescreen fix round 1

const MIXED = [{ from: 0, to: 0, reason: "personnel" as const }, { from: 2, to: 2, reason: "private" as const }];

test("a second rescreen run passing rescreenBefore skips the calls already rescreened", async () => {
  const { store, r } = rescreenStore();
  r.pulled_at = "2026-11-01T00:00:00.000Z";
  const first = await runSyncWith(TRIAL, deps(store, { ...listing, screen: async () => ({ verdict: "clean", cuts: [] }) }).d);
  assert.equal(first.rescreen!.rescreenBefore, NOW);
  assert.equal(r.pulled_at, NOW);
  const x = deps(store, { ...listing, clock: () => NOW_MS + 60_000 });
  const second = await runSyncWith({ ...TRIAL, rescreenBefore: first.rescreen!.rescreenBefore }, x.d);
  assert.deepEqual(x.seen.screened, []);
  assert.equal(second.rescreen!.rescreened, 0);
  assert.equal(second.rescreen!.rescreenBefore, NOW);
});

test("rescreened personnel rows are stamped too", async () => {
  const { store, r } = rescreenStore();
  await runSyncWith(TRIAL, deps(store, { ...listing, screen: async () => ({ verdict: "personnel", cuts: [] }) }).d);
  assert.equal(r.status, "personnel");
  assert.equal(r.pulled_at, NOW);
});

test("a 429 mid-rescreen keeps the stored bodies and reports more", async () => {
  const store = new FakeStore();
  const a = store.seed({ provider: "granola", external_id: "g1", title: "World Emblem weekly", met_at: "2026-11-10T10:00:00.000Z", body: OLD_BODY, cuts: OLD_CUTS, status: "digested" });
  const b = store.seed({ provider: "granola", external_id: "g2", title: "World Emblem two", met_at: "2026-11-11T10:00:00.000Z", body: "kept b", status: "digested" });
  const { RateLimitedError } = await import("../lib/memory/sources/shared.ts");
  const { d, seen } = deps(store, {
    granola: { calls: [call(), call({ externalId: "g2", title: "World Emblem two", metAt: "2026-11-11T10:00:00.000Z", url: "u2" })], cursor: null, rateLimited: false, skipped: 0 },
    transcript: async () => { throw new RateLimitedError("Granola"); },
  });
  const out = await runSyncWith(TRIAL, d);
  assert.equal(seen.fetched.length, 1);
  assert.equal(a.body, OLD_BODY);
  assert.equal(b.body, "kept b");
  assert.equal(out.more, true);
  assert.equal(out.rateLimited, true);
  assert.equal(out.rescreen!.rescreened, 0);
});

test("applyNotPersonnel keeps only private-detail cuts and drops a personnel verdict", () => {
  assert.deepEqual(applyNotPersonnel({ verdict: "cut", cuts: MIXED }), { verdict: "cut", cuts: [MIXED[1]] });
  assert.deepEqual(applyNotPersonnel({ verdict: "cut", cuts: [MIXED[0]] }), { verdict: "clean", cuts: [] });
  assert.deepEqual(applyNotPersonnel({ verdict: "personnel", cuts: [] }), { verdict: "clean", cuts: [] });
  assert.deepEqual(applyNotPersonnel({ verdict: "error" }), { verdict: "error" });
});

test("not_personnel override, first screen: personnel cuts dropped, private cuts kept", async () => {
  const store = new FakeStore();
  const r = store.seed({ provider: "granola", external_id: "g1", title: "World Emblem weekly", met_at: "2026-11-10T10:00:00.000Z" });
  store.overrides = [{ transcriptId: r.id, accountId: null, action: "not_personnel" }];
  await runSyncWith({ since: "2026-11-01T00:00:00.000Z" }, deps(store, { ...listing, screen: async () => ({ verdict: "cut", cuts: MIXED }) }).d);
  assert.deepEqual(r.cuts, [MIXED[1]]);
  assert.equal(r.body, turnsToBody(applyCuts(TURNS, [MIXED[1]])));
});

test("not_personnel override, rescreen: personnel cuts dropped, private cuts kept", async () => {
  const { store, r } = rescreenStore();
  store.overrides = [{ transcriptId: r.id, accountId: null, action: "not_personnel" }];
  const out = await runSyncWith(TRIAL, deps(store, { ...listing, screen: async () => ({ verdict: "cut", cuts: MIXED }) }).d);
  assert.deepEqual(r.cuts, [MIXED[1]]);
  assert.equal(out.rescreen!.cutsAfter, 1);
});

test("a released personnel call that errors on rescreen is screened once and counted once", async () => {
  const { store, r } = rescreenStore();
  Object.assign(r, { body: null, cuts: [], status: "personnel" });
  store.overrides = [{ transcriptId: r.id, accountId: null, action: "not_personnel" }];
  const x = deps(store, { ...listing, screen: async () => ({ verdict: "error" }) });
  const out = await runSyncWith(TRIAL, x.d);
  assert.equal(x.seen.screened.length, 1);
  assert.equal(out.rescreen!.errors, 1);
  assert.equal(r.body, null);
});

test("a personnel row that rescreens clean gets its source summary and its mention checks", async () => {
  const { store, r } = rescreenStore();
  Object.assign(r, { body: null, cuts: [], status: "personnel", summary: "" });
  const x = deps(store, {
    granola: { calls: [call({ sourceSummary: "Breakr in depth" })], cursor: null, rateLimited: false, skipped: 0 },
    screen: async () => ({ verdict: "clean", cuts: [] }),
  });
  await runSyncWith({ ...TRIAL, onlySlugs: ["world-emblem", "breakr"] }, x.d);
  assert.equal(r.status, "pending");
  assert.equal(r.summary, "Breakr in depth");
  assert.deepEqual(x.seen.mentions, ["World Emblem weekly"]);
});

test("rescreen counts: an error carries the unchanged cuts into the after totals", async () => {
  const { store } = rescreenStore();
  const out = await runSyncWith(TRIAL, deps(store, { ...listing, screen: async () => ({ verdict: "error" }) }).d);
  assert.equal(out.rescreen!.cutsAfter, out.rescreen!.cutsBefore);
  assert.equal(out.rescreen!.minutesCutAfter, out.rescreen!.minutesCutBefore);
});

test("a rescreen that yields the same body leaves the status alone", async () => {
  const { store, r } = rescreenStore();
  await runSyncWith(TRIAL, deps(store, { ...listing, screen: async () => ({ verdict: "cut", cuts: OLD_CUTS }) }).d);
  assert.equal(r.body, OLD_BODY);
  assert.equal(r.status, "digested");
  assert.equal(r.pulled_at, NOW);
});
