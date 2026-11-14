import { store as seedStore } from "@/lib/data/seed";
import { dbEnabled, importToDb } from "@/lib/data/db";
import { invalidate } from "@/lib/data";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// POST /api/admin/import: copy the repo's research docs and seed files into Supabase,
// keeping edits people made in the app. Open on a local dev server; elsewhere it needs
// the CLIENTOS_ADMIN_TOKEN header.
export async function POST(req: Request) {
  const token = process.env.CLIENTOS_ADMIN_TOKEN;
  const local = process.env.NODE_ENV !== "production";
  if (!local && (!token || req.headers.get("x-clientos-admin") !== token)) return new Response("Not allowed.", { status: 403 });
  if (!dbEnabled()) return new Response("Supabase is not configured: add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local and restart.", { status: 400 });
  try {
    const t0 = Date.now();
    const log = await importToDb(seedStore(), process.cwd());
    invalidate();
    return Response.json({ ok: true, seconds: Math.round((Date.now() - t0) / 1000), log });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
