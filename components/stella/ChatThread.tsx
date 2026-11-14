"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowUp, ChevronDown, ChevronRight, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ask, newChat, type Chat } from "./store";

const SOURCE = /\[((?:File|Book|Account)[^\]]+|[^\]|]+ · (?:File|Book|Account)[^\]]+)\]/g;

/** A conversation and its composer. Used full-width on the Stella page and narrow in the drawer. */
export function ChatThread({ chat, project, projectName, suggestions = [], compact = false, prefill, onStarted }: { chat: Chat | null; project: string; projectName: string; suggestions?: string[]; compact?: boolean; prefill?: string; onStarted?: (id: string) => void }) {
  const messages = chat?.messages ?? [];
  const busy = !!messages[messages.length - 1]?.pending;
  const [input, setInput] = useState("");
  const end = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { if (prefill) { setInput(prefill); box.current?.focus(); } }, [prefill]);
  const scroller = useRef<HTMLDivElement>(null);
  // Follow the answer as it streams, unless the reader has scrolled up.
  useEffect(() => {
    const el = scroller.current;
    if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 160) end.current?.scrollIntoView({ block: "end" });
  }, [chat?.messages]);
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [chat?.id]);
  useEffect(() => { box.current?.focus(); }, [chat?.id]);
  useEffect(() => { const el = box.current; if (el) { el.style.height = "auto"; el.style.height = `${Math.min(el.scrollHeight, 200)}px`; } }, [input]);

  async function send(text: string) {
    if (!text.trim() || busy) return;
    setInput("");
    // A chat is only created when the first question is sent, so empty chats never pile up.
    const id = chat?.id ?? newChat(project).id;
    if (!chat) onStarted?.(id);
    await ask(id, text);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto">
        <div className={cn("mx-auto flex flex-col gap-space-5 py-space-5", compact ? "px-space-4" : "max-w-[760px] px-space-6")}>
          {!messages.length && (
            <div className="flex flex-col gap-space-3 pt-space-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--color-action-subtle-bg))]"><Sparkles className="h-4 w-4 text-primary" /></span>
              <h2 className={cn("font-display font-semibold", compact ? "text-lg" : "text-2xl")}>Ask about {projectName}</h2>
              <p className="max-w-[60ch] text-sm text-muted-foreground">I answer from this project’s vault, book and account data, cite every source, and say when something isn’t recorded.</p>
              {suggestions.length > 0 && <div className="flex flex-col gap-1 pt-space-2">{suggestions.map((s) => <button key={s} onClick={() => send(s)} className="rounded-lg border border-border bg-card px-space-3 py-space-2 text-left text-sm hover:border-primary hover:bg-muted/40">{s}</button>)}</div>}
            </div>
          )}
          {messages.map((m, i) => m.role === "user" ? (
            <div key={i} className="max-w-[85%] self-end whitespace-pre-wrap rounded-2xl bg-muted px-space-4 py-space-2 text-sm">{m.content}</div>
          ) : (
            <div key={i} className="flex flex-col gap-space-2">
              {!!m.steps?.length && <Steps steps={m.steps} live={!!m.pending && !m.content} />}
              {m.pending && !m.content && !m.error && !m.steps?.length && <span className="text-sm text-muted-foreground">Reading the vault…</span>}
              {m.content && <div className="prose-vault stella-answer text-[15px]"><ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content.replace(SOURCE, " `$1`")}</ReactMarkdown></div>}
              {m.error && <p className="rounded-md border border-[hsl(var(--color-status-error-border))] bg-[hsl(var(--color-status-error-bg))] px-space-3 py-space-2 text-xs text-[hsl(var(--color-status-error-text))]">{/api.?key|authentication/i.test(m.error) ? "Stella has no Claude API key. Add ANTHROPIC_API_KEY to .env.local and restart the dev server." : m.error}</p>}
            </div>
          ))}
          <div ref={end} />
        </div>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className={cn("shrink-0 border-t border-border bg-background py-space-3", compact ? "px-space-3" : "px-space-6")}>
        <div className={cn("mx-auto flex items-end gap-space-2 rounded-2xl border border-input bg-card px-space-3 py-space-2 shadow-sm focus-within:border-primary", !compact && "max-w-[760px]")}>
          <textarea ref={box} value={input} onChange={(e) => setInput(e.target.value)} rows={1} placeholder={`Ask Stella about ${projectName}`} aria-label="Message Stella"
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            className="max-h-[200px] min-h-[24px] flex-1 resize-none bg-transparent py-1 text-sm outline-none" />
          <button disabled={busy || !input.trim()} aria-label="Send" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"><ArrowUp className="h-4 w-4" /></button>
        </div>
        {!compact && <p className="mx-auto mt-1 max-w-[760px] text-center text-xs text-muted-foreground">Enter to send · Shift+Enter for a new line</p>}
      </form>
    </div>
  );
}

function Steps({ steps, live }: { steps: string[]; live: boolean }) {
  const [open, setOpen] = useState(false);
  const show = open || live;
  return (
    <div className="text-xs text-muted-foreground">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1 hover:text-foreground">{show ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}{live ? "Searching" : `Looked at ${steps.length} source${steps.length === 1 ? "" : "s"}`}</button>
      {show && <ul className="mt-1 flex flex-col gap-0.5 border-l border-border pl-space-3">{steps.map((s, j) => <li key={j} className="flex items-center gap-1 font-mono"><Search className="h-3 w-3 shrink-0" />{s}</li>)}</ul>}
    </div>
  );
}
