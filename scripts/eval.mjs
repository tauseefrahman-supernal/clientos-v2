// Runs a Stella evaluation set against a running dev server and scores each answer.
//   node scripts/eval.mjs                       the 13 Nov set (eval/questions.json), all questions
//   node scripts/eval.mjs we-01 he-04           selected ids
//   node scripts/eval.mjs --set layer           the layer set (eval/layer-questions.json), todo entries skipped
//   node scripts/eval.mjs --set layer lw-10     selected layer ids
//   node scripts/eval.mjs --set layer --dry     print the planned questions and the estimated cost; calls nothing
// Default set scores: facts (every required fact present), cited (at least one citation of an expected kind, or
// none expected), and a combined pass. Writes eval/results-<timestamp>.json.
// Layer set scores: facts, the deepest memory layer reached (from the streamed tool events) against the expected
// layer, tool calls and tokens; pass = facts found and not deeper than expected. Writes eval/results-layer-<timestamp>.json.
// Every real run calls Claude and costs money: roughly $0.10-0.30 per question at current prices.
import { readFileSync, writeFileSync } from "node:fs";
import { COST_PER_QUESTION, LAYERS, plannedLayerQuestions, scoreLayerAnswer } from "./eval-layer.mjs";

const BASE = process.env.CLIENTOS_URL ?? "http://localhost:3100";
const argv = process.argv.slice(2);
const dry = argv.includes("--dry");
const setAt = argv.indexOf("--set");
const setName = setAt >= 0 ? argv[setAt + 1] : "default";
if (!["default", "layer"].includes(setName)) { console.error(`Unknown set "${setName}". Use --set layer, or no --set for eval/questions.json.`); process.exit(2); }
const pick = argv.filter((a, i) => !a.startsWith("--") && !(setAt >= 0 && i === setAt + 1));
const stamp = () => new Date().toISOString().replace(/[:.]/g, "-");

async function ask(q) {
  const res = await fetch(`${BASE}/api/stella`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: q.slug, messages: [{ role: "user", content: q.q }] }) });
  if (!res.ok) return { answer: "", steps: [], tools: [], error: `HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`, usage: null };
  const text = await res.text();
  let answer = "", steps = [], tools = [], error = null, usage = null;
  for (const line of text.split("\n").filter(Boolean)) {
    const ev = JSON.parse(line);
    if (ev.type === "text") answer += ev.delta;
    else if (ev.type === "tool") { steps.push(ev.summary); tools.push({ name: ev.name, summary: ev.summary }); }
    else if (ev.type === "reset") answer = "";
    else if (ev.type === "error") error = ev.message;
    else if (ev.type === "done") usage = ev.usage;
  }
  return { answer, steps, tools, error, usage };
}

function dryRun(qs, label) {
  for (const q of qs) console.log(`${q.id.padEnd(6)} ${q.slug.padEnd(20)} ${q.layer ? `${q.layer.padEnd(11)} ${q.within_days ? `${String(q.within_days).padStart(3)}d` : "  - "} ` : ""}${q.q}`);
  console.log(`\n${qs.length} questions from ${label} · estimated cost about $${(qs.length * COST_PER_QUESTION).toFixed(2)} at ~$${COST_PER_QUESTION} a question (claude-opus-5-5). Nothing was called.`);
}

const sumUsage = (rs) => rs.reduce((a, r) => ({ input: a.input + (r.usage?.input ?? 0), output: a.output + (r.usage?.output ?? 0), cacheRead: a.cacheRead + (r.usage?.cacheRead ?? 0) }), { input: 0, output: 0, cacheRead: 0 });

async function runDefault() {
  const set = JSON.parse(readFileSync("eval/questions.json", "utf8")).questions;
  const qs = pick.length ? set.filter((q) => pick.includes(q.id)) : set;
  if (dry) return dryRun(qs, "eval/questions.json");
  const results = [];
  for (const q of qs) {
    const t0 = Date.now();
    const r = await ask(q);
    const low = r.answer.toLowerCase();
    const missing = q.must.filter((alts) => !alts.some((a) => low.includes(a.toLowerCase())));
    const cites = [...r.answer.matchAll(/\[((?:File|Research|Book|Account)[^\]]*)\]/g)].map((m) => m[1]);
    const cited = q.cite.length === 0 || cites.some((c) => q.cite.some((k) => c.startsWith(k)));
    const pass = !r.error && missing.length === 0 && cited;
    results.push({ id: q.id, pass, facts: missing.length === 0, cited, missing, cites, seconds: Math.round((Date.now() - t0) / 1000), ...r });
    console.log(`${pass ? "PASS" : "FAIL"} ${q.id.padEnd(6)} ${missing.length ? `missing ${JSON.stringify(missing)}` : ""}${cited ? "" : " no matching citation"}${r.error ? ` error: ${r.error}` : ""}`);
  }
  const n = results.length, p = results.filter((r) => r.pass).length;
  const tokens = sumUsage(results);
  console.log(`\n${p} of ${n} passed · facts ${results.filter((r) => r.facts).length}/${n} · cited ${results.filter((r) => r.cited).length}/${n}`);
  console.log(`tokens: ${tokens.input} input, ${tokens.cacheRead} cache read, ${tokens.output} output`);
  const out = `eval/results-${stamp()}.json`;
  writeFileSync(out, JSON.stringify({ at: new Date().toISOString(), passed: p, total: n, tokens, results }, null, 2));
  console.log(`wrote ${out}`);
}

