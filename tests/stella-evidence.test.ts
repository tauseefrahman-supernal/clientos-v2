import { test } from "node:test";
import assert from "node:assert/strict";
import { evidenceHref, joinEvidence, resolveRefs, splitEvidence, visibleAnswer, type Evidence } from "../lib/stella/evidence.ts";

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
