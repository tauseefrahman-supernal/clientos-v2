import "server-only";
import { all, check, db } from "@/lib/data/db";
import { invalidate } from "@/lib/data";
import { clearPersonnelCalls } from "./personnel-cleanup.ts";
import { personnelOps } from "./sync.ts";
import { reFetchNotPersonnel } from "./override-core.ts";
import { screenCall } from "./screen.ts";
import { fetchTranscript, listFathom } from "./sources/index.ts";
import {
  goneList, rulesByProject, screenedList, syncStatus, unassignedList,
  type GoneItem, type OverrideAction, type ProviderStatus, type RuleGroup, type RuleKind, type ScreenedItem, type UnassignedItem,
} from "./admin-rules.ts";

// The memory admin page's data and its actions: overrides, gone calls and match rules. The decisions about what
// to show and what a request may contain live in admin-rules.ts; the not-personnel re-fetch in override-core.ts.

/** A request about something that is not there (a call or project). The route answers 404. */
export class NotThere extends Error {}

export interface MemoryAdminData {
  providers: ProviderStatus[];
  counts: { calls: number; pending: number; digested: number; failed: number; personnel: number; gone: number; unassigned: number };
  screened: ScreenedItem[];
  gone: GoneItem[];
  unassigned: UnassignedItem[];
  rules: RuleGroup[];
  projects: { slug: string; name: string }[];
}

