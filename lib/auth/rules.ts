// Access rules, kept free of server code so the tests can check them directly.

export type AccessLike = { admin: boolean; slugs: Set<string> | null; roles: Map<string, string[]> };

/** Admins (slugs null) see every project; everyone else only the projects they are assigned to. */
export const canSee = (a: AccessLike, slug: string): boolean => a.slugs === null || a.slugs.has(slug);

/** Admins, and strategists on the project, can change who is assigned to it. */
export const canAssign = (a: AccessLike, slug: string): boolean => a.admin || (a.roles.get(slug) ?? []).includes("strategist");
