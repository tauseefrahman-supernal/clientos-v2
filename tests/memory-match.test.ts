import { test } from "node:test";
import assert from "node:assert/strict";
import { mergeDuplicates, matchCall } from "../lib/memory/match.ts";
import type { SourceCall } from "../lib/memory/types.ts";

function call(over: Partial<SourceCall>): SourceCall {
  return {
    provider: "fathom", externalId: "x1", title: "Untitled", metAt: "2026-11-17T15:00:00Z",
    participants: [], url: "https://example.com/x1", sourceSummary: "", turns: null, ...over,
  };
}

test("a Granola and a Fathom call of the same meeting merge, keeping Granola", () => {
  const g = call({ provider: "granola", externalId: "g1", title: "Breakr x Supernal", metAt: "2026-11-17T15:00:00Z", url: "https://granola/g1" });
  const f = call({ provider: "fathom", externalId: "f1", title: "Breakr x Supernal", metAt: "2026-11-17T15:03:00Z", url: "https://fathom/f1" });
  const out = mergeDuplicates([f, g]);
  assert.equal(out.length, 1);
  assert.equal(out[0].provider, "granola");
  assert.equal(out[0].altUrl, "https://fathom/f1");
});

test("two Fathom recordings by different recorders merge deterministically", () => {
  const a = call({ externalId: "b", title: "Breakr x Supernal", url: "https://fathom/b" });
  const b = call({ externalId: "a", title: "Breakr x Supernal", metAt: "2026-11-17T15:01:00Z", url: "https://fathom/a" });
  const out = mergeDuplicates([a, b]);
  assert.equal(out.length, 1);
  assert.equal(out[0].externalId, "a");
  assert.equal(out[0].altUrl, "https://fathom/b");
  assert.deepEqual(mergeDuplicates([b, a])[0].externalId, "a");
});

test("daily standups on different days do not merge", () => {
  const a = call({ externalId: "a", title: "Daily standup", metAt: "2026-11-16T09:00:00Z" });
  const b = call({ externalId: "b", title: "Daily standup", metAt: "2026-11-17T09:00:00Z" });
  const out = mergeDuplicates([a, b]);
  assert.equal(out.length, 2);
  assert.ok(out.every((c) => c.altUrl === null));
});

test("different titles merge on shared participants; participants are unioned", () => {
  const p = (e: string) => ({ name: e, email: e });
  const a = call({ provider: "granola", externalId: "g", title: "Sync", participants: [p("a@x.com"), p("b@x.com")] });
  const b = call({ externalId: "f", title: "Call with Bob", metAt: "2026-11-17T15:05:00Z", participants: [p("A@x.com"), p("b@x.com"), p("c@x.com")] });
  const out = mergeDuplicates([a, b]);
  assert.equal(out.length, 1);
  assert.deepEqual(out[0].participants.map((x) => x.email).sort(), ["a@x.com", "b@x.com", "c@x.com"]);
});

const rules = new Map([
  ["world-emblem", { keywords: ["world emblem"], emails: [], domains: ["worldemblem.com"] }],
  ["rxvip", { keywords: ["rxvip", "rx"], emails: ["pat@rxvip.io"], domains: [] }],
]);

test("a participant on a matching domain is a strong match", () => {
  const c = call({ title: "Catch up", participants: [{ name: "E", email: "Elena@Eu.WorldEmblem.com" }] });
  assert.deepEqual(matchCall(c, rules), [{ slug: "world-emblem", strength: "strong" }]);
});

test("a keyword only in the summary is a mention", () => {
  const c = call({ title: "Weekly Pipeline Meeting", sourceSummary: "We discussed RxVIP onboarding once." });
  assert.deepEqual(matchCall(c, rules), [{ slug: "rxvip", strength: "mention" }]);
});

test("keywords match on word boundaries and in titles are strong", () => {
  assert.deepEqual(matchCall(call({ title: "Prescription review", sourceSummary: "x" }), rules), []);
  assert.deepEqual(matchCall(call({ title: "RX weekly" }), rules), [{ slug: "rxvip", strength: "strong" }]);
});

test("a call matching nothing returns []", () => {
  assert.deepEqual(matchCall(call({ title: "Lunch" }), rules), []);
});

const pp = (e: string) => ({ name: e.split("@")[0], email: e });

