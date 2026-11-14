import type { Store } from "./seed";

// The team and who is assigned to which project, derived from what Account OS records: each
// account's pod ("Nick Agresti (AM), Tauseef Rahman (strategist), Doren Gore (FDE)") and each
// deal's owner (AE) and pod strategist. Expansion deals also get their account's pod.

export type Role = "strategist" | "am" | "mason" | "fde" | "ae" | "other";
export type SeedPerson = { name: string; title: string; squad: string | null; admin: boolean };
export type SeedAssignment = { slug: string; name: string; role: Role };

const ROLE_OF: Record<string, Role> = { am: "am", strategist: "strategist", fde: "fde", engineer: "mason", mason: "mason", ae: "ae" };
const TITLE: Record<Role, string> = { strategist: "Strategist", am: "Account manager", mason: "Mason", fde: "FDE", ae: "Account executive", other: "Team" };
// Names Account OS writes in short or two ways.
const ALIASES: Record<string, string> = { "stu": "Stuart Childs", "stu childs": "Stuart Childs", "zack": "Zack Young" };
export const ADMINS = new Set(["Tauseef Rahman"]);

type Pipeline = { squads?: { name: string; members?: string[] }[]; deals?: unknown[] };

export function buildTeam(store: Store, pipeline: Pipeline): { people: SeedPerson[]; assignments: SeedAssignment[] } {
  const bundles = [...store.accounts.values()];
  const podEntries = (pod: string) => pod.split(/,\s*(?![^()]*\))/).map((p) => p.trim().match(/^(.+?)\s*\(([^)]+)\)$/)).filter((m): m is RegExpMatchArray => !!m)
    .map((m) => ({ raw: m[1].trim(), role: ROLE_OF[m[2].trim().toLowerCase()] })).filter((e) => !!e.role);

  // Every full name we know, to resolve first names against.
  const full = new Set<string>(ADMINS);
  for (const b of bundles) for (const e of podEntries(b.account.pod)) if (e.raw.includes(" ")) full.add(e.raw);
  for (const q of pipeline.squads ?? []) for (const m of q.members ?? []) if (m.includes(" ")) full.add(m);
  for (const v of Object.values(ALIASES)) full.add(v);
  const resolve = (raw: string): string => {
    const k = raw.trim().toLowerCase();
    if (ALIASES[k]) return ALIASES[k];
    if (raw.includes(" ")) return raw.trim();
    const hits = [...full].filter((n) => n.split(" ")[0].toLowerCase() === k);
    return hits.length === 1 ? hits[0] : raw.trim();
  };

  const assignments: SeedAssignment[] = [];
  const add = (slug: string, raw: string, role: Role) => { if (raw?.trim()) assignments.push({ slug, name: resolve(raw), role }); };
  const podOf = new Map(bundles.map((b) => [b.account.slug, podEntries(b.account.pod)]));
  for (const b of bundles) {
    const a = b.account;
    if (a.stage === "delivery") { for (const e of podOf.get(a.slug) ?? []) add(a.slug, e.raw, e.role); continue; }
    if (a.deal?.owner) add(a.slug, a.deal.owner, "ae");
    if (a.strategist) add(a.slug, a.strategist, "strategist");
    if (a.parent) for (const e of podOf.get(a.parent) ?? []) add(a.slug, e.raw, e.role);
  }
  const seen = new Set<string>();
  const unique = assignments.filter((x) => { const k = `${x.slug}|${x.name}|${x.role}`; return !seen.has(k) && seen.add(k); });

  const squadOf = new Map<string, string>();
  for (const q of pipeline.squads ?? []) for (const m of q.members ?? []) squadOf.set(resolve(m), q.name);
  const roles = new Map<string, Role[]>();
  for (const x of unique) roles.set(x.name, [...(roles.get(x.name) ?? []), x.role]);
  for (const n of ADMINS) if (!roles.has(n)) roles.set(n, ["strategist"]);
  for (const [n] of squadOf) if (!roles.has(n)) roles.set(n, []);
  const people: SeedPerson[] = [...roles.entries()].map(([name, rs]) => {
    const top = rs.sort((a, b) => rs.filter((r) => r === b).length - rs.filter((r) => r === a).length)[0];
    return { name, title: top ? TITLE[top] : "Team", squad: squadOf.get(name) ?? null, admin: ADMINS.has(name) };
  });
  return { people, assignments: unique };
}
