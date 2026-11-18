import { currentAccess } from "@/lib/auth/access";
import { dbEnabled } from "@/lib/data/db";
import { indexPending } from "@/lib/memory/embed";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// POST /api/admin/memory { action, ...options }: admin jobs for Stella's memory. Admins only.
//   index { dryRun? }: embed new or changed vault files, chapters, call summaries and call bodies;
//                      with dryRun, report the counts and an estimated token total without calling Voyage or writing.
type Body = Record<string, unknown> & { action?: string };
const actions: Record<string, (body: Body) => Promise<unknown>> = {
  index: (body) => indexPending({ dryRun: body.dryRun === true }),
};

export async function POST(req: Request) {
  if (!(await currentAccess()).admin) return new Response("Not allowed.", { status: 403 });
  if (!dbEnabled()) return new Response("Supabase is not configured.", { status: 400 });
  let body: Body;
  try { body = (await req.json()) as Body; } catch { return new Response("Send a JSON body with an action.", { status: 400 }); }
  const run = typeof body.action === "string" ? actions[body.action] : undefined;
  if (!run) return new Response(`Unknown action. Use one of: ${Object.keys(actions).join(", ")}.`, { status: 400 });
  try {
    const t0 = Date.now();
    const result = await run(body);
    return Response.json({ ok: true, action: body.action, seconds: Math.round((Date.now() - t0) / 1000), result });
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    return Response.json({ ok: false, action: body.action, error }, { status: /already in progress/.test(error) ? 409 : 500 });
  }
}
