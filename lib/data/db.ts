import "server-only";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { AccountBundle, Artifact, Category, Chapter, GroupId, Recording, ShareStatus, Template, VaultFile, Workflow } from "@/lib/types";
import { GROUPS } from "@/lib/types";
import type { Store } from "./seed";
import { buildTeam } from "./people-seed";

// Supabase backend for the `clientos` schema. The server uses the service role; row-level
// security keeps the anon and signed-in roles out until per-user policies exist.

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;

export type DbStore = Store & { ids: Map<string, string> };   // project slug -> accounts.id

// Next.js caches server fetches by default; database reads must always be live.
export const noStore: typeof fetch = (input, init) => fetch(input, { ...init, cache: "no-store" });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let client: SupabaseClient<any, any, any> | null = null;

export function dbEnabled(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function db(): SupabaseClient<any, any, any> {
  if (!client) {
    // Use only the origin, so a pasted URL with a path (".../rest/v1/") still works.
    const raw = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL)!.trim();
    const url = new URL(/^https?:\/\//.test(raw) ? raw : `https://${raw}`).origin;
    client = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, { db: { schema: "clientos" }, auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: noStore } });
  }
  return client;
}

function check<T>(res: { data: T; error: { message: string } | null }, what: string): T {
  if (res.error) throw new Error(`Supabase ${what}: ${res.error.message}`);
  return res.data;
}

/** Every row of a table, paging past the 1,000-row response limit. */
async function all(table: string, cols = "*", filter?: (q: any) => any): Promise<Row[]> {
  const out: Row[] = [];
  for (let from = 0; ; from += 1000) {
    let q = db().from(table).select(cols).range(from, from + 999);
    if (filter) q = filter(q);
    const rows = check(await q, `read ${table}`) as Row[];
    out.push(...rows);
    if (rows.length < 1000) return out;
  }
}

const groupOf = (path: string): GroupId => Math.max(0, GROUPS.indexOf(path.split("/")[0] as (typeof GROUPS)[number])) as GroupId;

// ---------------------------------------------------------------- read

