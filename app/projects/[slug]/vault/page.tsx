import { notFound } from "next/navigation";
import { getAccount, listCategories, listTemplates, usage } from "@/lib/data";
import { fileMarkdown, findFile } from "@/lib/data/render";
import { VaultView } from "@/components/project/VaultView";
import { GROUPS } from "@/lib/types";

export default async function VaultPage({ params, searchParams }: { params: { slug: string }; searchParams: { file?: string } }) {
  const b = (await getAccount(params.slug));
  if (!b) notFound();
  const cats = (await listCategories());
  const templates = (await listTemplates());
  const found = findFile(b.files, searchParams.file);
  const file = found && found.state !== "deleted" ? found : null;
  const others = file?.category ? (await usage(file.category, file.template ?? undefined)).filter((u) => u.slug !== b.account.slug) : [];
  const selected = file && (() => {
    const t = templates.find((x) => x.category === file.category && x.name === file.template) ?? null;
    const c = cats.find((x) => x.slug === file.category) ?? null;
    return {
      file,
      ...fileMarkdown(b, file, templates),
      category: c ? { slug: c.slug, name: c.name, status: c.status, isCore: c.isCore } : null,
      template: t ? { name: t.name, status: t.status, onlyAccount: t.onlyAccount } : null,
      otherProjects: others,
    };
  })();

  const groups = GROUPS.map((name, i) => {
    const files = b.files.filter((f) => f.group === i && f.state !== "deleted");
    const kind = (f: (typeof files)[number]) => { const t = templates.find((x) => x.category === f.category && x.name === f.template); return !t ? "added" : t.onlyAccount ? "added" : t.status === "standard" ? "core" : "shared"; };
    const sections = [
      { slug: "core", name: "Core", status: "standard" as const, files: files.filter((f) => kind(f) === "core") },
      { slug: "shared", name: "Shared templates", status: "shared" as const, files: files.filter((f) => kind(f) === "shared") },
      { slug: "added", name: "Added here", status: "local" as const, files: files.filter((f) => kind(f) === "added") },
    ].filter((x) => x.files.length);
    return { name, sections: sections.map((x) => ({ ...x, files: x.files.map((f) => ({ path: f.path, state: f.state, label: `${f.path.split("/").pop()}.md`, empty: !f.content, inView: f.shown ?? !!f.content })) })) };
  });

  // Everything the "+" picker can offer: every template in the library, and where it stands on this project.
  const catName = new Map(cats.map((c) => [c.slug, c]));
  const picker = templates
    .map((t) => {
      const f = b.files.find((x) => x.template === t.name && x.category === t.category && x.state !== "deleted");
      const c = catName.get(t.category);
      return {
        category: t.category, categoryName: c?.name ?? t.category, group: c?.group ?? 0, name: t.name, description: t.description,
        kind: t.status === "standard" ? "Core" : t.onlyAccount ? `From ${t.origin}` : "Shared",
        path: f?.path ?? null, filled: !!f?.content,
        where: (!f ? "add" : f.state === "archived" ? "archived" : (f.shown ?? !!f.content) ? "in view" : "hidden") as "add" | "archived" | "in view" | "hidden",
      };
    });

  return <VaultView slug={b.account.slug} groups={groups} selected={selected} picker={picker} />;
}
