// Runs the Stella evaluation set against a running dev server and scores each answer.
//   node scripts/eval.mjs                 all questions
//   node scripts/eval.mjs we-01 he-04     selected ids
// Scores: facts (every required fact present), cited (at least one citation of an expected
// kind, or none expected), and a combined pass. Writes eval/results-<timestamp>.json.
// Every run calls Claude and costs money: roughly $0.10-0.30 per question at current prices.
import { readFileSync, writeFileSync } from "node:fs";

const BASE = process.env.CLIENTOS_URL ?? "http://localhost:3100";
const set = JSON.parse(readFileSync("eval/questions.json", "utf8")).questions;
const pick = process.argv.slice(2);
const qs = pick.length ? set.filter((q) => pick.includes(q.id)) : set;

async function ask(q) {
  const res = await fetch(`${BASE}/api/stella`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: q.slug, messages: [{ role: "user", content: q.q }] }) });
  const text = await res.text();
  let answer = "", steps = [], error = null, usage = null;
  for (const line of text.split("\n").filter(Boolean)) {
    const ev = JSON.parse(line);
    if (ev.type === "text") answer += ev.delta;
    else if (ev.type === "tool") steps.push(ev.summary);
    else if (ev.type === "reset") answer = "";
    else if (ev.type === "error") error = ev.message;
    else if (ev.type === "done") usage = ev.usage;
  }
  return { answer, steps, error, usage };
}

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
const tokens = results.reduce((a, r) => ({ input: a.input + (r.usage?.input ?? 0), output: a.output + (r.usage?.output ?? 0), cacheRead: a.cacheRead + (r.usage?.cacheRead ?? 0) }), { input: 0, output: 0, cacheRead: 0 });
console.log(`\n${p} of ${n} passed · facts ${results.filter((r) => r.facts).length}/${n} · cited ${results.filter((r) => r.cited).length}/${n}`);
console.log(`tokens: ${tokens.input} input, ${tokens.cacheRead} cache read, ${tokens.output} output`);
const out = `eval/results-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
writeFileSync(out, JSON.stringify({ at: new Date().toISOString(), passed: p, total: n, tokens, results }, null, 2));
console.log(`wrote ${out}`);
