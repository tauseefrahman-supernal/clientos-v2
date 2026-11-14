import Link from "next/link";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { listAccounts, listCategories, listTemplates } from "@/lib/data";
import { MODEL } from "@/lib/stella/agent";
import { corpus } from "@/lib/stella/corpus";
import { Panel, Section } from "@/components/kit";
import { FrameworkList } from "@/components/stella/FrameworkList";

export const dynamic = "force-dynamic";

const CAN = [
  ["Answer questions about an account", "Why a client bought, why a feature is built a certain way, what was promised against what was built, what is slipping. Every claim cites the file, chapter or summary it came from."],
  ["Say when she does not know", "If the vault does not hold an answer she says so and names where it would be: a meeting, Linear, Account OS or Drive. Where sources disagree she gives both."],
  ["Work inside one project", "She reads only the project you have open. Hidden, archived and deleted files, and artifacts marked sensitive, are never in what she can read."],
  ["Start a workflow", "From the Work page she takes a workflow, such as the weekly client review, and prepares the first half. You review it before anything leaves ClientOS."],
];
const NOT_YET = ["Write to the vault (she drafts; you save)", "Read meetings directly from Granola or Fathom", "Read Linear, Account OS, Slack or Drive live", "Search across projects in one question"];

export default async function StellaPage() {
  const accounts = (await listAccounts());
  const cats = (await listCategories());
  const templates = (await listTemplates());
  const dir = join(process.cwd(), "templates", "stella", "Frameworks");
  const frameworks = readdirSync(dir).filter((f) => f.endsWith(".md")).sort().map((f) => {
    const body = readFileSync(join(dir, f), "utf8");
    const blurb = body.split("\n").find((l) => l.startsWith(">") || (l.trim() && !l.startsWith("#") && !l.startsWith("**")))?.replace(/^>\s*/, "").replace(/\*\*/g, "") ?? "";
    return { name: f.replace(/\.md$/, ""), blurb, body };
  });
  const coverage = await Promise.all(accounts.map(async (b) => {
    const src = await corpus(b.account.slug);
    const files = b.files.filter((f) => f.state === "active");
    return {
      slug: b.account.slug, name: b.account.name,
      filled: files.filter((f) => f.content).length, total: files.length,
      hidden: b.files.filter((f) => f.state === "hidden" || f.state === "archived").length,
      chapters: b.book.length, chunks: src.length, sensitive: b.artifacts.filter((a) => a.sensitive).length,
    };
  }));

  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-space-6 px-space-6 py-space-5">
      <header className="flex flex-col gap-space-2">
        <h1 className="font-display text-3xl font-semibold">Stella</h1>
        <p className="max-w-[70ch] text-base leading-relaxed">Stella is ClientOS’s strategy agent. She has read each project’s vault and book, so you can ask her what happened on an account, why, and where it stands, and get an answer with its sources. She works the way the team’s frameworks say a strategist should: one fact in one place, every claim traceable.</p>
        <p className="font-mono text-xs text-muted-foreground">Runs on {MODEL} · opens from the Stella button on any page</p>
      </header>

      <Section title="What she can do for you">
        <div className="grid grid-cols-1 gap-space-3 md:grid-cols-2">
          {CAN.map(([t, d]) => <Panel key={t} className="p-space-4"><h3 className="text-sm font-semibold">{t}</h3><p className="mt-1 text-sm text-muted-foreground">{d}</p></Panel>)}
        </div>
        <p className="text-xs text-muted-foreground"><b className="text-foreground">Not yet:</b> {NOT_YET.join(" · ")}.</p>
      </Section>

      <Section title="What context she has" aside={<span className="font-mono text-xs text-muted-foreground">per project, right now</span>}>
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead className="bg-muted text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"><tr>{["Project", "Vault files filled", "Book chapters", "Searchable passages", "Kept from her"].map((h) => <th key={h} className="px-space-3 py-space-2">{h}</th>)}</tr></thead>
            <tbody>{coverage.map((c) => (
              <tr key={c.slug} className="border-t border-border">
                <td className="px-space-3 py-space-2"><Link href={`/projects/${c.slug}/vault`} className="font-semibold text-[hsl(var(--color-action-text))]">{c.name}</Link></td>
                <td className="px-space-3 py-space-2 tabular-nums">{c.filled} of {c.total}</td>
                <td className="px-space-3 py-space-2 tabular-nums">{c.chapters}</td>
                <td className="px-space-3 py-space-2 tabular-nums">{c.chunks}</td>
                <td className="px-space-3 py-space-2 text-xs text-muted-foreground">{[c.hidden && `${c.hidden} hidden or archived files`, c.sensitive && `${c.sensitive} sensitive artifact${c.sensitive === 1 ? "" : "s"}`].filter(Boolean).join(" · ") || "Nothing"}</td>
              </tr>))}</tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">Each project’s files are the core templates, filled from its research and, for Hooray, its exported scoping vault. Meetings, Linear and Account OS come in when the connectors are built.</p>
      </Section>

      <Section title="The structure she works to" aside={<Link href="/library" className="rounded-md border border-border bg-card px-space-3 py-1 text-xs font-medium no-underline hover:bg-muted">Open the Template Library</Link>}>
        <div className="grid grid-cols-1 gap-space-3 md:grid-cols-4">
          {cats.sort((a, b) => a.group - b.group).map((c) => {
            const ts = templates.filter((t) => t.category === c.slug);
            return (
              <Panel key={c.slug} className="flex flex-col gap-space-2 p-space-4">
                <h3 className="font-display text-lg font-semibold">{c.name}</h3>
                <p className="text-xs text-muted-foreground">{c.description}</p>
                <ul className="flex flex-col gap-0.5 font-mono text-xs">{ts.filter((t) => t.status === "standard").map((t) => <li key={t.name}><Link href={`/library?open=${c.slug}&t=${encodeURIComponent(t.name)}`} className="text-foreground no-underline hover:underline">{t.name}.md</Link></li>)}</ul>
                <p className="mt-auto text-xs text-muted-foreground">+ {ts.filter((t) => t.status !== "standard" && !t.onlyAccount).length} shared · {ts.filter((t) => t.onlyAccount).length} local to one project</p>
              </Panel>
            );
          })}
        </div>
      </Section>

      <Section title="Her frameworks" aside={<span className="font-mono text-xs text-muted-foreground">{frameworks.length} documents she reads before writing</span>}>
        <FrameworkList frameworks={frameworks} />
      </Section>
    </div>
  );
}
