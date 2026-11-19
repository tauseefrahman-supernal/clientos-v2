import { askStella, type Attachment, type StellaDocument, type Turn } from "@/lib/stella/agent";
import { saveExchange, validChatId } from "@/lib/data/chats";
import type { Evidence } from "@/lib/stella/evidence";
import { currentUser } from "@/lib/auth/server";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const MAX_TEXT = 300_000;          // characters per text attachment
const MAX_PDF = 8_000_000;         // base64 characters (about 6 MB of PDF)

function cleanAttachments(raw: unknown, allowPdf: boolean): Attachment[] {
  if (!Array.isArray(raw)) return [];
  const out: Attachment[] = [];
  for (const a of raw.slice(0, 5)) {
    if (!a || typeof a.name !== "string") continue;
    if (a.kind === "text" && typeof a.text === "string") out.push({ name: a.name.slice(0, 200), kind: "text", text: a.text.slice(0, MAX_TEXT) });
    else if (a.kind === "pdf" && allowPdf && typeof a.data === "string" && a.data.length <= MAX_PDF) out.push({ name: a.name.slice(0, 200), kind: "pdf", data: a.data });
  }
  return out;
}

// POST { scope: ["slug", ...] | ["*"], messages: [{ role, content, attachments? }], chatId? } -> newline-delimited JSON events.
// (slug: "x" is still accepted for one project.)
export async function POST(req: Request) {
  let body: { slug?: unknown; scope?: unknown; messages?: unknown; chatId?: unknown };
  try { body = await req.json(); } catch { return new Response("Body must be JSON.", { status: 400 }); }
  const scope = Array.isArray(body.scope) ? body.scope.filter((x): x is string => typeof x === "string").slice(0, 100) : typeof body.slug === "string" ? [body.slug] : [];
  if (!scope.length) return new Response("Choose at least one project.", { status: 400 });

  const msgs = (Array.isArray(body.messages) ? body.messages : []).slice(-12);
  const history: Turn[] = msgs
    .filter((m) => !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim().length > 0)
    .map((m, i, arr) => ({ role: m.role, content: m.content, attachments: m.role === "user" ? cleanAttachments(m.attachments, i === arr.length - 1) : undefined }));
  if (!history.length || history[history.length - 1].role !== "user") return new Response("The last message must be a question.", { status: 400 });
  const last = history[history.length - 1];

  const chatId = validChatId(body.chatId) ? body.chatId : null;
  const userId = chatId ? (await currentUser())?.id ?? null : null;
  const answer: { content: string; steps: string[]; error?: string; usage?: unknown; documents: StellaDocument[]; evidence: Evidence[] } = { content: "", steps: [], documents: [], evidence: [] };
  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const ev of askStella(scope, history)) {
          if (ev.type === "text") answer.content += ev.delta;
          else if (ev.type === "reset") answer.content = "";
          else if (ev.type === "tool") answer.steps.push(ev.summary);
          else if (ev.type === "document") answer.documents.push(ev.doc);
          else if (ev.type === "evidence") answer.evidence = ev.items;
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
          const files = (last.attachments ?? []).map((a) => ({ name: a.name, kind: a.kind, size: a.kind === "pdf" ? Math.round((a.data?.length ?? 0) * 0.75) : a.text?.length ?? 0, ...(a.kind === "text" ? { text: a.text } : {}) }));
          const saved = await saveExchange(chatId, scope, userId, last.content, files, answer).then(() => ({ ok: true }), (e) => ({ ok: false, error: e instanceof Error ? e.message : String(e) }));
          if (!saved.ok) console.error("[stella] chat not saved:", saved);
          try { controller.enqueue(enc.encode(JSON.stringify({ type: "saved", ...saved }) + "\n")); } catch { /* reader gone */ }
        }
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" } });
}
