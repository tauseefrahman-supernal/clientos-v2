"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusTag } from "@/components/kit";
import { decideAction } from "@/app/actions";
import { cn } from "@/lib/utils";
import type { Category, ShareStatus } from "@/lib/types";

type Tpl = { name: string; description: string; body: string; status: ShareStatus; onlyAccount: string | null; createdBy: string; origin: string; projects: { slug: string; name: string; path: string }[] };
export type LibCategory = Category & { used: number; projects: { slug: string; name: string }[]; templates: Tpl[] };
type Pending = { kind: "category" | "template"; category: string; template: string | null; label: string; by: string; from: string };

export function LibraryView({ categories, pending, openCategory, openTemplate }: { categories: LibCategory[]; pending: Pending[]; openCategory: string; openTemplate: string | null }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Set<string>>(new Set(["core-sales", "core-deal", "core-tech", "core-delivery", openCategory]));
  const [localOpen, setLocalOpen] = useState<Set<string>>(new Set());
  const [tpl, setTpl] = useState<{ c: LibCategory; t: Tpl } | null>(() => {
    const c = categories.find((x) => x.slug === openCategory);
    const t = c?.templates.find((x) => x.name === openTemplate);
    return c && t ? { c, t } : null;
  });
  const [approvals, setApprovals] = useState(false);
  const [busy, start] = useTransition();
  const router = useRouter();
  const decide = (p: Pending, approve: boolean) => start(async () => { await decideAction(p.kind, p.category, p.template, approve); router.refresh(); });

  const query = q.toLowerCase().trim();
  const match = (c: LibCategory, t: Tpl) => !query || `${t.name} ${c.name} ${t.description}`.toLowerCase().includes(query);
  const toggle = (slug: string) => setOpen((s) => { const n = new Set(s); if (n.has(slug)) n.delete(slug); else n.add(slug); return n; });
  const total = useMemo(() => categories.reduce((n, c) => n + c.templates.length, 0), [categories]);

  const row = (c: LibCategory, t: Tpl, key: string) => (
    <button key={key} onClick={() => setTpl({ c, t })} className="grid grid-cols-[minmax(0,240px)_minmax(0,1fr)_auto] items-center gap-space-3 rounded-md px-space-2 py-1.5 text-left hover:bg-muted">
      <span className="truncate font-mono text-xs font-medium">{t.name}.md</span>
      <span className="truncate text-xs text-muted-foreground">{t.description}</span>
      <span className="flex items-center gap-space-2">{t.status === "standard" ? null : t.onlyAccount ? <span className="font-mono text-xs text-muted-foreground">{t.origin}</span> : <><span className="font-mono text-xs text-muted-foreground">{t.projects.length} project{t.projects.length === 1 ? "" : "s"}</span><StatusTag status={t.status} /></>}</span>
    </button>
  );

  // Plain render functions, not nested components: a nested component is a new type on every
  // render, which remounts the whole list and throws the page back to the top.
  const category = (c: LibCategory) => {
    const ts = c.templates.filter((t) => match(c, t));
    if (query && !ts.length) return null;
    const core = ts.filter((t) => t.status === "standard"), shared = ts.filter((t) => t.status !== "standard" && !t.onlyAccount), local = ts.filter((t) => t.onlyAccount);
    const isOpen = open.has(c.slug) || !!query, showLocal = local.length > 0 && (localOpen.has(c.slug) || !!query);
    return (
      <section key={c.slug} className="rounded-lg border border-border bg-card">
        <button onClick={() => toggle(c.slug)} aria-expanded={isOpen} className="grid w-full grid-cols-[16px_minmax(0,1fr)_auto] items-center gap-space-3 px-space-4 py-space-3 text-left hover:bg-muted/50">
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="min-w-0"><b className="font-display text-lg font-semibold">{c.name}</b><span className="ml-space-3 text-xs text-muted-foreground">{c.description}</span></span>
          <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">{core.length} core · {shared.length} shared · {local.length} local</span>
        </button>
        {isOpen && (
          <div className="flex flex-col gap-space-2 border-t border-border px-space-4 pb-space-3 pt-space-2">
            {core.length > 0 && <div><h4 className="px-space-2 pb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Core · on every project</h4>{core.map((t) => row(c, t, t.name))}</div>}
            {shared.length > 0 && <div><h4 className="px-space-2 pb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Shared · added by strategists</h4>{shared.map((t) => row(c, t, t.name))}</div>}
            {local.length > 0 && (
              <div>
                <button onClick={() => setLocalOpen((x) => { const n = new Set(x); if (n.has(c.slug)) n.delete(c.slug); else n.add(c.slug); return n; })} className="flex w-full items-center gap-space-2 rounded-md px-space-2 py-1 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:bg-muted">
                  {showLocal ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}Local · {local.length} file{local.length === 1 ? "" : "s"} one project added<span className="ml-auto font-normal normal-case tracking-normal">{Array.from(new Set(local.map((t) => t.origin))).join(", ")}</span>
                </button>
                {showLocal && local.map((t) => row(c, t, `${t.origin}-${t.name}`))}
              </div>
            )}
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-space-4 px-space-6 py-space-5">
      <div className="flex flex-wrap items-baseline gap-space-3"><h1 className="font-display text-3xl font-semibold">Template Library</h1><span className="font-mono text-xs text-muted-foreground">{categories.length} categories · {total} templates</span></div>
      <p className="max-w-[72ch] text-sm text-muted-foreground">The team’s blueprint for a project vault. Four categories. Each holds the core templates every project starts with, the shared templates strategists have added, and files one project added that can be proposed for everyone. Click a template to see it.</p>
      <div className="flex flex-wrap items-center gap-space-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter templates" aria-label="Filter templates" className="min-w-[220px] flex-1 rounded-md border border-input bg-card px-space-3 py-1.5 text-sm" />
        <button onClick={() => setApprovals(true)} className="flex items-center gap-1 rounded-md border border-border bg-card px-space-3 py-1.5 text-sm hover:bg-muted">Approvals {pending.length > 0 && <span className="rounded-full border border-[hsl(var(--color-status-warning-border))] bg-[hsl(var(--color-status-warning-bg))] px-1.5 text-xs font-semibold text-[hsl(var(--color-status-warning-text))]">{pending.length}</span>}</button>
      </div>

      {[...categories].sort((a, b) => a.group - b.group).map((c) => category(c))}

      <Dialog open={!!tpl} onOpenChange={(o) => !o && setTpl(null)}>
        <DialogContent className="max-h-[86vh] max-w-3xl overflow-y-auto">
          {tpl && <>
            <DialogHeader><DialogTitle className="flex flex-wrap items-center gap-space-2 font-mono text-base">{tpl.t.name}.md <StatusTag status={tpl.t.status} /><span className="ml-auto font-sans text-xs font-normal text-muted-foreground">{tpl.c.name} › {tpl.t.status === "standard" ? "Core" : tpl.t.onlyAccount ? `local to ${tpl.t.origin}` : "Shared"}</span></DialogTitle></DialogHeader>
            {tpl.t.description && <p className="text-sm text-muted-foreground">{tpl.t.description}</p>}
            <div className="prose-vault rounded-lg border border-border bg-background p-space-4"><ReactMarkdown remarkPlugins={[remarkGfm]}>{tpl.t.body}</ReactMarkdown></div>
            <div className="flex flex-wrap items-center gap-space-2 text-xs text-muted-foreground">
              <span>Added by {tpl.t.createdBy}{tpl.t.status === "standard" ? "" : `, on ${tpl.t.origin}`}</span><span>·</span>
              <span>{tpl.t.status === "standard" ? "On every project" : `Used on ${tpl.t.projects.length} project${tpl.t.projects.length === 1 ? "" : "s"}`}</span>
              {tpl.t.status !== "standard" && tpl.t.projects.map((p) => <Link key={p.slug} href={`/projects/${p.slug}/vault?file=${encodeURIComponent(p.path)}`} className="rounded-full border border-border px-space-2 py-0.5 text-foreground no-underline hover:bg-muted">{p.name}</Link>)}
            </div>
          </>}
        </DialogContent>
      </Dialog>

      <Dialog open={approvals} onOpenChange={setApprovals}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Waiting for approval <span className="font-mono text-xs font-normal text-muted-foreground">{pending.length}</span></DialogTitle></DialogHeader>
          {pending.length ? <ul className="flex flex-col divide-y divide-[var(--color-border-default)]">{pending.map((p) => (
            <li key={`${p.kind}-${p.category}-${p.template}`} className="flex flex-wrap items-center gap-space-2 py-space-2">
              <div className="min-w-0 flex-1"><div className={cn("text-sm font-semibold", p.kind === "template" && "font-mono text-xs")}>{p.label}</div><div className="text-xs text-muted-foreground">{p.kind === "category" ? "Category" : "Template"} · suggested by {p.by}, from {p.from}</div></div>
              <button disabled={busy} onClick={() => decide(p, true)} className="rounded-md bg-primary px-space-3 py-1 text-xs font-medium text-primary-foreground disabled:opacity-50">Approve</button>
              <button disabled={busy} onClick={() => decide(p, false)} className="rounded-md border border-border px-space-3 py-1 text-xs disabled:opacity-50">Send back</button>
            </li>
          ))}</ul> : <p className="text-sm text-muted-foreground">Nothing is waiting.</p>}
        </DialogContent>
      </Dialog>
    </div>
  );
}
