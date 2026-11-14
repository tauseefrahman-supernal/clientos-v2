import { getAccount } from "@/lib/data";
import { askStella } from "@/lib/stella/agent";

export const dynamic = "force-dynamic";

// POST { slug, messages: [{ role, content }] } -> newline-delimited JSON events.
export async function POST(req: Request) {
  let body: { slug?: unknown; messages?: unknown };
  try { body = await req.json(); } catch { return new Response("Body must be JSON.", { status: 400 }); }
  const slug = typeof body.slug === "string" ? body.slug : "";
  if (!getAccount(slug)) return new Response("Open a project first.", { status: 400 });
  const msgs = Array.isArray(body.messages) ? body.messages : [];
  const history = msgs
    .filter((m): m is { role: "user" | "assistant"; content: string } => !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim().length > 0)
    .slice(-12);
  if (!history.length || history[history.length - 1].role !== "user") return new Response("The last message must be a question.", { status: 400 });

  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const ev of askStella(slug, history)) controller.enqueue(enc.encode(JSON.stringify(ev) + "\n"));
      } catch (e) {
        controller.enqueue(enc.encode(JSON.stringify({ type: "error", message: e instanceof Error ? e.message : String(e) }) + "\n"));
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" } });
}
