"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Check, Sparkles, X } from "lucide-react";
import { decideSuggestionAction } from "@/app/actions";

export type SuggestionItem = { id: string; section: string; text: string; callTitle: string; callDate: string };

/**
 * Facts Stella suggested from a call for this place in the file, shown like suggested edits until someone decides.
 * Accept and Reject appear only for people who may decide (an admin or the project's strategist); the server action checks again.
 */
export function VaultSuggestions({ items, canDecide, newSection }: { items: SuggestionItem[]; canDecide: boolean; newSection?: boolean }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  if (!items.length) return null;
  const decide = (id: string, accept: boolean) => start(async () => {
    setError(null);
    try { await decideSuggestionAction(id, accept); router.refresh(); }
    catch (e) { setError(e instanceof Error ? e.message : "That did not work. Try again."); }
  });
  return (
    <div className="not-prose my-space-3 flex flex-col gap-space-2">
      {items.map((s) => (
        <div key={s.id} className="rounded-md border border-dashed border-[hsl(var(--color-action-text))] bg-[hsl(var(--color-action-subtle-bg))] px-space-3 py-space-2">
          <div className="flex flex-wrap items-center gap-x-space-2 gap-y-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-[hsl(var(--color-action-text))]" aria-hidden />
            <span className="font-semibold text-[hsl(var(--color-action-text))]">Suggested from a call</span>
            <span>{s.callTitle} · {s.callDate}</span>
            {newSection && s.section && <span className="rounded border border-border px-1">New section: {s.section}</span>}
          </div>
          {/* Plain text on purpose: model-written markdown could load images or links on view. */}
          <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{s.text}</p>
          {canDecide && (
            <div className="mt-space-2 flex gap-space-2">
              <button type="button" disabled={pending} onClick={() => decide(s.id, true)} className="inline-flex items-center gap-1 rounded-md bg-primary px-space-3 py-1 text-xs font-medium text-primary-foreground disabled:opacity-50"><Check className="h-3 w-3" />Accept</button>
              <button type="button" disabled={pending} onClick={() => decide(s.id, false)} className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-space-3 py-1 text-xs font-medium hover:bg-muted disabled:opacity-50"><X className="h-3 w-3" />Reject</button>
            </div>
          )}
        </div>
      ))}
      {error && <p role="alert" className="text-xs text-[hsl(var(--color-status-error-text))]">{error}</p>}
    </div>
  );
}