export async function loadFromDb(): Promise<DbStore> {
  const [accounts, deals, cats, tpls, files, chapters, arts, wfs, recs] = await Promise.all([
    all("accounts"), all("deals"), all("template_categories"), all("templates"),
    all("vault_files", "account_id,path,category_slug,template_name,summary,content,source,state,in_book,shown"),
    all("book_chapters"), all("artifacts"), all("workflows"),
    // One row per project link: that project's headline, plus the call it points to.
    all("transcript_accounts", "account_id,headline,transcripts(provider,external_id,title,met_at,participants,kind,summary,url,alt_url)"),
  ]);
  const slugOf = new Map(accounts.map((a) => [a.id as string, a.slug as string]));
  const by = <T,>(rows: Row[], map: (r: Row) => T) => {
    const m = new Map<string, T[]>();
    for (const r of rows) { const k = r.account_id as string; if (!m.has(k)) m.set(k, []); m.get(k)!.push(map(r)); }
    return m;
  };
  const filesBy = by<VaultFile>(files, (r) => ({ path: r.path, category: r.category_slug, template: r.template_name, group: groupOf(r.path), summary: r.summary, content: r.content, source: r.source, state: r.state, shown: r.shown ?? undefined, inBook: r.in_book }));
  const booksBy = by<Chapter>(chapters, (r) => ({ sort: r.sort, title: r.title, minutes: r.minutes, lenses: r.lenses, body: r.body, sources: r.sources ?? [] }));
  const artsBy = by<Artifact>(arts, (r) => ({ id: r.key ?? r.id, kind: r.kind, title: r.title, dated: r.dated ?? "", description: r.description, url: r.url ?? "", provider: r.provider ?? "", sensitive: r.sensitive }));
  const wfBy = by<Workflow>(wfs, (r) => ({ slug: r.slug, name: r.name, kind: r.kind, cadence: r.cadence ?? "", audience: r.audience ?? "", inputs: r.inputs ?? [], output: r.output ?? "", note: r.note ?? "", standard: r.standard }));
  // The Recordings list shows the project's headline; the call's own summary stands in when there is none.
  const recsBy = by<Recording>(recs, ({ headline, transcripts: t }) => ({ provider: t.provider, id: t.external_id, title: t.title, date: t.met_at ?? "", participants: t.participants ?? [], kind: t.kind, summary: headline || t.summary || "", url: t.url ?? "", altUrl: t.alt_url ?? "" }));
  const dealOf = new Map(deals.map((d) => [d.account_id as string, d]));

  const s: DbStore = { accounts: new Map(), categories: new Map(), templates: [], ids: new Map() };
  for (const a of accounts) {
    const sum = a.summary ?? {};
    const d = dealOf.get(a.id);
    const bundle: AccountBundle = {
      account: {
        slug: a.slug, stage: a.stage, parent: a.parent_slug ?? null, industry: a.industry ?? "", squad: a.squad, name: a.name, strategist: a.strategist ?? "",
        pod: sum.pod ?? "", mrr: sum.mrr ?? "", closedValue: sum.closedValue ?? "", closedCount: sum.closedCount ?? 0, health: sum.health ?? null,
        freshness: sum.freshness ?? [], transcriptCount: sum.transcriptCount ?? 0,
        deal: d ? { id: d.accountos_id ?? "", stage: d.stage ?? "", motion: d.motion ?? "", owner: d.owner ?? "", people: d.people ?? [], confidence: d.confidence ?? "", value: d.value ?? "", mrr: d.mrr ?? "", expectedClose: d.expected_close ?? "", nextStep: d.next_step ?? "", description: d.description ?? "", updatedAt: d.accountos_updated_at ?? "" } : null,
      },
      overview: sum.overview,
      book: (booksBy.get(a.id) ?? []).sort((x, y) => x.sort - y.sort),
      artifacts: artsBy.get(a.id) ?? [],
      recordings: (recsBy.get(a.id) ?? []).sort((x, y) => y.date.localeCompare(x.date)),
      files: filesBy.get(a.id) ?? [],
      workflows: wfBy.get(a.id) ?? [],
    };
    s.accounts.set(a.slug, bundle);
    s.ids.set(a.slug, a.id);
  }
  for (const c of cats) s.categories.set(c.slug, { slug: c.slug, group: c.group_id, name: c.name, description: c.description, status: c.status, isCore: c.is_core, createdBy: c.created_by ?? "", origin: c.origin ?? "" });
  s.templates = tpls.map((t) => ({ category: t.category_slug, name: t.name, description: t.description, body: t.body, status: t.status, onlyAccount: t.only_account_id ? slugOf.get(t.only_account_id) ?? null : null, createdBy: t.created_by ?? "", origin: t.origin ?? "" }));
  return s;
}

// ---------------------------------------------------------------- write-through edits

export async function updateFile(accountId: string, path: string, patch: Partial<Pick<VaultFile, "state" | "inBook" | "content" | "shown">>, by: string) {
  const row: Row = { updated_at: new Date().toISOString(), updated_by: by };
  if (patch.state !== undefined) row.state = patch.state;
  if (patch.inBook !== undefined) row.in_book = patch.inBook;
  if (patch.shown !== undefined) row.shown = patch.shown;
  if (patch.content !== undefined) { row.content = patch.content; row.source = "human"; }
  const updated = check(await db().from("vault_files").update(row).eq("account_id", accountId).eq("path", path).select("id"), "update file") as Row[];
  if (patch.content !== undefined && updated[0]) check(await db().from("vault_file_versions").insert({ file_id: updated[0].id, content: patch.content, saved_by: by }), "save version");
}

export async function insertFile(accountId: string, f: VaultFile) {
  check(await db().from("vault_files").upsert({ account_id: accountId, path: f.path, category_slug: f.category, template_name: f.template, summary: f.summary, content: f.content, source: f.source, state: f.state, shown: f.shown ?? null, in_book: f.inBook }, { onConflict: "account_id,path" }), "add file");
}

