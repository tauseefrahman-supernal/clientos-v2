"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Info, MessageSquarePlus, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatThread } from "./ChatThread";
import { deleteChat, useChats } from "./store";

type Project = { slug: string; name: string; stage: "delivery" | "sales"; suggestions: string[] };

const GROUPS = ["Today", "Yesterday", "Last 7 days", "Older"] as const;
function bucket(t: number) {
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const day = 86400000;
  return t >= start.getTime() ? GROUPS[0] : t >= start.getTime() - day ? GROUPS[1] : t >= start.getTime() - 6 * day ? GROUPS[2] : GROUPS[3];
}

/** Full-page Stella: conversations on the left, one clean thread on the right. */
export function StellaChat({ projects, initialProject, initialChat }: { projects: Project[]; initialProject: string | null; initialChat: string | null }) {
  const router = useRouter();
  const chats = useChats().filter((c) => c.messages.length);
  const byslug = useMemo(() => new Map(projects.map((p) => [p.slug, p])), [projects]);
  const [active, setActive] = useState<string | null>(initialChat);
  const fallback = initialProject ?? projects.find((p) => p.stage === "delivery")?.slug ?? projects[0]?.slug ?? "";
  const [project, setProject] = useState(fallback);
  const [scope, setScope] = useState<"all" | "project">("all");
  const [q, setQ] = useState("");

  const chat = chats.find((c) => c.id === active) ?? null;
  const current = byslug.get(chat?.project ?? project);

  const select = (id: string | null, slug?: string) => {
    setActive(id);
    if (slug) setProject(slug);
    const qs = id ? `?chat=${id}` : slug ? `?project=${slug}` : "";
    router.replace(`/stella${qs}`, { scroll: false });
  };

  const listed = chats.filter((c) => (scope === "all" || c.project === project) && (!q || `${c.title} ${byslug.get(c.project)?.name ?? ""}`.toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="flex h-full min-h-0">
      <aside className="flex w-[280px] shrink-0 flex-col border-r border-border bg-card">
        <div className="flex flex-col gap-space-2 p-space-3">
          <button onClick={() => select(null, project)} className="flex items-center justify-center gap-space-2 rounded-md bg-primary px-space-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            <MessageSquarePlus className="h-4 w-4" />New chat
          </button>
          <div className="flex items-center gap-space-2 rounded-md border border-input bg-background px-space-2">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search chats" aria-label="Search chats" className="min-w-0 flex-1 bg-transparent py-1.5 text-sm outline-none" />
          </div>
          <div className="flex gap-1">
            {(["all", "project"] as const).map((f) => (
              <button key={f} onClick={() => setScope(f)} className={cn("truncate rounded-full border px-space-2 py-0.5 text-xs", scope === f ? "border-primary bg-[hsl(var(--color-action-subtle-bg))] text-[hsl(var(--color-action-text))]" : "border-border text-muted-foreground hover:bg-muted")}>
                {f === "all" ? "All projects" : current?.name ?? "This project"}
              </button>
            ))}
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
                    <button onClick={() => select(c.id, c.project)} className="min-w-0 flex-1 px-space-2 py-1.5 text-left">
                      <span className="block truncate text-sm">{c.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">{byslug.get(c.project)?.name ?? c.project}</span>
                    </button>
                    <button onClick={() => { deleteChat(c.id); if (c.id === active) select(null, c.project); }} aria-label={`Delete chat ${c.title}`} className="mr-1 rounded p-1 text-muted-foreground opacity-0 hover:text-foreground focus:opacity-100 group-hover:opacity-100">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
          {!listed.length && <p className="px-space-2 py-space-3 text-xs text-muted-foreground">{q ? "No chats match." : "No chats yet. Your conversations with Stella will be listed here."}</p>}
        </nav>
        <Link href="/stella/about" className="flex items-center gap-space-2 border-t border-border px-space-4 py-space-3 text-xs text-muted-foreground no-underline hover:text-foreground">
          <Info className="h-3.5 w-3.5" />About Stella: what she can do and what she reads
        </Link>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex min-h-11 items-center gap-space-3 border-b border-border px-space-6">
          {chat ? (
            <>
              <span className="truncate text-sm font-semibold">{chat.title}</span>
              {current && <Link href={`/projects/${current.slug}`} className="ml-auto shrink-0 text-xs text-muted-foreground no-underline hover:text-foreground">{current.name} ↗</Link>}
            </>
          ) : (
            <>
              <label htmlFor="stella-project" className="text-xs text-muted-foreground">Ask about</label>
              <select id="stella-project" value={project} onChange={(e) => select(null, e.target.value)} className="rounded-md border border-input bg-background px-space-2 py-1 text-sm font-medium">
                <optgroup label="In delivery">{projects.filter((x) => x.stage === "delivery").map((x) => <option key={x.slug} value={x.slug}>{x.name}</option>)}</optgroup>
                <optgroup label="In sales">{projects.filter((x) => x.stage === "sales").map((x) => <option key={x.slug} value={x.slug}>{x.name}</option>)}</optgroup>
              </select>
            </>
          )}
        </header>
        <ChatThread key={chat?.id ?? `new-${project}`} chat={chat} project={chat?.project ?? project} projectName={current?.name ?? project}
          suggestions={current?.suggestions} onStarted={(id) => select(id, project)} />
      </section>
    </div>
  );
}
