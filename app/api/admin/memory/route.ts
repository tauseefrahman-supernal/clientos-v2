import { currentAccess } from "@/lib/auth/access";
import { dbEnabled } from "@/lib/data/db";
import { indexPending } from "@/lib/memory/embed";
import { runSync } from "@/lib/memory/sync";
import { digestPending, estimatePending, type DigestOptions } from "@/lib/memory/digest";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// POST /api/admin/memory { action, ...options }: admin jobs for Stella's memory. Admins only.
//   index { dryRun? }: embed new or changed vault files, chapters, call summaries and call bodies;
//                      with dryRun, report the counts and an estimated token total without calling Voyage or writing.
//   sync { since?, onlySlugs?, full?, preview?, confirmFull?, repairOnly?, rescreen? }: pull calls from Granola and Fathom, screen and store
//                      them, link projects. since (ISO date) and onlySlugs make an ad-hoc run that leaves the saved sync
//                      state alone; full lists everything so missing calls can be marked gone; preview lists everything and
//                      reports what would change (including calls it would mark gone) without writing. A full run is
//                      refused (409) without a preview in the last hour or confirmFull. repairOnly only folds stored duplicate rows. rescreen (needs
//                      onlySlugs) screens those projects' stored calls again from their source; pass the returned
//                      rescreen.rescreenBefore back on re-runs to skip calls already rescreened. Stops early and says when more remains.
//   estimate { onlySlugs?, limit?, retryFailed?, outputTokens? }: what digesting the waiting calls (status pending, with a stored
//                      body) would cost, counted as the requests are sent: system prompt + project outline as a cache write on
//                      each project's first call and a cache read after, the transcript as input, and output at outputTokens
//                      per call (else the last run's measured average, else 2,500).
//   digest { confirm: true, maxDollars, onlySlugs?, limit?, retryFailed? }: summary, project headlines and suggested vault facts
//                      for those calls (the newest when limit is set), run grouped by project so the prompt cache is
//                      reused. Refused without confirm or when the estimate is over maxDollars.
//                      Stops starting calls after about 150 s, or before a call or a retry whose estimate would take actual
//                      spend plus the estimates of calls in flight past maxDollars (those calls stay pending); says how many
//                      remain (more), so run it again until done. Spend can pass maxDollars only by how far the calls already
//                      in flight cost more than their estimates. Calls billed without usage (aborted, errored) count at their
//                      estimate. Returns dollarsActual by part (input, cache read, cache write, output, estimated), usage and
//                      per-call averages.
//                      retryFailed also takes calls an earlier digest marked failed.
type Body = Record<string, unknown> & { action?: string };

class BadRequest extends Error {}

function syncOptions(body: Body) {
  const opts: { since?: string; onlySlugs?: string[]; full?: boolean; preview?: boolean; confirmFull?: boolean; repairOnly?: boolean; rescreen?: boolean; rescreenBefore?: string } = {};
  if (body.repairOnly === true) return { repairOnly: true };
  if (body.since !== undefined) {
    if (typeof body.since !== "string" || Number.isNaN(Date.parse(body.since))) throw new BadRequest("since must be an ISO date.");
    opts.since = new Date(Date.parse(body.since)).toISOString();
  }
  if (body.onlySlugs !== undefined) {
    if (!Array.isArray(body.onlySlugs) || !body.onlySlugs.every((s) => typeof s === "string" && s.trim())) throw new BadRequest("onlySlugs must be a list of project slugs.");
    opts.onlySlugs = body.onlySlugs.map((s) => (s as string).trim());
  }
  if (body.full === true) opts.full = true;
  if (body.rescreen === true) {
    if (!opts.onlySlugs) throw new BadRequest("rescreen needs onlySlugs");
    opts.rescreen = true;
    if (body.rescreenBefore !== undefined) {
      if (typeof body.rescreenBefore !== "string" || Number.isNaN(Date.parse(body.rescreenBefore))) throw new BadRequest("rescreenBefore must be an ISO date.");
      opts.rescreenBefore = new Date(Date.parse(body.rescreenBefore)).toISOString();
    }
  }
  if (body.preview === true) {
    if (opts.since !== undefined || opts.onlySlugs) throw new BadRequest("preview lists everything; leave out onlySlugs and since");
    opts.preview = true;
  }
  if (body.confirmFull === true) opts.confirmFull = true;
  return opts;
}

function digestOptions(body: Body): DigestOptions {
  const o: DigestOptions = {};
  if (body.onlySlugs !== undefined) {
    if (!Array.isArray(body.onlySlugs) || !body.onlySlugs.length || !body.onlySlugs.every((s) => typeof s === "string" && s.trim())) throw new BadRequest("onlySlugs must be a list of project slugs.");
    o.onlySlugs = body.onlySlugs.map((s) => (s as string).trim());
  }
  if (body.limit !== undefined) {
    if (!Number.isInteger(body.limit) || (body.limit as number) < 1) throw new BadRequest("limit must be a whole number above 0.");
    o.limit = body.limit as number;
  }
  if (body.retryFailed === true) o.retryFailed = true;
  if (body.outputTokens !== undefined) {
    if (!Number.isInteger(body.outputTokens) || (body.outputTokens as number) < 1) throw new BadRequest("outputTokens must be a whole number above 0.");
    o.outputTokens = body.outputTokens as number;
  }
  return o;
}

async function digest(body: Body) {
  if (body.confirm !== true) throw new BadRequest("digest costs money: run estimate first, then send confirm: true and maxDollars.");
  if (typeof body.maxDollars !== "number" || !Number.isFinite(body.maxDollars) || body.maxDollars <= 0) throw new BadRequest("maxDollars must be a number above 0.");
  const r = await digestPending({ ...digestOptions(body), maxDollars: body.maxDollars });
  if ("refused" in r) throw new BadRequest(r.refused);
  return r;
}

const actions: Record<string, (body: Body) => Promise<unknown>> = {
  index: (body) => indexPending({ dryRun: body.dryRun === true }),
  sync: (body) => runSync(syncOptions(body)),
  estimate: (body) => estimatePending(digestOptions(body)),
  digest,
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
    if (/^Unknown project/.test(error)) return new Response(error, { status: 400 });
    return Response.json({ ok: false, action: body.action, error }, { status: /already in progress|run a preview first/.test(error) ? 409 : 500 });
  }
}
