import "server-only";
import type { AccountBundle, Category, GroupId, Template, VaultFile } from "@/lib/types";
import { GROUPS } from "@/lib/types";
import { store } from "./seed";

// The one data API the pages use. Backed by the seed store today; a Supabase backend
// with the same functions replaces it once the clientos schema is migrated.

export function listAccounts() {
  return [...store().accounts.values()];
}

export function getAccount(slug: string): AccountBundle | null {
  return store().accounts.get(slug) ?? null;
}

export function listCategories(): Category[] {
  return [...store().categories.values()];
}

export function listTemplates(): Template[] {
  return store().templates;
}

/** Accounts whose vault holds a file made from this category (or template). */
export function usage(category: string, template?: string) {
  const out: { slug: string; name: string; path: string }[] = [];
  for (const b of store().accounts.values()) {
    const f = b.files.find((x) => x.category === category && (!template || x.template === template) && x.state !== "deleted");
    if (f) out.push({ slug: b.account.slug, name: b.account.name, path: f.path });
  }
  return out;
}

export function setFileState(slug: string, path: string, patch: Partial<Pick<VaultFile, "state" | "inBook" | "content" | "shown">>) {
  const b = getAccount(slug);
  const f = b?.files.find((x) => x.path === path);
  if (!f) return null;
  Object.assign(f, patch);
  if (patch.content !== undefined) f.source = "human";
  return f;
}

export function proposeTemplate(slug: string, path: string, by: string) {
  const b = getAccount(slug);
  const f = b?.files.find((x) => x.path === path);
  if (!f || !f.category || !f.template) return null;
  const t = store().templates.find((x) => x.category === f.category && x.name === f.template);
  if (!t) return null;
  t.status = "proposed";
  t.onlyAccount = null;
  t.createdBy = by;
  const c = store().categories.get(f.category);
  if (c && c.status === "local") c.status = "proposed";
  return t;
}

export function decide(kind: "category" | "template", category: string, template: string | null, approve: boolean) {
  const s = store();
  if (kind === "category") {
    const c = s.categories.get(category);
    if (c) c.status = approve ? "shared" : "local";
    return c ?? null;
  }
  const t = s.templates.find((x) => x.category === category && x.name === template);
  if (t) t.status = approve ? "shared" : "local";
  return t ?? null;
}

export function pendingApprovals() {
  const s = store();
  return {
    categories: [...s.categories.values()].filter((c) => c.status === "proposed"),
    templates: s.templates.filter((t) => t.status === "proposed" && s.categories.get(t.category)?.status !== "proposed"),
  };
}

/** Put a template into a project's vault, in the given group. Brings back an existing file instead of duplicating it. */
export function addTemplateFile(slug: string, category: string, template: string, group: GroupId) {
  const b = getAccount(slug);
  const t = store().templates.find((x) => x.category === category && x.name === template);
  if (!b || !t) return null;
  const existing = b.files.find((x) => x.template === template && x.category === category);
  if (existing) { existing.state = "active"; existing.shown = true; return existing; }
  const f: VaultFile = { path: `${GROUPS[group]}/${template}`, category, template, group, summary: t.description, content: "", source: "template", state: "active", shown: true, inBook: true };
  b.files.push(f);
  return f;
}
