import { canSee, currentAccess } from "@/lib/auth/access";
import { check, db, dbEnabled } from "@/lib/data/db";
import { transcriptGate, turnsForPanel } from "@/lib/memory/admin-rules";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// GET /api/transcripts/:id -> { title, date, turns } for the Recordings side panel: the screened body, loaded only when
// the panel opens. Allowed when the person is an admin or can see at least one of the call's projects, and the call is
// not a personnel call nor gone from its source for more than 14 days; anything else is a 404. Turns are plain text
// with the screen's cut markers split out; the client renders them as text, never as HTML.
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!dbEnabled() || !UUID.test(params.id)) return new Response("Not found.", { status: 404 });
  const access = await currentAccess();
  const row = check(await db().from("transcripts")
    .select("id,title,met_at,status,gone_at,body,transcript_accounts(accounts(slug))")
    .eq("id", params.id).maybeSingle(), "read transcript") as Record<string, unknown> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const slugs = ((row?.transcript_accounts as any[]) ?? []).map((l) => l?.accounts?.slug).filter((s): s is string => typeof s === "string");
  const canSeeAny = access.admin || slugs.some((s) => canSee(access, s));
  const gate = transcriptGate(row ? { status: row.status as string, goneAt: (row.gone_at as string) ?? null } : null, canSeeAny, new Date());
  if (gate !== 200 || !row) return new Response("Not found.", { status: 404 });
  return Response.json(
    { title: row.title, date: row.met_at ?? null, turns: turnsForPanel(row.body as string | null) },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
