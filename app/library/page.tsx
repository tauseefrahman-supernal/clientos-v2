import { listAccounts, listCategories, listTemplates, pendingApprovals, usage } from "@/lib/data";
import { LibraryView, type LibCategory } from "@/components/library/LibraryView";

export default async function LibraryPage({ searchParams }: { searchParams: { open?: string; t?: string } }) {
  const templates = (await listTemplates());
  const accountCount = (await listAccounts()).length;
  // usage() reads the shared store; resolve it for every category and template up front.
  const allCats = await listCategories();
  const usedBy = new Map(await Promise.all(allCats.map(async (c) => [c.slug, await usage(c.slug)] as const)));
  const usedT = new Map(await Promise.all(templates.map(async (t) => [`${t.category}/${t.name}`, await usage(t.category, t.name)] as const)));
  const cats: LibCategory[] = allCats.map((c) => {
    const used = usedBy.get(c.slug) ?? [];
    return {
      ...c,
      used: c.isCore ? accountCount : used.length,
      projects: used.map((u) => ({ slug: u.slug, name: u.name })),
      templates: templates.filter((t) => t.category === c.slug).map((t) => ({
        name: t.name, description: t.description, body: t.body, status: t.status, onlyAccount: t.onlyAccount, createdBy: t.createdBy, origin: t.origin,
        projects: (usedT.get(`${c.slug}/${t.name}`) ?? []).map((u) => ({ slug: u.slug, name: u.name, path: u.path })),
      })),
    };
  }).filter((c) => c.templates.length);
  const p = (await pendingApprovals());
  return (
    <LibraryView
      categories={cats}
      pending={[...p.categories.map((c) => ({ kind: "category" as const, category: c.slug, template: null, label: c.name, by: c.createdBy, from: c.origin })), ...p.templates.map((t) => ({ kind: "template" as const, category: t.category, template: t.name, label: `${t.name}.md`, by: t.createdBy, from: t.origin }))]}
      openCategory={searchParams.open ?? "core-tech"}
      openTemplate={searchParams.t ?? null}
    />
  );
}
