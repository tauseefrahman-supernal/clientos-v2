import "server-only";
import { db, dbEnabled } from "./db";

// Stella conversations in clientos.stella_chats / stella_messages, one set per signed-in user
// (created_by; null when sign-in is off). Chat ids are UUIDs made by the browser, so a chat can be
// shown before the server has saved it.

export type ChatMessage = { role: "user" | "assistant"; content: string; steps?: string[]; error?: string; at: number };
export type Chat = { id: string; project: string; title: string; messages: ChatMessage[]; updatedAt: number };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const validChatId = (id: unknown): id is string => typeof id === "string" && UUID.test(id);

async function accountId(slug: string): Promise<string | null> {
  const { data } = await db().from("accounts").select("id").eq("slug", slug).maybeSingle();
  return (data?.id as string) ?? null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mine = (q: any, userId: string | null) => (userId ? q.eq("created_by", userId) : q.is("created_by", null));

export async function listChats(userId: string | null): Promise<Chat[] | null> {
  if (!dbEnabled()) return null;
  const { data: chats, error } = await mine(db().from("stella_chats").select("id,title,updated_at,accounts(slug)"), userId).order("updated_at", { ascending: false }).limit(200);
  if (error) throw new Error(error.message);
  const ids = ((chats ?? []) as { id: string }[]).map((c) => c.id);
  const { data: msgs, error: e2 } = ids.length ? await db().from("stella_messages").select("chat_id,role,content,steps,error,created_at").in("chat_id", ids).order("created_at") : { data: [], error: null };
  if (e2) throw new Error(e2.message);
  const by = new Map<string, ChatMessage[]>();
  for (const m of msgs ?? []) {
    if (!by.has(m.chat_id)) by.set(m.chat_id, []);
    by.get(m.chat_id)!.push({ role: m.role, content: m.content, steps: m.steps ?? [], error: m.error ?? undefined, at: Date.parse(m.created_at) });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (chats ?? []).map((c: any) => ({ id: c.id, project: c.accounts?.slug ?? "", title: c.title, updatedAt: Date.parse(c.updated_at), messages: by.get(c.id) ?? [] }));
}

export async function createChat(id: string, project: string, userId: string | null, title = "New chat") {
  const aid = await accountId(project);
  if (!aid) throw new Error(`No project ${project}`);
  const { error } = await db().from("stella_chats").upsert({ id, account_id: aid, title, created_by: userId }, { onConflict: "id", ignoreDuplicates: true });
  if (error) throw new Error(error.message);
}

export async function deleteChat(id: string, userId: string | null) {
  const { error } = await mine(db().from("stella_chats").delete().eq("id", id), userId);
  if (error) throw new Error(error.message);
}

/** Save one question and its answer, and name the chat after its first question. */
export async function saveExchange(chatId: string, project: string, userId: string | null, question: string, answer: { content: string; steps: string[]; error?: string; usage?: unknown }) {
  if (!dbEnabled()) return;
  await createChat(chatId, project, userId, question.slice(0, 60));
  // Only write into a chat that belongs to this user.
  const { data: owned } = await mine(db().from("stella_chats").select("id").eq("id", chatId), userId).maybeSingle();
  if (!owned) throw new Error("This chat belongs to someone else.");
  const now = Date.now();
  const { error } = await db().from("stella_messages").insert([
    // Batch inserts send null for any column a row leaves out, so every row sets every column.
    { chat_id: chatId, role: "user", content: question, steps: [], error: null, usage: null, created_at: new Date(now).toISOString() },
    { chat_id: chatId, role: "assistant", content: answer.content, steps: answer.steps, error: answer.error ?? null, usage: answer.usage ?? null, created_at: new Date(now + 1).toISOString() },
  ]);
  if (error) throw new Error(error.message);
  const { data: chat } = await db().from("stella_chats").select("title").eq("id", chatId).single();
  await db().from("stella_chats").update({ updated_at: new Date().toISOString(), ...(chat?.title === "New chat" ? { title: question.slice(0, 60) } : {}) }).eq("id", chatId);
}
