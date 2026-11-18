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
    // every line is a whole turn, except a leading carried-overlap tail, which is the end of one
    c.text.split("\n").forEach((l, j) => assert.ok(lines.has(l) || (j === 0 && i > 0 && [...lines].some((f) => f.endsWith(l.replace(/^(Ann|Bob): /, "")))), `split line: ${l}`));
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

test("overlap carries the tail of the previous chunk's last turn when turns are long", () => {
  // ~200-character turns: one 205-char line never fits whole inside a 150-char overlap, so the overlap is a cut tail.
  // Fresh content per chunk is target 1200, so 5 lines (5 x 205 + 4 = 1029; a 6th would make 1235).
  const body = (i: number) => `Point ${i}. ` + "alpha beta gamma delta epsilon zeta eta theta ".repeat(4).trim();
  const turns = Array.from({ length: 120 }, (_, i) => turn(i % 2 ? "Bob" : "Ann", body(i)));
  const chunks = chunkTurns(turns, 1200, 150);
  assert.ok(chunks.length > 2);
  for (let i = 1; i < chunks.length; i++) {
    const first = chunks[i].text.split("\n")[0];
    const text = first.replace(/^(Ann|Bob): /, "");
    assert.ok(text.length > 0 && text.length <= 150, `overlap length ${text.length}`);
    assert.ok(chunks[i - 1].text.endsWith(text), "overlap is the tail of the previous chunk");
    assert.ok(/^(Ann|Bob): /.test(first));
    assert.ok(chunks[i].text.length <= 2400);
  }
});

test("each chunk lists distinct speakers in order; empty speakers omitted", () => {
  const chunks = chunkTurns([turn("Ann", "Hi."), turn("Bob", "Hello."), turn("Ann", "Again."), turn("", "[personnel section removed, 4 min]")], 1200, 150);
  assert.equal(chunks.length, 1);
  assert.deepEqual(chunks[0].speakers, ["Ann", "Bob"]);
  assert.equal(chunks[0].text, "Ann: Hi.\nBob: Hello.\nAnn: Again.\n[personnel section removed, 4 min]");
});

test("a 3-hour fixture of 900 turns yields 100-130 chunks", () => {
  // Each line is "Ann: " + 150 x = 155 chars; 7 lines + 6 newlines = 1091 <= 1200 fresh, an 8th makes 1247 > 1200,
  // so ~7 fresh lines per chunk -> 900 / 7 = 129 chunks, each also carrying a <=150-char overlap tail.
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

test("a body-less heading merges into the next section; an overlong heading is hard-split", () => {
  const chunks = chunkText("# Top\n\n## Sub\n\nBody text.\n\n## Last", 400);
  assert.deepEqual(chunks.map((c) => c.text), ["# Top\n\n## Sub\n\nBody text.", "## Last"]);
  const long = "# " + "w".repeat(900);
  const hard = chunkText(long + "\n\nBody.", 400);
  assert.ok(hard.every((c) => c.text.length <= 800));
  assert.ok(hard.map((c) => c.text).join("").includes("w".repeat(900)));
});

test("chunkText splits an oversized paragraph on sentences", () => {
  const para = "A sentence that is fairly short. ".repeat(80).trim();
  const chunks = chunkText(para, 200);
  assert.ok(chunks.length > 1);
  assert.ok(chunks.every((c) => c.text.length > 0 && c.text.length <= 400));
});
