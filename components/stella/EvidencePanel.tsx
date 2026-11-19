"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { evidenceHref, type Evidence } from "@/lib/stella/evidence";

/** "Evidence (N)" under an answer: collapsed by default; each row is the point, its source and a quote. */
export function EvidencePanel({ evidence }: { evidence: Evidence[] }) {
  const [open, setOpen] = useState(false);
  if (!evidence.length) return null;
  return (
    <div className="text-xs">
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}Evidence ({evidence.length})
      </button>
      {open && (
        <ol className="mt-1 flex flex-col gap-space-2 border-l border-border pl-space-3">
          {evidence.map((e, i) => {
            const href = evidenceHref(e.ref);
            return (
              <li key={i} className="flex flex-col gap-0.5">
                <span className="text-sm text-foreground">{e.point}</span>
                {href && e.ref.kind === "call"
                  ? <a href={href} target="_blank" rel="noopener noreferrer" className="w-fit font-mono text-muted-foreground underline-offset-2 hover:text-foreground hover:underline">{e.source} ↗</a>
                  : href
                  ? <Link href={href} className="w-fit font-mono text-muted-foreground underline-offset-2 hover:text-foreground hover:underline">{e.source}</Link>
                  : <span className="font-mono text-muted-foreground">{e.source}</span>}
                {e.quote && <blockquote className="border-l-2 border-border pl-space-2 italic text-muted-foreground">“{e.quote}”</blockquote>}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
