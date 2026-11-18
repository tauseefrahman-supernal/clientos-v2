"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";
import { Empty } from "@/components/kit";
import type { MemoryAdminData } from "@/lib/memory/admin";
import { cn } from "@/lib/utils";

type SyncResult = {
  added: number; updated: number; pending: number; gone: number; rateLimited: boolean; more: boolean;
  preview?: { listed: number; new: number; existing: number; links: number; complete: boolean; wouldMarkGone: { title: string; provider: string; metAt: string | null }[] };
};
type Reply = { ok: true; result: unknown } | { ok: false; status: number; error: string };

const when = (iso: string | null) => { if (!iso) return "—"; const t = Date.parse(iso); return Number.isNaN(t) ? iso : new Date(t).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }); };
const stamp = (iso: string | null) => (iso ? new Date(iso).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "Never");
const source = (p: string) => (p === "granola" ? "Granola" : p === "fathom" ? "Fathom" : "Upload");
const btn = "rounded-md border border-border px-space-2 py-0.5 text-xs hover:bg-muted disabled:opacity-60";
const primary = "rounded-md bg-primary px-space-3 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-60";

async function post(payload: Record<string, unknown>): Promise<Reply> {
  const res = await fetch("/api/admin/memory", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const text = await res.text();
  let json: { ok?: boolean; result?: unknown; error?: string } | null = null;
  try { json = JSON.parse(text); } catch { /* plain-text error */ }
  if (res.ok && json?.ok) return { ok: true, result: json.result };
  return { ok: false, status: res.status, error: json?.error ?? text ?? `HTTP ${res.status}` };
}

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-space-2">
      <div>
        <h2 className="font-display text-xl font-semibold">{title}</h2>
        {note && <p className="mt-space-1 max-w-[80ch] text-sm text-muted-foreground">{note}</p>}
      </div>
      {children}
    </section>
  );
}

