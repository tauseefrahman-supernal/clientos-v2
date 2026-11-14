"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Loader2, Send, Sparkles, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { downloadText } from "@/components/stella/DocumentCard";
import { cn } from "@/lib/utils";

export type RunInfo = { id: string; status: "running" | "draft" | "approved" | "sent" | "failed"; title: string; draft: string; startedBy: string | null; startedAt: string; approvedBy: string | null } | null;

const LABEL: Record<string, string> = { running: "Running", draft: "Draft ready", approved: "Approved", sent: "Sent", failed: "Failed" };
const TONE: Record<string, string> = {
  running: "border-[hsl(var(--color-status-info-border,210_90%_85%))] text-[hsl(var(--color-action-text))]",
  draft: "border-[hsl(var(--color-status-warning-border))] bg-[hsl(var(--color-status-warning-bg))] text-[hsl(var(--color-status-warning-text))]",
  approved: "border-[hsl(var(--color-status-success-border))] bg-[hsl(var(--color-status-success-bg))] text-[hsl(var(--color-status-success-text))]",
  sent: "border-[hsl(var(--color-status-success-border))] bg-[hsl(var(--color-status-success-bg))] text-[hsl(var(--color-status-success-text))]",
  failed: "border-[hsl(var(--color-status-error-border))] bg-[hsl(var(--color-status-error-bg))] text-[hsl(var(--color-status-error-text))]",
};
const ago = (iso: string) => { const d = Math.round((Date.now() - Date.parse(iso)) / 86400000); return d <= 0 ? "today" : d === 1 ? "yesterday" : `${d} days ago`; };

/**
 * One workflow on one project: its latest run's status, a button to run it with Stella, and a review
 * dialog to approve, mark sent or discard the draft. Used on My View and on each project's Work page.
 */
export function RunControl({ slug, workflow, name, run, current = true, external = false, compact = false, label }: {
  slug: string; workflow: string; name: string; run: RunInfo; current?: boolean; external?: boolean; compact?: boolean; label?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<"run" | "decide" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const shown = current ? run : null;

  async function start() {
    setBusy("run"); setError(null);
    const res = await fetch("/api/workflows/run", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, workflow }) });
    setBusy(null);
    if (!res.ok) { setError(await res.text()); return; }
    router.refresh();
    setOpen(true);
  }
  async function decide(action: "approve" | "sent" | "discard") {
    if (!run) return;
    setBusy("decide");
    const res = await fetch("/api/workflows/decide", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: run.id, action }) });
    setBusy(null);
    if (!res.ok) { setError(await res.text()); return; }
    setOpen(false);
    router.refresh();
  }

  return (
    <span className={cn("inline-flex flex-wrap items-center gap-1", compact && "text-xs")}>
      {busy === "run" ? (
        <span className="inline-flex items-center gap-1 rounded-full border border-border px-space-2 py-0.5 text-xs text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin" />Drafting…</span>
      ) : shown ? (
        <button type="button" onClick={() => setOpen(true)} title={`${LABEL[shown.status]} · started by ${shown.startedBy ?? "someone"} ${ago(shown.startedAt)}`} className={cn("rounded-full border px-space-2 py-0.5 text-xs font-medium", TONE[shown.status])}>{LABEL[shown.status]}</button>
      ) : (
        <span className="rounded-full border border-border px-space-2 py-0.5 text-xs text-muted-foreground" title={run ? `Last run ${ago(run.startedAt)}` : "Never run"}>{run ? "Due" : "Not run"}</span>
      )}
      {busy !== "run" && (!shown || shown.status === "failed") && (
        <button type="button" onClick={start} disabled={!!busy} title={`Run ${name} with Stella`} className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-space-2 py-0.5 text-xs font-medium hover:bg-muted disabled:opacity-50">
          <Sparkles className="h-3 w-3 text-primary" />{label ?? "Run"}
        </button>
      )}
      {error && <span className="text-xs text-[hsl(var(--color-status-error-text))]">{error.slice(0, 160)}</span>}

      <Dialog open={open && !!run} onOpenChange={setOpen}>
        <DialogContent className="max-h-[86vh] max-w-3xl overflow-y-auto">
          {run && <>
            <DialogHeader><DialogTitle className="flex flex-wrap items-center gap-space-2">{name}<span className={cn("rounded-full border px-space-2 py-0.5 text-xs font-medium", TONE[run.status])}>{LABEL[run.status]}</span></DialogTitle></DialogHeader>
            <p className="text-xs text-muted-foreground">Drafted by Stella for {run.startedBy ?? "someone"}, {ago(run.startedAt)}{run.approvedBy ? ` · approved by ${run.approvedBy}` : ""}.</p>
            <div className="prose-vault rounded-lg border border-border bg-background p-space-4 text-sm"><ReactMarkdown remarkPlugins={[remarkGfm]}>{run.draft || "_Empty._"}</ReactMarkdown></div>
            <div className="flex flex-wrap items-center gap-space-2">
              {run.status === "draft" && <button disabled={!!busy} onClick={() => decide("approve")} className="inline-flex items-center gap-1 rounded-md bg-primary px-space-3 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50"><Check className="h-4 w-4" />Approve</button>}
              {external && (run.status === "draft" || run.status === "approved") && <button disabled={!!busy} onClick={() => decide("sent")} className="inline-flex items-center gap-1 rounded-md border border-border px-space-3 py-1.5 text-sm disabled:opacity-50"><Send className="h-4 w-4" />Mark sent</button>}
              <button onClick={() => downloadText(`${name.replace(/[^\w]+/g, "-")}.md`, run.draft)} className="rounded-md border border-border px-space-3 py-1.5 text-sm">Download</button>
              {(run.status === "draft" || run.status === "failed") && <button disabled={!!busy} onClick={() => decide("discard")} className="ml-auto inline-flex items-center gap-1 rounded-md px-space-3 py-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"><Trash2 className="h-4 w-4" />Discard</button>}
              {(run.status === "approved" || run.status === "sent") && <button disabled={!!busy} onClick={start} className="ml-auto inline-flex items-center gap-1 rounded-md px-space-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"><Sparkles className="h-4 w-4" />Run again</button>}
            </div>
            <p className="text-xs text-muted-foreground">Approving a scoping step writes this draft into the deal’s vault file for that step. Edit the file afterwards like any other.</p>
          </>}
        </DialogContent>
      </Dialog>
    </span>
  );
}
