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
