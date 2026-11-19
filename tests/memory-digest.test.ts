import { test } from "node:test";
import assert from "node:assert/strict";
import {
  estimateCost, validateDigest, DIGEST_MODEL, INPUT_PER_M, OUTPUT_PER_M, CACHE_READ_PER_M, CACHE_WRITE_PER_M, ASSUMED_OUTPUT_TOKENS,
  costOf, estimateRun, SpendGate, TOKENS_PER_CHAR_FACTOR, tokensForChars, digestSelection, DEFAULT_WINDOW_DAYS,
} from "../lib/memory/digest-rules.ts";

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

test("estimateCost at 4 chars per token times the tokenizer factor", () => {
  assert.equal(TOKENS_PER_CHAR_FACTOR, 1.35);
  assert.equal(tokensForChars(4000), 1350);
  assert.equal(tokensForChars(0), 0);
  assert.equal(tokensForChars(1), 1);
  const e = estimateCost([{ chars: 40000 }, { chars: 80000 }]);
  assert.equal(e.calls, 2);
  assert.equal(e.inputTokens, 40500);
  assert.ok(e.dollars > 0);
  // 40500 in * $4/M + 2 * 1900 out * $20/M
  assert.ok(Math.abs(e.dollars - (0.162 + 0.076)) < 1e-9);
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
  for (const section of ["A\nB", "## Scope", "Scope #2", "x".repeat(81), "![x](https://evil.example/a.png)", "a [b]", "a (b)", "a <b>", "Hi!", "a `b`"])
    assert.equal(validateDigest({ ...good(), suggestions: [{ ...s, section }] }, ctx).ok, false, section);
  assert.equal(validateDigest({ ...good(), suggestions: [{ ...s, section: "x".repeat(80) }] }, ctx).ok, true);
});

test("suggestion text over 600 characters is rejected", () => {
  const s = good().suggestions[0];
  assert.equal(validateDigest({ ...good(), suggestions: [{ ...s, text: "a".repeat(601) }] }, ctx).ok, false);
  assert.equal(validateDigest({ ...good(), suggestions: [{ ...s, text: "a".repeat(600) }] }, ctx).ok, true);
});

test("cache prices and the default output size", () => {
  assert.equal(CACHE_READ_PER_M, 0.2);
  assert.equal(CACHE_WRITE_PER_M, 5);
  assert.equal(ASSUMED_OUTPUT_TOKENS, 1900);
});

test("costOf splits dollars by input, cache read, cache write and output", () => {
  const c = costOf({ input: 1_000_000, cacheRead: 1_000_000, cacheWrite: 1_000_000, output: 1_000_000 });
  assert.deepEqual(c, { input: 4, cacheRead: 0.2, cacheWrite: 5, output: 20, total: 29.2 });
});

test("estimateRun charges the stable prefix as a cache write on a group's first call and a read after", () => {
  // stable 4000 chars = 1350 tokens; transcripts 8000 chars = 2700 tokens; output 1000 tokens
  const e = estimateRun(
    [{ chars: 8000, group: "a", stableChars: 4000 }, { chars: 8000, group: "a", stableChars: 4000 }, { chars: 8000, group: "b", stableChars: 4000 }],
    { outputTokens: 1000 },
  );
  assert.equal(e.calls, 3);
  assert.equal(e.inputTokens, 8100);
  assert.equal(e.cacheWriteTokens, 2700);
  assert.equal(e.cacheReadTokens, 1350);
  assert.equal(e.outputTokens, 3000);
  const first = (2700 * 4 + 1350 * 5 + 1000 * 20) / 1e6;
  const later = (2700 * 4 + 1350 * 0.2 + 1000 * 20) / 1e6;
  assert.ok(Math.abs(e.perCall[0] - first) < 1e-12);
  assert.ok(Math.abs(e.perCall[1] - later) < 1e-12);
  assert.ok(Math.abs(e.perCall[2] - first) < 1e-12);
  assert.ok(Math.abs(e.dollars - (2 * first + later)) < 1e-12);
  // a prefix too short to cache is plain input on every call
  const u = estimateRun([{ chars: 0, group: "a", stableChars: 4000, cacheable: false }, { chars: 0, group: "a", stableChars: 4000, cacheable: false }], { outputTokens: 0 });
  assert.equal(u.cacheWriteTokens, 0);
  assert.equal(u.cacheReadTokens, 0);
  assert.equal(u.inputTokens, 2700);
  // default output size when none is measured
  assert.equal(estimateRun([{ chars: 0, group: "a", stableChars: 0 }]).outputTokens, 1900);
});

test("SpendGate never lets spent plus in-flight reservations pass the cap", () => {
  const g = new SpendGate(1.0);
  assert.equal(g.tryReserve(0.4), true);
  assert.equal(g.tryReserve(0.4), true);
  assert.equal(g.tryReserve(0.4), false);   // 0.8 reserved + 0.4 > 1.0
  g.settle(0.4, 0.5);                        // one call cost more than its estimate
  assert.equal(g.spent, 0.5);
  assert.equal(g.reserved, 0.4);
  assert.equal(g.tryReserve(0.2), false);   // 0.5 + 0.4 + 0.2 > 1.0
  assert.equal(g.tryReserve(0.1), true);    // exactly 1.0 is allowed
  g.settle(0.4, 0.3); g.settle(0.1, 0.1);
  assert.ok(Math.abs(g.spent - 0.9) < 1e-12);
  assert.ok(Math.abs(g.reserved) < 1e-12);
});

test("digest selection: last 30 days by default, since overrides, transcriptIds pick calls directly", () => {
  const now = new Date("2026-11-18T12:00:00Z");
  assert.equal(DEFAULT_WINDOW_DAYS, 30);
  assert.deepEqual(digestSelection({}, now), { kind: "window", since: "2026-10-19T12:00:00.000Z", label: "calls since 2026-10-19 (the last 30 days, the default)" });
  assert.deepEqual(digestSelection({ since: "2026-06-01T00:00:00Z" }, now), { kind: "window", since: "2026-06-01T00:00:00.000Z", label: "calls since 2026-06-01 (given)" });
  assert.deepEqual(digestSelection({ transcriptIds: ["b", "a", "b"] }, now), { kind: "ids", ids: ["b", "a"], label: "2 chosen calls, any date" });
});
