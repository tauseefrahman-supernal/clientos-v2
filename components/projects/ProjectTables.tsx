"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Pill } from "@/components/kit";
import { cn } from "@/lib/utils";
import type { Tone } from "@/lib/types";

export type DeliveryRow = { slug: string; name: string; industry: string; squad: string | null; strategist: string; mrr: string; health: { score: string; band: string; tone: Tone } | null; chapters: number; filled: number; files: number };
export type SalesRow = { slug: string; name: string; expansion: boolean; stage: string; industry: string; value: string; owner: string; expectedClose: string; nextStep: string };

const NOT_SET = "Not set";
const CLOSE_BUCKETS = ["Past due", "Next 30 days", "31 to 90 days", "Later", NOT_SET] as const;

function closeBucket(date: string, today: number): (typeof CLOSE_BUCKETS)[number] {
  const t = Date.parse(date);
  if (!date || Number.isNaN(t)) return NOT_SET;
  const days = (t - today) / 86400000;
  return days < 0 ? "Past due" : days <= 30 ? "Next 30 days" : days <= 90 ? "31 to 90 days" : "Later";
}

type Filters = Record<string, string>;
function useFilters(table: "delivery" | "sales") {
  const KEY = `cos.projects.filters.${table}`;
  const [f, setF] = useState<Filters>({});
  useEffect(() => { try { setF(JSON.parse(localStorage.getItem(KEY) || "{}")); } catch { /* blocked storage */ } }, [KEY]);
  const set = (k: string, v: string) => setF((cur) => {
    const next = { ...cur, [k]: v };
    if (!v) delete next[k];
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* blocked storage */ }
    return next;
  });
  return [f, set] as const;
}

const options = (values: string[]) => Array.from(new Set(values.map((v) => v || NOT_SET))).sort((a, b) => (a === NOT_SET ? 1 : b === NOT_SET ? -1 : a.localeCompare(b)));

function Filter({ label, value, values, onChange, keep }: { label: string; value: string; values: string[]; onChange: (v: string) => void; keep?: boolean }) {
  return (
    <label className={cn("flex items-center gap-1 rounded-md border bg-card pl-space-2 text-xs", value ? "border-primary" : "border-border")}>
      <span className="text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="max-w-[220px] cursor-pointer bg-transparent py-1 pr-space-1 text-xs font-medium outline-none">
        <option value="">All</option>
        {(keep ? values : options(values)).map((v) => <option key={v} value={v}>{v}</option>)}
      </select>
    </label>
  );
}

function Bar({ children, shown, total, clear, active }: { children: React.ReactNode; shown: number; total: number; clear: () => void; active: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-space-2">
      {children}
      {active && <button onClick={clear} className="flex items-center gap-1 rounded-md px-space-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"><X className="h-3 w-3" />Clear</button>}
      <span className="ml-auto font-mono text-xs text-muted-foreground">{shown === total ? `${total}` : `${shown} of ${total}`}</span>
    </div>
  );
}

const th = "px-space-3 py-space-2";
const td = "px-space-3 py-space-3";

