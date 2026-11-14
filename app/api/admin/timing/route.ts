import { loadFromDb, db, dbEnabled } from "@/lib/data/db";
import { anonKey, supabaseUrl } from "@/lib/auth/config";
import { listAccounts, getAccount } from "@/lib/data";

export const dynamic = "force-dynamic";

// Dev-only: how long the pieces of a page load take against Supabase.
export async function GET() {
  if (process.env.NODE_ENV === "production" || !dbEnabled()) return new Response("Not available.", { status: 404 });
  const t = async <T,>(fn: () => Promise<T>) => { const s = performance.now(); const r = await fn(); return { ms: Math.round(performance.now() - s), r }; };
  const ping = await t(async () => await db().from("template_groups").select("id").limit(1));
  const authPing = await t(() => fetch(`${supabaseUrl()}/auth/v1/settings`, { headers: { apikey: anonKey() ?? "" } }));
  const full = await t(() => loadFromDb());
  const files = await t(async () => await db().from("vault_files").select("content").range(0, 999));
  const bytes = ((files.r.data ?? []) as { content: string }[]).reduce((n, f) => n + f.content.length, 0);
  const page1 = await t(async () => { await listAccounts(); return getAccount("heritage"); });
  const page2 = await t(async () => { await listAccounts(); return getAccount("world-emblem"); });
  return Response.json({ pageDataMs: [page1.ms, page2.ms], roundTripMs: ping.ms, authRoundTripMs: authPing.ms, fullLoadMs: full.ms, vaultFilesFirst1000Ms: files.ms, vaultContentKB: Math.round(bytes / 1024) });
}
