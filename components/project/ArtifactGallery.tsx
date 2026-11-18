"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ExternalLink, FileText, LayoutGrid, Mic, Search, Table2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Empty } from "@/components/kit";
import { useShell } from "@/components/shell/AppShell";
import { TranscriptPanel } from "@/components/project/TranscriptPanel";
import { formatOf } from "@/lib/formats";
import { cn } from "@/lib/utils";
import type { Artifact, Recording } from "@/lib/types";
import { httpUrl } from "@/lib/memory/admin-rules";

type View = "gallery" | "table" | "recordings";
type SortKey = "title" | "kind" | "format" | "dated" | "provider";

const chip = (on: boolean) => cn("rounded-full border px-space-2 py-0.5 text-xs", on ? "border-primary bg-[hsl(var(--color-action-subtle-bg))] text-[hsl(var(--color-action-text))]" : "border-border text-muted-foreground hover:text-foreground");
const KIND_LABEL: Record<Recording["kind"], string> = { client: "With the client", internal: "Internal", multi: "Several accounts" };
const when = (iso: string) => { const t = Date.parse(iso); return Number.isNaN(t) ? iso || "—" : new Date(t).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }); };

/** Artifacts as a gallery or a table (with formats), and every recording pulled in for the project. */
export function ArtifactGallery({ artifacts, recordings, heldBack, project, slug, canUnassign = false, openId, view: initialView }: { artifacts: Artifact[]; recordings: Recording[]; heldBack: number; project: string; slug?: string; canUnassign?: boolean; openId: string | null; view: View }) {
  const router = useRouter();
  const pathname = usePathname();
  const [view, setViewState] = useState<View>(initialView);
  const [kind, setKind] = useState("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; up: boolean }>({ key: "dated", up: false });
  const [open, setOpen] = useState<Artifact | null>(() => artifacts.find((a) => a.id === openId) ?? null);
  const { openStella } = useShell();
  const [reading, setReading] = useState<Recording | null>(null);
  const [unassigning, setUnassigning] = useState<string | null>(null);
  const [recNote, setRecNote] = useState<string | null>(null);

  // A strategist (or admin) takes a call off this project; the override keeps later syncs from adding it back.
  const unassign = async (r: Recording) => {
    if (!slug || !r.transcriptId || !window.confirm(`Remove “${r.title}” from ${project}? Later syncs will not add it back.`)) return;
    setUnassigning(r.transcriptId); setRecNote(null);
    try {
      const res = await fetch("/api/admin/memory", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "override", override: "unassign", transcriptId: r.transcriptId, slug }) });
      if (!res.ok) { setRecNote(res.status === 403 ? "Only this project’s strategists and admins can do that." : await res.text()); return; }
      setRecNote(`Removed “${r.title}” from ${project}.`);
      router.refresh();
    } catch (e) { setRecNote(e instanceof Error ? e.message : String(e)); }
    finally { setUnassigning(null); }
  };

  const setView = (v: View) => { setViewState(v); router.replace(v === "gallery" ? pathname : `${pathname}?view=${v}`, { scroll: false }); };
  const rows = useMemo(() => artifacts.map((a) => ({ ...a, format: formatOf(a.url, a.title) })), [artifacts]);
  const kinds = useMemo(() => ["All", ...Array.from(new Set(artifacts.map((a) => a.kind)))], [artifacts]);
  const needle = q.trim().toLowerCase();
  const list = rows.filter((a) => (kind === "All" || a.kind === kind) && (!needle || `${a.title} ${a.description} ${a.kind} ${a.format.label} ${a.provider}`.toLowerCase().includes(needle)));
  const sorted = [...list].sort((a, b) => {
    const v = (x: typeof a) => sort.key === "format" ? x.format.label : String(x[sort.key] ?? "");
    return (sort.up ? 1 : -1) * v(a).localeCompare(v(b), undefined, { numeric: true });
  });
  const formats = useMemo(() => Array.from(rows.reduce((m, a) => m.set(a.format.label, (m.get(a.format.label) ?? 0) + 1), new Map<string, number>())).sort((a, b) => b[1] - a[1]), [rows]);

  const [recKind, setRecKind] = useState<"All" | Recording["kind"]>("All");
  const recs = recordings.filter((r) => (recKind === "All" || r.kind === recKind) && (!needle || `${r.title} ${r.headline ?? ""} ${r.summary} ${r.participants.join(" ")}`.toLowerCase().includes(needle)));
  const byMonth = recs.reduce((m, r) => { const k = Number.isNaN(Date.parse(r.date)) ? "Undated" : new Date(r.date).toLocaleDateString(undefined, { month: "long", year: "numeric" }); m.set(k, [...(m.get(k) ?? []), r]); return m; }, new Map<string, Recording[]>());

  const head = (key: SortKey, label: string) => (
    <th className="px-space-3 py-space-2"><button onClick={() => setSort((s) => ({ key, up: s.key === key ? !s.up : true }))} className="inline-flex items-center gap-1 uppercase">{label}{sort.key === key && (sort.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}</button></th>
  );

  return (
    <div className="mx-auto flex max-w-[1180px] flex-col gap-space-4 px-space-6 py-space-5">
      <div className="flex flex-wrap items-center gap-space-3">
        <h2 className="font-display text-xl font-semibold">Artifacts</h2>
        <span className="font-mono text-xs text-muted-foreground">{artifacts.length} made for or about this project · {artifacts.filter((a) => a.url).length} with a link · {recordings.length} recordings</span>
        <div role="tablist" className="ml-auto flex overflow-hidden rounded-md border border-border bg-card text-sm">
          {([["gallery", "Gallery", LayoutGrid], ["table", "Table", Table2], ["recordings", `Recordings ${recordings.length}`, Mic]] as const).map(([v, label, Icon]) => (
            <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)} className={cn("flex items-center gap-1 px-space-3 py-1", view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}><Icon className="h-3.5 w-3.5" />{label}</button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-space-2">
        <span className="flex min-w-[220px] flex-1 items-center gap-space-2 rounded-md border border-input bg-card px-space-2 md:max-w-[320px]">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={view === "recordings" ? "Search meetings, people" : "Search artifacts"} aria-label="Search" className="min-w-0 flex-1 bg-transparent py-1 text-sm outline-none" />
        </span>
        {view !== "recordings"
          ? kinds.map((k) => <button key={k} onClick={() => setKind(k)} className={chip(k === kind)}>{k}{k !== "All" && ` ${artifacts.filter((a) => a.kind === k).length}`}</button>)
          : (["All", "client", "internal", "multi"] as const).map((k) => <button key={k} onClick={() => setRecKind(k)} className={chip(k === recKind)}>{k === "All" ? "All" : KIND_LABEL[k]} {k === "All" ? recordings.length : recordings.filter((r) => r.kind === k).length}</button>)}
      </div>

      {view === "gallery" && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-space-3">
          {list.map((a) => (
            <button key={a.id} onClick={() => setOpen(a)} className="flex min-w-0 flex-col gap-space-1 rounded-lg border border-border bg-card p-space-3 text-left hover:border-primary hover:bg-muted/40">
              <span className="flex h-16 flex-col items-center justify-center rounded-md bg-muted font-mono text-xs uppercase tracking-widest text-muted-foreground">{a.kind}<span className="mt-0.5 text-xs normal-case tracking-normal">{a.format.label}</span></span>
              <span className="line-clamp-2 text-sm font-semibold">{a.title}</span>
              <span className="line-clamp-2 text-xs text-muted-foreground">{[a.dated, a.description].filter(Boolean).join(" · ")}</span>
              <span className={cn("mt-auto font-mono text-xs", a.url ? "text-[hsl(var(--color-action-text))]" : "text-muted-foreground")}>{a.url ? `Open in ${a.provider || "Drive"} ↗` : "no link recorded"}</span>
            </button>
          ))}
        </div>
      )}

      {view === "table" && (
        <>
          <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">Formats: {formats.map(([f, n]) => <span key={f} className="rounded border border-border bg-card px-1.5 py-0.5">{f} {n}</span>)}</div>
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead className="bg-muted text-left text-xs font-medium tracking-wider text-muted-foreground"><tr>{head("title", "Title")}{head("kind", "Kind")}{head("format", "Format")}{head("dated", "Date")}{head("provider", "Where")}<th className="px-space-3 py-space-2 uppercase">What it is for</th><th className="px-space-3 py-space-2" /></tr></thead>
              <tbody className="divide-y divide-[var(--color-border-default)]">
                {sorted.map((a) => (
                  <tr key={a.id} className="align-top hover:bg-muted/40">
                    <td className="px-space-3 py-space-2"><button onClick={() => setOpen(a)} className="text-left font-semibold hover:underline">{a.title}</button></td>
                    <td className="px-space-3 py-space-2 text-xs">{a.kind}</td>
                    <td className="whitespace-nowrap px-space-3 py-space-2 text-xs"><span className="rounded border border-border px-1.5 py-0.5">{a.format.label}</span></td>
                    <td className="whitespace-nowrap px-space-3 py-space-2 text-xs">{a.dated || "—"}</td>
                    <td className="px-space-3 py-space-2 text-xs">{a.provider || "—"}</td>
                    <td className="max-w-[340px] px-space-3 py-space-2 text-xs text-muted-foreground">{a.description || "—"}</td>
                    <td className="px-space-3 py-space-2">{a.url ? <a href={a.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${a.title}`} className="inline-flex items-center gap-1 text-xs">Open<ExternalLink className="h-3 w-3" /></a> : <span className="text-xs text-muted-foreground">No link</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {view !== "recordings" && !list.length && <Empty>No artifacts match.</Empty>}
      {view !== "recordings" && heldBack > 0 && <Empty>{heldBack} item{heldBack === 1 ? "" : "s"} hold the client’s own customers’ documents. They are kept out of this list and out of Stella’s context.</Empty>}

      {view === "recordings" && (
        recordings.length ? (
          <div className="flex flex-col gap-space-4">
            <p className="text-xs text-muted-foreground">Every meeting pulled in for this project from Granola and Fathom, with its headline for this project, and Stella’s summary on calls she has summarised. Open a transcript to read it here, with private matters removed, or open the meeting where it lives.</p>
            {recNote && <p role="status" className="text-xs text-muted-foreground">{recNote}</p>}
            {Array.from(byMonth).map(([month, items]) => (
              <section key={month} className="flex flex-col gap-space-1">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{month} <span className="font-mono font-normal">{items.length}</span></h3>
                <div className="divide-y divide-[var(--color-border-default)] rounded-lg border border-border bg-card">
                  {items.map((r) => (
                    <div key={`${r.provider}-${r.id}`} className="grid grid-cols-1 gap-space-1 px-space-4 py-space-3 md:grid-cols-[110px_minmax(0,1fr)_auto] md:gap-space-4">
                      <div className="text-xs"><div className="font-semibold">{when(r.date)}</div><div className="text-muted-foreground">{r.provider === "granola" ? "Granola" : r.provider === "fathom" ? "Fathom" : "Upload"} · {KIND_LABEL[r.kind]}</div></div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold">{r.title}</div>
                        {r.headline && <div className="text-sm text-muted-foreground">{r.headline}</div>}
                        {r.summary && (
                          <details className="mt-0.5 text-sm">
                            <summary className="cursor-pointer select-none text-xs text-[hsl(var(--color-action-text))]">Summary</summary>
                            <div className="mt-0.5 whitespace-pre-line text-muted-foreground">{r.summary}</div>
                          </details>
                        )}
                        {r.participants.length > 0 && <div className="mt-0.5 truncate text-xs text-muted-foreground">{r.participants.slice(0, 8).join(", ")}{r.participants.length > 8 ? ` +${r.participants.length - 8}` : ""}</div>}
                      </div>
                      <div className="flex items-start gap-space-2">
                        {r.transcriptId && <button onClick={() => setReading(r)} className="inline-flex items-center gap-1 rounded-md border border-border px-space-2 py-0.5 text-xs hover:bg-muted"><FileText className="h-3 w-3" />Transcript</button>}
                        <button onClick={() => openStella(`What happened in the meeting “${r.title}” on ${when(r.date)}?`)} className="rounded-md border border-border px-space-2 py-0.5 text-xs hover:bg-muted">Ask Stella</button>
                        {httpUrl(r.url) && <a href={httpUrl(r.url)!} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md border border-border px-space-2 py-0.5 text-xs no-underline hover:bg-muted">Open<ExternalLink className="h-3 w-3" /></a>}
                        {httpUrl(r.altUrl) && <a href={httpUrl(r.altUrl)!} target="_blank" rel="noopener noreferrer" className="text-xs">Also in {r.provider === "granola" ? "Fathom" : "Granola"}</a>}
                        {canUnassign && r.transcriptId && <button onClick={() => unassign(r)} disabled={unassigning === r.transcriptId} className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-60" title="This call is not about this project">Not this project</button>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
            {!recs.length && <Empty>No recordings match.</Empty>}
          </div>
        ) : <Empty>No recordings pulled in for this project yet. They come from Granola and Fathom.</Empty>
      )}

      <TranscriptPanel recording={reading} when={when} onClose={() => setReading(null)} />

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-lg">
          {open && <>
            <DialogHeader><DialogTitle className="flex items-center gap-space-2"><span className="rounded border border-border px-1.5 font-mono text-xs font-normal uppercase text-muted-foreground">{open.kind}</span>{open.title}</DialogTitle></DialogHeader>
            <dl className="grid grid-cols-[120px_minmax(0,1fr)] gap-y-space-2 text-sm">
              <dt className="text-muted-foreground">What it is</dt><dd>{open.description || "Not recorded"}</dd>
              <dt className="text-muted-foreground">Format</dt><dd>{formatOf(open.url, open.title).label}</dd>
              <dt className="text-muted-foreground">Date</dt><dd>{open.dated || "Not recorded"}</dd>
              <dt className="text-muted-foreground">Where it lives</dt><dd>{open.provider || "Not recorded"}</dd>
              <dt className="text-muted-foreground">Project</dt><dd>{project}</dd>
            </dl>
            <div className="flex flex-wrap justify-end gap-space-2 pt-space-2">
              <button onClick={() => { openStella(`Tell me about “${open.title}”`); setOpen(null); }} className="rounded-md border border-border px-space-3 py-1.5 text-sm hover:bg-muted">Ask Stella about it</button>
              {open.url && <a href={open.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-md bg-primary px-space-3 py-1.5 text-sm font-medium text-primary-foreground no-underline">Open <ExternalLink className="h-3.5 w-3.5" /></a>}
            </div>
          </>}
        </DialogContent>
      </Dialog>
    </div>
  );
}
