import { test } from "node:test";
import assert from "node:assert/strict";
import { evidenceHref, joinEvidence, resolveRefs, splitEvidence, stripHistory, visibleAnswer, type Evidence } from "../lib/stella/evidence.ts";

const block = (json: string) => "```evidence\n" + json + "\n```";
const item = { point: "Bought for speed", source: "File Technical Strategy/Feature-Rationale.md", quote: "They chose us because we ship in weeks." };

test("a well-formed evidence block is removed from the answer and parsed", () => {
  const { answer, evidence } = splitEvidence(`They bought for speed.\n\n${block(JSON.stringify([item]))}`);
  assert.equal(answer, "They bought for speed.");
  assert.equal(evidence.length, 1);
  assert.equal(evidence[0].point, "Bought for speed");
  assert.equal(evidence[0].source, "File Technical Strategy/Feature-Rationale.md");
  assert.equal(evidence[0].quote, "They chose us because we ship in weeks.");
  assert.deepEqual(evidence[0].ref, { kind: "other", slug: null, id: null, at: null });
});

test("text before and after the block is kept", () => {
  const { answer, evidence } = splitEvidence(`Before the block.\n\n${block(JSON.stringify([item]))}\n\nAfter the block.`);
  assert.equal(answer, "Before the block.\n\nAfter the block.");
  assert.equal(evidence.length, 1);
});

test("a malformed block gives no evidence and the answer without the raw block", () => {
  const { answer, evidence } = splitEvidence(`The answer.\n\n${block("[{ point: oops")}`);
  assert.equal(answer, "The answer.");
  assert.deepEqual(evidence, []);
  // an unclosed block (cut off) is dropped too
  const cut = splitEvidence("The answer.\n\n```evidence\n[{\"point\": \"x\"");
  assert.equal(cut.answer, "The answer.");
  assert.deepEqual(cut.evidence, []);
  // JSON that is not an array of points
  assert.deepEqual(splitEvidence(`A.\n\n${block("{\"point\":\"x\"}")}`).evidence, []);
});

test("an answer with no block is returned unchanged", () => {
  const text = "No sources hold this. It would be in the kickoff meeting.\n\n```ts\nconst x = 1;\n```";
  assert.deepEqual(splitEvidence(text), { answer: text, evidence: [] });
});

test("a quote over 200 characters is trimmed", () => {
  const long = "a".repeat(450);
  const { evidence } = splitEvidence(`A.\n\n${block(JSON.stringify([{ ...item, quote: long }]))}`);
  assert.ok(evidence[0].quote!.length <= 200);
  assert.ok(evidence[0].quote!.startsWith("aaaa"));
});

test("a missing quote becomes null and points without a source are dropped", () => {
  const { evidence } = splitEvidence(`A.\n\n${block(JSON.stringify([{ point: "p", source: "File X.md" }, { point: "no source" }, "junk"]))}`);
  assert.equal(evidence.length, 1);
  assert.equal(evidence[0].quote, null);
});

test("an answer that still contains [File …] labels is left as is", () => {
  const text = "They bought for speed [File Technical Strategy/Feature-Rationale.md].";
  assert.deepEqual(splitEvidence(text), { answer: text, evidence: [] });
});

test("while streaming, everything from the opening fence onward is hidden", () => {
  assert.equal(visibleAnswer("The answer.\n\n```evidence\n[{\"po"), "The answer.");
  assert.equal(visibleAnswer("The answer.\n\n```evid"), "The answer.");
  assert.equal(visibleAnswer("The answer.\n\n``"), "The answer.");
  assert.equal(visibleAnswer("Plain answer so far"), "Plain answer so far");
  assert.equal(visibleAnswer("Code:\n```ts\nx\n```"), "Code:\n```ts\nx\n```");
});

test("labels resolve to vault files and book chapters from the turn's sources; unknown stays plain", () => {
  const known = [
    { label: "File Technical Strategy/Feature-Rationale.md (part 2)", slug: "heritage", id: "file:Technical Strategy/Feature-Rationale#2" },
    { label: "Heritage · Book, chapter 2: Why they bought", slug: "heritage", id: "chapter:1" },
    { label: "Account: deals", slug: "heritage", id: "account:deals" },
  ];
  const ev: Evidence[] = splitEvidence(`A.\n\n${block(JSON.stringify([
    item,
    { point: "Why", source: "[Heritage · Book, chapter 2: Why they bought]", quote: "q" },
    { point: "Deal", source: "Account: deals", quote: null },
    { point: "Made up", source: "File Nowhere.md", quote: null },
  ]))}`).evidence;
  const r = resolveRefs(ev, known);
  assert.deepEqual(r[0].ref, { kind: "file", slug: "heritage", id: "Technical Strategy/Feature-Rationale", at: null });
  assert.deepEqual(r[1].ref, { kind: "chapter", slug: "heritage", id: "1", at: null });
  assert.deepEqual(r[2].ref, { kind: "project", slug: "heritage", id: "account:deals", at: null });
  assert.deepEqual(r[3].ref, { kind: "other", slug: null, id: null, at: null });
  assert.equal(evidenceHref(r[0].ref), "/projects/heritage/vault?file=Technical%20Strategy%2FFeature-Rationale");
  assert.equal(evidenceHref(r[1].ref), "/projects/heritage/book?c=1");
  assert.equal(evidenceHref(r[2].ref), "/projects/heritage");
  assert.equal(evidenceHref(r[3].ref), null);
});

