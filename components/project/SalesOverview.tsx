import Link from "next/link";
import { Panel, Pill, Section } from "@/components/kit";
import { GROUPS, type AccountBundle } from "@/lib/types";
import { cn } from "@/lib/utils";

const BOARD = ["Idea", "Nurture", "Concept Alignment", "Prototype", "Proposal", "Order Form", "Closed Won"];

export function SalesOverview({ b, related, others }: { b: AccountBundle; related: { bundle: AccountBundle; shared: string[] }[]; others: AccountBundle[] }) {
  const a = b.account, d = a.deal!;
  const at = BOARD.indexOf(d.stage);
  const base = `/projects/${a.slug}`;
  return (
    <div className="mx-auto flex max-w-[1120px] flex-col gap-space-6 px-space-6 py-space-5">
      <p className="text-xs text-muted-foreground">{a.freshness.join(" · ")}</p>

      <Section title="Where the deal is">
        <Panel className="flex flex-col gap-space-3 p-space-4">
          <div className="grid grid-cols-7 gap-1">
            {BOARD.map((s, i) => <div key={s} className="flex flex-col gap-1"><span className={cn("h-1.5 rounded-full", i < at ? "bg-primary" : i === at ? "bg-primary ring-2 ring-[hsl(var(--color-action-subtle-bg))]" : "bg-muted")} /><span className={cn("text-xs", i === at ? "font-semibold" : "text-muted-foreground")}>{s}</span></div>)}
          </div>
          <dl className="grid grid-cols-1 gap-x-space-6 gap-y-space-2 text-sm md:grid-cols-[140px_minmax(0,1fr)]">
            <dt className="text-muted-foreground">Next step</dt><dd>{d.nextStep || "None recorded"}</dd>
            <dt className="text-muted-foreground">How sales sees it</dt><dd>{d.description || "Not written yet"}</dd>
            <dt className="text-muted-foreground">Value</dt><dd>{d.value || "Not set"}{d.mrr && `, ${d.mrr} a month`} · {d.motion || "motion not set"} · confidence {d.confidence || "not set"}</dd>
            <dt className="text-muted-foreground">People</dt><dd>Owner {d.owner || "not set"}{d.people.length ? ` · ${d.people.join(", ")}` : ""}</dd>
          </dl>
        </Panel>
      </Section>

      <Section title="Scoping files" aside={<Link href={`${base}/work`} className="rounded-md border border-border bg-card px-space-3 py-1 text-xs font-medium no-underline hover:bg-muted">Open scoping work</Link>}>
        <div className="grid grid-cols-1 gap-space-3 md:grid-cols-3">
          {GROUPS.slice(0, 3).map((g, gi) => {
            const fs = b.files.filter((f) => f.group === gi);
            return (
              <Panel key={g} className="flex flex-col gap-space-2 p-space-4">
                <div className="flex items-baseline justify-between"><h3 className="text-sm font-semibold">{g}</h3><span className="font-mono text-xs text-muted-foreground">{fs.filter((f) => f.content).length} of {fs.length} filled</span></div>
                <ul className="flex flex-col gap-0.5 font-mono text-xs">{fs.map((f) => <li key={f.path}><Link href={`${base}/vault?file=${encodeURIComponent(f.path)}`} className={cn("no-underline hover:underline", f.content ? "text-foreground" : "text-muted-foreground")}>{f.path.split("/").pop()}.md</Link></li>)}</ul>
              </Panel>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">Delivery Strategy files are created when the deal closes. Stella fills these from calls and from what similar projects learned; you approve each file.</p>
      </Section>

      <Section title="Expertise from projects in the same industry" aside={<span className="font-mono text-xs text-muted-foreground">{a.industry || "industry not set"}</span>}>
        {related.length ? (
          <div className="grid grid-cols-1 gap-space-3 md:grid-cols-2">
            {related.map(({ bundle: r, shared }) => (
              <Panel key={r.account.slug} className="flex flex-col gap-space-2 p-space-4">
                <div className="flex flex-wrap items-baseline gap-space-2"><Link href={`/projects/${r.account.slug}`} className="font-semibold">{r.account.name}</Link><span className="text-xs text-muted-foreground">{r.account.industry}</span>{r.account.squad && <Pill tone="info">{r.account.squad}</Pill>}</div>
                <p className="text-xs text-muted-foreground">Shares: {shared.join(", ")}. Strategist {r.account.strategist}.</p>
                <ul className="flex flex-wrap gap-1">{["Concept-Alignment", "Product-Segmentation", "Phasing-Commercial", "Feature-Rationale"].filter((n) => r.files.some((f) => f.path.endsWith(`/${n}`) && f.content)).map((n) => <li key={n}><Link href={`/projects/${r.account.slug}/vault?file=${n}`} className="rounded border border-border px-1.5 py-0.5 font-mono text-xs text-muted-foreground no-underline hover:text-foreground">{n}.md</Link></li>)}</ul>
              </Panel>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-border px-space-4 py-space-3 text-sm text-muted-foreground">{a.industry ? "No delivered project shares this industry yet." : "Set the industry to link this deal to delivered projects."} Stella can still draw on all {others.length} delivered projects when scoping.</p>
        )}
      </Section>
    </div>
  );
}
