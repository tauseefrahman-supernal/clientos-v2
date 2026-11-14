"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { History, Maximize2, MessageSquarePlus, Sparkles, X } from "lucide-react";
import { ChatThread } from "@/components/stella/ChatThread";
import { ScopePicker, scopeLabel, type PickProject } from "@/components/stella/ScopePicker";
import { suggestionsFor } from "@/components/stella/StellaChat";
import { ALL, setScope, useChats } from "@/components/stella/store";
import { cn } from "@/lib/utils";

// Side panel: a compact Stella. Opens on the open project's latest chat; the history button loads any
// earlier chat here without leaving the page. Same chats as the full Stella chat page.
export function StellaDrawer({ project, projects, prompt, onClose }: { project: string | null; projects: PickProject[]; prompt?: string; onClose: () => void }) {
  const chats = useChats().filter((c) => c.messages.length);
  const [active, setActive] = useState<string | null>(null);
  const [draft, setDraft] = useState<string[]>(project ? [project] : [ALL]);
  const [history, setHistory] = useState(false);
  const [onlyHere, setOnlyHere] = useState(true);
  const box = useRef<HTMLDivElement>(null);

  // Follow the page: on a project, start from its latest chat (or a new one about it).
  useEffect(() => {
    setDraft(project ? [project] : [ALL]);
    setActive(project ? chats.find((c) => c.scope.length === 1 && c.scope[0] === project)?.id ?? null : null);
  }, [project]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!history) return;
    const down = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setHistory(false); };
    document.addEventListener("mousedown", down);
    return () => document.removeEventListener("mousedown", down);
  }, [history]);

  const chat = chats.find((c) => c.id === active) ?? null;
  const scope = chat?.scope.length ? chat.scope : draft;
  const items = chats.filter((c) => !onlyHere || !project || c.scope.includes(project)).slice(0, 40);
  const full = chat ? `/stella/chat?chat=${chat.id}` : `/stella/chat?projects=${encodeURIComponent(scope.join(","))}`;
  const suggestions = suggestionsFor(scope, projects.map((p) => ({ ...p, suggestions: [] }))).slice(0, scope.length === 1 && scope[0] !== ALL ? 0 : 3);

  return (
    <aside className="flex w-[420px] shrink-0 flex-col border-l border-border bg-card">
      <div ref={box} className="relative border-b border-border px-space-3 py-space-2">
        <div className="flex items-center gap-space-1">
          <span className="mr-auto flex min-w-0 items-center gap-space-2 text-sm font-semibold"><Sparkles className="h-4 w-4 shrink-0 text-primary" /><span className="truncate">{chat ? chat.title : "Stella"}</span></span>
          <IconBtn label="Chat history" active={history} onClick={() => setHistory((h) => !h)}><History className="h-4 w-4" /></IconBtn>
          <IconBtn label="New chat" onClick={() => { setActive(null); setHistory(false); }}><MessageSquarePlus className="h-4 w-4" /></IconBtn>
          <Link href={full} title="Open full chat" aria-label="Open full chat" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"><Maximize2 className="h-4 w-4" /></Link>
          <IconBtn label="Close Stella" onClick={onClose}><X className="h-4 w-4" /></IconBtn>
        </div>
        <div className="mt-1 flex items-center gap-space-2 text-xs text-muted-foreground">
          Ask about <ScopePicker compact projects={projects} value={scope} onChange={(next) => (chat ? setScope(chat.id, next) : setDraft(next))} />
        </div>
        {history && (
          <div className="absolute left-2 right-2 top-full z-30 mt-1 flex max-h-[60vh] flex-col overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
            {project && (
              <div className="flex gap-1 border-b border-border p-space-2">
                {[true, false].map((v) => <button key={String(v)} onClick={() => setOnlyHere(v)} className={cn("rounded-full border px-space-2 py-0.5 text-xs", onlyHere === v ? "border-primary bg-[hsl(var(--color-action-subtle-bg))] text-[hsl(var(--color-action-text))]" : "border-border text-muted-foreground")}>{v ? (projects.find((p) => p.slug === project)?.name ?? "This project") : "All chats"}</button>)}
              </div>
            )}
            <ul className="overflow-y-auto p-space-1">
              {items.map((c) => (
                <li key={c.id}>
                  <button onClick={() => { setActive(c.id); setHistory(false); }} className={cn("flex w-full flex-col rounded-md px-space-2 py-1.5 text-left hover:bg-muted", c.id === active && "bg-[hsl(var(--color-action-subtle-bg))]")}>
                    <span className="truncate text-sm">{c.title}</span>
                    <span className="truncate text-xs text-muted-foreground">{scopeLabel(c.scope, projects)} · {new Date(c.updatedAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</span>
                  </button>
                </li>
              ))}
              {!items.length && <li className="px-space-2 py-space-3 text-xs text-muted-foreground">No chats yet{onlyHere && project ? " about this project" : ""}.</li>}
            </ul>
          </div>
        )}
      </div>
      <ChatThread key={chat?.id ?? `new-${scope.join(",")}`} chat={chat} scope={scope} scopeName={scopeLabel(scope, projects)} projects={projects}
        suggestions={suggestions} compact prefill={prompt} onStarted={setActive} />
    </aside>
  );
}

function IconBtn({ label, onClick, active, children }: { label: string; onClick: () => void; active?: boolean; children: React.ReactNode }) {
  return <button type="button" title={label} aria-label={label} aria-pressed={active} onClick={onClick} className={cn("rounded-md p-1.5 text-muted-foreground hover:bg-muted", active && "bg-muted text-foreground")}>{children}</button>;
}
