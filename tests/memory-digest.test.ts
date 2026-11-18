import { test } from "node:test";
import assert from "node:assert/strict";
import { estimateCost, validateDigest, DIGEST_MODEL, INPUT_PER_M, OUTPUT_PER_M } from "../lib/memory/digest-rules.ts";

const ctx = { linkedSlugs: ["world-emblem"], vaultPaths: { "world-emblem": ["00-overview.md", "notes/risks.md"] } };
const lines = (n: number) => Array.from({ length: n }, (_, i) => `line ${i + 1}`).join("\n");
const good = () => ({
  summary: lines(6),
  headlines: { "world-emblem": "Agreed to ship the pilot in March." },
  suggestions: [{ slug: "world-emblem", filePath: "00-overview.md", section: "Scope", text: "Pilot ships in March." }],
});

test("constants", () => {
  assert.equal(DIGEST_MODEL, "claude-opus-5-5");
  assert.equal(INPUT_PER_M, 4);
  assert.equal(OUTPUT_PER_M, 20);
});

test("estimateCost at 4 chars per token", () => {
  const e = estimateCost([{ chars: 40000 }, { chars: 80000 }]);
  assert.equal(e.calls, 2);
  assert.equal(e.inputTokens, 30000);
  assert.ok(e.dollars > 0);
  // 30000 in * $4/M + 2 * 1500 out * $20/M
  assert.ok(Math.abs(e.dollars - (0.12 + 0.06)) < 1e-9);
});

test("estimateCost rounds up per call and handles empty", () => {
  assert.equal(estimateCost([{ chars: 5 }, { chars: 1 }]).inputTokens, 3);
  assert.deepEqual(estimateCost([]), { calls: 0, inputTokens: 0, dollars: 0 });
});

test("a good digest passes", () => {
  const r = validateDigest(good(), ctx);
  assert.equal(r.ok, true);
});

test("summary must be 5 to 8 non-empty lines", () => {
  for (const n of [4, 9]) {
    const r = validateDigest({ ...good(), summary: lines(n) }, ctx);
    assert.equal(r.ok, false);
  }
  for (const n of [5, 8]) assert.equal(validateDigest({ ...good(), summary: lines(n) }, ctx).ok, true);
  // blank lines do not count
  assert.equal(validateDigest({ ...good(), summary: lines(4) + "\n\n  \n" }, ctx).ok, false);
});

test("headline for an unlinked project is rejected", () => {
  const r = validateDigest({ ...good(), headlines: { rxvip: "x" } }, ctx);
  assert.equal(r.ok, false);
});

test("headline over 200 characters is rejected", () => {
  assert.equal(validateDigest({ ...good(), headlines: { "world-emblem": "a".repeat(201) } }, ctx).ok, false);
  assert.equal(validateDigest({ ...good(), headlines: { "world-emblem": "a".repeat(200) } }, ctx).ok, true);
});

test("suggestion with a file outside the vault, unlinked slug, or empty text is rejected", () => {
  const s = good().suggestions[0];
  assert.equal(validateDigest({ ...good(), suggestions: [{ ...s, filePath: "nope.md" }] }, ctx).ok, false);
  assert.equal(validateDigest({ ...good(), suggestions: [{ ...s, slug: "rxvip" }] }, ctx).ok, false);
  assert.equal(validateDigest({ ...good(), suggestions: [{ ...s, text: "  " }] }, ctx).ok, false);
});

test("malformed input returns errors, never throws", () => {
  for (const raw of [null, "x", 3, {}, { summary: 1 }]) {
    const r = validateDigest(raw, ctx);
    assert.equal(r.ok, false);
    if (!r.ok) assert.ok(r.errors.length > 0);
  }
});

test("a section with a newline or '#', or over 80 characters, is rejected", () => {
  const s = good().suggestions[0];
  for (const section of ["A\nB", "## Scope", "Scope #2", "x".repeat(81)])
    assert.equal(validateDigest({ ...good(), suggestions: [{ ...s, section }] }, ctx).ok, false, section);
  assert.equal(validateDigest({ ...good(), suggestions: [{ ...s, section: "x".repeat(80) }] }, ctx).ok, true);
});

test("suggestion text over 600 characters is rejected", () => {
  const s = good().suggestions[0];
  assert.equal(validateDigest({ ...good(), suggestions: [{ ...s, text: "a".repeat(601) }] }, ctx).ok, false);
  assert.equal(validateDigest({ ...good(), suggestions: [{ ...s, text: "a".repeat(600) }] }, ctx).ok, true);
});
