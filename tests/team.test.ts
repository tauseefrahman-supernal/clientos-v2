import { test } from "node:test";
import assert from "node:assert/strict";
import { buildTeam } from "../lib/data/people-seed.ts";

// A minimal store: two accounts in delivery, a new deal and an expansion on one of the accounts.
const bundle = (slug: string, stage: "delivery" | "sales", pod: string, extra: Record<string, unknown> = {}) =>
  [slug, { account: { slug, stage, pod, strategist: "", parent: null, deal: null, ...extra } }] as const;

const store = {
  accounts: new Map<string, unknown>([
    bundle("rxvip", "delivery", "Nick Agresti (AM), Tauseef Rahman (strategist), Doren Gore (FDE)"),
    bundle("rafferty", "delivery", "Johnny Borbone (AM), Katie Jefferson (strategist), Thomas Bustos (CAIO, Holdings)"),
    bundle("deal-new", "sales", "Nick (AE)", { deal: { owner: "Nick" }, strategist: "Dominik" }),
    bundle("deal-rx-expansion", "sales", "Stu (AE)", { deal: { owner: "Stu" }, parent: "rxvip" }),
  ]),
  categories: new Map(),
  templates: [],
};
const pipeline = { squads: [{ name: "Polaris", members: ["Tauseef Rahman", "Dominik Springer", "Doren Gore"] }] };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const team = buildTeam(store as any, pipeline);
const on = (slug: string) => team.assignments.filter((a) => a.slug === slug).map((a) => `${a.name}:${a.role}`).sort();

test("pods become assignments with their roles", () => {
  assert.deepEqual(on("rxvip"), ["Doren Gore:fde", "Nick Agresti:am", "Tauseef Rahman:strategist"]);
});

test("client people in a pod are left out", () => {
  assert.ok(!team.people.some((p) => p.name === "Thomas Bustos"));
});

test("first names resolve to the full name; Stu is Stuart Childs", () => {
  assert.deepEqual(on("deal-new"), ["Dominik Springer:strategist", "Nick Agresti:ae"]);
  assert.ok(on("deal-rx-expansion").includes("Stuart Childs:ae"));
});

test("an expansion also gets its account's pod", () => {
  assert.deepEqual(on("deal-rx-expansion"), ["Doren Gore:fde", "Nick Agresti:am", "Stuart Childs:ae", "Tauseef Rahman:strategist"]);
});

test("listed admins are admins, squads come from the squad list, titles from the commonest role", () => {
  const t = team.people.find((p) => p.name === "Tauseef Rahman")!;
  assert.equal(t.admin, true);
  assert.equal(t.squad, "Polaris");
  assert.equal(t.title, "Strategist");
  assert.equal(team.people.find((p) => p.name === "Nick Agresti")!.admin, false);
});

test("no duplicate assignments", () => {
  const keys = team.assignments.map((a) => `${a.slug}|${a.name}|${a.role}`);
  assert.equal(new Set(keys).size, keys.length);
});
