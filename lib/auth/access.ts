import "server-only";
import { cache } from "react";
import { db, dbEnabled } from "@/lib/data/db";
import { authEnabled } from "./config";
import { currentUser } from "./server";
import { matchPersonByEmail } from "./rules";

// Role-based access. Admins see every project; everyone else sees the projects they are assigned
// to (from Account OS pods and deals, or added by a strategist). A signed-in user is linked to a
// person on the team by exact email only; anyone else is added with no projects until an admin assigns or links them.

export type Person = { id: string; name: string; email: string | null; role: "admin" | "member"; title: string | null; squad: string | null };
export type Access = { person: Person | null; admin: boolean; slugs: Set<string> | null; roles: Map<string, string[]> };

const OPEN: Access = { person: null, admin: true, slugs: null, roles: new Map() };
const TTL = 30_000;
const G = globalThis as unknown as { __clientosAccess?: Map<string, { at: number; access: Access }> };
const memo = () => (G.__clientosAccess ??= new Map());

/** Forget cached access (after assignments or roles change). */
export function resetAccess() { memo().clear(); }

async function personFor(user: { id: string; email: string; name: string }): Promise<Person | null> {
  const cols = "id,name,email,role,title,squad,user_id";
  const q = db().from("people");
  let { data } = await q.select(cols).eq("user_id", user.id).maybeSingle();
  if (!data) {
    // Not linked yet: only the row whose email is exactly theirs (ignoring case), and only if no one else holds it.
    // Never by name (a new sign-in could take over a teammate's row and access), and not with ilike, where _ and % are
    // wildcards. The team list is small, so it is matched here (lib/auth/rules.ts matchPersonByEmail).
    const { data: rows } = await db().from("people").select(cols).not("email", "is", null);
    const hit = matchPersonByEmail(rows ?? [], user.email);
    data = hit && (!hit.user_id || hit.user_id === user.id) ? hit : null;
  }
  if (data) {
    if (data.user_id !== user.id || data.email !== user.email) await db().from("people").update({ user_id: user.id, email: user.email }).eq("id", data.id);
    return { id: data.id, name: data.name, email: user.email, role: data.role, title: data.title, squad: data.squad };
  }
  const { data: made, error } = await db().from("people").insert({ name: user.name, email: user.email, user_id: user.id, role: "member", source: "signin" }).select(cols).single();
  if (error || !made) return null;
  return { id: made.id, name: made.name, email: made.email, role: made.role, title: made.title, squad: made.squad };
}

async function load(user: { id: string; email: string; name: string }): Promise<Access> {
  const person = await personFor(user);
  if (!person) return { person: null, admin: false, slugs: new Set(), roles: new Map() };
  const { data } = await db().from("assignments").select("role,accounts(slug)").eq("person_id", person.id);
  const roles = new Map<string, string[]>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const r of (data ?? []) as any[]) { const slug = r.accounts?.slug; if (slug) roles.set(slug, [...(roles.get(slug) ?? []), r.role]); }
  const admin = person.role === "admin";
  return { person, admin, slugs: admin ? null : new Set(roles.keys()), roles };
}

/** Access for this request. Open (everything) when sign-in or the database is off, or for local scripts. */
export const currentAccess = cache(async (): Promise<Access> => {
  if (!authEnabled() || !dbEnabled()) return OPEN;
  const user = await currentUser();
  if (!user) return OPEN; // the middleware lets no signed-out browser through; only local dev scripts get here
  const hit = memo().get(user.id);
  if (hit && Date.now() - hit.at < TTL) return hit.access;
  const access = await load(user);
  memo().set(user.id, { at: Date.now(), access });
  return access;
});

export { actionAllowed, actionRefusal, ADMIN_ONLY, canAssign, canOverride, canSee, matchPersonByEmail, NO_PROJECT_ACCESS, Refusal, runDecisionGate, type ActionKind, type ActionResult } from "./rules";
