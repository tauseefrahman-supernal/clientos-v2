"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { Pill } from "@/components/kit";
import { useShell } from "@/components/shell/AppShell";
import { RunControl } from "@/components/work/RunControl";
import type { MyViewData } from "@/lib/myview";
import { cn } from "@/lib/utils";

const ROLE_LABEL: Record<string, string> = { strategist: "Strategist", am: "AM", mason: "Mason", fde: "FDE", ae: "AE", other: "Team" };

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

export function MyView({ data }: { data: MyViewData }) {
  const router = useRouter();
  const { openStella } = useShell();
  const [filter, setFilter] = useState("All");
  const [all, setAll] = useState(false);
  const first = data.person.name.split(" ")[0];
  const behind = data.deals.reduce((n, d) => n + d.track.filter((s) => s.state === "behind").length, 0);
  const due = data.work.reduce((n, w) => n + w.flows.filter((f) => !f.current).length, 0);
  const decide = data.actions.filter((a) => a.kind === "Decide").length;
  const blocked = data.actions.filter((a) => a.kind !== "Decide" && (a.tone === "err" || /client|past/i.test(a.kind))).length;
  const kinds = ["All", ...Array.from(new Set(data.actions.map((a) => a.kind)))];
  const matching = data.actions.filter((a) => filter === "All" || a.kind === filter);
  const shown = all ? matching : matching.slice(0, 8);
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-space-6 px-space-6 py-space-5">
      <header className="flex flex-wrap items-end gap-space-3">
        <div>
          <div className="text-sm text-muted-foreground">{today}</div>
          <h1 className="font-display text-3xl font-semibold">{data.viewer.self ? `${greeting()}, ${first}` : `${data.person.name}’s view`}</h1>
          <div className="text-sm text-muted-foreground">{data.deals.length} deals in scoping · {data.work.length} accounts in delivery{data.person.squad ? ` · ${data.person.squad} squad` : ""}{data.person.title ? ` · ${data.person.title}` : ""}</div>
        </div>
        {data.viewer.admin && data.people.length > 0 && (
          <label className="ml-auto flex items-center gap-space-2 text-xs text-muted-foreground">View as
            <select value={data.person.id ?? ""} onChange={(e) => router.push(e.target.value ? `/?as=${e.target.value}` : "/")} className="rounded-md border border-input bg-card px-space-2 py-1 text-sm text-foreground">
              {data.people.map((p) => <option key={p.id} value={p.id}>{p.name}{p.title ? ` · ${p.title}` : ""}</option>)}
            </select>
          </label>
        )}
      </header>

      <div className="grid grid-cols-2 gap-space-3 md:grid-cols-5">
        <Kpi n={data.deals.length} label="Deals in scoping" />
        <Kpi n={behind} label="Scoping steps behind" tone={behind ? "err" : undefined} />
        <Kpi n={due} label="Workflows due" />
        <Kpi n={decide} label="Decisions waiting" />
        <Kpi n={blocked} label="Blocked or past target" tone={blocked ? "warn" : undefined} />
      </div>

      <section className="flex flex-col gap-space-3">
        <div className="flex flex-wrap items-baseline gap-space-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest">Scoping: move these deals forward</h2>
          <span className="font-mono text-xs text-muted-foreground">{data.deals.length}</span>
          <span className="ml-auto flex gap-space-3 text-xs text-muted-foreground"><Legend c="bg-[hsl(var(--color-status-success-text))]" t="done" /><Legend c="bg-[hsl(var(--color-action-default))]" t="now" /><Legend c="bg-[hsl(var(--color-status-error-text))]" t="behind" /><Legend c="bg-border" t="later" /></span>
        </div>
        {data.deals.map((d) => (
          <article key={d.slug} className="grid grid-cols-1 gap-space-4 rounded-xl border border-border bg-card p-space-4 lg:grid-cols-[240px_minmax(0,1fr)_300px]">
            <div className="flex flex-col gap-1">
              {d.parentName && <span className="text-xs font-bold uppercase tracking-wide text-[hsl(var(--color-action-text))]">Expansion · {d.parentName}</span>}
              <Link href={`/projects/${d.slug}`} className="font-display text-lg font-semibold text-foreground no-underline hover:underline">{d.parentName ? d.name.replace(`${d.parentName} · `, "") : d.name}</Link>
              <div className="flex flex-wrap items-center gap-space-2 text-xs text-muted-foreground"><Pill tone="info">{d.stage}</Pill>{d.value || "No value"} · {d.owner || "—"} (AE)</div>
              <div className="text-xs text-muted-foreground">Close {d.close || "not set"}{d.days !== null && <> · <b className={cn(d.days <= 7 && "text-[hsl(var(--color-status-error-text))]")}>{d.days < 0 ? `${-d.days} days past` : d.days === 0 ? "today" : `in ${d.days} days`}</b></>}</div>
              <div className="text-xs text-muted-foreground">{d.filled} vault files filled</div>
            </div>
            <ol className="relative grid grid-cols-8 gap-1 before:absolute before:left-[6%] before:right-[6%] before:top-[11px] before:h-0.5 before:bg-border">
              {d.track.map((s, i) => (
                <li key={s.slug} title={s.file ? `Produces ${s.file}` : "A sign-off step"} className={cn("relative flex flex-col items-center gap-1 text-center text-xs leading-tight", s.state === "now" && "font-semibold text-[hsl(var(--color-action-text))]", s.state === "behind" && "text-[hsl(var(--color-status-error-text))]", (s.state === "later" || s.state === "done") && "text-muted-foreground")}>
                  <span className={cn("flex h-6 w-6 items-center justify-center rounded-full border-2 bg-card text-xs font-bold",
                    s.state === "done" && "border-[hsl(var(--color-status-success-text))] bg-[hsl(var(--color-status-success-text))] text-white",
                    s.state === "now" && "border-[hsl(var(--color-action-default))] ring-4 ring-[hsl(var(--color-action-subtle-bg))]",
                    s.state === "behind" && "border-[hsl(var(--color-status-error-text))] bg-[hsl(var(--color-status-error-bg))]",
                    s.state === "later" && "border-border")}>{s.state === "done" ? <Check className="h-3.5 w-3.5" /> : i + 1}</span>
                  {s.name}
                </li>
              ))}
            </ol>
            <div className="flex flex-col gap-space-2 text-xs">
              {d.next ? (
                <div className="flex flex-col gap-1">
                  <span><b>{d.next.state === "behind" ? "Behind:" : d.next.state === "now" ? "Now:" : "Next:"}</b> {d.next.name}{d.next.file ? <span className="text-muted-foreground"> → {d.next.file}</span> : null}</span>
                  <RunControl slug={d.slug} workflow={d.next.slug} name={`${d.next.name}: ${d.name}`} run={(d.runs[d.next.slug] as never) ?? null} label={`Run ${d.next.name.toLowerCase()}`} />
                </div>
              ) : <span className="text-[hsl(var(--color-status-success-text))]">Every scoping step is done.</span>}
              {d.track.filter((s) => s.state === "behind").length > 1 && <span className="text-[hsl(var(--color-status-error-text))]">Also behind: {d.track.filter((s) => s.state === "behind" && s.slug !== d.next?.slug).map((s) => s.name).join(", ")}</span>}
              {d.accountOsNext && <span className="text-muted-foreground">Account OS next step: {d.accountOsNext}</span>}
              <span className="flex gap-space-2"><Link href={`/projects/${d.slug}/vault`} className="text-xs">Open vault</Link><Link href={`/projects/${d.slug}/work`} className="text-xs">All steps</Link></span>
            </div>
          </article>
        ))}
        {!data.deals.length && <p className="rounded-lg border border-dashed border-border px-space-4 py-space-3 text-sm text-muted-foreground">No deals in scoping are assigned to {data.viewer.self ? "you" : data.person.name}.</p>}
      </section>

      <section className="flex flex-col gap-space-3">
        <div className="flex flex-wrap items-baseline gap-space-3"><h2 className="text-xs font-semibold uppercase tracking-widest">This week’s work</h2><span className="text-xs text-muted-foreground">The same workflows as each project’s Work page: run one here or there and both show it.</span></div>
        {data.work.length ? (
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[960px] border-collapse text-sm">
              <thead><tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground"><th className="px-space-3 py-space-2">Account</th>{data.work[0].flows.map((f) => <th key={f.slug} className="px-space-3 py-space-2 font-semibold">{f.name}<div className="font-normal normal-case tracking-normal">{f.cadence}</div></th>)}</tr></thead>
              <tbody>{data.work.map((w) => (
                <tr key={w.slug} className="border-b border-border last:border-0">
                  <td className="px-space-3 py-space-2"><Link href={`/projects/${w.slug}/work`} className="font-semibold text-foreground no-underline hover:underline">{w.name}</Link>{w.health && <div><Pill tone={w.health.tone}>{w.health.score} · {w.health.band}</Pill></div>}</td>
                  {w.flows.map((f) => <td key={f.slug} className="px-space-3 py-space-2"><RunControl slug={w.slug} workflow={f.slug} name={`${f.name}: ${w.name}`} run={f.run as never} current={f.current} external={f.kind === "external"} compact /></td>)}
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : <p className="rounded-lg border border-dashed border-border px-space-4 py-space-3 text-sm text-muted-foreground">No accounts in delivery are assigned to {data.viewer.self ? "you" : data.person.name}.</p>}
      </section>

      <div className="grid grid-cols-1 gap-space-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-xl border border-border bg-card">
          <div className="flex flex-wrap items-center gap-space-2 border-b border-border px-space-4 py-space-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest">Needs you</h2><span className="font-mono text-xs text-muted-foreground">{matching.length}</span>
            <div className="ml-auto flex flex-wrap gap-1">{kinds.map((k) => <button key={k} onClick={() => { setFilter(k); setAll(false); }} className={cn("rounded-full border px-space-2 py-0.5 text-xs", k === filter ? "border-primary bg-[hsl(var(--color-action-subtle-bg))] text-[hsl(var(--color-action-text))]" : "border-border text-muted-foreground")}>{k}</button>)}</div>
          </div>
          {shown.map((a, i) => (
            <div key={`${a.slug}-${i}`} className="grid grid-cols-[10px_130px_minmax(0,1fr)_auto] items-start gap-space-3 border-b border-border px-space-4 py-space-3 last:border-0">
              <span className={cn("mt-1.5 h-2 w-2 rounded-full", a.tone === "err" ? "bg-[hsl(var(--color-status-error-text))]" : a.tone === "warn" ? "bg-[hsl(var(--color-status-warning-text))]" : "bg-[hsl(var(--color-action-default))]")} />
              <Link href={`/projects/${a.slug}`} className="truncate text-xs font-semibold text-[hsl(var(--color-action-text))] no-underline">{a.project}</Link>
              <div><span className="mr-space-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{a.kind}</span><b className="text-sm">{a.item}</b><div className="text-sm text-muted-foreground">{a.detail}</div></div>
              <button onClick={() => openStella(`On ${a.project}: ${a.item}. ${a.detail} What should I do next, and can you draft it?`)} title="Ask Stella" className="inline-flex items-center gap-1 rounded-md border border-border px-space-2 py-0.5 text-xs hover:bg-muted"><Sparkles className="h-3 w-3 text-primary" />Ask</button>
            </div>
          ))}
          {matching.length > 8 && <div className="px-space-4 py-space-3"><button onClick={() => setAll((x) => !x)} className="rounded-md border border-border px-space-3 py-1 text-xs">{all ? "Show the 8 most urgent" : `Show all ${matching.length}`}</button></div>}
          {!matching.length && <p className="px-space-4 py-space-3 text-sm text-muted-foreground">Nothing waiting.</p>}
        </section>
        <section className="max-h-[720px] self-start overflow-y-auto rounded-xl border border-border bg-card">
          <h2 className="border-b border-border px-space-4 py-space-3 text-xs font-semibold uppercase tracking-widest">Coming up</h2>
          {data.dates.map((x, i) => <div key={i} className="border-b border-border px-space-4 py-space-2 last:border-0"><div className="text-xs font-semibold">{x.when}</div><div className="text-sm">{x.what}</div><Link href={`/projects/${x.slug}`} className="text-xs no-underline">{x.project}</Link></div>)}
          {!data.dates.length && <p className="px-space-4 py-space-3 text-sm text-muted-foreground">No dates recorded.</p>}
        </section>
      </div>

      {data.accounts.length > 0 && (
        <section className="flex flex-col gap-space-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest">Accounts in delivery</h2>
          <div className="grid grid-cols-1 gap-space-3 md:grid-cols-2 xl:grid-cols-3">
            {data.accounts.map((a) => (
              <article key={a.slug} className="flex flex-col gap-space-2 rounded-xl border border-border bg-card p-space-4">
                <div className="flex flex-wrap items-baseline gap-space-2"><Link href={`/projects/${a.slug}`} className="font-display text-lg font-semibold text-foreground no-underline hover:underline">{a.name}</Link>{a.health ? <Pill tone={a.health.tone}>{a.health.score} · {a.health.band}</Pill> : <Pill>Not scored</Pill>}<span className="ml-auto text-xs text-muted-foreground">{a.mrr} MRR</span></div>
                <div className="text-xs text-muted-foreground">{a.roles.map((r) => ROLE_LABEL[r] ?? r).join(", ")} · {a.decisions} decisions · {a.slipping} slipping</div>
                <div className="flex flex-col gap-1">{a.streams.map((s) => <div key={s.name} className="grid grid-cols-[minmax(0,1fr)_90px_40px] items-center gap-space-2 text-xs"><span className="truncate">{s.name}</span><span className="h-1.5 overflow-hidden rounded bg-muted"><i className={cn("block h-full", s.tone === "err" ? "bg-[hsl(var(--color-status-error-text))]" : s.tone === "warn" ? "bg-[hsl(var(--color-status-warning-text))]" : "bg-primary")} style={{ width: `${s.pct ?? 0}%` }} /></span><span className="font-mono">{s.pct == null ? "—" : `${s.pct}%`}</span></div>)}</div>
                {a.next && <div className="rounded-md bg-muted px-space-3 py-space-2 text-xs"><b>{a.next.when}</b> · {a.next.what}</div>}
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Kpi({ n, label, tone }: { n: number; label: string; tone?: "err" | "warn" }) {
  return <div className="rounded-xl border border-border bg-card px-space-4 py-space-3"><b className={cn("block text-2xl font-semibold", tone === "err" && "text-[hsl(var(--color-status-error-text))]", tone === "warn" && "text-[hsl(var(--color-status-warning-text))]")}>{n}</b><span className="text-xs text-muted-foreground">{label}</span></div>;
}
function Legend({ c, t }: { c: string; t: string }) {
  return <span className="flex items-center gap-1"><i className={cn("inline-block h-2 w-2 rounded-full", c)} />{t}</span>;
}
