import "server-only";
import { currentAccess } from "@/lib/auth/access";
import { listAccounts } from "@/lib/data";
import { db, dbEnabled } from "@/lib/data/db";
import { latestRuns, type Run } from "@/lib/data/runs";
import { byPriority, daysUntil, nextStep, scopingTrack, type Step } from "@/lib/scoping";
import type { Tone } from "@/lib/types";

// Everything one person needs to act on: their deals in scoping (furthest along first, with the
// scoping steps due), this week's workflows on their accounts, what needs a decision, and dates.

export type MyDeal = { slug: string; name: string; parent: string | null; parentName: string | null; stage: string; value: string; owner: string; close: string; days: number | null; accountOsNext: string; track: Step[]; next: Step | null; filled: number; runs: Record<string, Run> };
export type MyWork = { slug: string; name: string; health: { score: string; band: string; tone: Tone } | null; mrr: string; flows: { slug: string; name: string; cadence: string; kind: string; run: Run | null; current: boolean }[] };
export type MyAction = { slug: string; project: string; kind: string; tone: Tone; item: string; detail: string };
export type MyAccount = { slug: string; name: string; health: { score: string; band: string; tone: Tone } | null; mrr: string; roles: string[]; decisions: number; slipping: number; streams: { name: string; pct: number | null; tone: Tone }[]; next: { when: string; what: string } | null };
export type MyViewData = {
  person: { id: string | null; name: string; title: string | null; squad: string | null };
  viewer: { admin: boolean; self: boolean };
  people: { id: string; name: string; title: string | null }[];
  deals: MyDeal[]; work: MyWork[]; actions: MyAction[]; dates: { slug: string; project: string; when: string; what: string }[]; accounts: MyAccount[];
};

const WEEKLY = new Set(["health", "review", "report", "checkin", "pulse"]);
const tone = (t: string): Tone => (["ok", "warn", "err", "info"].includes(t) ? (t as Tone) : "");

function startOfWeek(d = new Date()) { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; }
const isCurrent = (run: Run | null, slug: string) => {
  if (!run) return false;
  const t = new Date(run.startedAt);
  if (WEEKLY.has(slug)) return t >= startOfWeek();
  if (slug === "monthly") { const n = new Date(); return t.getFullYear() === n.getFullYear() && t.getMonth() === n.getMonth(); }
  return true;
};

export async function myView(asPersonId?: string | null): Promise<MyViewData> {
  const access = await currentAccess();
  const all = await listAccounts();
  const names = new Map(all.map((b) => [b.account.slug, b.account.name]));

  // Whose view: yours; an admin may look at anyone's.
  let person = access.person;
  let people: MyViewData["people"] = [];
  if (dbEnabled() && access.admin) {
    const { data } = await db().from("people").select("id,name,title,role,email,squad").order("name");
    people = (data ?? []).map((p) => ({ id: p.id, name: p.name, title: p.title }));
    if (asPersonId) { const p = (data ?? []).find((x) => x.id === asPersonId); if (p) person = { id: p.id, name: p.name, email: p.email, role: p.role, title: p.title, squad: p.squad }; }
  }

  // Their projects and roles: assignments, or (without a database) the strategist named on each project.
  const roles = new Map<string, string[]>();
  if (person && dbEnabled()) {
    const { data } = await db().from("assignments").select("role,accounts!inner(slug)").eq("person_id", person.id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const r of (data ?? []) as any[]) roles.set(r.accounts.slug, [...(roles.get(r.accounts.slug) ?? []), r.role]);
  } else if (!person) {
    for (const b of all) roles.set(b.account.slug, ["strategist"]);
  }
  const mine = all.filter((b) => roles.has(b.account.slug));
  const runs = await latestRuns(mine.map((b) => b.account.slug));
  const runsFor = (slug: string) => Object.fromEntries([...runs.entries()].filter(([k]) => k.startsWith(`${slug}/`)).map(([k, v]) => [k.split("/")[1], v]));

  const deals: MyDeal[] = mine.filter((b) => b.account.stage === "sales" && b.account.deal).map((b) => {
    const a = b.account, d = a.deal!;
    const filled = b.files.filter((f) => f.state !== "deleted" && f.content.trim()).map((f) => f.template ?? "");
    const r = runsFor(a.slug);
    const track = scopingTrack(d.stage, filled, Object.entries(r).filter(([, v]) => v.status === "approved" || v.status === "sent").map(([k]) => k));
    return { slug: a.slug, name: a.name, parent: a.parent, parentName: a.parent ? names.get(a.parent) ?? a.parent : null, stage: d.stage, value: d.value, owner: d.owner, close: d.expectedClose.slice(0, 10),
      days: daysUntil(d.expectedClose), accountOsNext: d.nextStep, track, next: nextStep(track), filled: filled.filter(Boolean).length, runs: r };
  }).sort(byPriority);

  const delivery = mine.filter((b) => b.account.stage === "delivery");
  const work: MyWork[] = delivery.map((b) => {
    const r = runsFor(b.account.slug);
    return { slug: b.account.slug, name: b.account.name, health: b.account.health, mrr: b.account.mrr,
      flows: b.workflows.filter((w) => w.standard && (WEEKLY.has(w.slug) || w.slug === "monthly")).map((w) => ({ slug: w.slug, name: w.name, cadence: w.cadence, kind: w.kind, run: r[w.slug] ?? null, current: isCurrent(r[w.slug] ?? null, w.slug) })) };
  });

  const rank: Record<string, number> = { err: 0, warn: 1, info: 2, "": 3, ok: 4 };
  const actions: MyAction[] = delivery.flatMap((b) => [
    ...(b.overview.decisions ?? []).map((x) => ({ slug: b.account.slug, project: b.account.name, kind: "Decide", tone: "info" as Tone, item: x.title, detail: x.detail })),
    ...(b.overview.slipping ?? []).map((x) => ({ slug: b.account.slug, project: b.account.name, kind: x.kind || "Slipping", tone: tone(x.tone) || "warn", item: x.item, detail: x.detail })),
  ]).sort((a, b) => rank[a.tone] - rank[b.tone] || Number(a.kind !== "Decide") - Number(b.kind !== "Decide"));

  const dates = mine.flatMap((b) => (b.overview.dates ?? []).map((x) => ({ slug: b.account.slug, project: b.account.name, when: x.when, what: x.what })));
  const accounts: MyAccount[] = delivery.map((b) => ({ slug: b.account.slug, name: b.account.name, health: b.account.health, mrr: b.account.mrr, roles: roles.get(b.account.slug) ?? [],
    decisions: b.overview.decisions?.length ?? 0, slipping: b.overview.slipping?.length ?? 0,
    streams: (b.overview.streams ?? []).slice(0, 5).map((s) => ({ name: s.name, pct: s.pct, tone: tone(s.tone) })), next: b.overview.dates?.[0] ?? null }));

  return {
    person: { id: person?.id ?? null, name: person?.name ?? "Everyone", title: person?.title ?? null, squad: person?.squad ?? null },
    viewer: { admin: access.admin, self: !asPersonId || asPersonId === access.person?.id },
    people, deals, work, actions, dates, accounts,
  };
}