/** The memory admin page: sync, screened calls, gone calls, unassigned calls and match rules. */
export function MemoryAdmin({ data }: { data: MemoryAdminData }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<{ text: string; error?: boolean } | null>(null);
  const [sync, setSync] = useState<SyncResult | null>(null);
  const [preview, setPreview] = useState<SyncResult["preview"] | null>(null);

  const act = async (key: string, payload: Record<string, unknown>, done?: (result: unknown) => string) => {
    setBusy(key); setNote(null);
    try {
      const r = await post(payload);
      if (!r.ok) { setNote({ text: r.error, error: true }); return r; }
      const m = (r.result as { message?: string } | null)?.message;
      setNote({ text: done ? done(r.result) : m ?? "Done." });
      router.refresh();
      return r;
    } catch (e) { setNote({ text: e instanceof Error ? e.message : String(e), error: true }); return null; }
    finally { setBusy(null); }
  };

  const syncSummary = (r: SyncResult) =>
    `Sync finished: ${r.added} new, ${r.updated} updated, ${r.pending} waiting, ${r.gone} marked gone.${r.rateLimited ? " A source asked us to slow down." : ""}${r.more ? " More remains: press Sync now again." : ""}`;

  const syncNow = async () => {
    setBusy("sync"); setNote(null); setSync(null); setPreview(null);
    try {
      const r = await post({ action: "sync" });
      if (r.ok) { setSync(r.result as SyncResult); setNote({ text: syncSummary(r.result as SyncResult) }); router.refresh(); return; }
      if (r.status === 409 && /preview/i.test(r.error)) {
        // This run would list everything and could mark calls gone: show what it would do first.
        const p = await post({ action: "sync", preview: true });
        if (!p.ok) { setNote({ text: p.error, error: true }); return; }
        setPreview((p.result as SyncResult).preview ?? null);
        setNote({ text: "This sync lists everything and can mark calls as gone. Check the preview, then confirm." });
        return;
      }
      setNote({ text: r.error, error: true });
    } catch (e) { setNote({ text: e instanceof Error ? e.message : String(e), error: true }); }
    finally { setBusy(null); }
  };

  const confirmFull = async () => {
    const r = await act("full", { action: "sync", confirmFull: true }, (res) => syncSummary(res as SyncResult));
    if (r?.ok) { setPreview(null); setSync(r.result as SyncResult); }
  };

  const override = (id: string, kind: "personnel" | "not_personnel") => {
    if (kind === "personnel" && !window.confirm("Mark this call personnel? Its transcript, search passages and pending facts are deleted.")) return;
    if (kind === "not_personnel" && !window.confirm("Mark this call not personnel? It is fetched again from its source and screened for private details (a small paid model call).")) return;
    return act(`o:${id}`, { action: "override", override: kind, transcriptId: id });
  };

  const c = data.counts;
  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-space-6 px-space-6 py-space-5">
      <div>
        <h1 className="font-display text-3xl font-semibold">Memory</h1>
        <p className="mt-space-1 max-w-[80ch] text-sm text-muted-foreground">Calls Stella can search, pulled from Granola and Fathom and screened for private matters before they are stored. Choices made here are kept by every later sync.</p>
      </div>

      {note && <p role="status" className={cn("sticky top-2 z-10 rounded-md border px-space-3 py-space-2 text-sm", note.error ? "border-[hsl(var(--color-status-error-border))] bg-[hsl(var(--color-status-error-bg))] text-[hsl(var(--color-status-error-text))]" : "border-border bg-card")}>{note.text}</p>}

      <Section title="Sync" note="Sync now pulls new and changed calls from Granola and Fathom and screens them. It can take a few minutes.">
        <div className="grid grid-cols-1 gap-space-3 md:grid-cols-2">
          {data.providers.map((p) => (
            <div key={p.provider} className="rounded-lg border border-border bg-card p-space-3 text-sm">
              <div className="font-semibold">{p.label}</div>
              <div className="text-muted-foreground">Last sync: {stamp(p.lastRunAt)}{p.more ? " · more to fetch" : ""}</div>
              {p.lastError && <div className="mt-0.5 text-xs text-[hsl(var(--color-status-error-text))]">Last error: {p.lastError}</div>}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-space-2 font-mono text-xs text-muted-foreground">
          {[["calls", c.calls], ["waiting", c.pending], ["summarised", c.digested], ["failed", c.failed], ["personnel", c.personnel], ["gone", c.gone], ["on no project", c.unassigned]].map(([k, v]) => (
            <span key={k} className="rounded border border-border bg-card px-1.5 py-0.5">{v} {k}</span>
          ))}
        </div>
        <div className="flex items-center gap-space-3">
          <button onClick={syncNow} disabled={!!busy} className={primary}>{busy === "sync" ? "Syncing…" : "Sync now"}</button>
          {sync && <span className="text-xs text-muted-foreground">{syncSummary(sync)}</span>}
        </div>
        {preview && (
          <div className="flex flex-col gap-space-2 rounded-lg border border-[hsl(var(--color-status-warning-border))] bg-[hsl(var(--color-status-warning-bg))] p-space-3 text-sm">
            <div className="font-semibold">Preview of a full sync</div>
            <div>{preview.listed} calls listed: {preview.new} new, {preview.existing} already stored, {preview.links} project links.{preview.complete ? "" : " The listing did not finish, so nothing would be marked gone."}</div>
            {preview.wouldMarkGone.length > 0 ? (
              <>
                <div>{preview.wouldMarkGone.length} call{preview.wouldMarkGone.length === 1 ? "" : "s"} would be marked “No longer in Granola or Fathom”:</div>
                <ul className="max-h-48 list-disc overflow-y-auto pl-space-5 text-xs">{preview.wouldMarkGone.map((g, i) => <li key={i}>{g.title} · {when(g.metAt)} · {source(g.provider)}</li>)}</ul>
              </>
            ) : <div>No calls would be marked gone.</div>}
            <div className="flex gap-space-2">
              <button onClick={confirmFull} disabled={!!busy} className={primary}>{busy === "full" ? "Syncing…" : "Confirm full sync"}</button>
              <button onClick={() => setPreview(null)} disabled={!!busy} className={btn}>Cancel</button>
            </div>
          </div>
        )}
      </Section>

      <Section title="Screened calls" note="Calls the privacy screen cut parts from, or kept as personnel calls (title only). Only admins see these. Mark a call personnel to delete its transcript, or not personnel to fetch it again with only clients’ customers’ private details removed.">
        {data.screened.length ? (
          <div className="divide-y divide-[var(--color-border-default)] rounded-lg border border-border bg-card">
            {data.screened.map((s) => (
              <div key={s.id} className="grid grid-cols-1 gap-space-1 px-space-3 py-space-2 text-sm md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <div className="min-w-0">
                  <div className="font-semibold">{s.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {when(s.date)} · {source(s.provider)} · {s.personnel ? "Personnel call: title only" : [s.personnelCuts && `${s.personnelCuts} personnel part${s.personnelCuts === 1 ? "" : "s"} removed`, s.privateCuts && `${s.privateCuts} private detail${s.privateCuts === 1 ? "" : "s"} removed`].filter(Boolean).join(", ") || "Nothing removed"}
                    {s.byHand && ` · marked ${s.byHand === "personnel" ? "personnel" : "not personnel"} by hand`}
                  </div>
                </div>
                <div className="flex gap-space-2">
                  {!s.personnel && <button onClick={() => override(s.id, "personnel")} disabled={!!busy} className={btn}>Personnel</button>}
                  {(s.personnel || s.personnelCuts > 0) && <button onClick={() => override(s.id, "not_personnel")} disabled={!!busy} className={btn}>{busy === `o:${s.id}` ? "Working…" : "Not personnel"}</button>}
                </div>
              </div>
            ))}
          </div>
        ) : <Empty>The screen has not removed anything yet.</Empty>}
      </Section>

      <Section title="No longer in Granola or Fathom" note="Calls missing from their source at a full sync. They stay searchable for 14 days. Keep clears the mark; Delete removes the call for good.">
        {data.gone.length ? (
          <div className="divide-y divide-[var(--color-border-default)] rounded-lg border border-border bg-card">
            {data.gone.map((g) => (
              <div key={g.id} className="grid grid-cols-1 gap-space-1 px-space-3 py-space-2 text-sm md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <div className="min-w-0">
                  <div className="font-semibold">{g.title}</div>
                  <div className="text-xs text-muted-foreground">{when(g.date)} · {source(g.provider)} · missing for {g.days} day{g.days === 1 ? "" : "s"}{g.hidden ? " · hidden from search" : ""}</div>
                </div>
                <div className="flex gap-space-2">
                  <button onClick={() => act(`g:${g.id}`, { action: "gone", transcriptId: g.id, keep: true })} disabled={!!busy} className={btn}>Keep</button>
                  <button onClick={() => window.confirm(`Delete “${g.title}” for good? Its transcript, summary and search passages go with it.`) && act(`g:${g.id}`, { action: "gone", transcriptId: g.id, keep: false })} disabled={!!busy} className={cn(btn, "text-[hsl(var(--color-status-error-text))]")}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : <Empty>Every call is still in Granola or Fathom.</Empty>}
      </Section>

      <Unassigned items={data.unassigned} projects={data.projects} busy={busy} act={act} />

      <Rules groups={data.rules} busy={busy} act={act} />
    </div>
  );
}

type Act = (key: string, payload: Record<string, unknown>) => Promise<unknown>;

function Unassigned({ items, projects, busy, act }: { items: MemoryAdminData["unassigned"]; projects: MemoryAdminData["projects"]; busy: string | null; act: Act }) {
  const [shown, setShown] = useState(50);
  const [pick, setPick] = useState<Record<string, string>>({});
  return (
    <Section title="Calls on no project" note="Calls that matched no project. Assigning one is kept by every later sync.">
      {items.length ? (
        <div className="divide-y divide-[var(--color-border-default)] rounded-lg border border-border bg-card">
          {items.slice(0, shown).map((u) => (
            <div key={u.id} className="grid grid-cols-1 gap-space-1 px-space-3 py-space-2 text-sm md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              <div className="min-w-0"><div className="font-semibold">{u.title}</div><div className="text-xs text-muted-foreground">{when(u.date)} · {source(u.provider)}</div></div>
              <div className="flex items-center gap-space-2">
                <select aria-label={`Project for ${u.title}`} value={pick[u.id] ?? ""} onChange={(e) => setPick((p) => ({ ...p, [u.id]: e.target.value }))} className="max-w-[220px] rounded-md border border-input bg-background px-space-2 py-0.5 text-xs">
                  <option value="">Choose a project</option>
                  {projects.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
                </select>
                <button onClick={() => act(`a:${u.id}`, { action: "override", override: "assign", transcriptId: u.id, slug: pick[u.id] })} disabled={!!busy || !pick[u.id]} className={btn}>Assign</button>
              </div>
            </div>
          ))}
          {items.length > shown && <button onClick={() => setShown((n) => n + 50)} className="w-full px-space-3 py-space-2 text-xs text-muted-foreground hover:bg-muted">Show more ({items.length - shown} left)</button>}
        </div>
      ) : <Empty>Every call is on a project.</Empty>}
    </Section>
  );
}

function Rules({ groups, busy, act }: { groups: MemoryAdminData["rules"]; busy: string | null; act: Act }) {
  const [draft, setDraft] = useState<Record<string, { kind: string; value: string }>>({});
  return (
    <Section title="Match rules" note="How the sync decides which project a call belongs to: keywords and names in the title or summary, and attendee emails and domains. Changes apply from the next sync.">
      <div className="flex flex-col gap-space-2">
        {groups.map((g) => {
          const d = draft[g.slug] ?? { kind: "keyword", value: "" };
          const set = (patch: Partial<typeof d>) => setDraft((x) => ({ ...x, [g.slug]: { ...d, ...patch } }));
          return (
            <details key={g.slug} className="rounded-lg border border-border bg-card px-space-3 py-space-2">
              <summary className="cursor-pointer text-sm font-semibold">{g.name} <span className="font-mono text-xs font-normal text-muted-foreground">{g.rules.length}</span></summary>
              <div className="mt-space-2 flex flex-wrap gap-1">
                {g.rules.map((r) => (
                  <span key={`${r.kind}:${r.value}`} className="inline-flex items-center gap-1 rounded-full border border-border px-space-2 py-0.5 text-xs">
                    <span className="text-muted-foreground">{r.kind}</span>{r.value}
                    <button aria-label={`Remove ${r.kind} ${r.value}`} disabled={!!busy} onClick={() => act(`r:${g.slug}`, { action: "rule", slug: g.slug, kind: r.kind, value: r.value, remove: true })} className="text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
                  </span>
                ))}
                {!g.rules.length && <span className="text-xs text-muted-foreground">No rules yet.</span>}
              </div>
              <form className="mt-space-2 flex flex-wrap items-center gap-space-2" onSubmit={async (e) => { e.preventDefault(); if (!d.value.trim()) return; await act(`r:${g.slug}`, { action: "rule", slug: g.slug, kind: d.kind, value: d.value }); set({ value: "" }); }}>
                <select aria-label="Rule kind" value={d.kind} onChange={(e) => set({ kind: e.target.value })} className="rounded-md border border-input bg-background px-space-2 py-0.5 text-xs">
                  <option value="keyword">Keyword or name</option><option value="email">Email</option><option value="domain">Domain</option>
                </select>
                <input aria-label="Rule value" value={d.value} onChange={(e) => set({ value: e.target.value })} placeholder={d.kind === "email" ? "name@company.com" : d.kind === "domain" ? "company.com" : "Project or person name"} className="min-w-[200px] flex-1 rounded-md border border-input bg-background px-space-2 py-0.5 text-xs md:max-w-[280px]" />
                <button type="submit" disabled={!!busy || !d.value.trim()} className={btn}>Add</button>
              </form>
            </details>
          );
        })}
      </div>
    </Section>
  );
}
