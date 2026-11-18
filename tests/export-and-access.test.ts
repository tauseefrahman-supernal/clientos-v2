import { test } from "node:test";
import assert from "node:assert/strict";
import { buildExport } from "../lib/export.ts";
import { actionAllowed, canAssign, canOverride, canSee, runDecisionGate } from "../lib/auth/rules.ts";
import { allowedEmail, supabaseUrl } from "../lib/auth/config.ts";

const file = (path: string, content: string, state = "active", group = 0) => ({ path, content, state, group, category: null, template: null, summary: "", source: "import", inBook: true });
const project = (slug: string, name: string) => ({
  account: { slug, name, stage: "delivery", industry: "Pharmacy", squad: "Polaris", strategist: "Tauseef Rahman", mrr: "$1,000", health: null, deal: null },
  overview: { deals: [], decisions: [], slipping: [], dates: [] },
  files: [
    file("Sales Strategy/Sales-Context", "# Sales Context\n\n## Origin\n\nA referral."),
    file("Sales Strategy/Sales-Research", ""),
    file("Deal Strategy/Secret", "Kept from view", "hidden", 1),
    file("Deal Strategy/Old", "Archived text", "archived", 1),
  ],
  book: [{ sort: 0, title: "The account", body: "Chapter text.", sources: ["Kickoff, 1 Jun"], minutes: 1, lenses: ["all"] }],
  artifacts: [{ id: "a", kind: "Doc", title: "Order form", dated: "1 Jun", description: "", url: "https://example.com", provider: "Drive", sensitive: false },
    { id: "b", kind: "Doc", title: "Family tax return", dated: "", description: "", url: "", provider: "Drive", sensitive: true }],
  workflows: [],
});

test("an export keeps filled, active files and the book, and leaves out empty, hidden, archived and sensitive", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { markdown, stats } = buildExport([project("rx", "RxVIP")] as any, { parts: ["vault", "book", "artifacts"] });
  assert.match(markdown, /A referral\./);
  assert.match(markdown, /Chapter text\./);
  assert.match(markdown, /Order form/);
  assert.doesNotMatch(markdown, /Kept from view|Archived text|Family tax return/);
  assert.equal(stats.files, 1);
  assert.equal(stats.chapters, 1);
});

