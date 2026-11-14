import "server-only";
import { db, dbEnabled } from "./db";

// Stella conversations in clientos.stella_chats / stella_messages, one set per signed-in user
// (created_by; null when sign-in is off). A chat's scope is the projects it asks about: slugs, or
// ["*"] for all. Chat ids are UUIDs made by the browser, so a chat shows before it is saved.

export type ChatDocument = { id: string; title: string; content: string; projects: string[]; kind: "written" | "export" };
export type ChatFile = { name: string; kind: "text" | "pdf"; size: number; text?: string };
export type ChatMessage = { role: "user" | "assistant"; content: string; steps?: string[]; error?: string; documents?: ChatDocument[]; attachments?: ChatFile[]; at: number };
export type Chat = { id: string; scope: string[]; title: string; messages: ChatMessage[]; updatedAt: number };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const validChatId = (id: unknown): id is string => typeof id === "string" && UUID.test(id);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mine = (q: any, userId: string | null) => (userId ? q.eq("created_by", userId) : q.is("created_by", null));

/** One project's id, kept on the chat for joins; null for multi-project chats. */
async function primaryAccount(scope: string[]): Promise<string | null> {
  if (scope.length !== 1 || scope[0] === "*") return null;
  const { data } = await db().from("accounts").select("id").eq("slug", scope[0]).maybeSingle();
  return (data?.id as string) ?? null;
}

const cleanScope = (scope: unknown): string[] => (Array.isArray(scope) ? scope.filter((x): x is string => typeof x === "string" && x.length < 120).slice(0, 100) : []);

export async function listChats(userId: string | null): Promise<Chat[] | null> {
  if (!dbEnabled()) return null;
  const { data: chats, error } = await mine(db().from("stella_chats").select("id,title,scope,updated_at,accounts(slug)"), userId).order("updated_at", { ascending: false }).limit(200);
  if (error) throw new Error(error.message);
  const ids = ((chats ?? []) as { id: string }[]).map((c) => c.id);
  const { data: msgs, error: e2 } = ids.length ? await db().from("stella_messages").select("chat_id,role,content,steps,error,documents,attachments,created_at").in("chat_id", ids).order("created_at") : { data: [], error: null };
  if (e2) throw new Error(e2.message);
  const by = new Map<string, ChatMessage[]>();
  for (const m of msgs ?? []) {
    if (!by.has(m.chat_id)) by.set(m.chat_id, []);
    by.get(m.chat_id)!.push({ role: m.role, content: m.content, steps: m.steps ?? [], error: m.error ?? undefined, documents: m.documents ?? [], attachments: m.attachments ?? [], at: Date.parse(m.created_at) });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (chats ?? []).map((c: any) => ({ id: c.id, scope: c.scope?.length ? c.scope : c.accounts?.slug ? [c.accounts.slug] : [], title: c.title, updatedAt: Date.parse(c.updated_at), messages: by.get(c.id) ?? [] }));
}

export async function createChat(id: string, scopeIn: unknown, userId: string | null, title = "New chat") {
  const scope = cleanScope(scopeIn);
  if (!scope.length) throw new Error("A chat needs at least one project.");
  const { error } = await db().from("stella_chats").upsert({ id, account_id: await primaryAccount(scope), scope, title, created_by: userId }, { onConflict: "id", ignoreDuplicates: true });
  if (error) throw new Error(error.message);
}

export async function setChatScope(id: string, scopeIn: unknown, userId: string | null) {
  const scope = cleanScope(scopeIn);
  if (!scope.length) throw new Error("A chat needs at least one project.");
  const { error } = await mine(db().from("stella_chats").update({ scope, account_id: await primaryAccount(scope) }).eq("id", id), userId);
  if (error) throw new Error(error.message);
}

export async function deleteChat(id: string, userId: string | null) {
  const { error } = await mine(db().from("stella_chats").delete().eq("id", id), userId);
  if (error) throw new Error(error.message);
}

/** Save one question and its answer, and name the chat after its first question. */
export async function saveExchange(chatId: string, scope: string[], userId: string | null, question: string, attachments: ChatFile[],
  answer: { content: string; steps: string[]; error?: string; usage?: unknown; documents: ChatDocument[] }) {
  if (!dbEnabled()) return;
  await createChat(chatId, scope, userId, question.slice(0, 60));
  // Only write into a chat that belongs to this user.
  const { data: owned } = await mine(db().from("stella_chats").select("id,title").eq("id", chatId), userId).maybeSingle();
  if (!owned) throw new Error("This chat belongs to someone else.");
  const now = Date.now();
  // Batch inserts send null for any column a row leaves out, so every row sets every column.
  const { error } = await db().from("stella_messages").insert([
    { chat_id: chatId, role: "user", content: question, steps: [], error: null, usage: null, documents: [], attachments, created_at: new Date(now).toISOString() },
    { chat_id: chatId, role: "assistant", content: answer.content, steps: answer.steps, error: answer.error ?? null, usage: answer.usage ?? null, documents: answer.documents, attachments: [], created_at: new Date(now + 1).toISOString() },
  ]);
  if (error) throw new Error(error.message);
  await db().from("stella_chats").update({ updated_at: new Date().toISOString(), scope, account_id: await primaryAccount(scope), ...(owned.title === "New chat" ? { title: question.slice(0, 60) } : {}) }).eq("id", chatId);
}
