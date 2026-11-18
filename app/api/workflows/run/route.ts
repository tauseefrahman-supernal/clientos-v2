import { runWorkflow } from "@/lib/data/runs";
import { canSee, currentAccess } from "@/lib/auth/access";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// POST { slug, workflow } -> the run, once Stella has drafted its output (30 to 90 seconds).
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (typeof body.slug !== "string" || typeof body.workflow !== "string") return new Response("slug and workflow are required.", { status: 400 });
  // Only someone who can see the project may run its workflows (local scripts get open access).
  const access = await currentAccess();
  if (!canSee(access, body.slug)) return new Response("You are not assigned to this project.", { status: 403 });
  const by = access.person?.name ?? "local script";
  try { return Response.json(await runWorkflow(body.slug, body.workflow, by)); }
  catch (e) { return new Response(e instanceof Error ? e.message : String(e), { status: 400 }); }
}
