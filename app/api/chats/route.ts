import { createChat, listChats, setChatScope, validChatId } from "@/lib/data/chats";
import { currentUser } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

// GET: every saved chat with its messages, or { enabled: false } when Supabase is not configured.
export async function GET() {
  try {
    const chats = await listChats((await currentUser())?.id ?? null);
    return Response.json(chats ? { enabled: true, chats } : { enabled: false, chats: [] });
  } catch (e) {
    return Response.json({ enabled: false, chats: [], error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

// POST { id, scope }: start a chat (id is a UUID made by the browser). PATCH { id, scope }: change its projects.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const scope = Array.isArray(body.scope) ? body.scope : typeof body.project === "string" ? [body.project] : [];
  if (!validChatId(body.id) || !scope.length) return new Response("id (uuid) and scope are required.", { status: 400 });
  try { await createChat(body.id, scope, (await currentUser())?.id ?? null); return Response.json({ ok: true }); }
  catch (e) { return new Response(e instanceof Error ? e.message : String(e), { status: 500 }); }
}

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (!validChatId(body.id) || !Array.isArray(body.scope)) return new Response("id (uuid) and scope are required.", { status: 400 });
  try { await setChatScope(body.id, body.scope, (await currentUser())?.id ?? null); return Response.json({ ok: true }); }
  catch (e) { return new Response(e instanceof Error ? e.message : String(e), { status: 500 }); }
}