test("evidence joined for storage splits back with its resolved refs", () => {
  const ev = resolveRefs(splitEvidence(`A.\n\n${block(JSON.stringify([item]))}`).evidence, [{ label: item.source, slug: "heritage", id: "file:Technical Strategy/Feature-Rationale" }]);
  const stored = joinEvidence("The answer.", ev);
  const back = splitEvidence(stored);
  assert.equal(back.answer, "The answer.");
  assert.deepEqual(back.evidence, ev);
  assert.equal(joinEvidence("No evidence.", []), "No evidence.");
});

test("every evidence block is stripped and their entries merged", () => {
  const two = `First part.\n\n${block(JSON.stringify([item]))}\n\nSecond part.\n\n${block(JSON.stringify([{ ...item, point: "Second point" }]))}`;
  const { answer, evidence } = splitEvidence(two);
  assert.equal(answer, "First part.\n\nSecond part.");
  assert.deepEqual(evidence.map((e) => e.point), ["Bought for speed", "Second point"]);
});

test("an evidence fence that does not start a line is still found", () => {
  const { answer, evidence } = splitEvidence(`They bought for speed.\`\`\`evidence\n${JSON.stringify([item])}\n\`\`\``);
  assert.equal(answer, "They bought for speed.");
  assert.equal(evidence.length, 1);
  assert.equal(visibleAnswer("They bought for speed.```evidence\n[{"), "They bought for speed.");
});

test("a final json block of points and sources is taken as evidence", () => {
  const { answer, evidence } = splitEvidence(`They bought for speed.\n\n\`\`\`json\n${JSON.stringify([item])}\n\`\`\`\n`);
  assert.equal(answer, "They bought for speed.");
  assert.equal(evidence.length, 1);
});

test("a json block mid-answer, or one that is not points and sources, stays visible", () => {
  const mid = "Their config:\n\n```json\n[{\"point\":\"p\",\"source\":\"File X.md\"}]\n```\n\nThat is all they sent.";
  assert.deepEqual(splitEvidence(mid), { answer: mid, evidence: [] });
  const other = "The payload:\n\n```json\n[{\"name\":\"x\"}]\n```";
  assert.deepEqual(splitEvidence(other), { answer: other, evidence: [] });
});

test("a reply that is only an evidence block leaves nothing to show", () => {
  assert.equal(splitEvidence(block(JSON.stringify([item]))).answer, "");
});

test("history sent back to Stella has no evidence and no empty assistant turns", () => {
  const out = stripHistory([
    { role: "user" as const, content: "Q1" },
    { role: "assistant" as const, content: `A1.\n\n${block(JSON.stringify([item]))}` },
    { role: "user" as const, content: "Q2" },
    { role: "assistant" as const, content: block(JSON.stringify([item])) },
    { role: "user" as const, content: "Q3" },
  ]);
  assert.deepEqual(out.map((t) => t.content), ["Q1", "A1.", "Q2", "(answered)", "Q3"]);
  for (let i = 1; i < out.length; i++) assert.notEqual(out[i].role, out[i - 1].role);
});

test("a call label resolves to the recording link with its date", () => {
  const known = [
    { label: "Call: Weekly sync, 2026-11-12", slug: "rxvip", id: "call:t1", url: "https://fathom.video/calls/1", at: "2026-11-12" },
    { label: "Call: Kickoff, 2026-10-01", slug: "rxvip", id: "call:t2", url: "javascript:alert(1)", at: "2026-10-01" },
  ];
  const ev = splitEvidence(`A.\n\n${block(JSON.stringify([
    { point: "Price cut", source: "Call: Weekly sync, 2026-11-12", quote: "we should cut the price" },
    { point: "Kickoff", source: "RxVIP · Call: Kickoff, 2026-10-01", quote: null },
  ]))}`).evidence;
  const r = resolveRefs(ev, known);
  assert.deepEqual(r[0].ref, { kind: "call", slug: "rxvip", id: "t1", at: "2026-11-12", url: "https://fathom.video/calls/1" });
  assert.equal(evidenceHref(r[0].ref), "https://fathom.video/calls/1");
  // an unsafe link is never kept
  assert.equal(r[1].ref.kind, "call");
  assert.equal(evidenceHref(r[1].ref), null);
  // stored and read back, the link survives
  const back = splitEvidence(joinEvidence("A.", r)).evidence;
  assert.equal(evidenceHref(back[0].ref), "https://fathom.video/calls/1");
  assert.equal(evidenceHref(back[1].ref), null);
});
