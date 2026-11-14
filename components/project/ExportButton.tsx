"use client";

import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";

const PARTS = [["overview", "Overview"], ["vault", "Vault files"], ["book", "Book"], ["artifacts", "Artifacts list"]] as const;
const GROUPS = ["Sales Strategy", "Deal Strategy", "Technical Strategy", "Delivery Strategy"];

/** Download one markdown document with this project's context: chosen parts and vault groups. */
export function ExportButton({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const [parts, setParts] = useState<string[]>(["overview", "vault", "book"]);
  const [groups, setGroups] = useState<number[]>([0, 1, 2, 3]);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", down);
    return () => document.removeEventListener("mousedown", down);
  }, [open]);
  const flip = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const href = `/api/export?projects=${encodeURIComponent(slug)}&parts=${parts.join(",")}&groups=${groups.join(",")}`;

  return (
    <div ref={box} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex items-center gap-1 rounded-md border border-border bg-card px-space-3 py-1 text-xs font-medium hover:bg-muted">
        <Download className="h-3.5 w-3.5" />Export
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-1 flex w-[280px] flex-col gap-space-3 rounded-lg border border-border bg-popover p-space-3 text-sm shadow-lg">
          <fieldset className="flex flex-col gap-1">
            <legend className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Include</legend>
            {PARTS.map(([id, label]) => <label key={id} className="flex items-center gap-space-2"><input type="checkbox" checked={parts.includes(id)} onChange={() => setParts((p) => flip(p, id))} />{label}</label>)}
          </fieldset>
          {parts.includes("vault") && (
            <fieldset className="flex flex-col gap-1">
              <legend className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Vault groups</legend>
              {GROUPS.map((g, i) => <label key={g} className="flex items-center gap-space-2"><input type="checkbox" checked={groups.includes(i)} onChange={() => setGroups((x) => flip(x, i))} />{g}</label>)}
            </fieldset>
          )}
          <p className="text-xs text-muted-foreground">One markdown file. Empty templates and anything hidden, archived or sensitive are left out. To combine projects, ask Stella.</p>
          <a href={href} download onClick={() => setOpen(false)} aria-disabled={!parts.length} className="flex items-center justify-center gap-1 rounded-md bg-primary px-space-3 py-1.5 text-sm font-medium text-primary-foreground no-underline aria-disabled:pointer-events-none aria-disabled:opacity-50">
            <Download className="h-4 w-4" />Download .md
          </a>
        </div>
      )}
    </div>
  );
}