export async function loadMemoryAdmin(): Promise<MemoryAdminData> {
  const [calls, links, overrides, rules, accounts, state] = await Promise.all([
    all("transcripts", "id,title,met_at,provider,status,cuts,gone_at", (q) => q.order("id")),
    all("transcript_accounts", "transcript_id", (q) => q.order("transcript_id").order("account_id")),
    all("transcript_overrides", "transcript_id,action,at", (q) => q.order("at").order("id")),
    all("match_rules", "account_id,kind,value,source", (q) => q.order("account_id").order("kind").order("value")),
    all("accounts", "id,slug,name", (q) => q.order("id")),
    all("sync_state", "provider,cursor,last_run_at,last_error"),
  ]);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const rows = calls as any[];
  const linked = new Set(links.map((l) => l.transcript_id as string));
  const unassigned = unassignedList(rows, linked);
  const by = (s: string) => rows.filter((r) => r.status === s).length;
  return {
    providers: syncStatus(state as any[]),
    counts: {
      calls: rows.length, pending: by("pending"), digested: by("digested"), failed: by("failed"), personnel: by("personnel"),
      gone: rows.filter((r) => r.gone_at).length, unassigned: unassigned.length,
    },
    screened: screenedList(rows, overrides as any[]),
    gone: goneList(rows, new Date()),
    unassigned,
    rules: rulesByProject(rules as any[], accounts as any[]),
    projects: (accounts as any[]).map((a) => ({ slug: a.slug, name: a.name })).sort((a, b) => a.name.localeCompare(b.name)),
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

async function accountId(slug: string): Promise<string> {
  const row = check(await db().from("accounts").select("id").eq("slug", slug).maybeSingle(), "find project") as { id: string } | null;
  if (!row) throw new NotThere(`Unknown project: ${slug}`);
  return row.id;
}

/**
 * Records the override (so every later sync respects it) and applies it now:
 * assign links the call by hand; unassign removes the link and its chunks' links to that project;
 * personnel deletes the body, chunks, headlines and pending suggested facts; not_personnel fetches the call again
 * and screens it for private details only (a paid model call, made only on this explicit admin click).
 */
export async function applyOverride(o: { transcriptId: string; slug: string | null; action: OverrideAction }, by: string): Promise<{ message: string }> {
  const call = check(await db().from("transcripts")
    .select("id,provider,external_id,title,met_at,participants,url,status")
    .eq("id", o.transcriptId).maybeSingle(), "find call") as Record<string, unknown> | null;
  if (!call) throw new NotThere("No such call.");
  const account = o.slug ? await accountId(o.slug) : null;
  check(await db().from("transcript_overrides").insert({ transcript_id: o.transcriptId, account_id: account, action: o.action, by }), "save override");
  try {
    if (o.action === "assign") {
      check(await db().from("transcript_accounts").upsert({ transcript_id: o.transcriptId, account_id: account, source: "manual" }, { onConflict: "transcript_id,account_id" }), "assign call");
      return { message: `Added to ${o.slug}. Search picks it up at the next index run.` };
    }
    if (o.action === "unassign") {
      const chunks = check(await db().from("chunks").select("id").eq("transcript_id", o.transcriptId), "read call chunks") as { id: string }[];
      for (let i = 0; i < chunks.length; i += 200)
        check(await db().from("chunk_accounts").delete().eq("account_id", account).in("chunk_id", chunks.slice(i, i + 200).map((c) => c.id)), "unlink call chunks");
      check(await db().from("transcript_accounts").delete().eq("transcript_id", o.transcriptId).eq("account_id", account), "unassign call");
      return { message: `Removed from ${o.slug}. Later syncs will not add it back.` };
    }
    if (o.action === "personnel") {
      await clearPersonnelCalls([o.transcriptId], personnelOps, { dropBodies: true });
      return { message: "Marked personnel. Its transcript, search passages and pending facts are gone." };
    }
    const out = await reFetchNotPersonnel({
      provider: call.provider as string, externalId: call.external_id as string, title: (call.title as string) ?? "",
      metAt: (call.met_at as string) ?? null, participants: Array.isArray(call.participants) ? call.participants as never : [],
      url: (call.url as string) ?? "", sourceSummary: "",
    }, {
      fetchTranscript: (provider, id) => fetchTranscript(provider, id),
      listFathom: (since) => listFathom(since, null),
      screen: screenCall,
      now: () => new Date().toISOString(),
    });
    if (out.kind === "later")
      return { message: `Marked not personnel. The transcript could not be fetched now (${out.reason}); it comes back when the call is next pulled from Granola or Fathom.` };
    check(await db().from("transcripts").update(out.patch).eq("id", o.transcriptId), "store screened body");
    return { message: `Marked not personnel. Transcript fetched again${out.cuts ? ` with ${out.cuts} private detail${out.cuts === 1 ? "" : "s"} removed` : ""}; it is summarised and indexed at the next digest and index runs.` };
  } finally {
    invalidate();
  }
}

/** Keep clears the gone mark (a later full sync marks it again if it is still missing); delete removes the call for good. */
export async function settleGone(g: { transcriptId: string; keep: boolean }): Promise<{ message: string }> {
  const call = check(await db().from("transcripts").select("id,gone_at").eq("id", g.transcriptId).maybeSingle(), "find call") as { id: string; gone_at: string | null } | null;
  if (!call) throw new NotThere("No such call.");
  if (!call.gone_at) throw new NotThere("That call is not marked as gone.");
  if (g.keep) check(await db().from("transcripts").update({ gone_at: null }).eq("id", g.transcriptId), "keep call");
  else check(await db().from("transcripts").delete().eq("id", g.transcriptId), "delete call");
  invalidate();
  return { message: g.keep ? "Kept; it will be marked again if still missing at the next full sync." : "Deleted." };
}

/** Adds (source manual) or removes one match rule. */
export async function editRule(r: { slug: string; kind: RuleKind; value: string; remove: boolean }): Promise<{ message: string }> {
  const account = await accountId(r.slug);
  if (r.remove) check(await db().from("match_rules").delete().eq("account_id", account).eq("kind", r.kind).eq("value", r.value), "remove match rule");
  else check(await db().from("match_rules").upsert({ account_id: account, kind: r.kind, value: r.value, source: "manual" }, { onConflict: "account_id,kind,value", ignoreDuplicates: true }), "add match rule");
  return { message: r.remove ? `Removed ${r.kind} ${r.value}.` : `Added ${r.kind} ${r.value}. It applies from the next sync.` };
}