export async function setTemplateStatus(t: Template, onlyAccountId: string | null, status: ShareStatus, patch: { onlyAccount?: null; createdBy?: string } = {}) {
  let q = db().from("templates").update({ status, ...(patch.onlyAccount === null ? { only_account_id: null } : {}), ...(patch.createdBy ? { created_by: patch.createdBy } : {}), updated_at: new Date().toISOString() })
    .eq("category_slug", t.category).eq("name", t.name);
  q = onlyAccountId ? q.eq("only_account_id", onlyAccountId) : q.is("only_account_id", null);
  check(await q, "update template");
}

export async function setCategoryStatus(slug: string, status: ShareStatus) {
  check(await db().from("template_categories").update({ status }).eq("slug", slug), "update category");
}

// ---------------------------------------------------------------- import from the repo files

/** Match rules from the `searched` terms of data/transcripts/<slug>.json: emails, domains, everything else a keyword. */
function matchRulesFor(root: string, slug: string): { kind: "keyword" | "email" | "domain"; value: string }[] {
  const p = join(root, "data", "transcripts", `${slug}.json`);
  if (!existsSync(p)) return [];
  let terms: unknown[];
  try { terms = JSON.parse(readFileSync(p, "utf8")).searched ?? []; } catch { return []; }
  const seen = new Set<string>();
  const out: { kind: "keyword" | "email" | "domain"; value: string }[] = [];
  for (const t of terms) {
    const value = String(t ?? "").trim();
    if (!value) continue;
    const kind = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value) ? "email" : /^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i.test(value) ? "domain" : "keyword";
    const v = kind === "keyword" ? value : value.toLowerCase();
    if (seen.has(`${kind}:${v}`)) continue;
    seen.add(`${kind}:${v}`);
    out.push({ kind, value: v });
  }
  return out;
}

/**
 * Copy the file-built store into Supabase. Keeps what people changed in the app: file content a person
 * edited, file visibility and state, template and category approval status. Book, artifacts and
 * workflows are replaced per project. Recordings are left to the sync; each project's match rules are
 * seeded from the terms its recordings list was searched with. Projects and files only in the
 * database are left alone.
 */
