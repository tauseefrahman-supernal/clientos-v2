import { test } from "node:test";
import assert from "node:assert/strict";
// Plain ES module (scripts/ and tests/ sit outside the TypeScript project).
import { toolLayer, deepestLayer, scoreLayerAnswer, plannedLayerQuestions, missingFacts } from "../scripts/eval-layer.mjs";

const ev = (name: string, summary: string) => ({ name, summary });

test("toolLayer maps each tool event to its memory layer", () => {
  assert.equal(toolLayer(ev("search_context", "searched “pricing” · 4 hits, 1 unconfirmed")), "vault");
  assert.equal(toolLayer(ev("read_source", "read File Weekly.md")), "vault");
  assert.equal(toolLayer(ev("search_expertise", "searched other projects for “x” · 2 hits")), "vault");
  assert.equal(toolLayer(ev("search_calls", "searched call summaries for “BC” in World Emblem · 6 hits")), "summaries");
  assert.equal(toolLayer(ev("search_calls", "searched call transcripts for “revenue” since 2026-10-19 · 6 hits")), "transcripts");
  assert.equal(toolLayer(ev("read_call", "read T3, 2026-11-18")), "summaries");
  assert.equal(toolLayer(ev("read_call", "read T3, 2026-11-18 around “business central”")), "transcripts");
  assert.equal(toolLayer(ev("read_call", "read T3, 2026-11-18 (whole transcript)")), "transcripts");
});

test("toolLayer ignores calls that retrieved nothing or only wrote", () => {
  for (const [n, s] of [
    ["search_calls", "invalid search"], ["search_context", "unknown project"], ["read_call", "call not found"],
    ["read_source", "source not found"], ["search_calls", "skipped: lookup budget used up"], ["search_calls", "search_calls failed"],
    ["create_document", "wrote “Brief”"], ["mystery", "did something"],
  ]) assert.equal(toolLayer(ev(n, s)), null, `${n}: ${s}`);
  // A query that merely contains the words is still a real search.
  assert.equal(toolLayer(ev("search_context", "searched “not found errors” · 2 hits")), "vault");
});

test("deepestLayer takes the deepest layer reached, header when nothing retrieved", () => {
  assert.equal(deepestLayer([]), "header");
  assert.equal(deepestLayer(undefined), "header");
  assert.equal(deepestLayer([ev("create_document", "wrote “x”")]), "header");
  assert.equal(deepestLayer([ev("search_context", "searched “a” · 1 hits"), ev("search_calls", "searched call summaries for “a” · 3 hits")]), "summaries");
  assert.equal(deepestLayer([ev("read_call", "read X around “y”"), ev("search_context", "searched “a” · 1 hits")]), "transcripts");
});

test("scoreLayerAnswer: facts and not-deeper-than-expected both needed to pass; exact layer is reported apart", () => {
  const q = { id: "x", layer: "summaries", must: [["Business Central", "BC API"], ["customer service"]] };
  const shallow = scoreLayerAnswer(q, { answer: "Customer service is live; Business Central blocks finance.", tools: [ev("search_context", "searched “s” · 2 hits")] });
  assert.deepEqual([shallow.pass, shallow.facts, shallow.reached, shallow.layerOk, shallow.layerExact, shallow.toolCalls], [true, true, "vault", true, false, 1]);
  const deep = scoreLayerAnswer(q, { answer: "customer service; business central", tools: [ev("search_calls", "searched call transcripts for “s” · 6 hits")] });
  assert.deepEqual([deep.pass, deep.facts, deep.layerOk], [false, true, false]);
  const missing = scoreLayerAnswer(q, { answer: "Customer service is live.", tools: [] });
  assert.deepEqual([missing.pass, missing.missing], [false, [["Business Central", "BC API"]]]);
  assert.equal(scoreLayerAnswer(q, { answer: "customer service business central", tools: [], error: "boom" }).pass, false);
});

test("missingFacts is case-insensitive over alternatives", () => {
  assert.deepEqual(missingFacts("GA4 via Windsor", [["ga four", "ga4"], ["ERP"]]), [["ERP"]]);
});

test("plannedLayerQuestions skips todo entries and honours picked ids", () => {
  const set = [{ id: "a" }, { id: "b", todo: true }, { id: "c" }];
  assert.deepEqual(plannedLayerQuestions(set).map((q: { id: string }) => q.id), ["a", "c"]);
  assert.deepEqual(plannedLayerQuestions(set, ["c", "b"]).map((q: { id: string }) => q.id), ["c"]);
});
