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
