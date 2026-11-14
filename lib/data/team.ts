import "server-only";
import { db, dbEnabled } from "./db";
import { canAssign, currentAccess, resetAccess, type Person } from "@/lib/auth/access";

// The team on each project (clientos.assignments) and the people list. Strategists on a project and
// admins can add or remove people; admins can make someone an admin.

export type Member = { personId: string; name: string; title: string | null; role: string; source: "import" | "manual"; linked: boolean };
export const ROLES = [["strategist", "Strategist"], ["am", "Account manager"], ["mason", "Mason"], ["fde", "FDE"], ["ae", "Account executive"], ["other", "Other"]] as const;

async function accountId(slug: string) {
  const { data } = await db().from("accounts").select("id").eq("slug", slug).maybeSingle();
  return (data?.id as string) ?? null;
}

export async function projectTeam(slug: string): Promise<Member[]> {
  if (!dbEnabled()) return [];
  const { data } = await db().from("assignments").select("role,source,people!inner(id,name,title,user_id),accounts!inner(slug)").eq("accounts.slug", slug);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((data ?? []) as any[]).map((r) => ({ personId: r.people.id, name: r.people.name, title: r.people.title, role: r.role, source: r.source, linked: !!r.people.user_id }))
    .sort((a, b) => ROLES.findIndex((x) => x[0] === a.role) - ROLES.findIndex((x) => x[0] === b.role) || a.name.localeCompare(b.name));
}

export async function listPeople(): Promise<(Person & { linked: boolean; projects: number })[]> {
  if (!dbEnabled()) return [];
  const { data } = await db().from("people").select("id,name,email,role,title,squad,user_id,assignments(id)").order("name");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((data ?? []) as any[]).map((p) => ({ id: p.id, name: p.name, email: p.email, role: p.role, title: p.title, squad: p.squad, linked: !!p.user_id, projects: p.assignments?.length ?? 0 }));
}

async function guard(slug: string) {
  const access = await currentAccess();
  if (!canAssign(access, slug)) throw new Error("Only an admin or this project's strategist can change its team.");
  return access;
}

export async function addMember(slug: string, personId: string, role: string) {
  const access = await guard(slug);
  if (!ROLES.some((r) => r[0] === role)) throw new Error("Unknown role.");
  const aid = await accountId(slug);
  if (!aid) throw new Error("No such project.");
  const { error } = await db().from("assignments").upsert({ account_id: aid, person_id: personId, role, source: "manual", created_by: access.person?.name ?? null }, { onConflict: "account_id,person_id,role", ignoreDuplicates: true });
  if (error) throw new Error(error.message);
  resetAccess();
}

export async function removeMember(slug: string, personId: string, role: string) {
  await guard(slug);
  const aid = await accountId(slug);
  if (!aid) throw new Error("No such project.");
  const { error } = await db().from("assignments").delete().eq("account_id", aid).eq("person_id", personId).eq("role", role);
  if (error) throw new Error(error.message);
  resetAccess();
}

export async function setPersonRole(personId: string, role: "admin" | "member") {
  const access = await currentAccess();
  if (!access.admin) throw new Error("Only admins can change roles.");
  if (access.person?.id === personId && role !== "admin") throw new Error("You cannot remove your own admin role.");
  const { error } = await db().from("people").update({ role }).eq("id", personId);
  if (error) throw new Error(error.message);
  resetAccess();
}
