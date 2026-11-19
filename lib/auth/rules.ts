// Access rules, kept free of server code so the tests can check them directly.

export type AccessLike = { admin: boolean; slugs: Set<string> | null; roles: Map<string, string[]> };

/** Admins (slugs null) see every project; everyone else only the projects they are assigned to. */
export const canSee = (a: AccessLike, slug: string): boolean => a.slugs === null || a.slugs.has(slug);

/** Admins, and strategists on the project, can change who is assigned to it. */
export const canAssign = (a: AccessLike, slug: string): boolean => a.admin || (a.roles.get(slug) ?? []).includes("strategist");

/**
 * Who may approve, mark sent or discard a run (approving writes into the project's vault): admins and
 * the project's strategists. null when allowed; 404 when the run has no project; 403 otherwise.
 */
export const runDecisionGate = (a: AccessLike, slug: string | null): 403 | 404 | null => (slug === null ? 404 : canAssign(a, slug) ? null : 403);

/**
 * Who may override a call's screen or project links. Admins every action. A project's strategist may only unassign a
 * call that is currently linked to their project (so they can't pull in, and then read, a call by id); assigning and
 * marking a call personnel or not personnel are admin only.
 */
export const canOverride = (a: AccessLike, slug: string | null, action: string, linkedToSlug = false): boolean => {
  if (action === "assign" || action === "personnel" || action === "not_personnel") return a.admin && (action !== "assign" || slug !== null);
  if (action === "unassign") return slug !== null && (a.admin || (linkedToSlug && canAssign(a, slug)));
  return false;
};

/** What a server action changes, for the access check it needs (see actionAllowed). */
export type ActionKind = "vault" | "team" | "approval" | "role";

export const NO_PROJECT_ACCESS = "You don't have access to that project.";

/**
 * Server-side check for every server action in app/actions.ts:
 * - vault: a vault file or document write on a project (save, state, in book, shown, propose a template, add a
 *   template or document): anyone who can see the project, so assigned people may edit their project's vault.
 * - team: adding or removing someone on a project's team: admins and the project's strategists (canAssign).
 * - approval: approving or declining a shared category or template: admins only.
 * - role: changing a person's admin/member role: admins only.
 * A project-scoped kind with no slug is refused.
 */
export const actionAllowed = (a: AccessLike, kind: ActionKind, slug: string | null = null): boolean => {
  if (kind === "approval" || kind === "role") return a.admin;
  if (typeof slug !== "string" || !slug) return false;
  return kind === "vault" ? canSee(a, slug) : canAssign(a, slug);
};

/**
 * What a server action returns. Next masks thrown Error messages in production, so a refusal the person should read
 * comes back as { ok: false, error } instead of being thrown.
 */
export type ActionResult<T = null> = { ok: true; value: T } | { ok: false; error: string };

/** A refusal whose message is safe and meant for the person (access, a missing or changed file, a bad role). */
export class Refusal extends Error {}

export const ADMIN_ONLY = "Only an admin can do that.";

/** The access check as a result: null when allowed, else the refusal to return. */
export const actionRefusal = (a: AccessLike, kind: ActionKind, slug: string | null = null): { ok: false; error: string } | null =>
  actionAllowed(a, kind, slug) ? null : { ok: false, error: kind === "approval" || kind === "role" ? ADMIN_ONLY : NO_PROJECT_ACCESS };

/** Client side: the action's value, or throws its refusal message (the callers already show e.message). */
export function unwrapAction<T>(r: ActionResult<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

/**
 * Who a signed-in user is on the team: only the people row whose email equals theirs (ignoring case and surrounding
 * spaces). Never by name, so a new sign-in cannot take over someone else's row and access; no match means no access
 * until an admin links them.
 */
export function matchPersonByEmail<P extends { email: string | null }>(people: P[], email: string): P | null {
  const want = email.trim().toLowerCase();
  if (!want) return null;
  const hits = people.filter((p) => typeof p.email === "string" && p.email.trim().toLowerCase() === want);
  return hits.length === 1 ? hits[0] : null;
}
