import { test } from "node:test";
import assert from "node:assert/strict";
import { chunkTurns, chunkText } from "../lib/memory/chunk.ts";
import type { Turn } from "../lib/memory/types.ts";

const turn = (speaker: string, text: string): Turn => ({ speaker, start: null, text });

test("turns are never split mid-turn and every chunk fits 2 x target", () => {
  const turns = Array.from({ length: 40 }, (_, i) => turn(i % 2 ? "Bob" : "Ann", `Turn ${i} ` + "word ".repeat(30).trim()));
  const chunks = chunkTurns(turns, 400, 150);
  const lines = new Set(turns.map((t) => `${t.speaker}: ${t.text}`));
  assert.ok(chunks.length > 1);
  chunks.forEach((c, i) => {
    assert.equal(c.seq, i);
    assert.ok(c.text.length <= 800);
    for (const l of c.text.split("\n")) assert.ok(lines.has(l), `split line: ${l}`);
  });
});

test("a single turn over 2 x target is split on sentences, each piece keeps the speaker", () => {
  const sentence = "This is one sentence of moderate length. ";
  const chunks = chunkTurns([turn("Ann", sentence.repeat(60).trim())], 200, 50);
  assert.ok(chunks.length > 1);
  for (const c of chunks) {
    assert.ok(c.text.length <= 400);
    assert.ok(c.text.split("\n").every((l) => l.startsWith("Ann: ")));
  }
});

test("consecutive chunks share at most overlap characters", () => {
  const turns = Array.from({ length: 60 }, (_, i) => turn(i % 2 ? "Bob" : "Ann", `Short ${i} line here.`));
  const chunks = chunkTurns(turns, 300, 150);
  let shared = 0;
  for (let i = 1; i < chunks.length; i++) {
    const a = chunks[i - 1].text.split("\n");
    const b = chunks[i].text.split("\n");
    let k = 0;
    while (k < Math.min(a.length, b.length) - 1 && a.slice(a.length - k - 1).join("\n") !== b.slice(0, k + 1).join("\n")) k++;
    const sharedText = a.slice(a.length - k - 1).join("\n");
    if (a.slice(a.length - k - 1).join("\n") === b.slice(0, k + 1).join("\n")) {
      shared++;
      assert.ok(sharedText.length <= 150);
    }
  }
  assert.ok(shared > 0, "expected some overlap");
});

test("each chunk lists distinct speakers in order; empty speakers omitted", () => {
  const chunks = chunkTurns([turn("Ann", "Hi."), turn("Bob", "Hello."), turn("Ann", "Again."), turn("", "[personnel section removed, 4 min]")], 1200, 150);
  assert.equal(chunks.length, 1);
  assert.deepEqual(chunks[0].speakers, ["Ann", "Bob"]);
  assert.equal(chunks[0].text, "Ann: Hi.\nBob: Hello.\nAnn: Again.\n[personnel section removed, 4 min]");
});

test("a 3-hour fixture of 900 turns yields 100-130 chunks", () => {
  const turns = Array.from({ length: 900 }, (_, i) => turn(i % 2 ? "Bob" : "Ann", "x".repeat(150)));
  const chunks = chunkTurns(turns);
  assert.ok(chunks.length >= 100 && chunks.length <= 130, `got ${chunks.length}`);
  assert.ok(chunks.every((c) => c.text.length > 0 && c.text.length <= 2400));
});

test("empty input yields no chunks", () => {
  assert.deepEqual(chunkTurns([]), []);
  assert.deepEqual(chunkText("  \n\n "), []);
});

test("chunkText splits on headings first, then paragraphs", () => {
  const md = "# Title\n\nIntro para.\n\n## Alpha\n\n" + "a".repeat(300) + "\n\n" + "b".repeat(300) + "\n\n## Beta\n\nBeta body.";
  const chunks = chunkText(md, 400);
  assert.deepEqual(chunks.map((c) => c.seq), chunks.map((_, i) => i));
  assert.equal(chunks[0].text, "# Title\n\nIntro para.");
  const alpha = chunks.filter((c) => c.text.startsWith("## Alpha"));
  assert.equal(alpha.length, 2);
  assert.ok(alpha[0].text.includes("a".repeat(300)) && !alpha[0].text.includes("b"));
  assert.ok(alpha[1].text.includes("b".repeat(300)));
  assert.equal(chunks[chunks.length - 1].text, "## Beta\n\nBeta body.");
  assert.ok(chunks.every((c) => c.text.length <= 800));
});

test("chunkText splits an oversized paragraph on sentences", () => {
  const para = "A sentence that is fairly short. ".repeat(80).trim();
  const chunks = chunkText(para, 200);
  assert.ok(chunks.length > 1);
  assert.ok(chunks.every((c) => c.text.length > 0 && c.text.length <= 400));
});
