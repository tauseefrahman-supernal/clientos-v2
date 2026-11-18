import { test } from "node:test";
import assert from "node:assert/strict";
import {
  InvalidRequest, goneList, httpUrl, parseGone, parseOverride, parseRule, rulesByProject, screenedList, splitMarkers, syncStatus,
  transcriptGate, turnsForPanel, unassignedList,
} from "../lib/memory/admin-rules.ts";
import { reFetchNotPersonnel, type NotPersonnelDeps } from "../lib/memory/override-core.ts";

const ID = "0b8f3c2e-1d4a-4c5b-9e6f-7a8b9c0d1e2f";
const NOW = new Date("2026-11-18T12:00:00Z");

// ---------------------------------------------------------------- request validation

test("an override needs a call id and a known kind (in override, since action names the route action); assign and unassign need a project", () => {
  assert.throws(() => parseOverride({ action: "assign", transcriptId: ID, slug: "rxvip" }), InvalidRequest);
  assert.deepEqual(parseOverride({ action: "override", transcriptId: ID, slug: " rxvip ", override: "assign" }), { transcriptId: ID, slug: "rxvip", action: "assign" });
  assert.deepEqual(parseOverride({ action: "override", transcriptId: ID, override: "personnel", slug: "rxvip" }), { transcriptId: ID, slug: null, action: "personnel" });
  assert.throws(() => parseOverride({ action: "override", transcriptId: "nope", override: "personnel" }), InvalidRequest);
  assert.throws(() => parseOverride({ action: "override", transcriptId: ID, override: "delete" }), InvalidRequest);
  assert.throws(() => parseOverride({ action: "override", transcriptId: ID, override: "unassign" }), InvalidRequest);
  assert.throws(() => parseOverride({ action: "override", transcriptId: ID, override: "assign", slug: "  " }), InvalidRequest);
});

test("gone takes a call id and keep as true or false", () => {
  assert.deepEqual(parseGone({ transcriptId: ID, keep: false }), { transcriptId: ID, keep: false });
  assert.deepEqual(parseGone({ transcriptId: ID, keep: true }), { transcriptId: ID, keep: true });
  assert.throws(() => parseGone({ transcriptId: ID }), InvalidRequest);
  assert.throws(() => parseGone({ transcriptId: ID, keep: "yes" }), InvalidRequest);
});

test("a match rule is tidied by kind and refused when it is not one", () => {
  assert.deepEqual(parseRule({ slug: "rxvip", kind: "keyword", value: "  Cycle   Fill " }), { slug: "rxvip", kind: "keyword", value: "Cycle Fill", remove: false });
  assert.deepEqual(parseRule({ slug: "rxvip", kind: "email", value: " Randy@RxVIP.com " }), { slug: "rxvip", kind: "email", value: "randy@rxvip.com", remove: false });
  assert.deepEqual(parseRule({ slug: "rxvip", kind: "domain", value: "https://www.RxVIP.com/" , remove: true }), { slug: "rxvip", kind: "domain", value: "rxvip.com", remove: true });
  assert.deepEqual(parseRule({ slug: "rxvip", kind: "domain", value: "@rxvip.com" }).value, "rxvip.com");
  assert.throws(() => parseRule({ slug: "rxvip", kind: "email", value: "randy" }), InvalidRequest);
  assert.throws(() => parseRule({ slug: "rxvip", kind: "domain", value: "localhost" }), InvalidRequest);
  assert.throws(() => parseRule({ slug: "rxvip", kind: "keyword", value: "x" }), InvalidRequest);
  assert.throws(() => parseRule({ slug: "rxvip", kind: "speaker", value: "Randy" }), InvalidRequest);
  assert.throws(() => parseRule({ kind: "keyword", value: "pricing" }), InvalidRequest);
});

// ---------------------------------------------------------------- the transcript panel

test("a transcript opens only for someone who can see one of its projects, never for a personnel call or one gone over 14 days", () => {
  const call = { status: "digested", goneAt: null };
  assert.equal(transcriptGate(call, true, NOW), 200);
  assert.equal(transcriptGate(call, false, NOW), 404);
  assert.equal(transcriptGate(null, true, NOW), 404);
  assert.equal(transcriptGate({ status: "personnel", goneAt: null }, true, NOW), 404);
  assert.equal(transcriptGate({ status: "pending", goneAt: "2026-11-10T00:00:00Z" }, true, NOW), 200);
  assert.equal(transcriptGate({ status: "pending", goneAt: "2026-10-01T00:00:00Z" }, true, NOW), 404);
});

