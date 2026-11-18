import { test } from "node:test";
import assert from "node:assert/strict";
import {
  allotCalls, callDigest, callVisible, excerpt, formatHit, matchSuggestions, parseReadCall, parseSearchCalls,
  parseSearchContext, parseSearchExpertise, sourceIdFor, keepHit, finalTurnNote, MAX_TOOL_CALLS, contextManagement,
} from "../lib/stella/tool-rules.ts";
import type { SearchHit } from "../lib/memory/types.ts";

const isErr = (x: unknown): x is { error: string } => !!x && typeof x === "object" && "error" in x;

test("search_context input: query required, limit clamped, default 6", () => {
  assert.ok(isErr(parseSearchContext({})));
  assert.ok(isErr(parseSearchContext({ query: "   " })));
  assert.deepEqual(parseSearchContext({ query: " pricing " }), { query: "pricing", project: undefined, limit: 6 });
  assert.equal((parseSearchContext({ query: "x", limit: 99 }) as { limit: number }).limit, 12);
  assert.equal((parseSearchContext({ query: "x", limit: 0 }) as { limit: number }).limit, 1);
  assert.equal((parseSearchContext({ query: "x", project: "rxvip" }) as { project: string }).project, "rxvip");
});

test("search_calls input: depth must be summaries or transcripts; dates and speakers validated", () => {
  assert.ok(isErr(parseSearchCalls({ query: "x" })));
  assert.ok(isErr(parseSearchCalls({ query: "x", depth: "everything" })));
  const ok = parseSearchCalls({ query: "pricing", depth: "transcripts", since: "2026-11-01", until: "2026-11-18", speakers: ["Randy", 3, " "] });
  assert.ok(!isErr(ok));
  if (!isErr(ok)) {
    assert.equal(ok.depth, "transcripts");
    assert.equal(ok.since, "2026-11-01T00:00:00.000Z");
    assert.equal(ok.until, "2026-11-18T00:00:00.000Z");
    assert.deepEqual(ok.speakers, ["Randy"]);
    assert.equal(ok.limit, 6);
  }
  assert.ok(isErr(parseSearchCalls({ query: "x", depth: "summaries", since: "last week" })));
  assert.ok(isErr(parseSearchCalls({ query: "x", depth: "summaries", since: "2026-11-10", until: "2026-11-01" })));
});

test("read_call input: id required, call: prefix accepted, full only when true", () => {
  assert.ok(isErr(parseReadCall({})));
  assert.ok(isErr(parseReadCall({ id: "not-a-uuid" })));
  const id = "0b9d6f7e-1c2d-4e5f-8a9b-0c1d2e3f4a5b";
  assert.deepEqual(parseReadCall({ id: `call:${id}` }), { id, around: undefined, full: false });
  assert.deepEqual(parseReadCall({ id, around: " budget ", full: "yes" }), { id, around: "budget", full: false });
  assert.equal((parseReadCall({ id, full: true }) as { full: boolean }).full, true);
});

test("search_expertise input: query required, default 6", () => {
  assert.ok(isErr(parseSearchExpertise({ query: "" })));
  assert.deepEqual(parseSearchExpertise({ query: "dispatch", limit: 3 }), { query: "dispatch", limit: 3 });
  assert.deepEqual(parseSearchExpertise({ query: "dispatch" }), { query: "dispatch", limit: 6 });
});

test("excerpt is at most 600 characters and centred on the query", () => {
  const text = "a".repeat(2000) + " the budget was cut " + "b".repeat(2000);
  const e = excerpt(text, "budget");
  assert.ok(e.length <= 600, String(e.length));
  assert.ok(e.includes("budget"));
  assert.equal(excerpt("short text", "x"), "short text");
  assert.ok(excerpt("z".repeat(5000), "nothing").length <= 600);
});

const hit = (over: Partial<SearchHit>): SearchHit => ({
  chunkId: "c1", transcriptId: null, slug: "rxvip", layer: "vault", label: "File Deal Strategy/Pricing.md (part 2 of 3)",
  excerpt: "", metAt: null, speakers: [], score: 0.03, ...over,
});

test("source ids: vault → slug|file:path, chapter → slug|chapter:index, calls → call:id", () => {
  assert.equal(sourceIdFor(hit({})), "rxvip|file:Deal Strategy/Pricing");
  assert.equal(sourceIdFor(hit({ layer: "chapter", label: "Book, chapter 3: Why they bought (part 1 of 2)" })), "rxvip|chapter:2");
  assert.equal(sourceIdFor(hit({ layer: "transcript", transcriptId: "t1", label: "Call: Weekly, 2026-11-12" })), "call:t1");
});

