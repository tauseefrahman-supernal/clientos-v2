import { listAccounts, listCategories, listTemplates, pendingApprovals, usage } from "@/lib/data";
import { LibraryView, type LibCategory } from "@/components/library/LibraryView";

export default function LibraryPage({ searchParams }: { searchParams: { open?: string; t?: string } }) {
  const templates = listTemplates();
  const accountCount = listAccounts().length;
  const cats: LibCategory[] = listCategories().map((c) => {
    const used = usage(c.slug);
    return {
      ...c,
      used: c.isCore ? accountCount : used.length,
      projects: used.map((u) => ({ slug: u.slug, name: u.name })),
      templates: templates.filter((t) => t.category === c.slug).map((t) => ({
        name: t.name, description: t.description, body: t.body, status: t.status, onlyAccount: t.onlyAccount, createdBy: t.createdBy, origin: t.origin,
        projects: usage(c.slug, t.name).map((u) => ({ slug: u.slug, name: u.name, path: u.path })),
      })),
    };
  }).filter((c) => c.templates.length);
  const p = pendingApprovals();
  return (
    <LibraryView
      categories={cats}
      pending={[...p.categories.map((c) => ({ kind: "category" as const, category: c.slug, template: null, label: c.name, by: c.createdBy, from: c.origin })), ...p.templates.map((t) => ({ kind: "template" as const, category: t.category, template: t.name, label: `${t.name}.md`, by: t.createdBy, from: t.origin }))]}
      openCategory={searchParams.open ?? "core-tech"}
      openTemplate={searchParams.t ?? null}
    />
  );
}