export function DeliveryTable({ rows }: { rows: DeliveryRow[] }) {
  const [f, set] = useFilters("delivery");
  const shown = rows.filter((r) => (!f.dSquad || (r.squad || NOT_SET) === f.dSquad) && (!f.dStrategist || (r.strategist || NOT_SET) === f.dStrategist) && (!f.dIndustry || (r.industry || NOT_SET) === f.dIndustry));
  const active = !!(f.dSquad || f.dStrategist || f.dIndustry);
  return (
    <>
      <Bar shown={shown.length} total={rows.length} active={active} clear={() => { set("dSquad", ""); set("dStrategist", ""); set("dIndustry", ""); }}>
        <Filter label="Squad" value={f.dSquad ?? ""} values={rows.map((r) => r.squad ?? "")} onChange={(v) => set("dSquad", v)} />
        <Filter label="Strategist" value={f.dStrategist ?? ""} values={rows.map((r) => r.strategist)} onChange={(v) => set("dStrategist", v)} />
        <Filter label="Industry" value={f.dIndustry ?? ""} values={rows.map((r) => r.industry)} onChange={(v) => set("dIndustry", v)} />
      </Bar>
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[1000px] border-collapse text-sm">
          <thead className="bg-muted text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"><tr>{["Project", "Industry", "Squad", "Strategist", "MRR", "Health", "Book", "Vault files filled"].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-[var(--color-border-default)]">
            {shown.map((a) => (
              <tr key={a.slug} className="align-top hover:bg-muted/40">
                <td className={td}><Link href={`/projects/${a.slug}`} className="font-semibold text-[hsl(var(--color-action-text))]">{a.name}</Link></td>
                <td className={`${td} text-xs`}>{a.industry || <span className="text-muted-foreground">Not set</span>}</td>
                <td className={td}>{a.squad ? <Pill tone="info">{a.squad}</Pill> : <span className="text-xs text-muted-foreground">Not set</span>}</td>
                <td className={td}>{a.strategist}</td>
                <td className={`${td} tabular-nums`}>{a.mrr || "—"}</td>
                <td className={td}>{a.health ? <Pill tone={a.health.tone}>{a.health.score} · {a.health.band}</Pill> : <Pill>Not scored</Pill>}</td>
                <td className={`${td} whitespace-nowrap`}>{a.chapters} chapters</td>
                <td className={`${td} tabular-nums`}>{a.filled} of {a.files}</td>
              </tr>
            ))}
            {!shown.length && <tr><td colSpan={8} className="px-space-3 py-space-4 text-sm text-muted-foreground">No projects match these filters.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function SalesTable({ rows, stageOrder }: { rows: SalesRow[]; stageOrder: string[] }) {
  const [f, set] = useFilters("sales");
  const [today, setToday] = useState(0);
  useEffect(() => { const d = new Date(); d.setHours(0, 0, 0, 0); setToday(d.getTime()); }, []); // client clock, after hydration
  const stages = useMemo(() => stageOrder.filter((s) => rows.some((r) => r.stage === s)), [rows, stageOrder]);
  const shown = rows.filter((r) =>
    (!f.sOwner || (r.owner || NOT_SET) === f.sOwner) && (!f.sIndustry || (r.industry || NOT_SET) === f.sIndustry) &&
    (!f.sStage || r.stage === f.sStage) && (!f.sClose || !today || closeBucket(r.expectedClose, today) === f.sClose));
  const active = !!(f.sOwner || f.sIndustry || f.sStage || f.sClose);
  return (
    <>
      <Bar shown={shown.length} total={rows.length} active={active} clear={() => { ["sOwner", "sIndustry", "sStage", "sClose"].forEach((k) => set(k, "")); }}>
        <Filter label="Owner" value={f.sOwner ?? ""} values={rows.map((r) => r.owner)} onChange={(v) => set("sOwner", v)} />
        <Filter label="Industry" value={f.sIndustry ?? ""} values={rows.map((r) => r.industry)} onChange={(v) => set("sIndustry", v)} />
        <Filter label="Stage" value={f.sStage ?? ""} values={stages} keep onChange={(v) => set("sStage", v)} />
        <Filter label="Expected close" value={f.sClose ?? ""} values={[...CLOSE_BUCKETS]} keep onChange={(v) => set("sClose", v)} />
      </Bar>
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[1000px] border-collapse text-sm">
          <thead className="bg-muted text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"><tr>{["Deal", "Stage", "Industry", "Value", "Owner", "Expected close", "Next step"].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-[var(--color-border-default)]">
            {shown.map((a) => {
              const late = today > 0 && closeBucket(a.expectedClose, today) === "Past due";
              return (
                <tr key={a.slug} className="align-top hover:bg-muted/40">
                  <td className={td}><Link href={`/projects/${a.slug}`} className="font-semibold text-[hsl(var(--color-action-text))]">{a.name}</Link>{a.expansion && <span className="ml-space-2 text-xs text-muted-foreground">expansion</span>}</td>
                  <td className={td}><Pill>{a.stage}</Pill></td>
                  <td className={`${td} text-xs`}>{a.industry || <span className="text-muted-foreground">Not set</span>}</td>
                  <td className={`${td} tabular-nums`}>{a.value || "—"}</td>
                  <td className={td}>{a.owner || "—"}</td>
                  <td className={cn(td, "whitespace-nowrap", late && "text-[hsl(var(--color-status-error-text))]")}>{a.expectedClose || "—"}{late && <span className="ml-1 text-xs">past due</span>}</td>
                  <td className={`${td} max-w-[320px] text-xs text-muted-foreground`}>{a.nextStep || "—"}</td>
                </tr>
              );
            })}
            {!shown.length && <tr><td colSpan={7} className="px-space-3 py-space-4 text-sm text-muted-foreground">No deals match these filters.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
