"use client";

import { useSyncExternalStore } from "react";
import { noRef, splitEvidence, stripHistory, type Evidence } from "@/lib/stella/evidence";

// Stella conversations, one store shared by the Stella chat page and the side drawer.
// With Supabase configured the server holds the chats (/api/chats) and saves each answer;
// otherwise they are kept in this browser's storage. A chat's scope is the projects it asks
// about: project slugs, or ["*"] for all of them.

export type ChatDocument = { id: string; title: string; content: string; projects: string[]; kind: "written" | "export" };
/** A file attached to a question. Text files keep their text; a PDF keeps its data only until it is sent. */
export type ChatFile = { name: string; kind: "text" | "pdf"; size: number; text?: string; data?: string };
export type ChatMessage = { role: "user" | "assistant"; content: string; steps?: string[]; error?: string; pending?: boolean; documents?: ChatDocument[]; attachments?: ChatFile[]; evidence?: Evidence[]; at: number };
export type Chat = { id: string; scope: string[]; title: string; messages: ChatMessage[]; updatedAt: number };

export const ALL = "*";
const KEY = "clientos.stella.chats.v2";
const OLD_KEY = "clientos.stella.chats.v1";
let chats: Chat[] = [];
let loaded = false;
let mode: "server" | "local" = "local";
const creating = new Map<string, Promise<unknown>>();
const listeners = new Set<() => void>();
const EMPTY: Chat[] = [];

function readLocal(): Chat[] {
  try {
    const now = JSON.parse(localStorage.getItem(KEY) || "null");
    if (Array.isArray(now)) return now;
    // v1 chats had one project
    const old = JSON.parse(localStorage.getItem(OLD_KEY) || "[]") as (Chat & { project?: string })[];
    return old.map(({ project, ...c }) => ({ ...c, scope: c.scope ?? (project ? [project] : []) }));
  } catch { return []; }
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  chats = readLocal().map((c) => ({ ...c, messages: c.messages.map((m) => (m.pending ? clean({ ...m, pending: false, error: m.content ? undefined : "Interrupted before Stella answered." }) : m)) }));
  fetch("/api/chats").then((r) => r.json()).then((j: { enabled: boolean; chats: Chat[] }) => {
    if (!j.enabled) return;
    mode = "server";
    chats = j.chats;
    listeners.forEach((l) => l());
  }).catch(() => { /* stay on browser storage */ });
}
function persist() {
  if (mode === "local") {
    // PDFs are not kept in browser storage
    const slim = chats.slice(0, 200).map((c) => ({ ...c, messages: c.messages.map((m) => (m.attachments ? { ...m, attachments: m.attachments.map(stripData) } : m)) }));
    try { localStorage.setItem(KEY, JSON.stringify(slim)); } catch { /* storage full or blocked */ }
  }
  listeners.forEach((l) => l());
}

/** An answer's text without its evidence block; evidence the server sent is kept, else what the block held (unresolved). */
function clean(m: ChatMessage): ChatMessage {
  if (m.role !== "assistant") return m;
  const { answer, evidence } = splitEvidence(m.content);
  return { ...m, content: answer, evidence: m.evidence?.length ? m.evidence : evidence.length ? evidence.map((e) => ({ ...e, ref: noRef() })) : undefined };
}

const stripData = (a: ChatFile): ChatFile => ({ name: a.name, kind: a.kind, size: a.size, ...(a.text !== undefined ? { text: a.text } : {}) });

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (Number(c) ^ (Math.random() * 16) >> (Number(c) / 4)).toString(16));
}

export function useChats(): Chat[] {
  return useSyncExternalStore(
    (l) => { load(); listeners.add(l); return () => listeners.delete(l); },
    () => { load(); return chats; },
    () => EMPTY,
  );
}

export function newChat(scope: string[]): Chat {
  load();
  const c: Chat = { id: uuid(), scope, title: "New chat", messages: [], updatedAt: Date.now() };
  chats = [c, ...chats];
  if (mode === "server") creating.set(c.id, fetch("/api/chats", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: c.id, scope }) }).catch(() => undefined));
  persist();
  return c;
}

export function updateChat(id: string, fn: (c: Chat) => Chat) {
  chats = chats.map((c) => (c.id === id ? fn(c) : c)).sort((a, b) => b.updatedAt - a.updatedAt);
  persist();
}

