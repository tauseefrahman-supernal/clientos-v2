import { test } from "node:test";
import assert from "node:assert/strict";
import { planSync, type PlanInput } from "../lib/memory/plan-sync.ts";

type Incoming = PlanInput["incoming"][number];

const NOW = "2026-11-18T12:00:00.000Z";
const DAY = 24 * 60 * 60 * 1000;
const daysAgo = (d: number) => new Date(Date.parse(NOW) - d * DAY).toISOString();

function inc(over: Partial<Incoming> = {}): Incoming {
  return {
    provider: "granola", externalId: "c1", title: "Weekly", metAt: "2026-11-17T15:00:00Z",
    participants: [], url: "https://granola/c1", sourceSummary: "", altUrl: null,
    turns: [{ speaker: "A", start: 0, text: "hi" }], matches: [], ...over,
  };
}

function plan(over: Partial<PlanInput> = {}) {
  return planSync({ incoming: [], existing: [], overrides: [], listedInFull: true, now: NOW, ...over });
}

test("a manual unassign override beats an automatic match", () => {
  const out = plan({
    incoming: [inc({ matches: [{ slug: "breakr", strength: "strong" }, { slug: "world-emblem", strength: "strong" }] })],
    overrides: [{ externalKey: "granola:c1", slug: "breakr", action: "unassign" }],
  });
  assert.deepEqual(out.links, [{ externalKey: "granola:c1", slug: "world-emblem", source: "auto" }]);
});

test("a manual assign adds a link the matcher did not find", () => {
  const out = plan({
    incoming: [inc()],
    overrides: [{ externalKey: "granola:c1", slug: "rxvip", action: "assign" }],
  });
  assert.deepEqual(out.links, [{ externalKey: "granola:c1", slug: "rxvip", source: "manual" }]);
});

test("an assign override for a call not in this run still links", () => {
  const out = plan({ overrides: [{ externalKey: "fathom:9", slug: "rxvip", action: "assign" }] });
  assert.deepEqual(out.links, [{ externalKey: "fathom:9", slug: "rxvip", source: "manual" }]);
});

test("an existing call absent from a full listing is marked gone with now", () => {
  const out = plan({ existing: [{ provider: "fathom", externalId: "f1", goneAt: null, status: "digested" }] });
  assert.deepEqual(out.markGone, ["fathom:f1"]);
  assert.equal(out.goneAt, NOW);
});

test("a call gone for 15 days is hidden, one gone for 13 days is not", () => {
  const out = plan({
    existing: [
      { provider: "fathom", externalId: "old", goneAt: daysAgo(15), status: "digested" },
      { provider: "fathom", externalId: "new", goneAt: daysAgo(13), status: "digested" },
    ],
  });
  assert.deepEqual(out.hide, ["fathom:old"]);
  assert.deepEqual(out.markGone, [], "already-gone calls are not marked again");
});

test("hide boundary: exactly 14 days is not yet hidden, a minute past is", () => {
  const out = plan({
    existing: [
      { provider: "fathom", externalId: "edge", goneAt: daysAgo(14), status: "digested" },
      { provider: "fathom", externalId: "past", goneAt: new Date(Date.parse(daysAgo(14)) - 60_000).toISOString(), status: "digested" },
    ],
  });
  assert.deepEqual(out.hide, ["fathom:past"]);
});

test("a gone call that reappears is un-gone and not hidden", () => {
  const out = plan({
    incoming: [inc()],
    existing: [{ provider: "granola", externalId: "c1", goneAt: daysAgo(20), status: "digested" }],
  });
  assert.deepEqual(out.unGone, ["granola:c1"]);
  assert.deepEqual(out.hide, []);
});

test("an absent call is never marked gone when the listing was not full", () => {
  const out = plan({
    listedInFull: false,
    existing: [{ provider: "fathom", externalId: "f1", goneAt: null, status: "digested" }],
  });
  assert.deepEqual(out.markGone, []);
});

test("a call with no turns yet is upserted as pending", () => {
  const out = plan({ incoming: [inc({ turns: null })] });
  assert.equal(out.upserts.length, 1);
  assert.equal(out.upserts[0].status, "pending");
  assert.equal(out.upserts[0].isNew, true);
  assert.equal(out.upserts[0].externalKey, "granola:c1");
});

test("a personnel override keeps the row and drops any body", () => {
  const out = plan({
    incoming: [inc()],
    existing: [{ provider: "granola", externalId: "c1", goneAt: null, status: "digested" }],
    overrides: [{ externalKey: "granola:c1", slug: null, action: "personnel" }],
  });
  assert.equal(out.upserts.length, 1);
  assert.equal(out.upserts[0].status, "personnel");
  assert.equal(out.upserts[0].dropBody, true);
  assert.equal(out.upserts[0].turns, null);
  assert.equal(out.upserts[0].sourceSummary, "");
  assert.deepEqual(out.dropBodies, ["granola:c1"]);
  assert.deepEqual(out.markGone, []);
});

test("a personnel override on a new call carries no turns or summary", () => {
  const out = plan({
    incoming: [inc({ sourceSummary: "salary talk" })],
    overrides: [{ externalKey: "granola:c1", slug: null, action: "personnel" }],
  });
  const u = out.upserts[0];
  assert.equal(u.isNew, true);
  assert.equal(u.status, "personnel");
  assert.equal(u.dropBody, true);
  assert.equal(u.turns, null);
  assert.equal(u.sourceSummary, "");
  assert.deepEqual(out.dropBodies, [], "no stored row yet, so nothing to drop");
});

