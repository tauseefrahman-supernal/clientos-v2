import { test } from "node:test";
import assert from "node:assert/strict";
import { recencyWeight, callWindow } from "../lib/memory/search-rules.ts";

test("recencyWeight halves every 60 days", () => {
  assert.equal(recencyWeight(0), 1);
  assert.equal(recencyWeight(60), 0.5);
  const w = recencyWeight(180);
  assert.ok(w > 0.12 && w < 0.13);
  assert.equal(recencyWeight(-10), 1);
});

const big = (marker: string, at: number) => {
  const filler = "lorem ipsum dolor sit amet\n";
  let s = filler.repeat(Math.ceil(200000 / filler.length)).slice(0, 200000);
  return s.slice(0, at) + marker + s.slice(at + marker.length);
};

test("callWindow centres on the match within the limit", () => {
  const body = big("the budget was cut", 100000);
  const w = callWindow(body, "THE BUDGET WAS CUT");
  assert.ok(w.length <= 3000);
  assert.ok(w.toLowerCase().includes("the budget was cut"));
});

test("callWindow missing or empty around returns the first chars", () => {
  const body = big("x", 10);
  assert.equal(callWindow(body, "not in here"), body.slice(0, 3000));
  assert.equal(callWindow(body, ""), body.slice(0, 3000));
});

test("callWindow near the very start and very end", () => {
  const start = big("needle", 3);
  const ws = callWindow(start, "needle");
  assert.ok(ws.length <= 3000 && ws.includes("needle"));
  const end = big("needle", 200000 - 8);
  const we = callWindow(end, "needle");
  assert.ok(we.length <= 3000 && we.includes("needle"));
  assert.ok(end.endsWith(we));
});

test("callWindow snaps to line boundaries and short bodies come back whole", () => {
  const body = "a\nb\nsome words here\nc\nd";
  assert.equal(callWindow(body, "words"), body);
  const lines = Array.from({ length: 400 }, (_, i) => `row ${i} ${"z".repeat(20)}`).join("\n");
  const w = callWindow(lines, "row 200 ", 500);
  assert.ok(w.length <= 500 && w.includes("row 200 "));
  assert.ok(w.startsWith("row "), "starts at a line start");
});
