import { revalidatePath } from "next/cache";
import { decideRun } from "@/lib/data/runs";
import { currentAccess } from "@/lib/auth/access";

export const dynamic = "force-dynamic";

// POST { id, action: "approve" | "sent" | "discard" }
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (typeof body.id !== "string" || !["approve", "sent", "discard"].includes(body.action)) return new Response("id and action are required.", { status: 400 });
  const by = (await currentAccess()).person?.name ?? "local script";
  try {
    const run = await decideRun(body.id, body.action, by);
    revalidatePath("/", "layout");
    return Response.json({ ok: true, run });
  } catch (e) { return new Response(e instanceof Error ? e.message : String(e), { status: 400 }); }
}