async function runLayer() {
  const file = JSON.parse(readFileSync("eval/layer-questions.json", "utf8"));
  const todo = file.questions.filter((q) => q.todo).length;
  const qs = plannedLayerQuestions(file.questions, pick);
  if (dry) { dryRun(qs, "eval/layer-questions.json"); if (todo) console.log(`${todo} todo entries skipped.`); return; }
  const results = [];
  for (const q of qs) {
    const t0 = Date.now();
    const r = await ask(q);
    const s = scoreLayerAnswer(q, r);
    results.push({ id: q.id, slug: q.slug, q: q.q, within_days: q.within_days ?? null, ...s, usage: r.usage, seconds: Math.round((Date.now() - t0) / 1000), error: r.error, answer: r.answer, tools: r.tools });
    console.log(`${s.pass ? "PASS" : "FAIL"} ${q.id.padEnd(6)} layer ${s.reached}/${s.expected}${s.layerOk ? "" : " (too deep)"} · ${s.toolCalls} tools · ${r.usage?.input ?? "?"} in${s.missing.length ? ` · missing ${JSON.stringify(s.missing)}` : ""}${r.error ? ` · error: ${r.error}` : ""}`);
  }
  const n = results.length;
  if (!n) return console.log("No questions to run.");
  const tokens = sumUsage(results);
  const avg = (x) => Math.round(x / n);
  const summary = {
    total: n,
    passed: results.filter((r) => r.pass).length,
    facts: results.filter((r) => r.facts).length,
    layerOk: results.filter((r) => r.layerOk).length,
    layerExact: results.filter((r) => r.layerExact).length,
    avgToolCalls: Math.round((results.reduce((a, r) => a + r.toolCalls, 0) / n) * 10) / 10,
    avgInput: avg(tokens.input), avgCacheRead: avg(tokens.cacheRead), avgOutput: avg(tokens.output),
    byLayer: Object.fromEntries(LAYERS.map((l) => {
      const g = results.filter((r) => r.expected === l);
      return [l, { n: g.length, facts: g.filter((r) => r.facts).length, layerOk: g.filter((r) => r.layerOk).length, exact: g.filter((r) => r.layerExact).length }];
    })),
  };
  const yn = (b) => (b ? "yes" : "no").padStart(5);
  console.log("\nid      pass  facts  layerOk  layerExact  reached/expected        tools  input");
  for (const r of results) console.log(`${r.id.padEnd(6)} ${yn(r.pass)}  ${yn(r.facts)}  ${yn(r.layerOk).padStart(7)}  ${yn(r.layerExact).padStart(10)}  ${`${r.reached}/${r.expected}`.padEnd(22)} ${String(r.toolCalls).padStart(5)}  ${r.usage?.input ?? "?"}`);
  console.log("\nexpected     n  facts  layerOk  layerExact");
  for (const [l, g] of Object.entries(summary.byLayer)) if (g.n) console.log(`${l.padEnd(11)} ${String(g.n).padStart(2)}  ${String(g.facts).padStart(5)}  ${String(g.layerOk).padStart(7)}  ${String(g.exact).padStart(10)}`);
  console.log(`\n${summary.passed} of ${n} passed (facts and layerOk) · facts ${summary.facts}/${n} · layerOk (not deeper than expected) ${summary.layerOk}/${n} · layerExact ${summary.layerExact}/${n}`);
  console.log(`avg tool calls ${summary.avgToolCalls} · avg input tokens ${summary.avgInput} (+${summary.avgCacheRead} cache read) · avg output ${summary.avgOutput}`);
  const out = `eval/results-layer-${stamp()}.json`;
  writeFileSync(out, JSON.stringify({ at: new Date().toISOString(), base: BASE, summary, tokens, results }, null, 2));
  console.log(`wrote ${out}`);
}

await (setName === "layer" ? runLayer() : runDefault());