/** Change which projects a chat asks about; applies from the next question. */
export function setScope(id: string, scope: string[]) {
  if (!scope.length) return;
  chats = chats.map((c) => (c.id === id ? { ...c, scope } : c));
  if (mode === "server") fetch("/api/chats", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, scope }) }).catch(() => undefined);
  persist();
}

export function deleteChat(id: string) {
  chats = chats.filter((c) => c.id !== id);
  if (mode === "server") fetch(`/api/chats/${id}`, { method: "DELETE" }).catch(() => undefined);
  persist();
}

/** Send a question (with any attached files) in a chat and stream Stella's answer into it. */
export async function ask(chatId: string, text: string, files: ChatFile[] = []) {
  const chat = chats.find((c) => c.id === chatId);
  if (!chat || !text.trim()) return;
  const question: ChatMessage = { role: "user", content: text.trim(), attachments: files.length ? files : undefined, at: Date.now() };
  const history = [...chat.messages.filter((m) => !m.error), question];
  updateChat(chatId, (c) => ({ ...c, title: c.messages.length ? c.title : text.trim().slice(0, 60), messages: [...c.messages, question, { role: "assistant", content: "", steps: [], documents: [], pending: true, at: Date.now() }], updatedAt: Date.now() }));
  const patch = (fn: (m: ChatMessage) => ChatMessage) => updateChat(chatId, (c) => ({ ...c, messages: [...c.messages.slice(0, -1), fn(c.messages[c.messages.length - 1])] }));
  try {
    await creating.get(chatId);
    const body = {
      scope: chat.scope,
      chatId: mode === "server" ? chatId : undefined,
      // Evidence stays in the browser: it is not sent back to Stella
      messages: stripHistory(history).map(({ role, content, attachments }) => ({ role, content, attachments: attachments?.map(({ name, kind, text, data }) => ({ name, kind, text, data })) })),
    };
    const res = await fetch("/api/stella", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok || !res.body) { const t = await res.text().catch(() => ""); patch((m) => ({ ...m, error: t || `Request failed (${res.status})` })); return; }
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines.filter(Boolean)) {
        const ev = JSON.parse(line);
        if (ev.type === "text") patch((m) => ({ ...m, content: m.content + ev.delta }));
        else if (ev.type === "reset") patch((m) => ({ ...m, content: "" }));
        else if (ev.type === "tool") patch((m) => ({ ...m, steps: [...(m.steps ?? []), ev.summary] }));
        else if (ev.type === "document") patch((m) => ({ ...m, documents: [...(m.documents ?? []), ev.doc] }));
        else if (ev.type === "evidence") patch((m) => ({ ...m, evidence: ev.items }));
        else if (ev.type === "error") patch((m) => ({ ...m, error: ev.message }));
        else if (ev.type === "saved" && !ev.ok) patch((m) => ({ ...m, steps: [...(m.steps ?? []), `not saved: ${ev.error}`] }));
      }
    }
  } catch (e) {
    patch((m) => ({ ...m, error: e instanceof Error ? e.message : String(e) }));
  } finally {
    patch((m) => clean({ ...m, pending: false }));
    // A PDF is read once; drop its data from the question so it is not sent again
    updateChat(chatId, (c) => ({ ...c, messages: c.messages.map((m) => (m === question || (m.at === question.at && m.role === "user")) && m.attachments ? { ...m, attachments: m.attachments.map(stripData) } : m) }));
  }
}

/** Read files picked by the user into attachments: text as text, PDFs as base64. */
export async function readFiles(list: FileList | File[]): Promise<{ files: ChatFile[]; skipped: string[] }> {
  const files: ChatFile[] = [], skipped: string[] = [];
  for (const f of Array.from(list).slice(0, 5)) {
    const isPdf = f.type === "application/pdf" || /\.pdf$/i.test(f.name);
    const isText = /^text\//.test(f.type) || /\.(md|markdown|txt|csv|json|tsv|html?)$/i.test(f.name);
    if (isPdf && f.size <= 6_000_000) {
      const buf = new Uint8Array(await f.arrayBuffer());
      let bin = "";
      for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
      files.push({ name: f.name, kind: "pdf", size: f.size, data: btoa(bin) });
    } else if (isText && f.size <= 300_000) files.push({ name: f.name, kind: "text", size: f.size, text: await f.text() });
    else skipped.push(f.name);
  }
  return { files, skipped };
}
