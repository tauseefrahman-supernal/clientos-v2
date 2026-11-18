import { test } from "node:test";
import assert from "node:assert/strict";
import { applyCuts, parseScreenReply } from "../lib/memory/screen.ts";
import type { Turn } from "../lib/memory/types.ts";

/** Ten turns, one minute apart, starting at 0s. */
function turns(n = 10): Turn[] {
  return Array.from({ length: n }, (_, i) => ({ speaker: `S${i}`, start: i * 60, text: `turn ${i}` }));
}

test("cutting turns 3 to 5 of a 10-turn call leaves 8 entries with a personnel marker", () => {
  const out = applyCuts(turns(), [{ from: 3, to: 5, reason: "personnel" }]);
  assert.equal(out.length, 8);
  // turn 3 starts at 180s, turn 6 (after the cut) at 360s: 3 minutes
  assert.deepEqual(out[3], { speaker: "", start: 180, text: "[personnel section removed, 3 min]" });
  assert.equal(out[2].text, "turn 2");
  assert.equal(out[4].text, "turn 6");
});

test("a private cut uses the private wording", () => {
  const out = applyCuts(turns(), [{ from: 3, to: 5, reason: "private" }]);
  assert.equal(out[3].text, "[private details removed, 3 min]");
});

test("no cuts returns the turns unchanged", () => {
  const t = turns();
  assert.deepEqual(applyCuts(t, []), t);
});

test("overlapping cuts collapse into one marker", () => {
  const out = applyCuts(turns(), [{ from: 2, to: 4, reason: "personnel" }, { from: 4, to: 6, reason: "personnel" }]);
  assert.equal(out.length, 6);
  assert.deepEqual(out[2], { speaker: "", start: 120, text: "[personnel section removed, 5 min]" });
  assert.equal(out[3].text, "turn 7");
});

test("adjacent cuts collapse; mixed reasons use the personnel wording", () => {
  const out = applyCuts(turns(), [{ from: 5, to: 6, reason: "private" }, { from: 3, to: 4, reason: "personnel" }]);
  assert.equal(out.length, 7);
  assert.equal(out[3].text, "[personnel section removed, 4 min]");
});

test("a short cut rounds up to at least 1 minute", () => {
  const t: Turn[] = [
    { speaker: "A", start: 0, text: "hi" },
    { speaker: "B", start: 10, text: "secret" },
    { speaker: "A", start: 20, text: "ok" },
  ];
  assert.equal(applyCuts(t, [{ from: 1, to: 1, reason: "private" }])[1].text, "[private details removed, 1 min]");
});

test("a cut at the end estimates the last turn from its words at 150 wpm", () => {
  const t: Turn[] = [
    { speaker: "A", start: 0, text: "hi" },
    { speaker: "B", start: 60, text: Array(300).fill("word").join(" ") },
  ];
  // 300 words = 2 min of speech after a start at 60s
  const out = applyCuts(t, [{ from: 1, to: 1, reason: "personnel" }]);
  assert.deepEqual(out[1], { speaker: "", start: 60, text: "[personnel section removed, 2 min]" });
});

test("without start times the length comes from the cut words", () => {
  const t: Turn[] = Array.from({ length: 4 }, (_, i) => ({ speaker: "A", start: null, text: Array(200).fill("w").join(" ") }));
  // 2 turns x 200 words = 400 words / 150 wpm = 2.67, rounded up to 3
  const out = applyCuts(t, [{ from: 1, to: 2, reason: "personnel" }]);
  assert.deepEqual(out[1], { speaker: "", start: null, text: "[personnel section removed, 3 min]" });
});

test("parseScreenReply accepts a clean verdict", () => {
  assert.deepEqual(parseScreenReply('{"verdict":"clean","cuts":[]}', 10), { verdict: "clean", cuts: [] });
});

test("parseScreenReply accepts cuts and tolerates a code fence", () => {
  const r = parseScreenReply('```json\n{"verdict":"cut","cuts":[{"from":2,"to":4,"reason":"private"}]}\n```', 10);
  assert.deepEqual(r, { verdict: "cut", cuts: [{ from: 2, to: 4, reason: "private" }] });
});

test("parseScreenReply accepts a whole-call personnel verdict", () => {
  assert.deepEqual(parseScreenReply('{"verdict":"personnel","cuts":[]}', 10), { verdict: "personnel", cuts: [] });
});

test("parseScreenReply returns error on anything malformed", () => {
  const bad = [
    "not json",
    '{"verdict":"maybe","cuts":[]}',
    '{"verdict":"cut","cuts":[{"from":2,"to":10,"reason":"private"}]}',
    '{"verdict":"cut","cuts":[{"from":-1,"to":2,"reason":"private"}]}',
    '{"verdict":"cut","cuts":[{"from":5,"to":4,"reason":"private"}]}',
    '{"verdict":"cut","cuts":[{"from":1,"to":2,"reason":"gossip"}]}',
    '{"verdict":"cut","cuts":[{"from":1.5,"to":2,"reason":"private"}]}',
    '{"verdict":"cut","cuts":[]}',
    '{"verdict":"clean","cuts":[{"from":1,"to":2,"reason":"private"}]}',
    '{"verdict":"cut"}',
    "[]",
  ];
  for (const b of bad) assert.deepEqual(parseScreenReply(b, 10), { verdict: "error" }, b);
});