export async function importToDb(seed: Store, root: string) {
  const log: string[] = [];
  const bundles = [...seed.accounts.values()];

  // projects
  const accRows = bundles.map((b) => {
    const a = b.account;
    return { slug: a.slug, parent_slug: a.parent, accountos_id: a.deal?.id || null, name: a.name, stage: a.stage, industry: a.industry || null, squad: a.squad, strategist: a.strategist || null, pod: { label: a.pod },
      summary: { pod: a.pod, mrr: a.mrr, closedValue: a.closedValue, closedCount: a.closedCount, health: a.health, freshness: a.freshness, transcriptCount: a.transcriptCount, overview: b.overview },
      synced_at: new Date().toISOString() };
  });
  const ids = new Map<string, string>();
  for (let i = 0; i < accRows.length; i += 100) {
    const got = check(await db().from("accounts").upsert(accRows.slice(i, i + 100), { onConflict: "slug" }).select("id,slug"), "upsert accounts") as Row[];
    for (const r of got) ids.set(r.slug, r.id);
  }
  log.push(`${ids.size} projects`);

  // Deals that left the open pipeline (closed, or folded into an account in delivery): remove their sales projects.
  const keep = new Set(bundles.map((b) => b.account.slug));
  const stale = (await all("accounts", "id,slug,name", (q) => q.eq("stage", "sales"))).filter((r) => !keep.has(r.slug));
  for (const r of stale) check(await db().from("accounts").delete().eq("id", r.id), "remove stale deal");
  if (stale.length) log.push(`removed ${stale.length} sales project${stale.length === 1 ? "" : "s"} no longer open: ${stale.map((r) => r.name).join(", ")}`);

  // sales deals
  const dealRows = bundles.filter((b) => b.account.deal?.id).map((b) => {
    const d = b.account.deal!;
    return { account_id: ids.get(b.account.slug), accountos_id: d.id, name: b.account.name, value: d.value || null, stage: d.stage || null, motion: d.motion || null, owner: d.owner || null,
      confidence: d.confidence || null, mrr: d.mrr || null, expected_close: /^\d{4}-\d{2}-\d{2}/.test(d.expectedClose) ? d.expectedClose.slice(0, 10) : null, next_step: d.nextStep || null,
      description: d.description || null, people: d.people, accountos_updated_at: d.updatedAt || null, pod_strategist: b.account.strategist || null };
  });
  if (dealRows.length) check(await db().from("deals").upsert(dealRows, { onConflict: "accountos_id" }), "upsert deals");
  log.push(`${dealRows.length} deals`);

  // squads
  const pipe = join(root, "data", "pipeline.json");
  if (existsSync(pipe)) {
    const squads = (JSON.parse(readFileSync(pipe, "utf8")).squads ?? []).map((q: Row) => ({ name: String(q.name), members: (q.members ?? []).map(String), source: q.source ? String(q.source) : null }));
    if (squads.length) check(await db().from("squads").upsert(squads, { onConflict: "name" }), "upsert squads");
    log.push(`${squads.length} squads`);
  }

  // categories: new ones in full; existing ones keep their approval status
  const existingCats = new Map((await all("template_categories", "id,slug")).map((r) => [r.slug as string, r.id as string]));
  const catRow = (c: Category, withStatus: boolean) => ({ slug: c.slug, group_id: c.group, name: c.name, description: c.description, is_core: c.isCore, created_by: c.createdBy || null, origin: c.origin || null, ...(withStatus ? { status: c.status } : {}) });
  const cats = [...seed.categories.values()];
  const newCats = cats.filter((c) => !existingCats.has(c.slug)), oldCats = cats.filter((c) => existingCats.has(c.slug));
  if (newCats.length) check(await db().from("template_categories").insert(newCats.map((c) => catRow(c, true))), "insert categories");
  if (oldCats.length) check(await db().from("template_categories").upsert(oldCats.map((c) => catRow(c, false)), { onConflict: "slug" }), "update categories");
  const catId = new Map((await all("template_categories", "id,slug")).map((r) => [r.slug as string, r.id as string]));
  log.push(`${cats.length} categories (${newCats.length} new)`);

  // templates: match on category + name + project; a proposed or shared template that started local still matches
  const existingT = await all("templates", "id,category_slug,name,only_account_id,origin,status");
  const findT = (t: Template) => {
    const only = t.onlyAccount ? ids.get(t.onlyAccount) ?? null : null;
    return existingT.find((r) => r.category_slug === t.category && r.name === t.name && (r.only_account_id === only || (r.only_account_id === null && only !== null && r.origin === (t.origin || null))));
  };
  let newT = 0;
  for (const t of seed.templates) {
    const cid = catId.get(t.category);
    if (!cid) { log.push(`skipped template ${t.name}: no category ${t.category}`); continue; }
    const base = { category_id: cid, category_slug: t.category, name: t.name, description: t.description, body: t.body, created_by: t.createdBy || null, origin: t.origin || null };
    const hit = findT(t);
    if (hit) check(await db().from("templates").update({ description: base.description, body: base.body, origin: base.origin }).eq("id", hit.id), "update template");
    else { check(await db().from("templates").insert({ ...base, status: t.status, only_account_id: t.onlyAccount ? ids.get(t.onlyAccount) ?? null : null }), "insert template"); newT++; }
  }
  log.push(`${seed.templates.length} templates (${newT} new)`);

  // vault files: new ones in full; existing ones get fresh imported content unless a person edited them
  let added = 0, refreshed = 0, kept = 0, seeded = 0;
  for (const b of bundles) {
    const aid = ids.get(b.account.slug)!;
    const existing = new Map((await all("vault_files", "path,source", (q) => q.eq("account_id", aid))).map((r) => [r.path as string, r.source as string]));
    const fresh = b.files.filter((f) => !existing.has(f.path)).map((f) => ({ account_id: aid, path: f.path, category_slug: f.category, template_name: f.template, summary: f.summary, content: f.content, source: f.source, state: f.state, shown: f.shown ?? null, in_book: f.inBook }));
    const update = b.files.filter((f) => existing.has(f.path) && existing.get(f.path) !== "human").map((f) => ({ account_id: aid, path: f.path, category_slug: f.category, template_name: f.template, summary: f.summary, content: f.content, source: f.source }));
    kept += b.files.filter((f) => existing.get(f.path) === "human").length;
    for (let i = 0; i < fresh.length; i += 50) check(await db().from("vault_files").insert(fresh.slice(i, i + 50)), "insert files");
    for (let i = 0; i < update.length; i += 50) check(await db().from("vault_files").upsert(update.slice(i, i + 50), { onConflict: "account_id,path" }), "refresh files");
    added += fresh.length; refreshed += update.length;

    // book, artifacts, workflows: replaced
    check(await db().from("book_chapters").delete().eq("account_id", aid), "clear book");
    if (b.book.length) check(await db().from("book_chapters").insert(b.book.map((c) => ({ account_id: aid, sort: c.sort, title: c.title, minutes: c.minutes, lenses: c.lenses, body: c.body, sources: c.sources }))), "insert book");
    check(await db().from("artifacts").delete().eq("account_id", aid), "clear artifacts");
    if (b.artifacts.length) check(await db().from("artifacts").insert(b.artifacts.map((x) => ({ account_id: aid, key: x.id, kind: x.kind, title: x.title, dated: x.dated || null, description: x.description, url: x.url || null, provider: x.provider || null, sensitive: x.sensitive }))), "insert artifacts");
    // Recordings are no longer imported (the sync owns them); the terms each list was searched with seed the match rules.
    const rules = matchRulesFor(root, b.account.slug).map((r) => ({ account_id: aid, ...r, source: "seed" }));
    if (rules.length) check(await db().from("match_rules").upsert(rules, { onConflict: "account_id,kind,value", ignoreDuplicates: true }), "seed match rules");
    seeded += rules.length;
    check(await db().from("workflows").delete().eq("account_id", aid), "clear workflows");
    if (b.workflows.length) check(await db().from("workflows").insert(b.workflows.map((w) => ({ account_id: aid, slug: w.slug, name: w.name, kind: w.kind, cadence: w.cadence || null, audience: w.audience || null, inputs: w.inputs, output: w.output || null, note: w.note || null, standard: w.standard }))), "insert workflows");
  }
  log.push(`files: ${added} added, ${refreshed} refreshed, ${kept} kept as edited`);
  log.push(`${seeded} match rules from the recordings lists`);

  // team and assignments: imported assignments are refreshed; ones a strategist added by hand stay
  const team = buildTeam(seed, existsSync(pipe) ? JSON.parse(readFileSync(pipe, "utf8")) : {});
  const known = new Map((await all("people", "id,name")).map((r) => [r.name as string, r.id as string]));
  const fresh = team.people.filter((p) => !known.has(p.name));
  if (fresh.length) check(await db().from("people").insert(fresh.map((p) => ({ name: p.name, title: p.title, squad: p.squad, role: p.admin ? "admin" : "member", source: "import" }))), "insert people");
  // Existing people keep their role, except that listed admins are always admins (never demoted here).
  for (const p of team.people.filter((x) => known.has(x.name))) check(await db().from("people").update({ title: p.title, squad: p.squad, ...(p.admin ? { role: "admin" } : {}) }).eq("name", p.name), "update person");
  const personId = new Map((await all("people", "id,name")).map((r) => [r.name as string, r.id as string]));
  check(await db().from("assignments").delete().eq("source", "import"), "clear imported assignments");
  const rows = team.assignments.filter((x) => ids.has(x.slug) && personId.has(x.name)).map((x) => ({ account_id: ids.get(x.slug), person_id: personId.get(x.name), role: x.role, source: "import" }));
  for (let i = 0; i < rows.length; i += 200) check(await db().from("assignments").upsert(rows.slice(i, i + 200), { onConflict: "account_id,person_id,role", ignoreDuplicates: true }), "insert assignments");
  log.push(`team: ${team.people.length} people (${fresh.length} new), ${rows.length} assignments from Account OS`);
  return log;
}
