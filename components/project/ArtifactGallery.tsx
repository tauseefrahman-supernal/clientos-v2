"use client";

import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Empty } from "@/components/kit";
import { useShell } from "@/components/shell/AppShell";
import { cn } from "@/lib/utils";
import type { Artifact } from "@/lib/types";

export function ArtifactGallery({ artifacts, heldBack, project, openId }: { artifacts: Artifact[]; heldBack: number; project: string; openId: string | null }) {
  const [kind, setKind] = useState("All");
  const [open, setOpen] = useState<Artifact | null>(() => artifacts.find((a) => a.id === openId) ?? null);
  const { openStella } = useShell();
  const kinds = useMemo(() => ["All", ...Array.from(new Set(artifacts.map((a) => a.kind)))], [artifacts]);
  const list = artifacts.filter((a) => kind === "All" || a.kind === kind);

  return (
    <div className="mx-auto flex max-w-[1120px] flex-col gap-space-4 px-space-6 py-space-5">
      <div className="flex flex-wrap items-baseline gap-space-3">
        <h2 className="font-display text-xl font-semibold">Artifacts</h2>
        <span className="font-mono text-xs text-muted-foreground">{artifacts.length} made for or about this account · {artifacts.filter((a) => a.url).length} with a link</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {kinds.map((k) => <button key={k} onClick={() => setKind(k)} className={cn("rounded-full border px-space-2 py-0.5 text-xs", k === kind ? "border-primary bg-[hsl(var(--color-action-subtle-bg))] text-[hsl(var(--color-action-text))]" : "border-border text-muted-foreground hover:text-foreground")}>{k}{k !== "All" && ` ${artifacts.filter((a) => a.kind === k).length}`}</button>)}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-space-3">
        {list.map((a) => (
          <button key={a.id} onClick={() => setOpen(a)} className="flex min-w-0 flex-col gap-space-1 rounded-lg border border-border bg-card p-space-3 text-left hover:border-primary hover:bg-muted/40">
            <span className="flex h-16 items-center justify-center rounded-md bg-muted font-mono text-xs uppercase tracking-widest text-muted-foreground">{a.kind}</span>
            <span className="line-clamp-2 text-sm font-semibold">{a.title}</span>
            <span className="line-clamp-2 text-xs text-muted-foreground">{[a.dated, a.description].filter(Boolean).join(" · ")}</span>
            <span className={cn("mt-auto font-mono text-xs", a.url ? "text-[hsl(var(--color-action-text))]" : "text-muted-foreground")}>{a.url ? `Open in ${a.provider || "Drive"} ↗` : "no link recorded"}</span>
          </button>
        ))}
      </div>
      {!list.length && <Empty>No artifacts of this kind.</Empty>}
      {heldBack > 0 && <Empty>{heldBack} item{heldBack === 1 ? "" : "s"} hold the client’s own customers’ documents. They are kept out of this gallery and out of Stella’s context.</Empty>}

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-lg">
          {open && <>
            <DialogHeader><DialogTitle className="flex items-center gap-space-2"><span className="rounded border border-border px-1.5 font-mono text-xs font-normal uppercase text-muted-foreground">{open.kind}</span>{open.title}</DialogTitle></DialogHeader>
            <dl className="grid grid-cols-[120px_minmax(0,1fr)] gap-y-space-2 text-sm">
              <dt className="text-muted-foreground">What it is</dt><dd>{open.description || "Not recorded"}</dd>
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
