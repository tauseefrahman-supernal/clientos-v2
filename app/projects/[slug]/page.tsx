import Link from "next/link";
import { notFound } from "next/navigation";
import { getAccount, listAccounts } from "@/lib/data";
import { relatedByIndustry } from "@/lib/data/related";
import { SalesOverview } from "@/components/project/SalesOverview";
import { Empty, Panel, Pill, Row, Rows, Section } from "@/components/kit";
import { cn } from "@/lib/utils";

const PHASES = ["Sales", "Deal", "Technical", "Delivery"];

export default async function OverviewPage({ params }: { params: { slug: string } }) {
  const b = (await getAccount(params.slug));
  if (!b) notFound();
  const { account: a, overview: o } = b;
  if (a.stage === "sales") {
    const all = (await listAccounts());
    return <SalesOverview b={b} related={relatedByIndustry(b, all)} others={all.filter((x) => x.account.stage === "delivery")} />;
  }
  const attention = o.streams.filter((s) => s.attention);
  const healthy = o.streams.filter((s) => !s.attention);
  const kinds = [...new Set(o.slipping.map((s) => s.kind))];
  const base = `/projects/${a.slug}`;

  return (
    <div className="mx-auto flex max-w-[1120px] flex-col gap-space-6 px-space-6 py-space-5">
      {a.freshness.length > 0 && <p className="flex flex-wrap gap-x-space-3 gap-y-space-1 text-xs text-muted-foreground">{a.freshness.map((f, i) => <span key={i}>{i > 0 && <span className="mr-space-3">·</span>}{f}</span>)}</p>}

      <Section title="Deals on this account" aside={<span className="font-mono text-xs text-muted-foreground">one row per order form, each at its own stage</span>}>
        <Panel>
          <div className="grid grid-cols-[minmax(0,1.3fr)_200px_minmax(0,1fr)] gap-space-3 border-b border-border px-space-4 py-1.5 font-mono text-xs text-muted-foreground"><span /><span className="grid grid-cols-4 text-center">{PHASES.map((p) => <span key={p}>{p}</span>)}</span><span /></div>
          {o.deals.map((d, i) => (
            <div key={i} className="grid grid-cols-1 items-center gap-space-3 border-b border-border px-space-4 py-space-2 last:border-0 md:grid-cols-[minmax(0,1.3fr)_200px_minmax(0,1fr)]">
              <div className="text-sm"><span className="font-semibold">{d.name}</span>{d.value && <span className="text-muted-foreground"> · {d.value}</span>}</div>
              <div className="grid grid-cols-4 gap-1">{PHASES.map((_, p) => <span key={p} className={cn("h-1.5 rounded-full", p <= d.phase ? "bg-primary" : "bg-muted")} />)}</div>
              <div className="text-sm">{d.stage}<div className="text-xs text-muted-foreground">{d.note}</div></div>
            </div>
          ))}
        </Panel>
        {o.lost && <p className="font-mono text-xs text-muted-foreground">{o.lost}</p>}
      </Section>

      <Section title="This week" aside={<Link href={`${base}/work`} className="rounded-md border border-border bg-card px-space-3 py-1 text-xs font-medium no-underline hover:bg-muted">Open Work</Link>}>
        <Panel><Rows>{o.decisions.map((d, i) => <Row key={i} title={d.title} detail={d.detail} right={<span className="rounded-md border border-border px-space-2 py-0.5 text-xs">{d.action}</span>} />)}</Rows></Panel>
        {o.slipping.length > 0 && (
          <details className="rounded-lg border border-border bg-card">
            <summary className="flex cursor-pointer flex-wrap items-center gap-space-2 px-space-4 py-space-3 text-sm font-semibold">{o.slipping.length} items slipping {kinds.map((k) => { const it = o.slipping.filter((s) => s.kind === k); return <Pill key={k} tone={it[0].tone}>{it.length} {k.toLowerCase()}</Pill>; })}</summary>
            <div className="border-t border-border"><Rows>{o.slipping.map((s, i) => <Row key={i} title={s.item} detail={s.detail} right={<Pill tone={s.tone}>{s.kind}</Pill>} />)}</Rows></div>
          </details>
        )}
        {o.dates.length > 0 && (
          <details className="rounded-lg border border-border bg-card">
            <summary className="cursor-pointer px-space-4 py-space-3 text-sm font-semibold">{o.dates.length} dates in the next 30 days <span className="ml-space-2 font-mono text-xs font-normal text-muted-foreground">next: {o.dates[0].when}</span></summary>
            <ul className="divide-y divide-[var(--color-border-default)] border-t border-border">{o.dates.map((d, i) => <li key={i} className="grid grid-cols-[72px_minmax(0,1fr)] gap-space-3 px-space-4 py-1.5 text-sm"><span className="font-mono text-xs text-muted-foreground">{d.when}</span>{d.what}</li>)}</ul>
          </details>
        )}
      </Section>

      <Section title="Where the account stands">
        <Panel>
          {o.tiles.map((t, i) => (
            <Link key={i} href={`${base}/vault?file=${encodeURIComponent(t.file)}`} className="grid grid-cols-1 items-center gap-space-2 border-b border-border px-space-4 py-space-3 text-foreground no-underline last:border-0 hover:bg-muted/50 md:grid-cols-[170px_minmax(0,1fr)_auto]">
              <span className="text-sm font-semibold">{t.title}<span className="block font-mono text-xs font-normal text-muted-foreground">{t.section}</span></span>
              <span className="text-sm text-muted-foreground">{t.headline}</span>
              <Pill tone={t.tone}>{t.state}</Pill>
            </Link>
          ))}
        </Panel>
      </Section>

      <Section title="Workstreams" aside={<span className="font-mono text-xs text-muted-foreground">{attention.length} of {o.streams.length} need attention</span>}>
        {o.streams.length ? <>
          <Panel>{attention.map((s, i) => <Stream key={i} s={s} />)}{!attention.length && <p className="px-space-4 py-space-3 text-sm text-muted-foreground">Nothing needs attention.</p>}</Panel>
          {healthy.length > 0 && <details className="rounded-lg border border-border bg-card"><summary className="cursor-pointer px-space-4 py-space-3 text-sm font-semibold">{healthy.length} on track or in progress</summary><div className="border-t border-border">{healthy.map((s, i) => <Stream key={i} s={s} />)}</div></details>}
        </> : <Empty>No workstreams recorded.</Empty>}
      </Section>

      <Section title="What updated the files">
        <Panel>
          <ul className="divide-y divide-[var(--color-border-default)]">
            {o.feed.map((f, i) => <li key={i} className="grid grid-cols-1 gap-space-1 px-space-4 py-space-2 md:grid-cols-[200px_minmax(0,1fr)]"><span className="font-mono text-xs text-muted-foreground">{f.meeting} · {f.date}</span><ul className="text-sm">{f.changes.map((c, j) => <li key={j}>{c}</li>)}</ul></li>)}
          </ul>
        </Panel>
      </Section>

      {o.disagreements.length > 0 && (
        <details className="rounded-lg border border-border bg-card">
          <summary className="cursor-pointer px-space-4 py-space-3 text-sm font-semibold">{o.disagreements.length} facts where the sources disagree</summary>
          <ul className="list-disc border-t border-border py-space-2 pl-space-7 pr-space-4 text-sm">{o.disagreements.map((d, i) => <li key={i} className="py-0.5">{d}</li>)}</ul>
        </details>
      )}
    </div>
  );
}

function Stream({ s }: { s: { name: string; state: string; tone: string; pct: number | null; due: string; measured: string; learned: string } }) {
  return (
    <div className="grid grid-cols-1 items-start gap-space-2 border-b border-border px-space-4 py-space-2 last:border-0 md:grid-cols-[180px_100px_minmax(0,1fr)_auto]">
      <span className="text-sm font-semibold">{s.name}</span>
      <span className="font-mono text-xs text-muted-foreground">{s.pct != null && <>{s.pct}%{s.due && ` · ${s.due}`}<span className="mt-1 block h-1 overflow-hidden rounded bg-muted"><span className="block h-full bg-primary" style={{ width: `${s.pct}%` }} /></span></>}</span>
      <span className="text-xs text-muted-foreground">{[s.learned, s.measured].filter(Boolean).join(" ")}</span>
      <Pill tone={s.tone}>{s.state}</Pill>
    </div>
  );
}
