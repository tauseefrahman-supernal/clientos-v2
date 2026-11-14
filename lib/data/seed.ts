/* eslint-disable @typescript-eslint/no-explicit-any -- the seed JSON is untyped; every field is coerced to its type below. */
import "server-only";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join } from "node:path";
import type { AccountBundle, Artifact, Category, Chapter, GroupId, Overview, Template, Tone, VaultFile, Workflow } from "@/lib/types";
import { GROUPS } from "@/lib/types";
import { CORE, DELIVERY_ACCOUNT_IDS, RESEARCH_TO_FILE, SALES_WORKFLOWS, SECTION_TO_FILE, SHARED, STANDARD_WORKFLOWS, coreName } from "./library-seed";

// Seed backend. Every project's vault starts from the core templates; each file is then filled
// from the account's research document (and, for Hooray, its exported scoping vault). A project
// section from the research merges into the file it belongs in; only what fits no file becomes
// a file of its own. Kept in memory, so edits in the app last until the server restarts.

const ROOT = process.cwd();
const tone = (t: unknown): Tone => (["ok", "warn", "err", "info"].includes(String(t)) ? (t as Tone) : "");
const str = (v: unknown) => (v == null ? "" : String(v));
const slugify = (s: string) => str(s).trim().replace(/\.md$/i, "").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") || "Notes";
const cell = (s: string) => (s || "—").replace(/\|/g, "/").replace(/\n+/g, " ");
const table = (head: string[], rows: string[][]) => rows.length ? `| ${head.join(" | ")} |\n|${head.map(() => "---").join("|")}|\n${rows.map((r) => `| ${r.map(cell).join(" | ")} |`).join("\n")}` : "_Nothing recorded._";

export interface Store { accounts: Map<string, AccountBundle>; categories: Map<string, Category>; templates: Template[] }

/** The opening lines of a template: its title and the block that says what the file is for. */
function header(body: string, name: string): string {
  const out: string[] = [];
  for (const l of body.split("\n")) {
    if (!out.length) { if (l.startsWith("#")) out.push(l); continue; }
    if (l.startsWith(">") || !l.trim()) { out.push(l); continue; }
    break;
  }
  return out.length ? out.join("\n").trim() : `# ${name.replace(/-/g, " ")}`;
}

function library(): { categories: Category[]; templates: Template[] } {
  const categories: Category[] = [];
  const templates: Template[] = [];
  for (const c of CORE) {
    categories.push({ slug: c.slug, group: c.group, name: c.name, description: c.description, status: "standard", isCore: true, createdBy: "Stella’s framework", origin: "every project" });
    for (const d of c.dirs) {
      const dir = join(ROOT, "templates", d);
      if (!existsSync(dir)) continue;
      for (const f of readdirSync(dir).filter((n) => n.endsWith(".md")).sort()) {
        const raw = readFileSync(join(dir, f), "utf8");
        const answers = raw.match(/\*\*Answers:\*\*\s*(.+)/);
        templates.push({ category: c.slug, name: coreName(f), description: answers ? answers[1].replace(/\*\*/g, "").trim() : "", body: raw, status: "standard", onlyAccount: null, createdBy: "Stella’s framework", origin: "every project" });
      }
    }
  }
  for (const s of SHARED) templates.push({ category: CORE[s.group].slug, name: s.name, description: s.description, body: `# ${s.name.replace(/-/g, " ")}\n\n> ${s.description}\n\n${s.body}`, status: s.status, onlyAccount: null, createdBy: s.createdBy, origin: s.origin });
  return { categories, templates };
}

