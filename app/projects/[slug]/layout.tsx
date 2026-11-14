import { notFound } from "next/navigation";
import { getAccount } from "@/lib/data";
import { Pill } from "@/components/kit";
import { ProjectTabs } from "@/components/project/ProjectTabs";

export default async function ProjectLayout({ params, children }: { params: { slug: string }; children: React.ReactNode }) {
  const b = (await getAccount(params.slug));
  if (!b) notFound();
  const a = b.account;
  const d = a.deal;
  return (
    <div className="flex min-h-full flex-col">
      <div className="border-b border-border px-space-6 pt-space-4">
        <div className="flex flex-wrap items-baseline gap-space-3">
          <h1 className="font-display text-3xl font-semibold">{a.name}</h1>
          <Pill tone={a.stage === "sales" ? "warn" : "ok"}>{a.stage === "sales" ? "In sales" : "In delivery"}</Pill>
        </div>
        <div className="mt-space-1 flex flex-wrap items-center gap-x-space-3 gap-y-space-1 text-xs text-muted-foreground">
          {a.industry && <span className="font-medium text-foreground">{a.industry}</span>}
          {a.squad && <Pill tone="info">{a.squad} squad</Pill>}
          {a.pod && <span>{a.pod}</span>}
          {d ? <>
            <span className="rounded-sm border border-border bg-secondary px-space-2 py-0.5 font-bold uppercase text-foreground">{d.stage}</span>
            {d.value && <span className="font-semibold text-[hsl(var(--color-action-text))]">{d.value}</span>}
            {d.expectedClose && <span>Expected close {d.expectedClose}</span>}
          </> : <>
            <span className="rounded-sm border border-border bg-secondary px-space-2 py-0.5 font-bold uppercase text-foreground">{a.closedCount} Closed Won</span>
            {a.closedValue && <span className="font-semibold text-[hsl(var(--color-action-text))]">{a.closedValue}</span>}
            {a.mrr && <span>{a.mrr} MRR</span>}
            {a.health && <Pill tone={a.health.tone}>Health {a.health.score} · {a.health.band}</Pill>}
          </>}
        </div>
        <ProjectTabs slug={a.slug} hasBook={a.stage === "delivery" || b.book.length > 0} hasArtifacts={a.stage === "delivery" || b.artifacts.length > 0} />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
