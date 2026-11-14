"use client";

import { useSyncExternalStore } from "react";

// Stella conversations, one store shared by the Stella page and the side drawer.
// With Supabase configured the server holds the chats (/api/chats) and saves each answer;
// otherwise they are kept in this browser's storage.

export type ChatMessage = { role: "user" | "assistant"; content: string; steps?: string[]; error?: string; pending?: boolean; at: number };
export type Chat = { id: string; project: string; title: string; messages: ChatMessage[]; updatedAt: number };

const KEY = "clientos.stella.chats.v1";
let chats: Chat[] = [];
let loaded = false;
let mode: "server" | "local" = "local";
const creating = new Map<string, Promise<unknown>>();
const listeners = new Set<() => void>();
const EMPTY: Chat[] = [];

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { chats = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { chats = []; }
  fetch("/api/chats").then((r) => r.json()).then((j: { enabled: boolean; chats: Chat[] }) => {
    if (!j.enabled) return;
    mode = "server";
    chats = j.chats;
    listeners.forEach((l) => l());
  }).catch(() => { /* stay on browser storage */ });
  chats = chats.map((c) => ({ ...c, messages: c.messages.map((m) => (m.pending ? { ...m, pending: false, error: m.content ? undefined : "Interrupted before Stella answered." } : m)) }));
}
function persist() {
  if (mode === "local") { try { localStorage.setItem(KEY, JSON.stringify(chats.slice(0, 200))); } catch { /* storage full or blocked */ } }
  listeners.forEach((l) => l());
}

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

export function newChat(project: string): Chat {
  load();
  const c: Chat = { id: uuid(), project, title: "New chat", messages: [], updatedAt: Date.now() };
  chats = [c, ...chats];
  if (mode === "server") creating.set(c.id, fetch("/api/chats", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: c.id, project }) }).catch(() => undefined));
  persist();
  return c;
}

export function updateChat(id: string, fn: (c: Chat) => Chat) {
  chats = chats.map((c) => (c.id === id ? fn(c) : c)).sort((a, b) => b.updatedAt - a.updatedAt);
  persist();
}

export function deleteChat(id: string) {
  chats = chats.filter((c) => c.id !== id);
  if (mode === "server") fetch(`/api/chats/${id}`, { method: "DELETE" }).catch(() => undefined);
  persist();
}

/** Send a question in a chat and stream Stella's answer into it. */
export async function ask(chatId: string, text: string) {
  const chat = chats.find((c) => c.id === chatId);
  if (!chat || !text.trim()) return;
  const question: ChatMessage = { role: "user", content: text.trim(), at: Date.now() };
  const history = [...chat.messages.filter((m) => !m.error), question];
  updateChat(chatId, (c) => ({ ...c, title: c.messages.length ? c.title : text.trim().slice(0, 60), messages: [...c.messages, question, { role: "assistant", content: "", steps: [], pending: true, at: Date.now() }], updatedAt: Date.now() }));
  const patch = (fn: (m: ChatMessage) => ChatMessage) => updateChat(chatId, (c) => ({ ...c, messages: [...c.messages.slice(0, -1), fn(c.messages[c.messages.length - 1])] }));
  try {
    await creating.get(chatId);
    const res = await fetch("/api/stella", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: chat.project, chatId: mode === "server" ? chatId : undefined, messages: history.map(({ role, content }) => ({ role, content })) }) });
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
        else if (ev.type === "error") patch((m) => ({ ...m, error: ev.message }));
        else if (ev.type === "saved" && !ev.ok) patch((m) => ({ ...m, steps: [...(m.steps ?? []), `not saved: ${ev.error}`] }));
      }
    }
  } catch (e) {
    patch((m) => ({ ...m, error: e instanceof Error ? e.message : String(e) }));
  } finally {
    patch((m) => ({ ...m, pending: false }));
  }
}
