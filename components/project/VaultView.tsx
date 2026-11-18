"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Archive, ArchiveRestore, ChevronDown, ChevronRight, Eye, EyeOff, Folder, Plus, Search, Sparkles, Trash2 } from "lucide-react";
import { StatusTag } from "@/components/kit";
import { VaultUpload } from "@/components/project/VaultUpload";
import { SafeMarkdown } from "@/components/project/SafeMarkdown";
import { VaultSuggestions, type SuggestionItem } from "@/components/project/VaultSuggestions";
import { headingKey, sectionLayout } from "@/lib/memory/digest-core";
import { useShell } from "@/components/shell/AppShell";
import { addTemplateAction, proposeTemplateAction, saveFileAction, setFileShownAction, setFileStateAction, toggleInBookAction } from "@/app/actions";
import { cn } from "@/lib/utils";
import type { FileState, ShareStatus, VaultFile } from "@/lib/types";

type TreeFile = { path: string; state: FileState; label: string; empty: boolean; inView: boolean };
type Group = { name: string; sections: { slug: string; name: string; status: ShareStatus; files: TreeFile[] }[] };
type PickItem = { category: string; categoryName: string; group: number; name: string; description: string; kind: string; path: string | null; filled: boolean; where: "add" | "archived" | "in view" | "hidden" };
type Selected = {
  file: VaultFile; markdown: string; generated: boolean;
  category: { slug: string; name: string; status: ShareStatus; isCore: boolean } | null;
  template: { name: string; status: ShareStatus; onlyAccount: string | null } | null;
  otherProjects: { slug: string; name: string; path: string }[];
  suggestions: SuggestionItem[]; canDecide: boolean;
} | null;

const isOut = (f: TreeFile) => f.state === "archived" || !f.inView;