test("file headings sit under the export's structure", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { markdown } = buildExport([project("rx", "RxVIP")] as any, { parts: ["vault"] });
  assert.match(markdown, /^##### Origin$/m);
  assert.doesNotMatch(markdown, /^# Sales Context$/m);
});

test("a multi-project export has a contents list", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { markdown, stats } = buildExport([project("rx", "RxVIP"), project("we", "World Emblem")] as any, { parts: ["vault"] });
  assert.match(markdown, /## Contents/);
  assert.equal(stats.projects, 2);
});

test("admins see everything; members only their projects; strategists and admins assign", () => {
  const admin = { admin: true, slugs: null, roles: new Map() };
  const member = { admin: false, slugs: new Set(["rxvip"]), roles: new Map([["rxvip", ["am"]], ["deal-x", ["strategist"]]]) };
  assert.ok(canSee(admin, "anything"));
  assert.ok(canSee(member, "rxvip"));
  assert.ok(!canSee(member, "heritage"));
  assert.ok(canAssign(admin, "anything"));
  assert.ok(!canAssign(member, "rxvip"));
  assert.ok(canAssign(member, "deal-x"));
});

test("only admins and the project's strategists may approve, send or discard its runs", () => {
  const admin = { admin: true, slugs: null, roles: new Map() };
  const member = { admin: false, slugs: new Set(["rxvip", "deal-x"]), roles: new Map([["rxvip", ["am"]], ["deal-x", ["strategist"]]]) };
  assert.equal(runDecisionGate(admin, "anything"), null);
  assert.equal(runDecisionGate(member, "deal-x"), null);
  assert.equal(runDecisionGate(member, "rxvip"), 403);
  assert.equal(runDecisionGate(member, "heritage"), 403);
  assert.equal(runDecisionGate(member, null), 404);
});

test("admins override everything; a strategist only unassigns a call already on their project; members never screen", () => {
  const admin = { admin: true, slugs: null, roles: new Map() };
  const strategist = { admin: false, slugs: new Set(["rxvip", "heritage"]), roles: new Map([["rxvip", ["strategist"]], ["heritage", ["am"]]]) };
  const member = { admin: false, slugs: new Set(["rxvip"]), roles: new Map([["rxvip", ["am"]]]) };
  for (const action of ["assign", "unassign", "personnel", "not_personnel"]) assert.ok(canOverride(admin, action.endsWith("assign") ? "rxvip" : null, action), action);
  assert.ok(!canOverride(admin, null, "assign"));
  // Assigning would let a strategist pull any call (by id) into their project and read it: admin only.
  assert.ok(!canOverride(strategist, "rxvip", "assign"));
  assert.ok(!canOverride(strategist, "rxvip", "assign", true));
  assert.ok(canOverride(strategist, "rxvip", "unassign", true));
  assert.ok(!canOverride(strategist, "rxvip", "unassign"));
  assert.ok(!canOverride(strategist, "heritage", "unassign", true));
  assert.ok(!canOverride(strategist, "we", "unassign", true));
  assert.ok(!canOverride(strategist, null, "unassign", true));
  assert.ok(!canOverride(strategist, "rxvip", "personnel"));
  assert.ok(!canOverride(strategist, "rxvip", "not_personnel"));
  assert.ok(!canOverride(member, "rxvip", "personnel"));
  assert.ok(!canOverride(member, null, "not_personnel"));
  assert.ok(!canOverride(member, "rxvip", "unassign", true));
  assert.ok(!canOverride(admin, "rxvip", "delete"));
});

test("only @getsupernal.ai emails may sign in", () => {
  assert.ok(allowedEmail("tauseef.rahman@getsupernal.ai"));
  assert.ok(allowedEmail("Someone@GetSupernal.AI"));
  assert.ok(!allowedEmail("someone@supernal.ai"));
  assert.ok(!allowedEmail("someone@getsupernal.ai.evil.com"));
  assert.ok(!allowedEmail("getsupernal.ai@gmail.com"));
  assert.ok(!allowedEmail(null));
});

test("a Supabase URL pasted with a path is reduced to its origin", () => {
  const keep = process.env.NEXT_PUBLIC_SUPABASE_URL;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://abc.supabase.co/rest/v1/";
  assert.equal(supabaseUrl(), "https://abc.supabase.co");
  process.env.NEXT_PUBLIC_SUPABASE_URL = "abc.supabase.co";
  assert.equal(supabaseUrl(), "https://abc.supabase.co");
  if (keep === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL; else process.env.NEXT_PUBLIC_SUPABASE_URL = keep;
});

test("server actions: vault writes need the project, team changes its strategist, approvals and roles an admin", () => {
  const admin = { admin: true, slugs: null, roles: new Map<string, string[]>() };
  const strategist = { admin: false, slugs: new Set(["rx"]), roles: new Map([["rx", ["strategist"]]]) };
  const engineer = { admin: false, slugs: new Set(["rx"]), roles: new Map([["rx", ["engineer"]]]) };
  const outsider = { admin: false, slugs: new Set<string>(), roles: new Map<string, string[]>() };
  // [who, kind, slug, allowed]
  const table: [typeof admin, "vault" | "team" | "approval" | "role", string | null, boolean][] = [
    [admin, "vault", "rx", true], [admin, "vault", "other", true], [admin, "team", "other", true], [admin, "approval", null, true], [admin, "role", null, true],
    [strategist, "vault", "rx", true], [strategist, "vault", "other", false], [strategist, "team", "rx", true], [strategist, "team", "other", false],
    [strategist, "approval", null, false], [strategist, "role", null, false],
    [engineer, "vault", "rx", true], [engineer, "vault", "other", false], [engineer, "team", "rx", false], [engineer, "approval", "rx", false], [engineer, "role", null, false],
    [outsider, "vault", "rx", false], [outsider, "team", "rx", false], [outsider, "approval", null, false],
    [admin, "vault", null, false], [admin, "team", "", false], [strategist, "vault", null, false],
  ];
  for (const [who, kind, slug, ok] of table) assert.equal(actionAllowed(who, kind, slug), ok, `${who === admin ? "admin" : who === strategist ? "strategist" : who === engineer ? "engineer" : "outsider"} ${kind} ${slug}`);
});