/** "## 4. Why they bought" sections of a research document, by number. */
function researchSections(slug: string): Map<number, { title: string; text: string }> {
  const p = join(ROOT, "docs", "context", `${slug}.md`);
  const out = new Map<number, { title: string; text: string }>();
  if (!existsSync(p)) return out;
  for (const sec of readFileSync(p, "utf8").split(/^## /m).slice(1)) {
    const m = sec.match(/^(\d+)\.\s*([^\n]+)\n/);
    if (m) out.set(Number(m[1]), { title: m[2].trim(), text: sec.slice(m[0].length).replace(/\n---\s*$/, "").trim() });
  }
  return out;
}

/** An exported ClientOS vault for the account, keyed by core file name. */
function exportedVault(slug: string): Map<string, string> {
  const out = new Map<string, string>();
  const dir = join(ROOT, "data", "vault", slug);
  if (!existsSync(dir)) return out;
  (function walk(d: string) {
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      if (statSync(p).isDirectory()) { if (n !== "Transcripts") walk(p); }
      else if (n.endsWith(".md") && !n.startsWith("_")) {
        const name = coreName(n);
        const text = readFileSync(p, "utf8");
        if (text.length > (out.get(name)?.length ?? 0)) out.set(name, text); // two copies of Sales-Research exist; keep the fuller one
      }
    }
  })(dir);
  return out;
}

function overviewFrom(d: any): Overview {
  return {
    deals: (d.deals || []).map((x: any) => ({ name: str(x.name), value: str(x.value), stage: str(x.stage), phase: Math.min(3, Math.max(0, Number(x.phase) || 0)), note: str(x.note) })),
    lost: str(d.lost),
    sold: (d.sold || []).map((x: any) => ({ form: str(x.form), promised: str(x.promised), met: str(x.met), tone: tone(x.tone) })),
    arc: (d.arc || []).map((x: any) => ({ period: str(x.period), meetings: x.meetings == null ? null : Number(x.meetings), points: (x.points || []).map(str) })),
    disagreements: (d.disagreements || []).map(str),
    streams: (d.streams || []).map((x: any) => ({ name: str(x.name), state: str(x.state), tone: tone(x.tone), pct: x.pct == null ? null : Number(x.pct), due: str(x.due), measured: str(x.measured), learned: str(x.learned), attention: !!x.attention })),
    tiles: (d.tiles || []).map((x: any) => ({ file: x.file === "plan" ? "Project-Plan" : x.file === "stakeholders" ? "Stakeholders" : "AI-Strategy-Roadmap", section: str(x.section), title: str(x.title), headline: str(x.headline), tone: tone(x.tone), state: str(x.state) })),
    decisions: (d.decisions || []).map((x: any) => ({ title: str(x.title), detail: str(x.detail), action: str(x.action) || "Open" })),
    slipping: (d.slipping || []).map((x: any) => ({ kind: str(x.kind), tone: tone(x.tone), item: str(x.item), detail: str(x.detail) })),
    dates: (d.dates || []).map((x: any) => ({ when: str(x.when), what: str(x.what) })),
    feed: (d.feed || []).map((x: any) => ({ meeting: str(x.meeting), date: str(x.date), changes: (x.changes || []).map(str) })),
    people: (d.people || []).map((x: any) => ({ name: str(x.name), title: str(x.title), note: str(x.note), influence: str(x.influence) || "Medium", disposition: str(x.disposition) || "Neutral" })),
    metrics: (d.metrics || []).map((x: any) => ({ criterion: str(x.criterion), now: str(x.now), state: str(x.state), tone: tone(x.tone) })),
    accountOs: (d.accountos || []).map((x: any) => ({ record: str(x.record), now: str(x.now), proposes: str(x.proposes) })),
    rationale: (d.rationale || []).map((x: any) => ({ decision: str(x.decision), why: str(x.why), source: str(x.source) })),
    answers: (d.answers || []).map((x: any) => ({ q: str(x.q), a: str(x.a) })),
  };
}

