import { runWorkflow } from "@/lib/data/runs";
import { currentAccess } from "@/lib/auth/access";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// POST { slug, workflow } -> the run, once Stella has drafted its output (30 to 90 seconds).
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (typeof body.slug !== "string" || typeof body.workflow !== "string") return new Response("slug and workflow are required.", { status: 400 });
  const by = (await currentAccess()).person?.name ?? "local script";
  try { return Response.json(await runWorkflow(body.slug, body.workflow, by)); }
  catch (e) { return new Response(e instanceof Error ? e.message : String(e), { status: 400 }); }
}