export function VaultView({ slug, groups, selected, picker }: { slug: string; groups: Group[]; selected: Selected; picker: PickItem[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>({ "Sales Strategy": true, "Deal Strategy": true, "Delivery Strategy": true, "Technical Strategy": true });
  const [reveal, setReveal] = useState<Record<string, boolean>>({});
  const [adding, setAdding] = useState<number | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();
  const base = `/projects/${slug}/vault`;
  const href = (path: string) => `${base}?file=${encodeURIComponent(path)}`;
  const run = (fn: () => Promise<unknown>) => start(async () => { await fn(); router.refresh(); });

  return (
    <div className="grid min-h-[calc(100vh-170px)] grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)]">
      <nav aria-label="Vault files" className="relative border-b border-border bg-card p-space-3 font-mono text-xs lg:border-b-0 lg:border-r">
        <VaultUpload slug={slug} groups={groups.map((g) => g.name)} />
        {groups.map((g, gi) => {
          const isOpen = open[g.name] ?? false;
          const all = g.sections.flatMap((s) => s.files);
          const out = all.filter(isOut).length;
          const showOut = !!reveal[g.name];
          return (
            <div key={g.name} className="mb-space-1">
              <div className="relative">
              <div className="group/cat flex items-center rounded-md hover:bg-muted">
                <button onClick={() => setOpen((o) => ({ ...o, [g.name]: !isOpen }))} aria-expanded={isOpen} className="flex min-w-0 flex-1 items-center gap-space-1 px-space-2 py-1 text-left font-bold uppercase tracking-wide text-muted-foreground hover:text-foreground">
                  {isOpen ? <ChevronDown className="h-3 w-3 shrink-0" /> : <ChevronRight className="h-3 w-3 shrink-0" />}<Folder className="h-3 w-3 shrink-0" /><span className="truncate">{g.name}</span>
                  <span className="ml-auto pl-1 font-normal">{all.length - out}</span>
                </button>
                {out > 0 && (
                  <button onClick={() => { setReveal((r) => ({ ...r, [g.name]: !showOut })); setOpen((o) => ({ ...o, [g.name]: true })); }} title={showOut ? "Hide hidden and archived files" : `Show ${out} hidden or archived`} aria-label={showOut ? `Hide hidden files in ${g.name}` : `Show ${out} hidden files in ${g.name}`} aria-pressed={showOut}
                    className={cn("flex items-center gap-0.5 rounded p-1 text-muted-foreground hover:bg-background hover:text-foreground", showOut && "text-[hsl(var(--color-action-text))]")}>
                    {showOut ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}<span className="text-xs">{out}</span>
                  </button>
                )}
                <button onClick={() => setAdding(adding === gi ? null : gi)} title={`Add a template to ${g.name}`} aria-label={`Add a template to ${g.name}`} aria-expanded={adding === gi} className="mr-1 rounded p-1 text-muted-foreground hover:bg-background hover:text-foreground"><Plus className="h-3.5 w-3.5" /></button>
              </div>
              {adding === gi && <TemplatePicker items={picker} group={gi} groupName={g.name} busy={pending} onClose={() => setAdding(null)}
                onPick={(it) => run(async () => {
                  if (it.where === "add") { const path = await addTemplateAction(slug, it.category, it.name, gi); if (path) router.push(href(path)); }
                  else if (it.path) { if (it.where === "archived") await setFileStateAction(slug, it.path, "active"); await setFileShownAction(slug, it.path, true); router.push(href(it.path)); }
                  setAdding(null);
                })} />}
              </div>
              {isOpen && (
                <div className="ml-space-4 border-l border-[var(--color-border-subtle)] pl-space-2">
                  {g.sections.map((s) => {
                    const files = s.files.filter((f) => showOut || !isOut(f));
                    if (!files.length) return null;
                    return (
                      <div key={s.slug} className="mb-space-1">
                        <div className="flex items-center gap-space-1 px-space-2 py-0.5 text-xs font-bold uppercase tracking-widest text-[hsl(var(--color-text-tertiary))]">{s.name}{s.slug === "added" && <StatusTag status="local" />}</div>
                        {files.map((f) => {
                          const out = isOut(f);
                          const current = selected?.file.path === f.path;
                          return (
                            <div key={f.path} className={cn("group/file flex items-center rounded-md hover:bg-muted", current && "bg-[hsl(var(--color-action-subtle-bg))]")}>
                              <Link href={href(f.path)} aria-current={current ? "true" : undefined}
                                className={cn("flex min-w-0 flex-1 items-center gap-space-1 px-space-2 py-1 text-foreground no-underline", current && "text-[hsl(var(--color-action-text))]", out && "opacity-55", f.state === "archived" && "italic")}>
                                <span className={cn("truncate", f.empty && "text-muted-foreground")}>{f.label}</span>
                                {f.state === "archived" ? <span className="shrink-0 rounded border border-border px-1 text-xs text-muted-foreground">archived</span>
                                  : !f.inView ? <span className="shrink-0 rounded border border-border px-1 text-xs text-muted-foreground">hidden</span>
                                  : f.state === "hidden" ? <span title="Kept from Stella" className="shrink-0 text-muted-foreground"><Sparkles className="h-3 w-3 opacity-50" /></span> : null}
                              </Link>
                              <span className={cn("mr-1 flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity focus-within:opacity-100 group-hover/file:opacity-100", current && "opacity-100")}>
                                {out ? (
                                  <IconBtn label={`Restore ${f.label}`} disabled={pending} onClick={() => run(async () => { if (f.state === "archived") await setFileStateAction(slug, f.path, "active"); await setFileShownAction(slug, f.path, true); })}><ArchiveRestore className="h-3.5 w-3.5" /></IconBtn>
                                ) : (
                                  <>
                                    <IconBtn label={`Hide ${f.label} from the sidebar`} disabled={pending} onClick={() => run(() => setFileShownAction(slug, f.path, false))}><EyeOff className="h-3.5 w-3.5" /></IconBtn>
                                    <IconBtn label={`Archive ${f.label}`} disabled={pending} onClick={() => run(() => setFileStateAction(slug, f.path, "archived"))}><Archive className="h-3.5 w-3.5" /></IconBtn>
                                  </>
                                )}
                                <IconBtn label={`Delete ${f.label}`} danger disabled={pending} onClick={() => { if (window.confirm(`Delete ${f.label} from this project? This can’t be undone here.`)) run(async () => { await setFileStateAction(slug, f.path, "deleted"); if (current) router.push(base); }); }}><Trash2 className="h-3.5 w-3.5" /></IconBtn>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                  {all.length === out && !showOut && (
                    <button onClick={() => setAdding(gi)} className="w-full rounded-md px-space-2 py-1 text-left italic text-muted-foreground hover:bg-muted">{all.length ? `${out} templates tucked away · add one` : "No files yet · add one"}</button>
                  )}
                </div>
              )}
            </div>
          );
        })}
        <p className="mt-space-3 px-space-2 font-sans text-xs leading-relaxed text-muted-foreground">Empty templates stay out of the way until you add them with +. Hover a file to hide, archive or delete it.</p>
      </nav>
      <div className="min-w-0 px-space-6 py-space-5">{selected ? <FileView slug={slug} s={selected} /> : <p className="text-sm text-muted-foreground">Pick a file from the vault.</p>}</div>
    </div>
  );
}

function IconBtn({ label, onClick, disabled, danger, children }: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" title={label} aria-label={label} disabled={disabled} onClick={onClick}
      className={cn("rounded p-1 text-muted-foreground hover:bg-background disabled:opacity-40", danger ? "hover:text-[hsl(var(--color-status-error-text))]" : "hover:text-foreground")}>
      {children}
    </button>
  );
}

/** "+" on a category: search every template, this category first, then the others. */
function TemplatePicker({ items, group, groupName, busy, onPick, onClose }: { items: PickItem[]; group: number; groupName: string; busy: boolean; onPick: (it: PickItem) => void; onClose: () => void }) {
  const [q, setQ] = useState("");
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const down = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) onClose(); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", down); document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", down); document.removeEventListener("keydown", key); };
  }, [onClose]);
  const needle = q.trim().toLowerCase();
  const match = items.filter((it) => it.where !== "in view" && (!needle || `${it.name} ${it.description} ${it.categoryName} ${it.kind}`.toLowerCase().includes(needle)));
  const here = match.filter((it) => it.group === group);
  const other = match.filter((it) => it.group !== group);
  const byCat = Array.from(new Set(other.map((it) => it.categoryName)));
  const row = (it: PickItem) => (
    <li key={`${it.category}/${it.name}/${it.kind}`}>
      <button type="button" disabled={busy} onClick={() => onPick(it)} className="flex w-full flex-col gap-0.5 rounded-md px-space-2 py-1.5 text-left hover:bg-muted disabled:opacity-50">
        <span className="flex items-center gap-space-2">
          <span className="truncate font-mono text-xs font-medium">{it.name}.md</span>
          <span className="ml-auto shrink-0 rounded border border-border px-1 font-sans text-xs text-muted-foreground">{it.where === "add" ? it.kind : it.where === "archived" ? "Restore" : it.filled ? "Show" : "Show · empty"}</span>
        </span>
        {it.description && <span className="line-clamp-1 font-sans text-xs text-muted-foreground">{it.description}</span>}
      </button>
    </li>
  );
  return (
    <div ref={box} role="dialog" aria-label={`Add a template to ${groupName}`} className="absolute left-0 right-0 top-full z-30 mt-1 flex max-h-[60vh] flex-col overflow-hidden rounded-lg border border-border bg-popover font-sans shadow-lg lg:-right-10">
      <div className="flex items-center gap-space-2 border-b border-border px-space-3 py-space-2">
        <Search className="h-3.5 w-3.5 text-muted-foreground" />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search templates" aria-label="Search templates" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
      </div>
      <div className="overflow-y-auto p-space-1">
        {here.length > 0 && <><div className="px-space-2 pb-1 pt-space-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{groupName}</div><ul>{here.map(row)}</ul></>}
        {byCat.map((c) => <div key={c}><div className="px-space-2 pb-1 pt-space-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">From {c}</div><ul>{other.filter((it) => it.categoryName === c).map(row)}</ul></div>)}
        {!match.length && <p className="px-space-3 py-space-3 text-xs text-muted-foreground">{needle ? "No templates match." : "Every template is already in view."}</p>}
      </div>
    </div>
  );
}

function FileView({ slug, s }: { slug: string; s: NonNullable<Selected> }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(s.markdown);
  const [pending, start] = useTransition();
  const router = useRouter();
  const { openStella } = useShell();
  const f = s.file;
  const name = `${f.path.split("/").pop()}.md`;
  const act = (fn: () => Promise<void>, after?: () => void) => start(async () => { await fn(); after?.(); router.refresh(); });
  const hidden = f.state === "hidden";

  return (
    <div className="mx-auto flex max-w-[920px] flex-col gap-space-4">
      <div className="flex flex-wrap items-center gap-space-2">
        <span className="font-mono text-xs text-muted-foreground">{f.path}.md</span>
        {s.generated && <span className="rounded border border-border px-1.5 text-xs text-muted-foreground">Assembled from account data</span>}
        <div className="ml-auto flex gap-space-2">
          <button onClick={() => openStella(`About ${name}: `)} className="rounded-md border border-border px-space-3 py-1 text-xs hover:bg-muted">Ask Stella</button>
          <button onClick={() => { setEditing((e) => !e); setDraft(s.markdown); }} className={cn("rounded-md px-space-3 py-1 text-xs font-medium", editing ? "bg-primary text-primary-foreground" : "border border-border hover:bg-muted")}>{editing ? "Close tools" : "Edit"}</button>
        </div>
      </div>

      {hidden && <p className="rounded-lg border border-dashed border-border px-space-3 py-space-2 text-xs"><b>Hidden from Stella.</b> Not used in answers or in the book.</p>}
      {f.state === "archived" && <p className="rounded-lg border border-dashed border-border px-space-3 py-space-2 text-xs"><b>Archived.</b> Out of the vault sidebar and Stella’s memory. Restore it from the file’s icon, or + on its category.</p>}

      {editing && (
        <section className="flex flex-col gap-space-3 rounded-lg border border-border bg-card p-space-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">This file</h3>
          <div className="flex flex-wrap items-center gap-space-2 text-sm">
            {s.template && s.category && s.template.status !== "standard" ? (
              <>{s.template.onlyAccount ? "A custom file on this project only, in" : <>From the template <b className="font-mono text-xs">{s.template.name}.md</b> in</>} <Link href={`/library?open=${s.category.slug}&t=${encodeURIComponent(s.template.name)}`} className="font-semibold">{s.category.name}</Link> <StatusTag status={s.template.status} /></>
            ) : <>A core template every project starts with, in <b>{s.category?.name}</b>.</>}
          </div>
          <div className="flex flex-wrap items-center gap-1 text-xs">
            {s.otherProjects.length ? <><span className="text-muted-foreground">Also on</span>{s.otherProjects.map((p) => <Link key={p.slug} href={`/projects/${p.slug}/vault?file=${encodeURIComponent(p.path)}`} className="rounded-full border border-border px-space-2 py-0.5 text-foreground no-underline hover:bg-muted">{p.name}</Link>)}</> : <span className="text-muted-foreground">Not on any other project.</span>}
          </div>
          <div className="flex flex-wrap gap-space-2">
            {s.template && (s.template.onlyAccount || s.template.status === "local") && <Btn disabled={pending} onClick={() => act(() => proposeTemplateAction(slug, f.path))}>Propose as a template</Btn>}
            <Btn disabled={pending} onClick={() => act(() => toggleInBookAction(slug, f.path, !f.inBook))}>{f.inBook ? "Leave out of the book" : "Add to the book"}</Btn>
            <Btn disabled={pending} onClick={() => act(() => setFileStateAction(slug, f.path, hidden ? "active" : "hidden"))}>{hidden ? "Unhide" : "Hide from Stella"}</Btn>
            <Btn disabled={pending} onClick={() => act(() => setFileStateAction(slug, f.path, f.state === "archived" ? "active" : "archived"))}>{f.state === "archived" ? "Restore" : "Archive"}</Btn>
            <Btn disabled={pending} onClick={() => act(() => setFileStateAction(slug, f.path, "deleted"), () => router.push(`/projects/${slug}/vault`))}>Delete</Btn>
          </div>
          <p className="text-xs text-muted-foreground">Hide from Stella keeps the file in the vault but out of her answers and the book. To tidy the sidebar, use the icons next to the file name: hide, archive or delete. Hidden and archived files come back from the eye toggle on their category.</p>
          {!s.generated && (
            <div className="flex flex-col gap-space-2">
              <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={14} className="w-full rounded-md border border-input bg-background p-space-3 font-mono text-xs" aria-label="File content" />
              <div className="flex justify-end"><Btn primary disabled={pending || draft === s.markdown} onClick={() => act(() => saveFileAction(slug, f.path, draft))}>Save</Btn></div>
            </div>
          )}
        </section>
      )}

      <article className={cn("prose-vault", hidden && "pointer-events-none select-none blur-[5px]")}>
        <h1 className="font-display text-2xl font-semibold">{name.replace(/\.md$/, "").replace(/-/g, " ")}</h1>
        <FileBody markdown={s.markdown.replace(/^\s*# [^\n]*\n+/, "")} suggestions={s.suggestions} canDecide={s.canDecide} />
      </article>
    </div>
  );
}

/** The file's text, with pending suggestions shown at the end of the section each would be added to. */
function FileBody({ markdown, suggestions, canDecide }: { markdown: string; suggestions: SuggestionItem[]; canDecide: boolean }) {
  if (!suggestions.length) return <SafeMarkdown>{markdown}</SafeMarkdown>;
  const layout = sectionLayout(markdown);
  // Where each section ends (its first heading, as an accept would use). An empty file shows its template, and an
  // accept appends into that same text. H1s are titles, never sections: a suggestion naming one is a new section.
  const endOf = new Map<string, number>();
  layout.forEach((c, i) => c.closes.forEach((k) => { if (!endOf.has(k)) endOf.set(k, i); }));
  const at = (i: number) => suggestions.filter((x) => x.section && endOf.get(headingKey(x.section)) === i);
  const rest = suggestions.filter((x) => !x.section || !endOf.has(headingKey(x.section)));
  return (
    <>
      {layout.map((c, i) => (
        <div key={i}>
          <SafeMarkdown>{c.markdown}</SafeMarkdown>
          <VaultSuggestions items={at(i)} canDecide={canDecide} />
        </div>
      ))}
      <VaultSuggestions items={rest} canDecide={canDecide} newSection />
    </>
  );
}

function Btn({ children, onClick, disabled, primary }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; primary?: boolean }) {
  return <button disabled={disabled} onClick={onClick} className={cn("rounded-md px-space-3 py-1 text-xs font-medium disabled:opacity-50", primary ? "bg-primary text-primary-foreground" : "border border-border bg-card hover:bg-muted")}>{children}</button>;
}