function bundleFrom(d: any, s: Store, meta: Meta): AccountBundle {
  const slug = str(d.key), name = str(d.title);
  const h = d.health || {};
  const m = meta.accounts.get(slug);
  const account = {
    slug, stage: "delivery" as const, industry: m?.industry ?? "", squad: m?.squad ?? null, deal: null, parent: null,
    name, strategist: str(d.strat), pod: str(d.pod), mrr: str(d.mrr), closedValue: str(d.closedValue), closedCount: Number(d.closedCount) || 0,
    health: h.score ? { score: str(h.score), band: str(h.band), tone: tone(h.tone) } : null, freshness: (d.fresh || []).map(str), transcriptCount: Number(d.transcripts) || 0,
  };
  const o = overviewFrom(d);
  const research = researchSections(slug);
  const vault = exportedVault(slug);

  // 1. Every core template, plus the shared Delivery files every account uses.
  const files = new Map<string, VaultFile>();
  const tplOf = (n: string) => s.templates.find((t) => t.name === n && !t.onlyAccount);
  const add = (n: string, extra = "") => {
    const t = tplOf(n);
    const group = (t ? Math.max(0, CORE.findIndex((c) => c.slug === t.category)) : 3) as GroupId;
    let f = files.get(n);
    if (!f) { f = { path: `${GROUPS[group]}/${n}`, category: CORE[group].slug, template: t ? n : null, group, summary: t?.description ?? "", content: "", source: "template", state: "active", inBook: true }; files.set(n, f); }
    if (extra) {
      if (!f.content) f.content = header(t?.body ?? "", n);
      f.content = `${f.content}\n\n${extra.trim()}`;
      f.source = "import";
    }
    return f;
  };
  for (const t of s.templates.filter((t) => t.status === "standard")) add(t.name);
  add("Stakeholders"); add("Weekly");

  // 2. An exported ClientOS vault: the real scoping files, as written at close.
  for (const [n, text] of Array.from(vault)) if (files.has(n) && text.length > 400) { const f = add(n); f.content = text; f.source = "import"; }

  // 3. The research document, one section per file. On an exported vault it reads as what changed since close.
  for (const [num, sec] of Array.from(research)) {
    const target = RESEARCH_TO_FILE[num];
    if (!target) continue;
    add(target, `${vault.has(target) ? "## Since close: " : "## "}${sec.title}\n\n${sec.text}`);
  }

  // 4. Structured data that belongs in a delivery file.
  add("Stakeholders", `## Power map\n\n${table(["Name", "Title", "Where they stand", "Influence", "Disposition"], o.people.map((p) => [p.name, p.title, p.note, p.influence, p.disposition]))}`);
  add("Project-Plan", `## Workstreams\n\n${table(["Workstream", "State", "Milestone", "Measured", "Learned or blocked by"], o.streams.map((x) => [x.name, x.state, x.pct == null ? "" : `${x.pct}%${x.due ? ` · due ${x.due}` : ""}`, x.measured, x.learned]))}`);
  add("AI-Strategy-Roadmap", `## Opportunity map\n\n${table(["Deal", "Value", "Stage", "Note"], o.deals.filter((x) => x.phase < 3).map((x) => [x.name, x.value, x.stage, x.note]))}\n\n## Success metrics\n\n${table(["Criterion", "Now", "State"], o.metrics.map((m) => [m.criterion, m.now, m.state]))}\n\n## Account OS records\n\n${table(["Record", "In Account OS now", "Could be drafted"], o.accountOs.map((r) => [r.record, r.now, r.proposes]))}`);
  add("Weekly", `## Decisions\n\n${table(["Decision", "Detail"], o.decisions.map((x) => [x.title, x.detail]))}\n\n## Slipping\n\n${table(["Kind", "Item", "Detail"], o.slipping.map((x) => [x.kind, x.item, x.detail]))}\n\n## Coming up\n\n${table(["When", "What"], o.dates.map((x) => [x.when, x.what]))}`);
  if (o.rationale.length) add("Feature-Rationale", `## Decisions\n\n${table(["Decision", "Why", "Decided in"], o.rationale.map((r) => [r.decision, r.why, r.source]))}`);

  // 5. Project sections from the research: merge into the file they belong in, or become their own file.
  for (const sx of d.sections || []) {
    const title = str(sx.category);
    const list = (sx.files || []).map((f: any) => `- **${str(f.name).replace(/-/g, " ")}:** ${str(f.summary)}`).join("\n");
    const target = SECTION_TO_FILE[title.toLowerCase()];
    if (target) { add(target, `## ${title}\n\n${str(sx.desc)}\n\n${list}`); continue; }
    const n = slugify(title);
    const group = Math.min(3, Math.max(0, Number(sx.group) || 0)) as GroupId;
    if (!s.templates.some((t) => t.name === n && t.onlyAccount === slug)) s.templates.push({ category: CORE[group].slug, name: n, description: str(sx.desc), body: `# ${title}\n\n> ${str(sx.desc)}`, status: "local", onlyAccount: slug, createdBy: account.strategist || "the strategist", origin: name });
    files.set(n, { path: `${GROUPS[group]}/${n}`, category: CORE[group].slug, template: n, group, summary: str(sx.desc), content: `# ${title}\n\n> ${str(sx.desc)}\n\n${list}`, source: "import", state: "active", inBook: true });
  }
  const inv = join(ROOT, "docs", "context", `${slug}-drive-inventory.md`);
  if (existsSync(inv)) {
    if (!s.templates.some((t) => t.name === "Drive-Inventory" && t.onlyAccount === slug)) s.templates.push({ category: "core-delivery", name: "Drive-Inventory", description: "What the client’s Drive folders hold, and what must never be shown.", body: "# Drive Inventory", status: "local", onlyAccount: slug, createdBy: account.strategist, origin: name });
    files.set("Drive-Inventory", { path: "Delivery Strategy/Drive-Inventory", category: "core-delivery", template: "Drive-Inventory", group: 3, summary: "What the client’s Drive folders hold.", content: readFileSync(inv, "utf8"), source: "import", state: "active", inBook: false });
  }

  const book: Chapter[] = (d.book || []).map((c: any, i: number) => ({ sort: i, title: str(c.title), minutes: Math.max(1, Math.ceil(str(c.text).split(/\s+/).length / 200)), lenses: c.lenses?.length ? c.lenses.map(str) : ["all"], body: str(c.text), sources: (c.sources || []).map(str) }));
  const artifacts: Artifact[] = (d.artifacts || []).map((x: any, i: number) => ({ id: `${slug}-a${i}`, kind: str(x.kind) || "Document", title: str(x.title), dated: str(x.date), description: str(x.what), url: /^https?:\/\//.test(str(x.url)) ? str(x.url) : "", provider: str(x.where), sensitive: !!x.sensitive }));
  const custom: Workflow[] = (d.workflows || []).map((w: any) => ({ slug: slugify(w.name).toLowerCase(), name: str(w.name), kind: w.kind === "internal" ? "internal" : "external", cadence: str(w.cadence), audience: str(w.with), inputs: [], output: str(w.output), note: [str(w.note), w.lastRun ? `Last run: ${str(w.lastRun)}` : ""].filter(Boolean).join(" "), standard: false }));
  const standard: Workflow[] = STANDARD_WORKFLOWS.map((w) => ({ ...w, inputs: [...w.inputs], kind: w.kind as Workflow["kind"], note: "", standard: true }));
  const rank = (f: VaultFile) => { const t = f.template ? tplOf(f.template) : null; return f.group * 10 + (t?.status === "standard" ? 0 : t ? 1 : 2); };

  return {
    account, overview: o, book, artifacts,
    files: Array.from(files.values()).sort((a, b) => rank(a) - rank(b)),
    workflows: [...standard, ...custom.filter((c) => !standard.some((x) => x.name.toLowerCase() === c.name.toLowerCase()))],
  };
}

type Meta = { accounts: Map<string, { industry: string; squad: string | null }>; deals: any[] };

function loadMeta(): Meta {
  const p = join(ROOT, "data", "pipeline.json");
  if (!existsSync(p)) return { accounts: new Map(), deals: [] };
  try {
    const j = JSON.parse(readFileSync(p, "utf8"));
    // A pipeline deal belongs to the squad of its pod strategist (first name match).
    const squadOf = (who: string) => (j.squads || []).find((q: any) => who && (q.members || []).some((m: string) => str(m).split(" ")[0].toLowerCase() === who.split(" ")[0].toLowerCase()))?.name ?? null;
    const deals = (j.deals || []).map((d: any) => ({ ...d, squad: squadOf(str(d.pod_strategist)) }));
    return { accounts: new Map((j.accounts || []).map((a: any) => [str(a.key), { industry: str(a.industry), squad: a.squad ? str(a.squad) : null }])), deals };
  } catch (e) { console.error("[seed] pipeline.json unreadable:", e); return { accounts: new Map(), deals: [] }; }
}

const money = (v: unknown) => { const n = Number(v); return Number.isFinite(n) && n > 0 ? `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}` : ""; };

/** A deal in the pipeline: the core templates with Sales-Intake filled from Account OS, and the scoping workflows. */
const firstLine = (t: string) => t.split("\n").map((l) => l.replace(/^[#>*\-\s]+/, "").trim()).find(Boolean)?.slice(0, 160) ?? "";
const normTitle = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** A scoping deal's research document (docs/context/deals/<slug>.md): core file sections, book, artifacts. */
function dealDoc(slug: string) {
  const p = join(ROOT, "docs", "context", "deals", `${slug}.md`);
  if (!existsSync(p)) return null;
  const text = readFileSync(p, "utf8");
  const files = new Map<string, string>();
  const book: { title: string; body: string; sources: string[] }[] = [];
  let artifacts: string[][] = [];
  // Only these headings start a section; files keep their own template "##" headings inside.
  for (const sec of text.split(/^## (?=File:|Meta\s*$|Book\s*$|Artifacts\s*$|Gaps\s*$)/m).slice(1)) {
    const nl = sec.indexOf("\n");
    const head = sec.slice(0, nl).trim(), body = sec.slice(nl + 1).trim();
    const fm = head.match(/^File:\s*(.+)$/i);
    if (fm) { files.set(slugify(fm[1].replace(/\.md$/i, "")), body); continue; }
    if (/^book$/i.test(head)) {
      for (const ch of body.split(/^### /m).slice(1)) {
        const cl = ch.indexOf("\n");
        const title = ch.slice(0, cl).replace(/^\d+\.\s*/, "").trim();
        let rest = ch.slice(cl + 1).trim();
        const sm = rest.match(/\n?Sources?:\s*(.+)\s*$/i);
        const sources = sm ? sm[1].split(/;\s*/).map((x) => x.trim()).filter(Boolean) : [];
        if (sm) rest = rest.slice(0, sm.index).trim();
        book.push({ title, body: rest, sources });
      }
    }
    if (/^artifacts$/i.test(head)) {
      artifacts = body.split("\n").filter((l) => /^\|/.test(l) && !/^\|\s*-/.test(l)).slice(1)
        .map((l) => l.replace(/^\||\|$/g, "").split("|").map((c) => c.trim())).filter((r) => r[0]);
    }
  }
  return { files, book, artifacts };
}

let REVIEWS: Map<string, string> | null = null;
/** Per-deal notes from the weekly pipeline reviews (docs/context/deals/_pipeline-reviews.md). */
function pipelineReviews(): Map<string, string> {
  if (REVIEWS) return REVIEWS;
  REVIEWS = new Map();
  const p = join(ROOT, "docs", "context", "deals", "_pipeline-reviews.md");
  if (!existsSync(p)) return REVIEWS;
  for (const sec of readFileSync(p, "utf8").split(/^## /m).slice(1)) {
    const nl = sec.indexOf("\n");
    const head = sec.slice(0, nl).trim();
    if (/^(meetings used|not discussed|other pipeline)/i.test(head)) continue;
    // "Order Form #2: RxVIP pharmacy (Nick)" -> aliases "order form 2", "foreman ... / help desk ..." -> both
    const base = head.replace(/\s*\([^)]*\)\s*$/, "").split(":")[0];
    for (const alias of base.split("/")) if (normTitle(alias)) REVIEWS.set(normTitle(alias), sec.slice(nl + 1).trim());
  }
  return REVIEWS;
}

/** Pipeline-review notes for a deal title: exact alias, or one title starting with the other. */
function reviewsFor(title: string): string | undefined {
  const t = normTitle(title), all = pipelineReviews();
  if (all.has(t)) return all.get(t);
  const hit = Array.from(all.keys()).filter((k) => k.length > 3 && (t.startsWith(k) || k.startsWith(t))).sort((a, b) => b.length - a.length)[0];
  return hit ? all.get(hit) : undefined;
}

function salesBundle(x: any, s: Store, parentSlug: string | null = null): AccountBundle {
  const parent = parentSlug ? s.accounts.get(parentSlug)?.account ?? null : null;
  // An expansion is named after its account: "RxVIP · Order Form #2".
  const title = str(x.title).replace(new RegExp(`^${(parent?.name ?? "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*(expansion)?\\s*[-:·]?\\s*`, "i"), "").replace(/^expansion\s*[-:·]\s*/i, "") || str(x.title);
  const name = parent ? `${parent.name} · ${title}` : str(x.organization) || str(x.title);
  const slug = `deal-${slugify(str(x.title) || name).toLowerCase()}`;
  const deal = { id: str(x.id), stage: str(x.stage), motion: str(x.motion), owner: str(x.owner), people: (x.people || []).map(str), confidence: str(x.confidence), value: money(x.value), mrr: money(x.mrr), expectedClose: str(x.expected_close), nextStep: str(x.next_step), description: str(x.description), updatedAt: str(x.updated_at) };
  const files: VaultFile[] = s.templates.filter((t) => t.status === "standard").map((t) => {
    const group = Math.max(0, CORE.findIndex((c) => c.slug === t.category)) as GroupId;
    return { path: `${GROUPS[group]}/${t.name}`, category: t.category, template: t.name, group, summary: t.description, content: "", source: "template" as const, state: "active" as const, inBook: true };
  });
  const intake = files.find((f) => f.template === "Sales-Intake");
  if (intake) {
    intake.source = "import";
    intake.content = [
      "# Sales Intake", `> From Account OS, ${deal.updatedAt.slice(0, 10) || "latest"}.`,
      "## Client", `${name}${x.industry ? ` · ${str(x.industry)}${x.industry_inferred ? " (inferred)" : ""}` : ""}`,
      "## Deal size", `${deal.value || "Not set"}${deal.mrr ? `, ${deal.mrr} a month` : ""}`,
      "## Type", `${deal.motion || "Not set"} · stage ${deal.stage} · confidence ${deal.confidence || "not set"}`,
      "## How sales sees the deal", deal.description || "_Not written yet._",
      "## Next step", `${deal.nextStep || "_None recorded._"} Expected close: ${deal.expectedClose || "not set"}.`,
      "## People", `Owner: ${deal.owner || "not set"}. Client contacts: ${deal.people.join(", ") || "none recorded"}.`,
    ].join("\n\n");
  }
  const phase = /order form|proposal/i.test(deal.stage) ? 2 : /prototype/i.test(deal.stage) ? 1 : 0;
  const doc = dealDoc(slug);
  if (doc) {
    for (const [n, body] of Array.from(doc.files)) {
      let f = files.find((x) => x.template === n);
      if (!f) {
        // Context the core files do not hold: a file of its own, in the sales group.
        if (!s.templates.some((t) => t.name === n && t.onlyAccount === slug)) s.templates.push({ category: CORE[0].slug, name: n, description: firstLine(body), body: `# ${n.replace(/-/g, " ")}`, status: "local", onlyAccount: slug, createdBy: deal.owner || "the strategist", origin: name });
        f = { path: `${GROUPS[0]}/${n}`, category: CORE[0].slug, template: n, group: 0, summary: firstLine(body), content: "", source: "import", state: "active", inBook: true };
        files.push(f);
      }
      const intro = f.template === "Sales-Intake" && f.content ? `${f.content}\n\n` : `# ${n.replace(/-/g, " ")}\n\n`;
      f.content = `${intro}${body}`;
      f.source = "import";
    }
  }
  const reviews = reviewsFor(str(x.title));
  if (reviews) {
    const notes = files.find((f) => f.template === "Sales-Notes");
    if (notes) { notes.content = `${notes.content || "# Sales Notes"}\n\n## From the weekly pipeline reviews\n\n${reviews}`; notes.source = "import"; }
  }
  const book: Chapter[] = (doc?.book ?? []).map((c, i) => ({ sort: i, title: c.title, minutes: Math.max(1, Math.ceil(c.body.split(/\s+/).length / 200)), lenses: ["all"], body: c.body, sources: c.sources }));
  const artifacts: Artifact[] = (doc?.artifacts ?? []).map((a, i) => ({ id: `${slug}-a${i}`, kind: a[1] || "Document", title: a[0], dated: a[2], description: a[5], url: /^https?:\/\//.test(a[4]) ? a[4] : (a[4].match(/\((https?:[^)]+)\)/)?.[1] ?? ""), provider: a[3], sensitive: false }));
  return {
    account: { slug, stage: "sales", industry: parent?.industry || str(x.industry), squad: x.squad ? str(x.squad) : parent?.squad ?? null, deal, parent: parentSlug, name, strategist: str(x.pod_strategist), pod: deal.owner ? `${deal.owner} (AE)` : "", mrr: deal.mrr, closedValue: "", closedCount: 0, health: null, freshness: [`From Account OS, updated ${deal.updatedAt.slice(0, 10) || "unknown"}`], transcriptCount: 0 },
    overview: { deals: [{ name: str(x.title), value: deal.value, stage: deal.stage, phase, note: deal.nextStep }], lost: "", sold: [], arc: [], disagreements: [], streams: [], tiles: [], decisions: [], slipping: [], dates: deal.expectedClose ? [{ when: deal.expectedClose, what: "Expected close" }] : [], feed: [], people: deal.people.map((p: string) => ({ name: p, title: "", note: "", influence: "Medium", disposition: "Neutral" })), metrics: [], accountOs: [], rationale: [], answers: [] },
    book, artifacts, files,
    workflows: SALES_WORKFLOWS.map((w) => ({ ...w, inputs: [...w.inputs], kind: w.kind as Workflow["kind"], note: "", standard: true })),
  };
}

// One store per server process. Next.js loads this module separately for pages and for
// server actions, so a module-level variable would give each its own copy and edits would
// never show. Keeping it on globalThis shares it. It is rebuilt only when its sources change
// (seed code, research documents, seed data), checked at most every two seconds.
const G = globalThis as unknown as { __clientos?: { store: Store; stamp: number; checked: number } };
function sourceStamp(): number {
  let max = 0;
  const walk = (d: string, depth: number) => {
    if (!existsSync(d)) return;
    for (const n of readdirSync(d)) {
      if (n.startsWith(".")) continue;
      const p = join(d, n), st = statSync(p);
      if (st.isDirectory()) { if (depth > 0) walk(p, depth - 1); } else if (st.mtimeMs > max) max = st.mtimeMs;
    }
  };
  walk(join(ROOT, "lib", "data"), 0); walk(join(ROOT, "docs", "context"), 1); walk(join(ROOT, "data"), 1); walk(join(ROOT, "templates"), 3);
  return max;
}

export function store(): Store {
  const now = Date.now(), c = G.__clientos;
  if (c && now - c.checked < 2000) return c.store;
  const stamp = sourceStamp();
  if (c && c.stamp === stamp) { c.checked = now; return c.store; }
  const lib = library();
  const s: Store = { accounts: new Map(), categories: new Map(lib.categories.map((c) => [c.slug, c])), templates: lib.templates };
  const meta = loadMeta();
  const dir = join(ROOT, "data", "seed");
  for (const f of readdirSync(dir).filter((n) => n.endsWith(".json")).sort()) {
    try { const d = JSON.parse(readFileSync(join(dir, f), "utf8")); s.accounts.set(str(d.key), bundleFrom(d, s, meta)); }
    catch (e) { console.error(`[seed] skipped ${basename(f)}:`, e); }
  }
  for (const x of meta.deals) {
    // An expansion on an account in delivery is its own scoping project, linked to that account.
    const b = salesBundle(x, s, x.account_id ? DELIVERY_ACCOUNT_IDS[str(x.account_id)] ?? null : null);
    if (!s.accounts.has(b.account.slug)) s.accounts.set(b.account.slug, b);
  }
  G.__clientos = { store: s, stamp, checked: now };
  return s;
}
