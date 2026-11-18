"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { httpUrl, type PanelTurn } from "@/lib/memory/admin-rules";
import type { Recording } from "@/lib/types";

const pad = (n: number) => String(n).padStart(2, "0");
const clock = (s: number) => `${s >= 3600 ? `${Math.floor(s / 3600)}:` : ""}${pad(Math.floor((s % 3600) / 60))}:${pad(Math.floor(s % 60))}`;

type State = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; turns: PanelTurn[] };

/**
 * A call's screened transcript in a side panel, fetched only when opened. Every word is rendered as plain text
 * (transcripts are untrusted); the screen's cut markers show as "Removed for privacy".
 */
export function TranscriptPanel({ recording, when, onClose }: { recording: Recording | null; when: (iso: string) => string; onClose: () => void }) {
  const [state, setState] = useState<State>({ status: "loading" });
  const id = recording?.transcriptId;

  useEffect(() => {
    if (!id) return;
    const ctl = new AbortController();
    setState({ status: "loading" });
    fetch(`/api/transcripts/${id}`, { signal: ctl.signal, cache: "no-store" })
      .then(async (r) => {
        if (r.status === 404) throw new Error("This transcript is not available to you, or is no longer kept.");
        if (!r.ok) throw new Error("The transcript could not be loaded. Try again.");
        const data = (await r.json()) as { turns: PanelTurn[] };
        setState({ status: "ready", turns: data.turns });
      })
      .catch((e) => { if (!ctl.signal.aborted) setState({ status: "error", message: e instanceof Error ? e.message : String(e) }); });
    return () => ctl.abort();
  }, [id]);

  return (
    <Sheet open={!!recording} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="flex w-full flex-col gap-space-3 overflow-hidden sm:max-w-[640px]">
        {recording && <>
          <SheetHeader>
            <SheetTitle className="pr-space-6">{recording.title}</SheetTitle>
            <SheetDescription className="flex flex-wrap items-center gap-space-2">
              <span>{when(recording.date)} · {recording.provider === "granola" ? "Granola" : recording.provider === "fathom" ? "Fathom" : "Upload"}</span>
              {httpUrl(recording.url) && <a href={httpUrl(recording.url)!} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs">Open at the source<ExternalLink className="h-3 w-3" /></a>}
            </SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto pr-space-2">
            {state.status === "loading" && <p className="text-sm text-muted-foreground">Loading the transcript…</p>}
            {state.status === "error" && <p className="text-sm text-[hsl(var(--color-status-error-text))]">{state.message}</p>}
            {state.status === "ready" && !state.turns.length && <p className="text-sm text-muted-foreground">No transcript is stored for this call yet. It arrives with the next sync.</p>}
            {state.status === "ready" && state.turns.length > 0 && (
              <ol className="flex flex-col gap-space-2">
                {state.turns.map((t, i) => (
                  <li key={i} className="grid grid-cols-[52px_minmax(0,1fr)] gap-space-2 text-sm">
                    <span className="pt-0.5 font-mono text-xs text-muted-foreground">{t.start === null ? "" : clock(t.start)}</span>
                    <div className="min-w-0 whitespace-pre-wrap break-words">
                      {t.speaker && <span className="font-semibold">{t.speaker}: </span>}
                      {t.segments.map((s, j) => s.removed
                        ? <span key={j} title={s.reason === "personnel" ? "A personal or personnel matter was removed" : "A client's customer's private details were removed"}
                            className="mx-0.5 inline-block rounded border border-dashed border-[hsl(var(--color-status-warning-border))] bg-[hsl(var(--color-status-warning-bg))] px-1.5 text-xs text-[hsl(var(--color-status-warning-text))]">
                            Removed for privacy · {s.minutes} min
                          </span>
                        : <span key={j}>{s.text}</span>)}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </>}
      </SheetContent>
    </Sheet>
  );
}
