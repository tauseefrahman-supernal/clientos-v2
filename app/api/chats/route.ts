import { createChat, listChats, validChatId } from "@/lib/data/chats";
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

// POST { id, project }: start a chat (id is a UUID made by the browser).
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (!validChatId(body.id) || typeof body.project !== "string") return new Response("id (uuid) and project are required.", { status: 400 });
  try { await createChat(body.id, body.project, (await currentUser())?.id ?? null); return Response.json({ ok: true }); }
  catch (e) { return new Response(e instanceof Error ? e.message : String(e), { status: 500 }); }
}
