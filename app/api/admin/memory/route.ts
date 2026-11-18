import { currentAccess } from "@/lib/auth/access";
import { dbEnabled } from "@/lib/data/db";
import { indexPending } from "@/lib/memory/embed";
import { runSync } from "@/lib/memory/sync";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// POST /api/admin/memory { action, ...options }: admin jobs for Stella's memory. Admins only.
//   index { dryRun? }: embed new or changed vault files, chapters, call summaries and call bodies;
//                      with dryRun, report the counts and an estimated token total without calling Voyage or writing.
//   sync { since?, onlySlugs?, full? }: pull calls from Granola and Fathom, screen and store them, link projects.
//                      since (ISO date) and onlySlugs make an ad-hoc run that leaves the saved sync state alone;
//                      full lists everything so missing calls can be marked gone. Stops early and says when more remains.
type Body = Record<string, unknown> & { action?: string };

class BadRequest extends Error {}

function syncOptions(body: Body) {
  const opts: { since?: string; onlySlugs?: string[]; full?: boolean } = {};
  if (body.since !== undefined) {
    if (typeof body.since !== "string" || Number.isNaN(Date.parse(body.since))) throw new BadRequest("since must be an ISO date.");
    opts.since = new Date(Date.parse(body.since)).toISOString();
  }
  if (body.onlySlugs !== undefined) {
    if (!Array.isArray(body.onlySlugs) || !body.onlySlugs.every((s) => typeof s === "string" && s.trim())) throw new BadRequest("onlySlugs must be a list of project slugs.");
    opts.onlySlugs = body.onlySlugs.map((s) => (s as string).trim());
  }
  if (body.full === true) opts.full = true;
  return opts;
}

const actions: Record<string, (body: Body) => Promise<unknown>> = {
  index: (body) => indexPending({ dryRun: body.dryRun === true }),
  sync: (body) => runSync(syncOptions(body)),
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
    if (e instanceof BadRequest) return new Response(e.message, { status: 400 });
    const error = e instanceof Error ? e.message : String(e);
    return Response.json({ ok: false, action: body.action, error }, { status: /already in progress/.test(error) ? 409 : 500 });
  }
}
