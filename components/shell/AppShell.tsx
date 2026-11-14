"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { LayoutGrid, Library, PanelLeftClose, PanelLeftOpen, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SearchItem } from "@/lib/search";
import { StellaDrawer } from "./StellaDrawer";

// App frame: collapsible sidebar, top bar with search, and a Stella drawer that
// persists across pages. ⌘K opens the search palette from anywhere.

type ShellCtx = { openStella: (prompt?: string) => void };
const Ctx = createContext<ShellCtx>({ openStella: () => {} });
export const useShell = () => useContext(Ctx);

const read = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* private window */ } };

export function AppShell({ children, searchIndex, names }: { children: React.ReactNode; searchIndex: SearchItem[]; names: Record<string, string> }) {
  const [collapsed, setCollapsed] = useState(false);
  const [stella, setStella] = useState(false);
  const [stellaPrompt, setStellaPrompt] = useState<string | undefined>();
  const [palette, setPalette] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setCollapsed(read("cos.sb") === "min"); setStella(read("cos.st") === "open"); }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPalette((p) => !p); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleSidebar = () => setCollapsed((c) => { write("cos.sb", c ? "full" : "min"); return !c; });
  const toggleStella = (open?: boolean) => setStella((s) => { const n = open ?? !s; write("cos.st", n ? "open" : "min"); return n; });
  const openStella = useCallback((prompt?: string) => { setStellaPrompt(prompt); toggleStella(true); }, []);
  const project = pathname.match(/^\/projects\/([^/]+)/)?.[1] ?? null;

  const nav = [
    { href: "/", label: "Projects", icon: LayoutGrid, active: pathname === "/" || pathname.startsWith("/projects") },
    { href: "/library", label: "Template Library", icon: Library, active: pathname.startsWith("/library") },
    { href: "/stella", label: "Stella", icon: Sparkles, active: pathname.startsWith("/stella") },
  ];

  return (
    <Ctx.Provider value={{ openStella }}>
      <div className="flex h-screen overflow-hidden">
        <aside className={cn("flex shrink-0 flex-col gap-space-3 border-r border-border bg-sidebar px-space-2 py-space-3 transition-[width] duration-150", collapsed ? "w-16" : "w-60")}>
          <div className={cn("flex min-h-9 items-center gap-space-2", collapsed ? "justify-center" : "justify-between px-space-2")}>
            {!collapsed && <div><div className="text-base font-bold tracking-tight">Supernal</div><div className="text-xs font-medium text-muted-foreground">ClientOS</div></div>}
            <button onClick={toggleSidebar} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} className="rounded-md p-space-1 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground">
              {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
          </div>
          <nav className="flex flex-col gap-0.5">
            <button onClick={() => setPalette(true)} className={cn("flex items-center gap-space-2 rounded-md px-space-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground", collapsed && "justify-center")} title="Search">
              <Search className="h-4 w-4" />{!collapsed && <><span>Search</span><kbd className="ml-auto rounded border border-border px-1 font-mono text-xs">⌘K</kbd></>}
            </button>
            <div className="my-space-1 h-px bg-[var(--color-border-default)]" />
            {nav.map(({ href, label, icon: Icon, active }) => (
              <Link key={href} href={href} title={label} className={cn("flex items-center gap-space-2 rounded-md px-space-2 py-1.5 text-sm font-medium no-underline", collapsed && "justify-center", active ? "bg-sidebar-active-bg text-sidebar-active-fg" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground")}>
                <Icon className="h-4 w-4" />{!collapsed && label}
              </Link>
            ))}
          </nav>
          {!collapsed && <p className="mt-auto px-space-2 text-xs leading-relaxed text-muted-foreground">Prototype data from the account research of 13 Nov. Edits last until the server restarts.</p>}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex min-h-12 shrink-0 items-center gap-space-3 border-b border-border px-space-5">
            <Crumbs pathname={pathname} names={names} />
            <button onClick={() => setPalette(true)} className="ml-auto flex min-w-[220px] items-center gap-space-2 rounded-md border border-border bg-card px-space-3 py-1 text-xs text-muted-foreground hover:bg-muted">
              <Search className="h-3.5 w-3.5" />Search projects, files, templates<kbd className="ml-auto rounded border border-border px-1 font-mono text-xs">⌘K</kbd>
            </button>
            {!pathname.startsWith("/stella") && <button onClick={() => toggleStella()} className={cn("flex items-center gap-space-1 rounded-md border px-space-3 py-1 text-xs font-medium", stella ? "border-primary bg-[hsl(var(--color-action-subtle-bg))] text-[hsl(var(--color-action-text))]" : "border-border bg-card hover:bg-muted")}>
              <Sparkles className="h-3.5 w-3.5" />Stella
            </button>}
          </header>
          <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
        </div>

        {stella && !pathname.startsWith("/stella") && <StellaDrawer project={project} projectName={project ? names[project] ?? project : null} prompt={stellaPrompt} onClose={() => toggleStella(false)} />}
      </div>
      {palette && <Palette items={searchIndex} onClose={() => setPalette(false)} />}
    </Ctx.Provider>
  );
}

function Crumbs({ pathname, names }: { pathname: string; names: Record<string, string> }) {
  const parts = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href?: string }[] = [];
  if (parts[0] === "library") crumbs.push({ label: "Template Library" });
  else if (parts[0] === "stella") { crumbs.push({ label: "Stella", href: parts[1] ? "/stella" : undefined }); if (parts[1] === "about") crumbs.push({ label: "About" }); }
  else if (parts[0] === "projects" && parts[1]) {
    crumbs.push({ label: "Projects", href: "/" });
    crumbs.push({ label: names[parts[1]] ?? parts[1], href: parts[2] ? `/projects/${parts[1]}` : undefined });
    if (parts[2]) crumbs.push({ label: parts[2][0].toUpperCase() + parts[2].slice(1) });
  } else crumbs.push({ label: "Projects" });
  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 flex-wrap items-center gap-space-1 text-xs text-muted-foreground">
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-space-1">
          {c.href ? <Link href={c.href} className="text-muted-foreground no-underline hover:text-foreground">{c.label}</Link> : <span className="font-semibold text-foreground">{c.label}</span>}
          {i < crumbs.length - 1 && <span>›</span>}
        </span>
      ))}
    </nav>
  );
}