test("cut markers split out of a line so the panel can style them as removed for privacy", () => {
  assert.deepEqual(splitMarkers("plain words"), [{ removed: false, text: "plain words" }]);
  assert.deepEqual(splitMarkers("[personnel section removed, 4 min]"), [{ removed: true, reason: "personnel", minutes: 4 }]);
  assert.deepEqual(splitMarkers("before [private details removed, 1 min] after"), [
    { removed: false, text: "before " }, { removed: true, reason: "private", minutes: 1 }, { removed: false, text: " after" },
  ]);
  // Look-alikes the screen never writes stay text.
  assert.deepEqual(splitMarkers("[secret removed, 3 min]"), [{ removed: false, text: "[secret removed, 3 min]" }]);
});

test("a stored body becomes panel turns with markers split out and no HTML interpreted", () => {
  const body = "[00:00:05] Randy: Hello <b>there</b>\n[00:01:00] [personnel section removed, 2 min]\nAsha: Next";
  const turns = turnsForPanel(body);
  assert.equal(turns.length, 3);
  assert.deepEqual(turns[0], { speaker: "Randy", start: 5, segments: [{ removed: false, text: "Hello <b>there</b>" }] });
  assert.deepEqual(turns[1].segments, [{ removed: true, reason: "personnel", minutes: 2 }]);
  assert.equal(turns[1].speaker, "");
  assert.equal(turns[2].start, null);
  assert.deepEqual(turnsForPanel(null), []);
});

// ---------------------------------------------------------------- admin lists

test("screened calls: personnel calls, calls with cuts and calls overridden by hand, newest first, with cut counts", () => {
  const rows = [
    { id: "a", title: "Old cut", met_at: "2026-10-01T00:00:00Z", provider: "granola", status: "digested", cuts: [{ from: 1, to: 2, reason: "personnel" }, { from: 5, to: 5, reason: "private" }] },
    { id: "b", title: "Review", met_at: "2026-11-01T00:00:00Z", provider: "fathom", status: "personnel", cuts: [] },
    { id: "c", title: "Clean", met_at: "2026-11-02T00:00:00Z", provider: "fathom", status: "digested", cuts: [] },
    { id: "d", title: "Released", met_at: "2026-09-01T00:00:00Z", provider: "granola", status: "pending", cuts: [] },
  ];
  const overrides = [
    { transcript_id: "d", action: "personnel", at: "2026-11-10T00:00:00Z" },
    { transcript_id: "d", action: "not_personnel", at: "2026-11-11T00:00:00Z" },
    { transcript_id: "a", action: "assign", at: "2026-11-11T00:00:00Z" },
  ];
  const list = screenedList(rows, overrides);
  assert.deepEqual(list.map((x) => x.id), ["b", "a", "d"]);
  assert.deepEqual(list[0], { id: "b", title: "Review", date: "2026-11-01T00:00:00Z", provider: "fathom", personnel: true, personnelCuts: 0, privateCuts: 0, byHand: null });
  assert.equal(list[1].personnelCuts, 1);
  assert.equal(list[1].privateCuts, 1);
  assert.equal(list[1].byHand, null);
  assert.equal(list[2].byHand, "not_personnel");
});

test("gone calls say how long they have been gone and whether search has hidden them", () => {
  const list = goneList([
    { id: "a", title: "A", met_at: "2026-01-01T00:00:00Z", provider: "fathom", gone_at: "2026-11-15T00:00:00Z" },
    { id: "b", title: "B", met_at: null, provider: "granola", gone_at: "2026-10-01T00:00:00Z" },
    { id: "c", title: "C", met_at: null, provider: "granola", gone_at: null },
  ], NOW);
  assert.deepEqual(list.map((x) => [x.id, x.days, x.hidden]), [["b", 48, true], ["a", 3, false]]);
});

