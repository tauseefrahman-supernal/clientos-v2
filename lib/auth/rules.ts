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
 * Who may override a call's screen or project links: admins every action; the project's strategists may assign or
 * unassign that project's calls; marking a call personnel or not personnel is for admins only.
 */
export const canOverride = (a: AccessLike, slug: string | null, action: string): boolean => {
  if (action === "assign" || action === "unassign") return slug !== null && canAssign(a, slug);
  if (action === "personnel" || action === "not_personnel") return a.admin;
  return false;
};