const ORDER = ["Project", "Page", "Chapter", "File", "Artifact", "Workflow", "Person", "Deal", "Category", "Template"];

function Palette({ items, onClose }: { items: SearchItem[]; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const router = useRouter();
  const list = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const hit = words.length ? items.filter((x) => words.every((w) => `${x.type} ${x.title} ${x.sub}`.toLowerCase().includes(w))) : items.filter((x) => x.type === "Project" || x.type === "Category");
    return hit.sort((a, b) => ORDER.indexOf(a.type) - ORDER.indexOf(b.type)).slice(0, 40);
  }, [q, items]);
  const go = (i: number) => { const x = list[i]; if (x) { onClose(); router.push(x.href); } };
  const ref = useRef<HTMLUListElement>(null);
  useEffect(() => { ref.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" }); }, [sel]);

  return (
    <div className="fixed inset-0 z-modal flex items-start justify-center bg-[var(--color-overlay-bg)] px-space-4 pt-[12vh]" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label="Search" className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-xl">
        <input autoFocus value={q} onChange={(e) => { setQ(e.target.value); setSel(0); }} placeholder="Search projects, pages, files, artifacts, people, templates"
          onKeyDown={(e) => { if (e.key === "Escape") onClose(); else if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, list.length - 1)); } else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); } else if (e.key === "Enter") { e.preventDefault(); go(sel); } }}
          className="w-full border-b border-border bg-transparent px-space-4 py-space-3 text-base outline-none" />
        <ul ref={ref} className="max-h-[52vh] overflow-y-auto p-space-1">
          {list.length ? list.map((x, i) => (
            <li key={i}>
              <button aria-selected={i === sel} onMouseEnter={() => setSel(i)} onClick={() => go(i)} className={cn("grid w-full grid-cols-[80px_minmax(0,1fr)_auto] items-baseline gap-space-2 rounded-md px-space-2 py-1.5 text-left", i === sel && "bg-[hsl(var(--color-action-subtle-bg))]")}>
                <span className="font-mono text-xs text-muted-foreground">{x.type}</span>
                <span className="truncate text-sm font-medium">{x.title}</span>
                <span className="truncate text-xs text-muted-foreground">{x.sub}</span>
              </button>
            </li>
          )) : <li className="px-space-3 py-space-4 text-sm text-muted-foreground">Nothing matches.</li>}
        </ul>
        <div className="flex gap-space-4 border-t border-border px-space-4 py-space-2 font-mono text-xs text-muted-foreground"><span>↑↓ to move</span><span>Enter to open</span><span>Esc to close</span></div>
      </div>
    </div>
  );
}

