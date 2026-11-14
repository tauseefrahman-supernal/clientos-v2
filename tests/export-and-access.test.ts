import { test } from "node:test";
import assert from "node:assert/strict";
import { buildExport } from "../lib/export.ts";
import { canAssign, canSee } from "../lib/auth/rules.ts";
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
