import { createClient } from "@supabase/supabase-js";
import { db, dbEnabled, noStore } from "@/lib/data/db";
import { anonKey, authEnabled, supabaseUrl } from "@/lib/auth/config";
import { getAccount, listAccounts } from "@/lib/data";
import { buildExport } from "@/lib/export";
import { search } from "@/lib/stella/corpus";
import { createChat, deleteChat, listChats } from "@/lib/data/chats";
import { decideRun, runWorkflow } from "@/lib/data/runs";
import { myView } from "@/lib/myview";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

type Check = { name: string; ok: boolean; detail: string };

// GET /api/admin/selftest[?stella=1]: checks the live system end to end against Supabase and the
// running app. Local dev server only (or CLIENTOS_ADMIN_TOKEN). ?stella=1 also runs one workflow
// with Stella (costs about $0.20) and discards the draft.
export async function GET(req: Request) {
  const token = process.env.CLIENTOS_ADMIN_TOKEN;
  if (process.env.NODE_ENV === "production" && (!token || req.headers.get("x-clientos-admin") !== token)) return new Response("Not allowed.", { status: 403 });
  const checks: Check[] = [];
  const check = async (name: string, fn: () => Promise<string>) => {
    try { checks.push({ name, ok: true, detail: await fn() }); }
    catch (e) { checks.push({ name, ok: false, detail: e instanceof Error ? e.message : String(e) }); }
  };
  const must = (cond: unknown, msg?: string) => { if (!cond) throw new Error(msg ?? "check failed"); };

  await check("database reachable", async () => {
    must(dbEnabled(), "Supabase is not configured");
    const { count, error } = await db().from("accounts").select("id", { count: "exact", head: true });
    must(!error, error?.message); must((count ?? 0) > 0, "no projects");
    return `${count} projects`;
  });

  await check("anonymous key cannot read clientos tables", async () => {
    must(anonKey(), "no anon key configured");
    const anon = createClient(supabaseUrl()!, anonKey()!, { db: { schema: "clientos" }, auth: { persistSession: false }, global: { fetch: noStore } });
    const tables = ["accounts", "vault_files", "people", "assignments", "stella_chats", "stella_messages", "workflow_runs"];
    const leaks: string[] = [];
    for (const t of tables) { const { data } = await anon.from(t).select("*").limit(1); if (data && data.length) leaks.push(t); }
    must(!leaks.length, `readable without signing in: ${leaks.join(", ")}`);
    return `${tables.length} tables closed`;
  });

  await check("Google sign-in is on and sessions use asymmetric keys", async () => {
    must(authEnabled(), "sign-in not configured");
    const s = await (await fetch(`${supabaseUrl()}/auth/v1/settings`, { headers: { apikey: anonKey()! }, cache: "no-store" })).json();
    must(s?.external?.google === true, "Google provider is off");
    const jwks = await (await fetch(`${supabaseUrl()}/auth/v1/.well-known/jwks.json`, { cache: "no-store" })).json();
    must((jwks.keys ?? []).some((k: { alg?: string }) => k.alg && k.alg !== "HS256"), "no asymmetric signing key");
    return `Google on · ${(jwks.keys ?? []).map((k: { alg?: string }) => k.alg).join(", ")}`;
  });

  await check("every delivery account has a strategist, every expansion a parent", async () => {
    const { data: accts } = await db().from("accounts").select("id,slug,stage,parent_slug");
    const { data: asg } = await db().from("assignments").select("account_id,role");
    const strat = new Set((asg ?? []).filter((a) => a.role === "strategist").map((a) => a.account_id));
    const slugs = new Set((accts ?? []).map((a) => a.slug));
    const missing = (accts ?? []).filter((a) => a.stage === "delivery" && !strat.has(a.id)).map((a) => a.slug);
    const orphans = (accts ?? []).filter((a) => a.parent_slug && !slugs.has(a.parent_slug)).map((a) => a.slug);
    must(!missing.length, `no strategist on: ${missing.join(", ")}`);
    must(!orphans.length, `expansions with no parent: ${orphans.join(", ")}`);
    return `${(asg ?? []).length} assignments · ${(accts ?? []).filter((a) => a.parent_slug).length} expansions`;
  });

  await check("data API matches the database", async () => {
    const all = await listAccounts();
    const { count } = await db().from("accounts").select("id", { count: "exact", head: true });
    must(all.length === count, `app has ${all.length}, database ${count}`);
    return `${all.length} projects in both`;
  });

  await check("export builds from a project's vault", async () => {
    const b = (await listAccounts()).find((x) => x.account.stage === "delivery")!;
    const out = buildExport([b], { parts: ["vault", "book"] });
    must(out.stats.files > 0 && out.markdown.length > 1000, "export is empty");
    return `${b.account.name}: ${out.stats.files} files, ${Math.round(out.markdown.length / 1000)}k characters`;
  });

  await check("Stella's search finds project context", async () => {
    const b = await getAccount("heritage");
    must(b, "Heritage not found");
    const hits = await search("heritage", "accuracy", 5);
    must(hits.length > 0, "no hits");
    return `${hits.length} hits, top: ${hits[0].label}`;
  });

  await check("chats save, list and delete", async () => {
    const id = crypto.randomUUID();
    await createChat(id, ["heritage", "world-emblem"], null, "selftest");
    const listed = (await listChats(null)) ?? [];
    const found = listed.find((c) => c.id === id);
    await deleteChat(id, null);
    must(found && found.scope.length === 2, "chat not listed with its scope");
    must(!((await listChats(null)) ?? []).some((c) => c.id === id), "chat not deleted");
    return "round trip ok";
  });

  await check("My View builds for every person on the team", async () => {
    const { data: people } = await db().from("people").select("id,name");
    const rows: string[] = [];
    for (const p of people ?? []) {
      const v = await myView(p.id);
      must(v.person.id === p.id, `view for ${p.name} came back as ${v.person.name}`);
      for (const d of v.deals) must(d.track.length === 8, `${d.name} has no scoping track`);
      if (["Tauseef Rahman", "Jaime Garcia", "Sven Boettger"].includes(p.name)) rows.push(`${p.name.split(" ")[0]}: ${v.deals.length} deals, ${v.work.length} accounts, ${v.actions.length} actions`);
    }
    return `${(people ?? []).length} people · ${rows.join(" · ")}`;
  });

  if (new URL(req.url).searchParams.get("stella") === "1") {
    await check("a workflow runs with Stella and its draft can be discarded", async () => {
      const deal = (await listAccounts()).find((b) => b.account.slug === "deal-iec-colleges") ?? (await listAccounts()).find((b) => b.account.stage === "sales")!;
      const run = await runWorkflow(deal.account.slug, "deal-desk", "selftest");
      const ok = run.status === "draft" && run.draft.length > 200;
      await decideRun(run.id, "discard", "selftest");
      must(ok, `run ended ${run.status}: ${run.draft.slice(0, 200)}`);
      return `${deal.account.name}: drafted “${run.title}” (${run.draft.length} characters), then discarded`;
    });
  }

  const passed = checks.filter((c) => c.ok).length;
  return Response.json({ ok: passed === checks.length, passed, total: checks.length, checks }, { status: passed === checks.length ? 200 : 500 });
}