test("unassigned calls are those with no project link, personnel calls left out, newest first", () => {
  const list = unassignedList([
    { id: "a", title: "A", met_at: "2026-11-01T00:00:00Z", provider: "fathom", status: "pending" },
    { id: "b", title: "B", met_at: "2026-11-03T00:00:00Z", provider: "granola", status: "digested" },
    { id: "c", title: "C", met_at: "2026-11-04T00:00:00Z", provider: "granola", status: "personnel" },
    { id: "d", title: "D", met_at: "2026-11-05T00:00:00Z", provider: "granola", status: "pending" },
  ], new Set(["d"]));
  assert.deepEqual(list.map((x) => x.id), ["b", "a"]);
});

test("match rules group under every project, by name, keywords first", () => {
  const groups = rulesByProject(
    [{ account_id: "1", kind: "email", value: "r@rx.com", source: "manual" }, { account_id: "1", kind: "keyword", value: "RxVIP", source: "seed" }],
    [{ id: "1", slug: "rxvip", name: "RxVIP" }, { id: "2", slug: "breakr", name: "Breakr" }],
  );
  assert.deepEqual(groups.map((g) => g.slug), ["breakr", "rxvip"]);
  assert.deepEqual(groups[1].rules.map((r) => r.kind), ["keyword", "email"]);
  assert.deepEqual(groups[0].rules, []);
});

test("sync status lists both providers, with or without a saved run", () => {
  const s = syncStatus([{ provider: "fathom", last_run_at: "2026-11-18T10:00:00Z", last_error: "HTTP 500", cursor: "abc" }]);
  assert.deepEqual(s, [
    { provider: "granola", label: "Granola", lastRunAt: null, lastError: null, more: false },
    { provider: "fathom", label: "Fathom", lastRunAt: "2026-11-18T10:00:00Z", lastError: "HTTP 500", more: true },
  ]);
});

// ---------------------------------------------------------------- not personnel: fetch again and screen

const turns = [
  { speaker: "Randy", start: 0, text: "Pricing is fine." },
  { speaker: "Asha", start: 60, text: "Dave is underperforming." },
  { speaker: "Randy", start: 120, text: "The client's estate is worth 4m." },
];
const fakeDeps = (over: Partial<NotPersonnelDeps> = {}) => {
  const calls: string[] = [];
  const deps: NotPersonnelDeps = {
    fetchTranscript: async (provider, id) => { calls.push(`fetch:${provider}:${id}`); return { status: "ready", turns }; },
    listFathom: async (since) => { calls.push(`list:${since}`); return { calls: [], cursor: null, rateLimited: false, skipped: 0 }; },
    screen: async () => { calls.push("screen"); return { verdict: "cut", cuts: [{ from: 1, to: 1, reason: "personnel" }, { from: 2, to: 2, reason: "private" }] }; },
    now: () => "2026-11-18T12:00:00.000Z",
    ...over,
  };
  return { calls, deps };
};
const row = (o: Partial<Parameters<typeof reFetchNotPersonnel>[0]> = {}) => ({ provider: "granola", externalId: "not_1", title: "Weekly", metAt: "2026-11-10T15:00:00Z", participants: [], url: "", sourceSummary: "", ...o });

test("not personnel on a Granola call fetches it again, keeps only private-detail cuts and queues it as pending", async () => {
  const { calls, deps } = fakeDeps();
  const out = await reFetchNotPersonnel(row(), deps);
  assert.deepEqual(calls, ["fetch:granola:not_1", "screen"]);
  assert.equal(out.kind, "stored");
  if (out.kind !== "stored") return;
  assert.equal(out.patch.status, "pending");
  assert.deepEqual(out.patch.cuts, [{ from: 2, to: 2, reason: "private" }]);
  assert.match(String(out.patch.body), /Dave is underperforming/);
  assert.match(String(out.patch.body), /\[private details removed, 1 min\]/);
  assert.doesNotMatch(String(out.patch.body), /estate/);
  assert.deepEqual(out.patch.speakers, ["Randy", "Asha"]);
  assert.equal(out.patch.pulled_at, "2026-11-18T12:00:00.000Z");
});

