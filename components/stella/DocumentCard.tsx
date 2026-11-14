"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, ChevronDown, ChevronRight, Copy, Download, FileText, Printer, Save } from "lucide-react";
import { saveDocumentAction } from "@/app/actions";
import { cn } from "@/lib/utils";
import type { ChatDocument } from "./store";
import type { PickProject } from "./ScopePicker";

const GROUPS = ["Sales Strategy", "Deal Strategy", "Technical Strategy", "Delivery Strategy"];
const fileName = (title: string) => (title.replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-").slice(0, 80) || "stella-document") + ".md";

export function downloadText(name: string, text: string, type = "text/markdown;charset=utf-8") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** A document Stella wrote or compiled: preview, download, copy, print to PDF, save to a project's vault. */
export function DocumentCard({ doc, projects, defaultOpen = false }: { doc: ChatDocument; projects: PickProject[]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [target, setTarget] = useState(doc.projects[0] ?? projects[0]?.slug ?? "");
  const [group, setGroup] = useState(doc.kind === "export" ? 3 : 0);
  const [saved, setSaved] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const body = useRef<HTMLDivElement>(null);
  const words = doc.content.split(/\s+/).length;

  function print() {
    const w = window.open("", "_blank");
    if (!w || !body.current) return;
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${doc.title.replace(/</g, "&lt;")}</title><style>body{font:15px/1.6 Georgia,serif;max-width:720px;margin:40px auto;padding:0 24px;color:#111}h1,h2,h3,h4{font-family:Helvetica,Arial,sans-serif;line-height:1.25}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:4px 8px;text-align:left;font-size:13px}code{font-size:13px}</style></head><body>${body.current.innerHTML}</body></html>`);
    w.document.close(); w.focus(); setTimeout(() => w.print(), 300);
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center gap-space-2 px-space-3 py-space-2">
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex min-w-0 flex-1 items-center gap-space-2 text-left">
          {open ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
          <FileText className="h-4 w-4 shrink-0 text-primary" />
          <span className="truncate text-sm font-semibold">{doc.title}</span>
          <span className="shrink-0 rounded border border-border px-1 text-xs text-muted-foreground">{doc.kind === "export" ? "Export" : "Document"} · {words.toLocaleString()} words</span>
        </button>
        <span className="flex shrink-0 items-center gap-0.5">
          <Icon label="Download as markdown" onClick={() => downloadText(fileName(doc.title), doc.content)}><Download className="h-4 w-4" /></Icon>
          <Icon label={copied ? "Copied" : "Copy markdown"} onClick={() => { navigator.clipboard.writeText(doc.content).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }); }}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Icon>
          <Icon label="Print or save as PDF" onClick={() => { setOpen(true); setTimeout(print, 50); }}><Printer className="h-4 w-4" /></Icon>
          <Icon label="Save to a project's vault" onClick={() => setSaving((s) => !s)}><Save className="h-4 w-4" /></Icon>
        </span>
      </div>
      {saving && (
        <div className="flex flex-wrap items-center gap-space-2 border-t border-border px-space-3 py-space-2 text-xs">
          {saved ? <span>Saved as <Link href={`/projects/${target}/vault?file=${encodeURIComponent(saved)}`} className="font-mono">{saved}.md</Link></span> : <>
            <span className="text-muted-foreground">Save to</span>
            <select value={target} onChange={(e) => setTarget(e.target.value)} className="rounded border border-input bg-background px-1 py-0.5" aria-label="Project">
              {projects.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
            </select>
            <select value={group} onChange={(e) => setGroup(Number(e.target.value))} className="rounded border border-input bg-background px-1 py-0.5" aria-label="Vault group">
              {GROUPS.map((g, i) => <option key={g} value={i}>{g}</option>)}
            </select>
            <button type="button" disabled={pending || !target} onClick={() => start(async () => { const p = await saveDocumentAction(target, group, doc.title, doc.content); if (p) setSaved(p); })}
              className="rounded bg-primary px-space-2 py-0.5 font-medium text-primary-foreground disabled:opacity-50">{pending ? "Saving…" : "Save"}</button>
            <span className="text-muted-foreground">It becomes a file added to that project, which Stella then reads.</span>
          </>}
        </div>
      )}
      <div className={cn("border-t border-border px-space-4 py-space-3", !open && "hidden")}>
        <div ref={body} className="prose-vault max-h-[480px] overflow-y-auto text-sm"><ReactMarkdown remarkPlugins={[remarkGfm]}>{doc.content}</ReactMarkdown></div>
      </div>
    </div>
  );
}

function Icon({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" title={label} aria-label={label} onClick={onClick} className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">{children}</button>;
}
