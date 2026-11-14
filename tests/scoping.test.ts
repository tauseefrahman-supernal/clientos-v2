import { test } from "node:test";
import assert from "node:assert/strict";
import { byPriority, daysUntil, nextStep, scopingTrack } from "../lib/scoping.ts";

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
