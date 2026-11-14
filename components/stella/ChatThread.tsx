"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowUp, AudioLines, ChevronDown, ChevronRight, FileText, Mic, Paperclip, Search, Sparkles, Square, Volume2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ask, newChat, readFiles, type Chat, type ChatFile } from "./store";
import { DocumentCard } from "./DocumentCard";
import type { PickProject } from "./ScopePicker";
import { useVoice } from "./useVoice";

const SOURCE = /\[((?:File|Book|Account)[^\]]+|[^\]|]+ · (?:File|Book|Account)[^\]]+)\]/g;
const kb = (n: number) => (n > 1_000_000 ? `${(n / 1_000_000).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1000))} KB`);

/** A conversation and its composer. Used full-width on the Stella chat page and narrow in the drawer. */
export function ChatThread({ chat, scope, scopeName, projects, suggestions = [], compact = false, prefill, onStarted }: {
  chat: Chat | null; scope: string[]; scopeName: string; projects: PickProject[]; suggestions?: string[]; compact?: boolean; prefill?: string; onStarted?: (id: string) => void;
}) {
  const messages = chat?.messages ?? [];
  const busy = !!messages[messages.length - 1]?.pending;
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<ChatFile[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [voiceMode, setVoiceMode] = useState(false);
  const [dragging, setDragging] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLTextAreaElement>(null);
  const picker = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const spokenFor = useRef<string | null>(null);

  const voice = useVoice({ onFinal: (text) => { if (voiceMode) send(text); else setInput((v) => (v ? `${v} ${text}` : text)); } });

  useEffect(() => { if (prefill) { setInput(prefill); box.current?.focus(); } }, [prefill]);
  // Follow the answer as it streams, unless the reader has scrolled up.
  useEffect(() => {
    const el = scroller.current;
    if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 160) end.current?.scrollIntoView({ block: "end" });
  }, [chat?.messages]);
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [chat?.id]);
  useEffect(() => { box.current?.focus(); }, [chat?.id]);
  useEffect(() => { const el = box.current; if (el) { el.style.height = "auto"; el.style.height = `${Math.min(el.scrollHeight, 200)}px`; } }, [input]);

  // Voice mode: read each finished answer aloud, then listen for the next question.
  const last = messages[messages.length - 1];
  useEffect(() => {
    if (!voiceMode || !last || last.role !== "assistant" || last.pending) return;
    const key = `${chat?.id}:${messages.length}`;
    if (spokenFor.current === key) return;
    spokenFor.current = key;
    const docs = last.documents?.length ? ` I also made ${last.documents.length === 1 ? "a document" : `${last.documents.length} documents`}: ${last.documents.map((d) => d.title).join(", ")}.` : "";
    voice.speak((last.error ? `Something went wrong: ${last.error}` : last.content) + docs, () => voice.listen());
  }, [voiceMode, last, messages.length, chat?.id, voice]);

  async function addFiles(list: FileList | File[] | null) {
    if (!list?.length) return;
    const { files: got, skipped } = await readFiles(list);
    setFiles((f) => [...f, ...got].slice(0, 5));
    setNote(skipped.length ? `Not attached: ${skipped.join(", ")}. Stella reads PDFs up to 6 MB and text, markdown, CSV or JSON files up to 300 KB.` : null);
  }

  async function send(text: string) {
    if (!text.trim() || busy) return;
    const attach = files;
    setInput(""); setFiles([]); setNote(null);
    // A chat is only created when the first question is sent, so empty chats never pile up.
    const id = chat?.id ?? newChat(scope).id;
    if (!chat) onStarted?.(id);
    await ask(id, text, attach);
  }

  function toggleVoiceMode() {
    if (voiceMode) { setVoiceMode(false); voice.stopSpeaking(); voice.stopListening(); return; }
    setVoiceMode(true);
    spokenFor.current = `${chat?.id}:${messages.length}`; // don't re-read the last answer
    voice.listen();
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col"
      onDragOver={(e) => { if (e.dataTransfer.types.includes("Files")) { e.preventDefault(); setDragging(true); } }}
      onDragLeave={(e) => { if (e.currentTarget === e.target) setDragging(false); }}
      onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}>
      {dragging && <div className="pointer-events-none absolute inset-2 z-20 flex items-center justify-center rounded-xl border-2 border-dashed border-primary bg-background/80 text-sm font-medium">Drop files to attach them</div>}
      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto">
        <div className={cn("mx-auto flex flex-col gap-space-5 py-space-5", compact ? "px-space-4" : "max-w-[760px] px-space-6")}>
          {!messages.length && (
            <div className="flex flex-col gap-space-3 pt-space-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--color-action-subtle-bg))]"><Sparkles className="h-4 w-4 text-primary" /></span>
              <h2 className={cn("font-display font-semibold", compact ? "text-lg" : "text-2xl")}>Ask about {scopeName}</h2>
              <p className="max-w-[60ch] text-sm text-muted-foreground">I answer from the vaults, books and account data of the projects you choose, cite every source, and say when something isn’t recorded. Attach files, ask me to write a document or export a project’s context, or talk to me.</p>
              {suggestions.length > 0 && <div className="flex flex-col gap-1 pt-space-2">{suggestions.map((s) => <button key={s} onClick={() => send(s)} className="rounded-lg border border-border bg-card px-space-3 py-space-2 text-left text-sm hover:border-primary hover:bg-muted/40">{s}</button>)}</div>}
            </div>
          )}
          {messages.map((m, i) => m.role === "user" ? (
            <div key={i} className="flex max-w-[85%] flex-col items-end gap-1 self-end">
              {!!m.attachments?.length && <div className="flex flex-wrap justify-end gap-1">{m.attachments.map((a) => <span key={a.name} className="flex items-center gap-1 rounded-md border border-border bg-card px-space-2 py-0.5 text-xs"><FileText className="h-3 w-3" />{a.name}</span>)}</div>}
              <div className="whitespace-pre-wrap rounded-2xl bg-muted px-space-4 py-space-2 text-sm">{m.content}</div>
            </div>
          ) : (
            <div key={i} className="flex flex-col gap-space-2">
              {!!m.steps?.length && <Steps steps={m.steps} live={!!m.pending && !m.content} />}
              {m.pending && !m.content && !m.error && !m.steps?.length && <span className="text-sm text-muted-foreground">Reading the vault…</span>}
              {m.content && <div className="prose-vault stella-answer text-[15px]"><ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content.replace(SOURCE, " `$1`")}</ReactMarkdown></div>}
              {m.documents?.map((d) => <DocumentCard key={d.id} doc={d} projects={projects} defaultOpen={!compact && d.kind === "written"} />)}
              {m.content && !m.pending && voice.supported.speak && (
                <button type="button" onClick={() => (voice.speaking ? voice.stopSpeaking() : voice.speak(m.content))} className="flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <Volume2 className="h-3.5 w-3.5" />{voice.speaking ? "Stop reading" : "Read aloud"}
                </button>
              )}
              {m.error && <p className="rounded-md border border-[hsl(var(--color-status-error-border))] bg-[hsl(var(--color-status-error-bg))] px-space-3 py-space-2 text-xs text-[hsl(var(--color-status-error-text))]">{/api.?key|authentication/i.test(m.error) ? "Stella has no Claude API key. Add ANTHROPIC_API_KEY to .env.local and restart the dev server." : m.error}</p>}
            </div>
          ))}
          <div ref={end} />
        </div>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className={cn("shrink-0 border-t border-border bg-background py-space-3", compact ? "px-space-3" : "px-space-6")}>
        <div className={cn("mx-auto flex flex-col gap-space-2", !compact && "max-w-[760px]")}>
          {voiceMode && (
            <div className="flex items-center gap-space-2 rounded-lg border border-primary bg-[hsl(var(--color-action-subtle-bg))] px-space-3 py-space-2 text-sm">
              <AudioLines className={cn("h-4 w-4 text-primary", (voice.listening || voice.speaking) && "animate-pulse")} />
              <span className="min-w-0 flex-1 truncate">{voice.listening ? (voice.interim || "Listening…") : voice.speaking ? "Stella is speaking…" : busy ? "Stella is thinking…" : "Voice mode"}</span>
              {voice.speaking && <button type="button" onClick={() => { voice.stopSpeaking(); voice.listen(); }} className="text-xs underline">Skip</button>}
              <button type="button" onClick={toggleVoiceMode} className="rounded-md border border-border bg-background px-space-2 py-0.5 text-xs">End voice</button>
            </div>
          )}
          {(files.length > 0 || note || voice.error) && (
            <div className="flex flex-wrap items-center gap-1">
              {files.map((f, i) => (
                <span key={`${f.name}-${i}`} className="flex items-center gap-1 rounded-md border border-border bg-card px-space-2 py-0.5 text-xs">
                  <FileText className="h-3 w-3" />{f.name}<span className="text-muted-foreground">{f.kind === "pdf" ? "PDF" : "text"} · {kb(f.size)}</span>
                  <button type="button" aria-label={`Remove ${f.name}`} onClick={() => setFiles((all) => all.filter((_, j) => j !== i))} className="rounded p-0.5 hover:bg-muted"><X className="h-3 w-3" /></button>
                </span>
              ))}
              {(note || voice.error) && <span className="text-xs text-[hsl(var(--color-status-warning-text))]">{note ?? voice.error}</span>}
            </div>
          )}
          <div className="flex items-end gap-space-1 rounded-2xl border border-input bg-card px-space-2 py-space-2 shadow-sm focus-within:border-primary">
            <input ref={picker} type="file" multiple accept=".pdf,.md,.markdown,.txt,.csv,.json,.tsv,.html,application/pdf,text/*" className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
            <button type="button" title="Attach files (PDF, markdown, text, CSV)" aria-label="Attach files" onClick={() => picker.current?.click()} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"><Paperclip className="h-4 w-4" /></button>
            <textarea ref={box} value={voice.listening && !voiceMode ? `${input}${input ? " " : ""}${voice.interim}` : input} onChange={(e) => setInput(e.target.value)} rows={1}
              placeholder={voice.listening ? "Listening…" : `Ask Stella about ${scopeName}`} aria-label="Message Stella"
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              onPaste={(e) => { if (e.clipboardData.files.length) { e.preventDefault(); addFiles(e.clipboardData.files); } }}
              className="max-h-[200px] min-h-[24px] flex-1 resize-none bg-transparent px-1 py-1 text-sm outline-none" />
            {voice.supported.listen && !voiceMode && (
              <button type="button" title={voice.listening ? "Stop dictation" : "Dictate"} aria-label={voice.listening ? "Stop dictation" : "Dictate"} onClick={() => (voice.listening ? voice.stopListening() : voice.listen())}
                className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-muted", voice.listening ? "text-[hsl(var(--color-status-error-text))]" : "text-muted-foreground hover:text-foreground")}>
                {voice.listening ? <Square className="h-3.5 w-3.5 fill-current" /> : <Mic className="h-4 w-4" />}
              </button>
            )}
            {voice.supported.listen && voice.supported.speak && !voiceMode && (
              <button type="button" title="Voice mode: talk with Stella hands-free" aria-label="Start voice mode" onClick={toggleVoiceMode} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"><AudioLines className="h-4 w-4" /></button>
            )}
            <button disabled={busy || !input.trim()} aria-label="Send" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"><ArrowUp className="h-4 w-4" /></button>
          </div>
          {!compact && <p className="text-center text-xs text-muted-foreground">Enter to send · Shift+Enter for a new line · drop or paste files to attach</p>}
        </div>
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