test("a solo-recorder call does not merge with an unrelated call that includes the recorder", () => {
  const a = call({ externalId: "a", title: "Quick note", participants: [pp("me@s.com")] });
  const b = call({ externalId: "b", title: "Client review", metAt: "2026-11-17T15:05:00Z", participants: [pp("me@s.com"), pp("x@c.com"), pp("y@c.com")] });
  assert.equal(mergeDuplicates([a, b]).length, 2);
});

test("one shared email cannot bridge two distinct meetings into one group", () => {
  const a = call({ externalId: "a", title: "Alpha planning", metAt: "2026-11-17T15:00:00Z", participants: [pp("a1@x.com"), pp("a2@x.com"), pp("shared1@x.com")] });
  const b = call({ externalId: "b", title: "Bridge", metAt: "2026-11-17T15:06:00Z", participants: [pp("shared1@x.com"), pp("shared2@x.com")] });
  const c = call({ externalId: "c", title: "Gamma review", metAt: "2026-11-17T15:12:00Z", participants: [pp("c1@x.com"), pp("c2@x.com"), pp("shared2@x.com")] });
  assert.equal(mergeDuplicates([a, b, c]).length, 3);
});

test("same title more than 10 minutes apart does not merge", () => {
  const a = call({ externalId: "a", title: "Breakr x Supernal" });
  const b = call({ externalId: "b", title: "Breakr x Supernal", metAt: "2026-11-17T15:11:00Z" });
  assert.equal(mergeDuplicates([a, b]).length, 2);
});

test("containment merges; short titles do not merge by containment", () => {
  const a = call({ externalId: "a", title: "Breakr x Supernal" });
  const b = call({ externalId: "b", title: "Breakr x Supernal weekly", metAt: "2026-11-17T15:02:00Z" });
  assert.equal(mergeDuplicates([a, b]).length, 1);
  const c = call({ externalId: "c", title: "Sync" });
  const d = call({ externalId: "d", title: "Sync with Acme", metAt: "2026-11-17T15:02:00Z" });
  assert.equal(mergeDuplicates([c, d]).length, 2);
});

test("a 3-copy group merges into one", () => {
  const mk = (id: string, t: string) => call({ externalId: id, title: "Breakr x Supernal", metAt: t, url: `https://u/${id}` });
  const out = mergeDuplicates([mk("c", "2026-11-17T15:04:00Z"), mk("a", "2026-11-17T15:00:00Z"), mk("b", "2026-11-17T15:02:00Z")]);
  assert.equal(out.length, 1);
  assert.equal(out[0].externalId, "a");
});

test("kept copy borrows missing turns and summary; no-email duplicates of named people are dropped", () => {
  const turns = [{ speaker: "A", start: 0, text: "hi" }];
  const g = call({ provider: "granola", externalId: "g", title: "Breakr x Supernal", sourceSummary: "", turns: null, participants: [{ name: "Ann", email: null }, { name: "Bob", email: null }] });
  const f = call({ externalId: "f", title: "Breakr x Supernal", sourceSummary: "Summary", turns, participants: [{ name: "ann", email: "ann@x.com" }] });
  const [m] = mergeDuplicates([g, f]);
  assert.equal(m.sourceSummary, "Summary");
  assert.equal(m.turns, turns);
  assert.deepEqual(m.participants.map((p) => p.name), ["ann", "Bob"]);
  const g2 = call({ provider: "granola", externalId: "g2", title: "Breakr x Supernal", sourceSummary: "Own", turns: [{ speaker: "Z", start: null, text: "own" }] });
  const [m2] = mergeDuplicates([g2, f]);
  assert.equal(m2.sourceSummary, "Own");
  assert.equal(m2.turns![0].speaker, "Z");
});

test("rule emails are strong, lookalike domains do not match, empty inputs return []", () => {
  assert.deepEqual(matchCall(call({ participants: [{ name: "P", email: "PAT@rxvip.io" }] }), rules), [{ slug: "rxvip", strength: "strong" }]);
  assert.deepEqual(matchCall(call({ participants: [{ name: "N", email: "n@notworldemblem.com" }] }), rules), []);
  assert.deepEqual(matchCall(call({ title: "RX weekly" }), new Map()), []);
  assert.deepEqual(matchCall(call({ title: "Lunch", sourceSummary: "" }), rules), []);
});