test("a stored personnel row that reappears stays personnel with no content", () => {
  const out = plan({
    incoming: [inc({ sourceSummary: "salary talk" })],
    existing: [{ provider: "granola", externalId: "c1", goneAt: null, status: "personnel" }],
  });
  const u = out.upserts[0];
  assert.equal(u.status, "personnel");
  assert.equal(u.dropBody, true);
  assert.equal(u.turns, null);
  assert.equal(u.sourceSummary, "");
  assert.deepEqual(out.dropBodies, ["granola:c1"]);
});

test("dropBodies covers stored calls absent from the listing", () => {
  const out = plan({
    listedInFull: false,
    existing: [
      { provider: "fathom", externalId: "b", goneAt: null, status: "personnel" },
      { provider: "fathom", externalId: "a", goneAt: null, status: "digested" },
      { provider: "fathom", externalId: "c", goneAt: null, status: "digested" },
      { provider: "fathom", externalId: "d", goneAt: null, status: "personnel" },
    ],
    overrides: [
      { externalKey: "fathom:a", slug: null, action: "personnel" },
      { externalKey: "fathom:d", slug: null, action: "not_personnel" },
      { externalKey: "fathom:zz", slug: null, action: "personnel" },
    ],
  });
  assert.deepEqual(out.dropBodies, ["fathom:a", "fathom:b"]);
  assert.deepEqual(out.upserts, []);
});

test("unlinks re-asserts every active unassign, listed or not", () => {
  const out = plan({
    incoming: [inc({ matches: [{ slug: "breakr", strength: "strong" }] })],
    overrides: [
      { externalKey: "granola:c1", slug: "breakr", action: "unassign" },
      { externalKey: "fathom:9", slug: "rxvip", action: "unassign" },
      { externalKey: "fathom:9", slug: "breakr", action: "unassign" },
      { externalKey: "fathom:8", slug: "rxvip", action: "unassign" },
      { externalKey: "fathom:8", slug: "rxvip", action: "assign" },
    ],
  });
  assert.deepEqual(out.unlinks, [
    { externalKey: "fathom:9", slug: "breakr" },
    { externalKey: "fathom:9", slug: "rxvip" },
    { externalKey: "granola:c1", slug: "breakr" },
  ]);
  assert.deepEqual(out.links, [{ externalKey: "fathom:8", slug: "rxvip", source: "manual" }]);
});

test("a now that is not a date throws", () => {
  assert.throws(() => plan({ now: "yesterday" }), /now is not a date/);
});

test("a not_personnel override on a personnel row sends it back to pending", () => {
  const out = plan({
    incoming: [inc()],
    existing: [{ provider: "granola", externalId: "c1", goneAt: null, status: "personnel" }],
    overrides: [
      { externalKey: "granola:c1", slug: null, action: "personnel" },
      { externalKey: "granola:c1", slug: null, action: "not_personnel" },
    ],
  });
  assert.equal(out.upserts[0].status, "pending");
  assert.equal(out.upserts[0].dropBody, false);
  assert.deepEqual(out.upserts[0].turns, [{ speaker: "A", start: 0, text: "hi" }]);
  assert.deepEqual(out.dropBodies, []);
});

test("mention matches go to mentions, not links", () => {
  const out = plan({
    incoming: [inc({ matches: [{ slug: "breakr", strength: "mention" }, { slug: "rxvip", strength: "strong" }] })],
  });
  assert.deepEqual(out.links, [{ externalKey: "granola:c1", slug: "rxvip", source: "auto" }]);
  assert.deepEqual(out.mentions, [{ externalKey: "granola:c1", slug: "breakr" }]);
});

test("an unassigned mention is dropped too", () => {
  const out = plan({
    incoming: [inc({ matches: [{ slug: "breakr", strength: "mention" }] })],
    overrides: [{ externalKey: "granola:c1", slug: "breakr", action: "unassign" }],
  });
  assert.deepEqual(out.mentions, []);
});

test("an existing digested call that reappears is kept, with metadata refreshed", () => {
  const out = plan({
    incoming: [inc({ title: "Renamed" })],
    existing: [{ provider: "granola", externalId: "c1", goneAt: null, status: "digested" }],
  });
  assert.equal(out.upserts[0].status, "keep");
  assert.equal(out.upserts[0].isNew, false);
  assert.equal(out.upserts[0].dropBody, false);
  assert.equal(out.upserts[0].title, "Renamed");
});

test("an existing pending call with turns arriving stays pending for screening", () => {
  const out = plan({
    incoming: [inc()],
    existing: [{ provider: "granola", externalId: "c1", goneAt: null, status: "pending" }],
  });
  assert.equal(out.upserts[0].status, "pending");
  assert.equal(out.upserts[0].isNew, false);
});

test("outputs are sorted regardless of input order", () => {
  const a = inc({ externalId: "b", matches: [{ slug: "z", strength: "strong" }, { slug: "a", strength: "strong" }] });
  const b = inc({ externalId: "a" });
  const out1 = plan({ incoming: [a, b] });
  const out2 = plan({ incoming: [b, a] });
  assert.deepEqual(out1, out2);
  assert.deepEqual(out1.upserts.map((u) => u.externalKey), ["granola:a", "granola:b"]);
  assert.deepEqual(out1.links.map((l) => l.slug), ["a", "z"]);
});
