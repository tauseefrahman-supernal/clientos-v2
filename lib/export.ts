import type { AccountBundle } from "./types";

const GROUPS = ["Sales Strategy", "Deal Strategy", "Technical Strategy", "Delivery Strategy"];

// Builds one contextualised markdown document from one or more projects: a header, a contents
// list, then each project's overview, filled vault files (by group), book and artifacts.
// Used by the Export button and by Stella's compile_export tool.

export type ExportPart = "overview" | "vault" | "book" | "artifacts";
export const EXPORT_PARTS: { id: ExportPart; label: string }[] = [
  { id: "overview", label: "Overview" }, { id: "vault", label: "Vault files" }, { id: "book", label: "Book" }, { id: "artifacts", label: "Artifacts list" },
];

export interface ExportOptions { parts: ExportPart[]; groups?: number[]; title?: string; files?: string[] }

const anchor = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
// Push a file's own headings down so they sit under the export's structure.
const demote = (md: string, by: number) => md.replace(/^(#{1,6}) /gm, (_m, h: string) => `${"#".repeat(Math.min(6, h.length + by))} `);

export function buildExport(bundles: AccountBundle[], opts: ExportOptions): { title: string; markdown: string; stats: { projects: number; files: number; chapters: number } } {
  const parts = new Set(opts.parts.length ? opts.parts : ["overview", "vault", "book"]);
  const groups = new Set(opts.groups?.length ? opts.groups : [0, 1, 2, 3]);
  const only = opts.files?.length ? new Set(opts.files) : null;
  const title = opts.title || (bundles.length === 1 ? `${bundles[0].account.name}: context export` : `Context export: ${bundles.map((b) => b.account.name).join(", ")}`);
  const date = new Date().toISOString().slice(0, 10);
  let files = 0, chapters = 0;

  const toc: string[] = [];
  const body: string[] = [];
  for (const b of bundles) {
    const a = b.account;
    toc.push(`- [${a.name}](#${anchor(a.name)})`);
    body.push(`## ${a.name}`, "");
    const facts = [
      a.stage === "sales" ? `In sales · ${a.deal?.stage ?? ""}${a.deal?.value ? ` · ${a.deal.value}` : ""}${a.deal?.owner ? ` · owner ${a.deal.owner}` : ""}` : `In delivery${a.mrr ? ` · MRR ${a.mrr}` : ""}${a.health ? ` · health ${a.health.score} (${a.health.band})` : ""}`,
      a.industry && `Industry: ${a.industry}`, a.squad && `Squad: ${a.squad}`, a.strategist && `Strategist: ${a.strategist}`,
    ].filter(Boolean);
    body.push(`> ${facts.join(" · ")}`, "");

    if (parts.has("overview")) {
      const o = b.overview;
      const lines: string[] = [];
      if (a.deal?.nextStep) lines.push(`- **Next step:** ${a.deal.nextStep}`);
      if (a.deal?.description) lines.push(`- **How sales sees the deal:** ${a.deal.description}`);
      for (const d of o.deals ?? []) lines.push(`- **${d.name}** · ${d.value} · ${d.stage}${d.note ? `. ${d.note}` : ""}`);
      for (const d of o.decisions ?? []) lines.push(`- Decision: **${d.title}.** ${d.detail}`);
      for (const s of o.slipping ?? []) lines.push(`- ${s.kind}: ${s.item}. ${s.detail}`);
      for (const d of o.dates ?? []) lines.push(`- ${d.when}: ${d.what}`);
      if (lines.length) body.push("### Overview", "", ...lines, "");
    }

    if (parts.has("vault")) {
      const kept = b.files.filter((f) => f.state === "active" && f.content.trim() && groups.has(f.group) && (!only || only.has(f.path)));
      for (let g = 0; g < GROUPS.length; g++) {
        const inGroup = kept.filter((f) => f.group === g);
        if (!inGroup.length) continue;
        body.push(`### ${GROUPS[g]}`, "");
        for (const f of inGroup) {
          const name = f.path.split("/").pop()!.replace(/-/g, " ");
          body.push(`#### ${name}`, "", `_Source: ${a.name} vault, ${f.path}.md_`, "", demote(f.content.replace(/^\s*# [^\n]*\n+/, ""), 3).trim(), "");
          files++;
        }
      }
    }

    if (parts.has("book") && b.book.length) {
      body.push("### Book", "");
      for (const c of b.book) {
        body.push(`#### ${c.sort + 1}. ${c.title}`, "", c.body.trim(), "");
        if (c.sources.length) body.push(`_Sources: ${c.sources.join("; ")}_`, "");
        chapters++;
      }
    }

    if (parts.has("artifacts")) {
      const arts = b.artifacts.filter((x) => !x.sensitive);
      if (arts.length) {
        body.push("### Artifacts", "", "| Title | Kind | Date | Link |", "|---|---|---|---|");
        for (const x of arts) body.push(`| ${x.title.replace(/\|/g, "/")} | ${x.kind} | ${x.dated} | ${x.url ? `[open](${x.url})` : x.provider || ""} |`);
        body.push("");
      }
    }
  }

  const header = [`# ${title}`, "", `_Exported from ClientOS on ${date}. ${bundles.length} project${bundles.length === 1 ? "" : "s"}${files ? `, ${files} vault files` : ""}${chapters ? `, ${chapters} book chapters` : ""}. Files left out: empty templates, and anything hidden, archived or marked sensitive._`, ""];
  const contents = bundles.length > 1 ? ["## Contents", "", ...toc, ""] : [];
  return { title, markdown: [...header, ...contents, ...body].join("\n").replace(/\n{3,}/g, "\n\n"), stats: { projects: bundles.length, files, chapters } };
}
