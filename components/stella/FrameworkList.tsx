"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Framework = { name: string; blurb: string; body: string };

export function FrameworkList({ frameworks }: { frameworks: Framework[] }) {
  const [open, setOpen] = useState<Framework | null>(null);
  return (
    <>
      <div className="grid grid-cols-1 gap-space-2 md:grid-cols-2">
        {frameworks.map((f) => (
          <button key={f.name} onClick={() => setOpen(f)} className="flex flex-col gap-1 rounded-lg border border-border bg-card p-space-3 text-left hover:border-primary hover:bg-muted/40">
            <span className="text-sm font-semibold">{f.name.replace(/-/g, " ")}</span>
            <span className="line-clamp-2 text-xs text-muted-foreground">{f.blurb}</span>
          </button>
        ))}
      </div>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-h-[86vh] max-w-3xl overflow-y-auto">
          {open && <>
            <DialogHeader><DialogTitle>{open.name.replace(/-/g, " ")}</DialogTitle></DialogHeader>
            <div className="prose-vault"><ReactMarkdown remarkPlugins={[remarkGfm]}>{open.body}</ReactMarkdown></div>
          </>}
        </DialogContent>
      </Dialog>
    </>
  );
}
