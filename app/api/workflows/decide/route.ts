import { revalidatePath } from "next/cache";
import { decideRun, runProject } from "@/lib/data/runs";
import { currentAccess, runDecisionGate } from "@/lib/auth/access";

export const dynamic = "force-dynamic";

// POST { id, action: "approve" | "sent" | "discard" }
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (typeof body.id !== "string" || !["approve", "sent", "discard"].includes(body.action)) return new Response("id and action are required.", { status: 400 });
  // Approving writes into the project's vault: only admins and its strategists may decide (local scripts get open access).
  const access = await currentAccess();
  try {
    const gate = runDecisionGate(access, await runProject(body.id));
    if (gate) return new Response(gate === 404 ? "No such run." : "Only the project's strategists or an admin can decide its runs.", { status: gate });
    const by = access.person?.name ?? "local script";
    const run = await decideRun(body.id, body.action, by);
    revalidatePath("/", "layout");
    return Response.json({ ok: true, run });
  } catch (e) { return new Response(e instanceof Error ? e.message : String(e), { status: 400 }); }
}
