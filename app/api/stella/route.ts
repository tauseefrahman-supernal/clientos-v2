import { getAccount } from "@/lib/data";
import { askStella } from "@/lib/stella/agent";
import { saveExchange, validChatId } from "@/lib/data/chats";
import { currentUser } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

// POST { slug, messages: [{ role, content }] } -> newline-delimited JSON events.
export async function POST(req: Request) {
  let body: { slug?: unknown; messages?: unknown; chatId?: unknown };
  try { body = await req.json(); } catch { return new Response("Body must be JSON.", { status: 400 }); }
  const slug = typeof body.slug === "string" ? body.slug : "";
  if (!(await getAccount(slug))) return new Response("Open a project first.", { status: 400 });
  const msgs = Array.isArray(body.messages) ? body.messages : [];
  const history = msgs
    .filter((m): m is { role: "user" | "assistant"; content: string } => !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim().length > 0)
    .slice(-12);
  if (!history.length || history[history.length - 1].role !== "user") return new Response("The last message must be a question.", { status: 400 });

  const chatId = validChatId(body.chatId) ? body.chatId : null;
  const userId = chatId ? (await currentUser())?.id ?? null : null;
  const answer: { content: string; steps: string[]; error?: string; usage?: unknown } = { content: "", steps: [] };
  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const ev of askStella(slug, history)) {
          if (ev.type === "text") answer.content += ev.delta;
          else if (ev.type === "reset") answer.content = "";
          else if (ev.type === "tool") answer.steps.push(ev.summary);
          else if (ev.type === "error") answer.error = ev.message;
          else if (ev.type === "done") answer.usage = ev.usage;
          controller.enqueue(enc.encode(JSON.stringify(ev) + "\n"));
        }
      } catch (e) {
        answer.error = e instanceof Error ? e.message : String(e);
        controller.enqueue(enc.encode(JSON.stringify({ type: "error", message: answer.error }) + "\n"));
      } finally {
        // Save the exchange to the chat (Supabase only); a failed save never breaks the answer.
        if (chatId) {
          const saved = await saveExchange(chatId, slug, userId, history[history.length - 1].content, answer).then(() => ({ ok: true }), (e) => ({ ok: false, error: e instanceof Error ? e.message : String(e) }));
          if (!saved.ok) console.error("[stella] chat not saved:", saved);
          try { controller.enqueue(enc.encode(JSON.stringify({ type: "saved", ...saved }) + "\n")); } catch { /* reader gone */ }
        }
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" } });
}
