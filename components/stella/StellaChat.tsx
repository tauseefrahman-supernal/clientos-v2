"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Info, MessageSquarePlus, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatThread } from "./ChatThread";
import { ScopePicker, scopeLabel, type PickProject } from "./ScopePicker";
import { ALL, deleteChat, setScope, useChats } from "./store";

type Project = PickProject & { suggestions: string[] };

const GROUPS = ["Today", "Yesterday", "Last 7 days", "Older"] as const;
function bucket(t: number) {
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const day = 86400000;
  return t >= start.getTime() ? GROUPS[0] : t >= start.getTime() - day ? GROUPS[1] : t >= start.getTime() - 6 * day ? GROUPS[2] : GROUPS[3];
}

export function suggestionsFor(scope: string[], projects: Project[]): string[] {
  if (scope.length === 1 && scope[0] !== ALL) return projects.find((p) => p.slug === scope[0])?.suggestions ?? [];
  return [
    "Compare how these projects were sold: price, structure and what unlocked each deal",
    "Which of these projects need attention this week, and why?",
    "Write a one-page brief covering these projects",
    "Export the vaults and books of these projects into one document",
  ];
}

/** Full-page Stella: conversations on the left, one clean thread on the right. */
export function StellaChat({ projects, initialScope, initialChat }: { projects: Project[]; initialScope: string[] | null; initialChat: string | null }) {
  const router = useRouter();
  const chats = useChats().filter((c) => c.messages.length);
  const [active, setActive] = useState<string | null>(initialChat);
  const firstDelivery = projects.find((p) => p.stage === "delivery")?.slug ?? projects[0]?.slug;
  const [draftScope, setDraftScope] = useState<string[]>(initialScope?.length ? initialScope : firstDelivery ? [firstDelivery] : []);
  const [q, setQ] = useState("");
  const names = useMemo(() => new Map(projects.map((p) => [p.slug, p.name])), [projects]);

  const chat = chats.find((c) => c.id === active) ?? null;
  const scope = chat?.scope.length ? chat.scope : draftScope;

  const select = (id: string | null) => {
    setActive(id);
    router.replace(id ? `/stella/chat?chat=${id}` : "/stella/chat", { scroll: false });
  };
  const changeScope = (next: string[]) => { if (chat) setScope(chat.id, next); else setDraftScope(next); };

  const label = (s: string[]) => scopeLabel(s, projects);
  const listed = chats.filter((c) => !q || `${c.title} ${c.scope.map((s) => names.get(s) ?? s).join(" ")}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="flex h-full min-h-0">
      <aside className="flex w-[280px] shrink-0 flex-col border-r border-border bg-card">
        <div className="flex flex-col gap-space-2 p-space-3">
          <button onClick={() => select(null)} className="flex items-center justify-center gap-space-2 rounded-md bg-primary px-space-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            <MessageSquarePlus className="h-4 w-4" />New chat
          </button>
          <div className="flex items-center gap-space-2 rounded-md border border-input bg-background px-space-2">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search chats" aria-label="Search chats" className="min-w-0 flex-1 bg-transparent py-1.5 text-sm outline-none" />
          </div>
        </div>
        <nav aria-label="Chats" className="min-h-0 flex-1 overflow-y-auto px-space-2 pb-space-3">
          {GROUPS.map((g) => {
            const items = listed.filter((c) => bucket(c.updatedAt) === g);
            if (!items.length) return null;
            return (
              <div key={g} className="mt-space-2">
                <div className="px-space-2 pb-1 text-xs font-semibold text-muted-foreground">{g}</div>
                {items.map((c) => (
                  <div key={c.id} className={cn("group flex items-center rounded-md", c.id === active ? "bg-[hsl(var(--color-action-subtle-bg))]" : "hover:bg-muted")}>
                    <button onClick={() => select(c.id)} className="min-w-0 flex-1 px-space-2 py-1.5 text-left">
                      <span className="block truncate text-sm">{c.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">{label(c.scope)}</span>
                    </button>
                    <button onClick={() => { deleteChat(c.id); if (c.id === active) select(null); }} aria-label={`Delete chat ${c.title}`} className="mr-1 rounded p-1 text-muted-foreground opacity-0 hover:text-foreground focus:opacity-100 group-hover:opacity-100">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
          {!listed.length && <p className="px-space-2 py-space-3 text-xs text-muted-foreground">{q ? "No chats match." : "No chats yet. Your conversations with Stella will be listed here."}</p>}
        </nav>
        <Link href="/stella" className="flex items-center gap-space-2 border-t border-border px-space-4 py-space-3 text-xs text-muted-foreground no-underline hover:text-foreground">
          <Info className="h-3.5 w-3.5" />About Stella: what she can do and what she reads
        </Link>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex min-h-11 items-center gap-space-3 border-b border-border px-space-6">
          {chat && <span className="min-w-0 truncate text-sm font-semibold">{chat.title}</span>}
          <span className={cn("flex shrink-0 items-center gap-space-2", chat && "ml-auto")}>
            <span className="text-xs text-muted-foreground">Ask about</span>
            <ScopePicker projects={projects} value={scope} onChange={changeScope} />
          </span>
          {scope.length === 1 && scope[0] !== ALL && <Link href={`/projects/${scope[0]}`} className={cn("shrink-0 text-xs text-muted-foreground no-underline hover:text-foreground", !chat && "ml-auto")}>Open project ↗</Link>}
        </header>
        <ChatThread key={chat?.id ?? "new"} chat={chat} scope={scope} scopeName={label(scope)} projects={projects}
          suggestions={suggestionsFor(scope, projects)} onStarted={(id) => select(id)} />
      </section>
    </div>
  );
}