test("formatHit: call hits carry title, date, speakers, project, link; excerpt skips the header line", () => {
  const body = "Call: Weekly sync, 2026-11-12\n[00:01:00] Randy: we should cut the price\n[00:01:10] Tauseef: agreed";
  const f = formatHit(hit({ layer: "transcript", transcriptId: "t1", label: "Call: Weekly sync, 2026-11-12 (part 2 of 4)", excerpt: body, metAt: "2026-11-12T15:00:00Z", speakers: ["Randy", "Tauseef"] }),
    { query: "price", project: "RxVIP", prefix: false, call: { title: "Weekly sync", url: "https://fathom.video/calls/1", metAt: "2026-11-12T15:00:00Z" } });
  assert.equal(f.id, "call:t1");
  assert.equal(f.label, "Call: Weekly sync, 2026-11-12");
  assert.equal(f.date, "2026-11-12");
  assert.equal(f.link, "https://fathom.video/calls/1");
  assert.equal(f.project, "RxVIP");
  assert.deepEqual(f.speakers, ["Randy", "Tauseef"]);
  assert.ok(!f.excerpt.startsWith("Call:"), "header line removed");
  assert.ok(f.excerpt.includes("Randy: we should cut the price"));
  assert.equal(f.layer, "transcript");
  assert.ok(f.strength >= 0 && f.strength <= 100);
  // summary hits get the same call label so evidence resolves one call
  const s = formatHit(hit({ layer: "summary", transcriptId: "t1", label: "Call summary: Weekly sync, 2026-11-12", excerpt: "Weekly sync (2026-11-12)\n\nThey agreed to cut price.", metAt: "2026-11-12T15:00:00Z" }),
    { query: "price", project: "RxVIP", prefix: true, call: { title: "Weekly sync", url: null, metAt: "2026-11-12T15:00:00Z" } });
  assert.equal(s.label, "RxVIP · Call: Weekly sync, 2026-11-12");
  assert.equal(s.excerpt, "They agreed to cut price.");
  assert.equal(s.link, null);
  // vault hits: label without the part suffix, link to nothing external
  const v = formatHit(hit({ excerpt: "File: Deal Strategy/Pricing\nPrice is $40k." }), { query: "price", project: "RxVIP", prefix: false });
  assert.equal(v.label, "File Deal Strategy/Pricing.md");
  assert.equal(v.excerpt, "Price is $40k.");
  assert.equal(v.date, null);
});

test("keepHit drops personnel calls and calls gone more than 14 days", () => {
  const now = new Date("2026-11-18T00:00:00Z");
  assert.equal(keepHit({ status: "digested", gone_at: null }, now), true);
  assert.equal(keepHit({ status: "personnel", gone_at: null }, now), false);
  assert.equal(keepHit({ status: "digested", gone_at: "2026-11-03T00:00:00Z" }, now), false);  // 15 days
  assert.equal(keepHit({ status: "digested", gone_at: "2026-11-10T00:00:00Z" }, now), true);   // 8 days
  assert.equal(keepHit(undefined, now), false);                                                   // call row missing
});

test("callVisible: linked to a project the person sees, or admin", () => {
  assert.equal(callVisible(["rxvip", "world-emblem"], new Set(["rxvip"])), true);
  assert.equal(callVisible(["world-emblem"], new Set(["rxvip"])), false);
  assert.equal(callVisible([], new Set(["rxvip"])), false);
  assert.equal(callVisible([], null), true);
});

test("callDigest: newest first, at most 10 lines, headline else title, last 30 days only", () => {
  const now = new Date("2026-11-18T12:00:00Z");
  const rows = Array.from({ length: 14 }, (_, i) => ({ metAt: new Date(now.getTime() - i * 2 * 86_400_000).toISOString(), headline: i === 1 ? "" : `headline ${i}`, title: `Title ${i}` }));
  const lines = callDigest(rows, now);
  assert.ok(lines.length <= 10);
  assert.ok(lines[0].includes("2026-11-18") && lines[0].includes("headline 0"));
  assert.ok(lines[1].includes("Title 1"));
  assert.ok(lines[lines.length - 1].includes("more call"), "overflow line");
  assert.ok(!lines.some((l) => l.includes("headline 13")), "older than 30 days left out");
  assert.deepEqual(callDigest([], now), []);
  assert.equal(callDigest(rows.slice(0, 3), now, 2).length, 2);
});

test("allotCalls: at most 8 tool calls per answer", () => {
  assert.equal(MAX_TOOL_CALLS, 8);
  assert.deepEqual(allotCalls(0, 3), { run: 3, skip: 0, exhausted: false });
  assert.deepEqual(allotCalls(6, 3), { run: 2, skip: 1, exhausted: true });
  assert.deepEqual(allotCalls(7, 1), { run: 1, skip: 0, exhausted: true });
  assert.ok(finalTurnNote().length > 10);
});

test("context management clears tool results older than the last 4 tool uses", () => {
  const cm = contextManagement();
  assert.deepEqual(cm.edits[0].keep, { type: "tool_uses", value: 4 });
  assert.equal(cm.edits[0].type, "clear_tool_uses_20250919");
});

test("matchSuggestions ranks pending facts by shared words and labels them unconfirmed", () => {
  const rows = [
    { id: "s1", account_id: "a", file_path: "Deal Strategy/Pricing", text: "Randy wants pricing per site", met_at: "2026-11-12T00:00:00Z", transcript_id: "t1" },
    { id: "s2", account_id: "a", file_path: "Technical Strategy/Stack", text: "They use Azure", met_at: null, transcript_id: null },
    { id: "s3", account_id: "a", file_path: "Deal Strategy/Pricing", text: "Pricing per site, annual", met_at: "2026-11-13T00:00:00Z", transcript_id: null },
  ];
  const out = matchSuggestions(rows, "site pricing", 5);
  assert.deepEqual(out.map((r) => r.id), ["s3", "s1"]);
  assert.equal(matchSuggestions(rows, "the of", 5).length, 0);
  assert.equal(matchSuggestions(rows, "pricing", 1).length, 1);
});
