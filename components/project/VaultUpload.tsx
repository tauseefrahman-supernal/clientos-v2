"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { ACCEPT, refusalLine } from "@/lib/vault-upload";

type Result = { saved: { name: string; path: string }[]; refused: { name: string; reason: string }[] };

/** "Upload files" at the top of the vault: pick a group, pick files, each is saved as a vault file. */
export function VaultUpload({ slug, groups }: { slug: string; groups: string[] }) {
  const [group, setGroup] = useState(0);
  const [progress, setProgress] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const picker = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const href = (path: string) => `/projects/${slug}/vault?file=${encodeURIComponent(path)}`;

  async function upload(list: FileList | null) {
    const files = Array.from(list ?? []);
    if (!files.length) return;
    const out: Result = { saved: [], refused: [] };
    setResult(null);
    // One file per request, so progress is visible and one slow PDF does not hold up the rest.
    for (const [i, f] of files.entries()) {
      setProgress(`Uploading ${i + 1} of ${files.length}: ${f.name}${/\.pdf$/i.test(f.name) ? " (converting the PDF can take a minute)" : ""}`);
      const body = new FormData();
      body.set("slug", slug); body.set("group", String(group)); body.append("file", f);
      try {
        const res = await fetch("/api/vault/upload", { method: "POST", body });
        if (res.status === 413) { out.refused.push({ name: f.name, reason: "too large to upload" }); continue; }
        const isJson = (res.headers.get("content-type") ?? "").includes("application/json");
        if (!res.ok || !isJson) {
          // Our own 4xx replies are short plain sentences; anything else (an HTML error page) gets a plain message.
          const text = !isJson && res.status >= 400 && res.status < 500 ? (await res.text()).trim() : "";
          out.refused.push({ name: f.name, reason: text && text.length < 200 && !text.startsWith("<") ? text : "the upload failed; try again" });
          continue;
        }
        const r = (await res.json()) as Result;
        out.saved.push(...r.saved); out.refused.push(...r.refused);
      } catch {
        out.refused.push({ name: f.name, reason: "the upload failed; try again" });
      }
    }
    setProgress(null);
    setResult(out);
    if (out.saved.length) router.refresh();
  }

  return (
    <div className="mb-space-3 flex flex-col gap-space-2 border-b border-[var(--color-border-subtle)] pb-space-3 font-sans">
      <div className="flex items-center gap-space-2">
        <input ref={picker} type="file" multiple accept={ACCEPT} className="hidden" onChange={(e) => { upload(e.target.files); e.target.value = ""; }} />
        <button type="button" disabled={!!progress} onClick={() => picker.current?.click()} className="flex items-center gap-space-1 rounded-md border border-border bg-background px-space-3 py-1 text-xs font-medium hover:bg-muted disabled:opacity-50">
          <Upload className="h-3.5 w-3.5" />Upload files
        </button>
        <label className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
          <span className="shrink-0">to</span>
          <select value={group} disabled={!!progress} onChange={(e) => setGroup(Number(e.target.value))} aria-label="Vault group for uploaded files" className="min-w-0 rounded-md border border-input bg-background px-1 py-0.5 text-xs text-foreground">
            {groups.map((g, i) => <option key={g} value={i}>{g}</option>)}
          </select>
        </label>
      </div>
      {progress && <p role="status" className="text-xs text-muted-foreground">{progress}</p>}
      {result && (
        <div role="status" className="relative flex flex-col gap-1 rounded-md border border-border bg-background p-space-2 pr-space-5 text-xs">
          <button type="button" aria-label="Dismiss upload results" onClick={() => setResult(null)} className="absolute right-1 top-1 rounded p-0.5 text-muted-foreground hover:bg-muted"><X className="h-3 w-3" /></button>
          {result.saved.length > 0 && (
            <div>
              <span className="font-semibold">Saved to the vault</span>
              <ul className="mt-0.5">{result.saved.map((s) => <li key={s.path}><Link href={href(s.path)} className="break-all">{s.name}</Link></li>)}</ul>
            </div>
          )}
          {result.refused.map((r, i) => <p key={`${r.name}-${i}`} className="text-[hsl(var(--color-status-warning-text))]">{refusalLine(r.name, r.reason)}</p>)}
        </div>
      )}
    </div>
  );
}
