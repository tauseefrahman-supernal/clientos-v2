import "server-only";
import type { AccountBundle, Category, GroupId, Template, VaultFile } from "@/lib/types";
import { GROUPS } from "@/lib/types";
import { store as seedStore, type Store } from "./seed";
import { dbEnabled, insertFile, loadFromDb, setCategoryStatus, setTemplateStatus, updateFile, type DbStore } from "./db";

// The one data API the pages use. With Supabase configured (NEXT_PUBLIC_SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY) the `clientos` schema is the source of truth: reads come from a
// server copy, and every edit is written to the database before the copy changes. A full load
// takes 1 to 2 seconds, so pages never wait for one after the first: when the copy is older than
// REFRESH_MS it is reloaded in the background while the current copy keeps serving.
// Without it, the store is built from the repo files and edits last until a restart.

const REFRESH_MS = 30_000;
const G = globalThis as unknown as { __clientosDb?: { store: DbStore | null; at: number; loading?: Promise<DbStore> } };

export function backend(): "supabase" | "files" {
  return dbEnabled() ? "supabase" : "files";
}

function reload(): Promise<DbStore> {
  const c = G.__clientosDb ?? (G.__clientosDb = { store: null, at: 0 });
  if (c.loading) return c.loading;
  c.loading = loadFromDb()
    .then((store) => { G.__clientosDb = { store, at: Date.now() }; return store; })
    .catch((e) => { c.loading = undefined; throw e; });
  return c.loading;
}

async function current(): Promise<Store> {
  if (!dbEnabled()) return seedStore();
  const c = G.__clientosDb;
  if (!c?.store) return reload();                       // first load: wait once
  if (Date.now() - c.at > REFRESH_MS) reload().catch((e) => console.error("[data] background reload failed:", e));
  return c.store;                                       // serve the current copy
}

/** Drop the server copy so the next read comes from the database (after an import). */
export function invalidate() {
  delete G.__clientosDb;
}

const accountId = (s: Store, slug: string) => (s as DbStore).ids?.get(slug) ?? null;

export async function listAccounts(): Promise<AccountBundle[]> {
  return [...(await current()).accounts.values()];
}

export async function getAccount(slug: string): Promise<AccountBundle | null> {
  return (await current()).accounts.get(slug) ?? null;
}

export async function listCategories(): Promise<Category[]> {
  return [...(await current()).categories.values()];
}

export async function listTemplates(): Promise<Template[]> {
  return (await current()).templates;
}

/** Accounts whose vault holds a file made from this category (or template). */
export async function usage(category: string, template?: string) {
  const out: { slug: string; name: string; path: string }[] = [];
  for (const b of (await current()).accounts.values()) {
    const f = b.files.find((x) => x.category === category && (!template || x.template === template) && x.state !== "deleted");
    if (f) out.push({ slug: b.account.slug, name: b.account.name, path: f.path });
  }
  return out;
}

export async function setFileState(slug: string, path: string, patch: Partial<Pick<VaultFile, "state" | "inBook" | "content" | "shown">>, by = "You") {
  const s = await current();
  const f = s.accounts.get(slug)?.files.find((x) => x.path === path);
  if (!f) return null;
  const id = accountId(s, slug);
  if (id) await updateFile(id, path, patch, by);
  Object.assign(f, patch);
  if (patch.content !== undefined) f.source = "human";
  return f;
}

export async function proposeTemplate(slug: string, path: string, by: string) {
  const s = await current();
  const f = s.accounts.get(slug)?.files.find((x) => x.path === path);
  if (!f || !f.category || !f.template) return null;
  const t = s.templates.find((x) => x.category === f.category && x.name === f.template && (!x.onlyAccount || x.onlyAccount === slug));
  if (!t) return null;
  const c = s.categories.get(f.category);
  if (dbEnabled()) {
    await setTemplateStatus(t, t.onlyAccount ? accountId(s, t.onlyAccount) : null, "proposed", { onlyAccount: null, createdBy: by });
    if (c && c.status === "local") await setCategoryStatus(c.slug, "proposed");
  }
  t.status = "proposed";
  t.onlyAccount = null;
  t.createdBy = by;
  if (c && c.status === "local") c.status = "proposed";
  return t;
}

export async function decide(kind: "category" | "template", category: string, template: string | null, approve: boolean) {
  const s = await current();
  const status = approve ? "shared" : "local";
  if (kind === "category") {
    const c = s.categories.get(category);
    if (c) { if (dbEnabled()) await setCategoryStatus(c.slug, status); c.status = status; }
    return c ?? null;
  }
  const t = s.templates.find((x) => x.category === category && x.name === template && x.status === "proposed") ?? s.templates.find((x) => x.category === category && x.name === template);
  if (t) { if (dbEnabled()) await setTemplateStatus(t, t.onlyAccount ? accountId(s, t.onlyAccount) : null, status); t.status = status; }
  return t ?? null;
}

export async function pendingApprovals() {
  const s = await current();
  return {
    categories: [...s.categories.values()].filter((c) => c.status === "proposed"),
    templates: s.templates.filter((t) => t.status === "proposed" && s.categories.get(t.category)?.status !== "proposed"),
  };
}

/** Put a template into a project's vault, in the given group. Brings back an existing file instead of duplicating it. */
export async function addTemplateFile(slug: string, category: string, template: string, group: GroupId) {
  const s = await current();
  const b = s.accounts.get(slug);
  const t = s.templates.find((x) => x.category === category && x.name === template);
  if (!b || !t) return null;
  const id = accountId(s, slug);
  const existing = b.files.find((x) => x.template === template && x.category === category);
  if (existing) {
    if (id) await updateFile(id, existing.path, { state: "active", shown: true }, "You");
    existing.state = "active"; existing.shown = true;
    return existing;
  }
  const f: VaultFile = { path: `${GROUPS[group]}/${template}`, category, template, group, summary: t.description, content: "", source: "template", state: "active", shown: true, inBook: true };
  if (id) await insertFile(id, f);
  b.files.push(f);
  return f;
}

const CATEGORY_OF_GROUP = ["core-sales", "core-deal", "core-tech", "core-delivery"];

/** Save a document (from Stella, or a file someone uploaded) into a project's vault as a new file in a group. */
export async function addDocumentFile(slug: string, group: GroupId, title: string, content: string, by: string) {
  const s = await current();
  const b = s.accounts.get(slug);
  if (!b) return null;
  const base = title.replace(/\.(md|markdown|txt)$/i, "").replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "").slice(0, 60) || "Document";
  let name = base, n = 2;
  while (b.files.some((f) => f.path === `${GROUPS[group]}/${name}` && f.state !== "deleted")) name = `${base}-${n++}`;
  const f: VaultFile = { path: `${GROUPS[group]}/${name}`, category: CATEGORY_OF_GROUP[group], template: null, group, summary: title.slice(0, 160), content, source: "stella", state: "active", shown: true, inBook: false };
  const id = accountId(s, slug);
  if (id) await insertFile(id, f);
  b.files.push(f);
  void by;
  return f;
}
