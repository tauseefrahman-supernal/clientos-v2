import type { AccountBundle, Category, Template } from "@/lib/types";

export interface SearchItem { type: string; title: string; sub: string; href: string }

/** Everything the ⌘K palette can jump to. Built on the server, sent to the client once. */
export function buildSearchIndex(accounts: AccountBundle[], categories: Category[], templates: Template[]): SearchItem[] {
  const out: SearchItem[] = [];
  const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;
  for (const b of accounts) {
    const a = b.account, base = `/projects/${a.slug}`;
    out.push({ type: "Project", title: a.name, sub: `${a.strategist} · ${a.mrr} MRR`, href: base });
    for (const [label, path] of [["Book", "book"], ["Artifacts", "artifacts"], ["Vault", "vault"], ["Work", "work"]]) out.push({ type: "Page", title: `${a.name} › ${label}`, sub: "", href: `${base}/${path}` });
    b.book.forEach((c, i) => out.push({ type: "Chapter", title: c.title, sub: `${a.name} · book`, href: `${base}/book?c=${i}` }));
    for (const f of b.files.filter((f) => f.state !== "deleted" && f.state !== "archived")) out.push({ type: "File", title: `${f.path.split("/").pop()}.md`, sub: `${a.name} · ${f.category ? catName(f.category) : "Delivery"}`, href: `${base}/vault?file=${encodeURIComponent(f.path)}` });
    for (const x of b.artifacts.filter((x) => !x.sensitive)) out.push({ type: "Artifact", title: x.title, sub: `${a.name} · ${x.kind}`, href: `${base}/artifacts?a=${x.id}` });
    for (const p of b.overview.people) out.push({ type: "Person", title: p.name, sub: `${a.name} · ${p.title}`, href: `${base}/vault?file=Stakeholders` });
    for (const d of b.overview.deals) out.push({ type: "Deal", title: d.name, sub: `${a.name} · ${d.stage}`, href: base });
    for (const w of b.workflows) out.push({ type: "Workflow", title: w.name, sub: `${a.name} · ${w.cadence}`, href: `${base}/work?w=${w.slug}` });
  }
  for (const c of categories) out.push({ type: "Category", title: c.name, sub: "Template Library", href: `/library?open=${c.slug}` });
  for (const t of templates) out.push({ type: "Template", title: `${t.name}.md`, sub: `Template Library · ${catName(t.category)}`, href: `/library?open=${t.category}&t=${encodeURIComponent(t.name)}` });
  return out;
}
