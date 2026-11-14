"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Maximize2, MessageSquarePlus, Sparkles, X } from "lucide-react";
import { ChatThread } from "@/components/stella/ChatThread";
import { useChats } from "@/components/stella/store";

// Side drawer: the latest Stella chat for the open project. Same chats as the Stella page.
export function StellaDrawer({ project, projectName, prompt, onClose }: { project: string | null; projectName: string | null; prompt?: string; onClose: () => void }) {
  const chats = useChats();
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => { setActive(chats.find((c) => c.project === project && c.messages.length)?.id ?? null); }, [project]); // eslint-disable-line react-hooks/exhaustive-deps
  const chat = chats.find((c) => c.id === active) ?? null;

  return (
    <aside className="flex w-[420px] shrink-0 flex-col border-l border-border bg-card">
      <div className="flex items-center gap-space-1 border-b border-border px-space-3 py-space-2">
        <span className="mr-auto flex min-w-0 items-center gap-space-2 text-sm font-semibold"><Sparkles className="h-4 w-4 shrink-0 text-primary" /><span className="truncate">{chat ? chat.title : "Stella"}</span></span>
        {project && <button onClick={() => setActive(null)} title="New chat" aria-label="New chat" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"><MessageSquarePlus className="h-4 w-4" /></button>}
        <Link href={chat ? `/stella?chat=${chat.id}` : project ? `/stella?project=${project}` : "/stella"} title="Open full chat" aria-label="Open full chat" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"><Maximize2 className="h-4 w-4" /></Link>
        <button onClick={onClose} title="Close" aria-label="Close Stella" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
      </div>
      {project ? (
        <ChatThread key={chat?.id ?? `new-${project}`} chat={chat} project={project} projectName={projectName ?? project} compact prefill={prompt} onStarted={setActive} />
      ) : (
        <div className="flex flex-1 flex-col items-start gap-space-3 p-space-4 text-sm text-muted-foreground">
          <p>Open a project and I’ll answer from its vault, book and account data.</p>
          <Link href="/stella" className="rounded-md bg-primary px-space-3 py-1.5 text-sm font-medium text-primary-foreground no-underline">Open Stella chats</Link>
        </div>
      )}
    </aside>
  );
}
