import { test } from "node:test";
import assert from "node:assert/strict";
import { byPriority, daysUntil, nextStep, scopingTrack } from "../lib/scoping.ts";
import { searchableCallFilter, workflowBrief } from "../lib/workflow-brief.ts";

const states = (t: { state: string }[]) => t.map((s) => s.state).join(",");

test("a deal at Order Form with only the intake is behind on every earlier step", () => {
  const t = scopingTrack("Order Form", ["Sales-Intake"]);
  assert.equal(states(t), "done,behind,behind,behind,behind,behind,behind,now");
  assert.equal(nextStep(t)?.slug, "research");
});

test("filled files and approved runs mark steps done", () => {
  const t = scopingTrack("Proposal", ["Sales-Intake", "Sales-Research", "Discovery-Readout", "Concept-Alignment", "Prototype-Summary"], ["deal-desk"]);
  assert.equal(states(t), "done,done,done,done,done,now,done,later");
  assert.equal(nextStep(t)?.slug, "proposal");
});

test("an early deal has nothing behind", () => {
  const t = scopingTrack("Idea", ["Sales-Intake"]);
  assert.equal(states(t), "done,later,later,later,later,later,later,later");
  assert.equal(nextStep(t)?.slug, "research");
});

test("an unknown stage is treated as the first stage", () => {
  assert.equal(scopingTrack("Somewhere", [])[0].state, "now");
});

test("a fully scoped deal has no next step", () => {
  const t = scopingTrack("Order Form", ["Sales-Intake", "Sales-Research", "Discovery-Readout", "Concept-Alignment", "Prototype-Summary", "Proposal"], ["deal-desk", "order-form"]);
  assert.equal(nextStep(t), null);
});

test("deals sort by furthest stage, then soonest close, with no date last", () => {
  const deals = [
    { name: "a", stage: "Proposal", close: "2026-12-10" },
    { name: "b", stage: "Order Form", close: "" },
    { name: "c", stage: "Order Form", close: "2026-11-16" },
    { name: "d", stage: "Idea", close: "2026-11-01" },
  ];
  assert.deepEqual([...deals].sort(byPriority).map((d) => d.name), ["c", "b", "a", "d"]);
});

test("days until a close date", () => {
  const today = new Date(2026, 10, 14);
  assert.equal(daysUntil("2026-11-16", today), 2);
  assert.equal(daysUntil("2026-11-10", today), -4);
  assert.equal(daysUntil("", today), null);
});

const intake = { name: "Sales intake", inputs: ["Sales-Intake", "Deal-Brief"] };

test("with calls, the workflow brief sends Stella to the project's calls as well as its vault files", () => {
  const b = workflowBrief(intake, 3);
  assert.match(b, /Sales-Intake, Deal-Brief/);
  assert.match(b, /search_calls/);
  assert.match(b, /3 calls/);
  assert.ok(b.indexOf("summaries") < b.indexOf("transcripts"), "summaries come before transcripts");
  assert.match(b, /exact wording/);
  assert.match(b, /who said what/);
  assert.match(b, /title and date/);
  assert.match(b, /30 days/);
  assert.doesNotMatch(b, /no calls yet/i);
});

test("with one call, the brief says so in the singular", () => {
  assert.match(workflowBrief(intake, 1), /1 call\b/);
});

test("without calls, the workflow brief says there are none and marks call facts as gaps", () => {
  const b = workflowBrief(intake, 0);
  assert.match(b, /Sales-Intake, Deal-Brief/);
  assert.match(b, /no calls yet/i);
  assert.match(b, /gap/);
  assert.doesNotMatch(b, /search_calls/);
});

test("a workflow with no input files still points Stella at the vault", () => {
  assert.match(workflowBrief({ name: "Discovery readout", inputs: [] }, 0), /vault/);
});

test("with calls, the brief says documents cite calls inline, not in an evidence block", () => {
  const b = workflowBrief(intake, 2);
  assert.match(b, /inline/);
  assert.match(b, /\[Call: <title>, <date>\]/);
  assert.doesNotMatch(b, /evidence block/);
});

test("when the call count is unknown, the brief neither claims calls nor says there are none", () => {
  const b = workflowBrief(intake, null);
  assert.match(b, /Sales-Intake, Deal-Brief/);
  assert.match(b, /search_calls/);
  assert.match(b, /if it returns nothing/i);
  assert.match(b, /gap/);
  assert.doesNotMatch(b, /no calls yet/i);
  assert.doesNotMatch(b, /also has \d/);
});

test("the usable-call filter keeps searchable calls that are not personnel and not long gone", () => {
  const f = searchableCallFilter("2026-11-04T00:00:00.000Z");
  for (const part of ["status.eq.digested", "body.not.is.null", "status.neq.personnel", "gone_at.is.null", 'gone_at.gte."2026-11-04T00:00:00.000Z"']) assert.ok(f.includes(part), part);
  assert.ok(!/\s/.test(f), "no spaces in a PostgREST filter");
});
