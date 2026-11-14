"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ALL } from "./store";

export type PickProject = { slug: string; name: string; stage: "delivery" | "sales" };

export function scopeLabel(scope: string[], projects: PickProject[]): string {
  if (scope.includes(ALL)) return "All projects";
  if (scope.length === 1) return projects.find((p) => p.slug === scope[0])?.name ?? scope[0];
  return `${scope.length} projects`;
}

/** Choose which projects Stella answers from: one, several, or all. */
export function ScopePicker({ projects, value, onChange, compact = false }: { projects: PickProject[]; value: string[]; onChange: (scope: string[]) => void; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", down); document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", down); document.removeEventListener("keydown", key); };
  }, [open]);

  const all = value.includes(ALL);
  const chosen = new Set(all ? [] : value);
  const toggle = (slug: string) => {
    const next = new Set(chosen);
    if (next.has(slug)) next.delete(slug); else next.add(slug);
    if (next.size) onChange([...next]);
  };
  const needle = q.trim().toLowerCase();
  const list = projects.filter((p) => !needle || p.name.toLowerCase().includes(needle));
  const section = (stage: "delivery" | "sales", label: string) => {
    const items = list.filter((p) => p.stage === stage);
    if (!items.length) return null;
    return (
      <div>
        <div className="px-space-2 pb-1 pt-space-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</div>
        {items.map((p) => (
          <button key={p.slug} type="button" role="menuitemcheckbox" aria-checked={chosen.has(p.slug)} onClick={() => toggle(p.slug)} disabled={all}
            className="flex w-full items-center gap-space-2 rounded-md px-space-2 py-1 text-left text-sm hover:bg-muted disabled:opacity-40">
            <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center rounded border", chosen.has(p.slug) ? "border-primary bg-primary text-primary-foreground" : "border-input")}>{chosen.has(p.slug) && <Check className="h-3 w-3" />}</span>
            <span className="truncate">{p.name}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div ref={box} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Projects Stella answers from"
        className={cn("flex max-w-[260px] items-center gap-1 rounded-md border border-input bg-background px-space-2 font-medium hover:bg-muted", compact ? "py-0.5 text-xs" : "py-1 text-sm")}>
        <span className="truncate">{scopeLabel(value, projects)}</span><ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      </button>
      {open && (
        <div role="menu" className="absolute left-0 top-full z-40 mt-1 flex max-h-[60vh] w-[300px] flex-col overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
          <div className="flex items-center gap-space-2 border-b border-border px-space-3 py-space-2">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a project" aria-label="Find a project" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
          </div>
          <div className="overflow-y-auto p-space-1">
            <button type="button" role="menuitemcheckbox" aria-checked={all} onClick={() => onChange(all ? [projects[0]?.slug].filter(Boolean) as string[] : [ALL])}
              className="flex w-full items-center gap-space-2 rounded-md px-space-2 py-1.5 text-left text-sm font-medium hover:bg-muted">
              <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center rounded border", all ? "border-primary bg-primary text-primary-foreground" : "border-input")}>{all && <Check className="h-3 w-3" />}</span>
              All projects <span className="ml-auto text-xs font-normal text-muted-foreground">{projects.length}</span>
            </button>
            {section("delivery", "In delivery")}
            {section("sales", "In sales")}
          </div>
          <div className="border-t border-border px-space-3 py-space-2 text-xs text-muted-foreground">{all ? "Stella answers across every project." : `${chosen.size} selected. Stella searches all of them and names the project for each fact.`}</div>
        </div>
      )}
    </div>
  );
}
