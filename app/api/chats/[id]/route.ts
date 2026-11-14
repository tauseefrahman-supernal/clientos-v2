import { deleteChat, validChatId } from "@/lib/data/chats";
import { dbEnabled } from "@/lib/data/db";

export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!dbEnabled()) return Response.json({ ok: true });
  if (!validChatId(params.id)) return new Response("Bad id.", { status: 400 });
  try { await deleteChat(params.id); return Response.json({ ok: true }); }
  catch (e) { return new Response(e instanceof Error ? e.message : String(e), { status: 500 }); }
}