test("a Fathom row with a recording id fetches by it; one without lists Fathom from the day before and finds it", async () => {
  const a = fakeDeps();
  await reFetchNotPersonnel(row({ provider: "fathom", externalId: "rec:99" }), a.deps);
  assert.deepEqual(a.calls.slice(0, 1), ["fetch:fathom:99"]);

  const listed = { provider: "fathom" as const, externalId: "123", fetchId: "77", title: "Weekly", metAt: "2026-11-10T15:00:00Z", participants: [], url: "", sourceSummary: "Talked pricing", turns: null };
  const b = fakeDeps({ listFathom: async (since) => { b.calls.push(`list:${since}`); return { calls: [listed], cursor: null, rateLimited: false, skipped: 0 }; } });
  const out = await reFetchNotPersonnel(row({ provider: "fathom", externalId: "123" }), b.deps);
  assert.deepEqual(b.calls, ["list:2026-11-09T15:00:00.000Z", "fetch:fathom:77", "screen"]);
  assert.equal(out.kind, "stored");

  const c = fakeDeps({ listFathom: async () => ({ calls: [{ ...listed, turns }], cursor: null, rateLimited: false, skipped: 0 }) });
  await reFetchNotPersonnel(row({ provider: "fathom", externalId: "123" }), c.deps);
  assert.deepEqual(c.calls, ["screen"]);
});

test("when the source can't be reached or the screen fails, nothing is stored and the reason is plain", async () => {
  const gone = await reFetchNotPersonnel(row(), fakeDeps({ fetchTranscript: async () => ({ status: "gone" }) }).deps);
  assert.equal(gone.kind, "later");
  const thrown = await reFetchNotPersonnel(row(), fakeDeps({ fetchTranscript: async () => { throw new Error("HTTP 500"); } }).deps);
  assert.equal(thrown.kind, "later");
  const missing = await reFetchNotPersonnel(row({ provider: "fathom", externalId: "123" }), fakeDeps().deps);
  assert.equal(missing.kind, "later");
  const noDate = await reFetchNotPersonnel(row({ provider: "fathom", externalId: "123", metAt: null }), fakeDeps().deps);
  assert.equal(noDate.kind, "later");
  const upload = await reFetchNotPersonnel(row({ provider: "upload" }), fakeDeps().deps);
  assert.equal(upload.kind, "later");
  const err = await reFetchNotPersonnel(row(), fakeDeps({ screen: async () => ({ verdict: "error" }) }).deps);
  assert.equal(err.kind, "later");
  if (err.kind === "later") assert.match(err.reason, /screen/);
});

test("a whole-call personnel verdict under a not-personnel override stores the full body", async () => {
  const out = await reFetchNotPersonnel(row(), fakeDeps({ screen: async () => ({ verdict: "personnel", cuts: [] }) }).deps);
  assert.equal(out.kind, "stored");
  if (out.kind === "stored") { assert.deepEqual(out.patch.cuts, []); assert.match(String(out.patch.body), /estate/); }
});

test("provider links render only for http and https URLs", () => {
  assert.equal(httpUrl("https://fathom.video/calls/1"), "https://fathom.video/calls/1");
  assert.equal(httpUrl(" http://notes.granola.ai/d/x "), "http://notes.granola.ai/d/x");
  assert.equal(httpUrl("javascript:alert(1)"), null);
  assert.equal(httpUrl("JaVaScRiPt:alert(1)"), null);
  assert.equal(httpUrl("data:text/html,hi"), null);
  assert.equal(httpUrl("//evil.example"), null);
  assert.equal(httpUrl(""), null);
  assert.equal(httpUrl(undefined), null);
});

test("a recording shows only its project's headline; the call summary rides along only for a digested call", async () => {
  const { recordingText } = await import("../lib/memory/index-rules.ts");
  assert.deepEqual(recordingText("RxVIP part: pricing agreed", { status: "digested", summary: "Line one\nLine two" }), { headline: "RxVIP part: pricing agreed", summary: "Line one\nLine two" });
  // Undigested: the stored summary may be a source one-liner or another project's seeded line; never sent.
  assert.deepEqual(recordingText("Pricing call", { status: "pending", summary: "Squad review with another project's section" }), { headline: "Pricing call", summary: "" });
  assert.deepEqual(recordingText("", { status: "failed", summary: "x" }), { headline: "", summary: "" });
  assert.deepEqual(recordingText(null, { status: "digested", summary: "  " }), { headline: "", summary: "" });
  assert.deepEqual(recordingText("H", { status: "digested", summary: null }), { headline: "H", summary: "" });
});
