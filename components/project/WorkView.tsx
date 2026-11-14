"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronRight, Sparkles } from "lucide-react";
import { Pill } from "@/components/kit";
import { useShell } from "@/components/shell/AppShell";
import { cn } from "@/lib/utils";
import type { Workflow } from "@/lib/types";

export type WorkflowDetail =
  | { kind: "table"; head: string[]; rows: string[][]; lead?: string }
  | { kind: "columns"; columns: [string, string[]][] }
  | { kind: "none" };

const FILTERS = ["All", "With the client", "Internal", "Makes an artifact"] as const;

export function WorkView({ slug, items, openSlug }: { slug: string; items: (Workflow & { detail: WorkflowDetail })[]; openSlug: string | null }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [open, setOpen] = useState<string | null>(openSlug);
  const { openStella } = useShell();
  const list = items.filter((w) => filter === "All" || (filter === "With the client" && w.kind === "external") || (filter === "Internal" && w.kind === "internal") || (filter === "Makes an artifact" && w.output));

  return (
    <div className="mx-auto flex max-w-[1120px] flex-col gap-space-4 px-space-6 py-space-5">
      <div className="flex flex-wrap items-baseline gap-space-3">
        <h2 className="font-display text-xl font-semibold">Work</h2>
        <span className="font-mono text-xs text-muted-foreground">{items.length} workflows · {items.filter((w) => w.kind === "external").length} with the client · {items.filter((w) => w.kind === "internal").length} internal</span>
      </div>
      <p className="max-w-[72ch] text-sm text-muted-foreground">How client work gets delivered on this account. Each workflow says who it is for, what it draws on and what it produces. Stella can run one to get the first half done.</p>
      <div className="flex flex-wrap gap-1">
        {FILTERS.map((f) => <button key={f} onClick={() => setFilter(f)} className={cn("rounded-full border px-space-2 py-0.5 text-xs", f === filter ? "border-primary bg-[hsl(var(--color-action-subtle-bg))] text-[hsl(var(--color-action-text))]" : "border-border text-muted-foreground hover:text-foreground")}>{f}</button>)}
      </div>
      <div className="rounded-lg border border-border bg-card">
        {list.map((w) => {
          const isOpen = open === w.slug;
          return (
            <div key={w.slug} className="border-b border-border last:border-0">
              <button onClick={() => setOpen(isOpen ? null : w.slug)} aria-expanded={isOpen} className="grid w-full grid-cols-[16px_minmax(0,1.4fr)_minmax(0,1fr)_auto] items-center gap-space-3 px-space-4 py-space-3 text-left hover:bg-muted/50">
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <span><span className="block text-sm font-semibold">{w.name}</span><span className="block text-xs text-muted-foreground">{[w.cadence, w.audience].filter(Boolean).join(" · ")}</span></span>
                <span className="hidden text-xs text-muted-foreground md:block">{w.output ? `Produces: ${w.output}` : "No artifact"}</span>
                <span className="flex gap-1">{w.kind === "external" ? <Pill tone="info">With client</Pill> : <Pill>Internal</Pill>}{!w.standard && <Pill>This account</Pill>}</span>
              </button>
              {isOpen && (
                <div className="flex flex-col gap-space-3 px-space-4 pb-space-4 pl-[52px]">
                  <Detail d={w.detail} note={w.note} />
                  <div className="flex flex-wrap items-center gap-space-2">
                    {w.inputs.length > 0 && <><span className="font-mono text-xs text-muted-foreground">Draws on</span>{w.inputs.map((i) => <Link key={i} href={`/projects/${slug}/vault?file=${encodeURIComponent(i)}`} className="rounded border border-border px-1.5 py-0.5 font-mono text-xs text-muted-foreground no-underline hover:text-foreground">{i}.md</Link>)}</>}
                    <button onClick={() => openStella(`Run the “${w.name}” workflow and draft ${w.output || "the output"}.`)} className="ml-auto flex items-center gap-1 rounded-md bg-primary px-space-3 py-1 text-xs font-medium text-primary-foreground"><Sparkles className="h-3.5 w-3.5" />Run with Stella</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Detail({ d, note }: { d: WorkflowDetail; note: string }) {
  if (d.kind === "columns") return (
    <div className="grid grid-cols-1 gap-space-3 md:grid-cols-3">
      {d.columns.map(([h, items]) => <div key={h}><h4 className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{h}</h4><ul className="list-disc pl-4 text-sm">{items.length ? items.map((x, i) => <li key={i}>{x}</li>) : <li className="text-muted-foreground">Nothing recorded.</li>}</ul></div>)}
    </div>
  );
  if (d.kind === "table") return (
    <div className="flex flex-col gap-space-2">
      {d.lead && <p className="text-sm text-muted-foreground">{d.lead}</p>}
      {d.rows.length ? <div className="overflow-x-auto rounded-md border border-border"><table className="w-full min-w-[560px] border-collapse text-xs"><thead className="bg-muted text-left uppercase tracking-wide text-muted-foreground"><tr>{d.head.map((h) => <th key={h} className="px-space-2 py-1.5 font-medium">{h}</th>)}</tr></thead><tbody>{d.rows.map((r, i) => <tr key={i} className="border-t border-border align-top">{r.map((c, j) => <td key={j} className={cn("px-space-2 py-1.5", j === 0 && "font-medium")}>{c || "—"}</td>)}</tr>)}</tbody></table></div> : <p className="text-sm text-muted-foreground">Nothing recorded.</p>}
    </div>
  );
  return <p className="text-sm text-muted-foreground">{note || "Recorded from the account’s meetings. Stella has no preview for it yet."}</p>;
}
