"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Plus, UserRound, Users, X } from "lucide-react";
import { addMemberAction, removeMemberAction } from "@/app/actions";
import { unwrapAction } from "@/lib/auth/rules";
import { cn } from "@/lib/utils";

type Member = { personId: string; name: string; title: string | null; role: string; source: "import" | "manual"; linked: boolean };
const ROLES: [string, string][] = [["strategist", "Strategist"], ["am", "Account manager"], ["mason", "Mason"], ["fde", "FDE"], ["ae", "Account executive"], ["other", "Other"]];
const SHORT: Record<string, string> = { strategist: "Strat", am: "AM", mason: "Mason", fde: "FDE", ae: "AE", other: "Team" };

/** Who is on this project. Admins and the project's strategists can add and remove people. */
export function TeamBar({ slug, members, people, canEdit }: { slug: string; members: Member[]; people: { id: string; name: string; title: string | null }[]; canEdit: boolean }) {
  const [open, setOpen] = useState(false);
  const [person, setPerson] = useState("");
  const [role, setRole] = useState("mason");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", down);
    return () => document.removeEventListener("mousedown", down);
  }, [open]);
  const act = (fn: () => Promise<void>) => start(async () => { setError(null); try { await fn(); } catch (e) { setError(e instanceof Error ? e.message : String(e)); } });

  return (
    <div ref={box} className="relative mt-space-2 flex flex-wrap items-center gap-1 text-xs">
      <Users className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
      {members.map((m) => (
        <span key={`${m.personId}-${m.role}`} title={`${m.title ?? ""}${m.source === "import" ? " · from Account OS" : " · added in ClientOS"}${m.linked ? " · has signed in" : ""}`}
          className={cn("inline-flex items-center gap-1 rounded-full border border-border bg-card px-space-2 py-0.5", m.linked && "border-[hsl(var(--color-action-default))]")}>
          {m.name}<span className="text-muted-foreground">{SHORT[m.role] ?? m.role}</span>
          {canEdit && <button type="button" aria-label={`Remove ${m.name} as ${m.role}`} disabled={pending} onClick={() => act(async () => { unwrapAction(await removeMemberAction(slug, m.personId, m.role)); })} className="rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"><X className="h-3 w-3" /></button>}
        </span>
      ))}
      {!members.length && <span className="text-muted-foreground">No one assigned yet.</span>}
      {canEdit && <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-space-2 py-0.5 text-muted-foreground hover:text-foreground"><Plus className="h-3 w-3" />Add</button>}
      {error && <span className="text-[hsl(var(--color-status-error-text))]">{error}</span>}
      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 flex w-[320px] flex-col gap-space-2 rounded-lg border border-border bg-popover p-space-3 text-sm shadow-lg">
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">Person
            <select value={person} onChange={(e) => setPerson(e.target.value)} className="rounded-md border border-input bg-background px-space-2 py-1 text-sm text-foreground">
              <option value="">Choose…</option>
              {people.map((p) => <option key={p.id} value={p.id}>{p.name}{p.title ? ` · ${p.title}` : ""}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">Role on this project
            <select value={role} onChange={(e) => setRole(e.target.value)} className="rounded-md border border-input bg-background px-space-2 py-1 text-sm text-foreground">
              {ROLES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <button type="button" disabled={!person || pending} onClick={() => act(async () => { unwrapAction(await addMemberAction(slug, person, role)); setOpen(false); setPerson(""); })} className="inline-flex items-center justify-center gap-1 rounded-md bg-primary px-space-3 py-1.5 font-medium text-primary-foreground disabled:opacity-50"><UserRound className="h-4 w-4" />Assign</button>
          <p className="text-xs text-muted-foreground">They see this project as soon as they sign in. People from Account OS pods are added on each import; people you add here stay.</p>
        </div>
      )}
    </div>
  );
}
