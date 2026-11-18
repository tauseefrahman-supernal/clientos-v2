// What an admin's "not personnel" override does to a stored call, with the sources and the screen injected:
// fetch the transcript again, screen it, keep only private-detail cuts, and return the row patch that queues the
// call for digest and index (status pending). No "server-only" import, so node --test can run it against fakes.
import { turnsToBody } from "./index-rules.ts";
import { applyCuts, type ScreenResult } from "./screen.ts";
import { applyNotPersonnel, speakersOf } from "./sync-core.ts";
import type { ListResult, TranscriptResult } from "./sources/shared.ts";
import type { SourceCall, Turn } from "./types.ts";

const DAY_MS = 86_400_000;

export interface NotPersonnelDeps {
  fetchTranscript(provider: SourceCall["provider"], id: string): Promise<TranscriptResult>;
  /** Fathom meetings created after since (ISO), transcripts included. */
  listFathom(since: string): Promise<ListResult>;
  screen(call: SourceCall): Promise<ScreenResult>;
  now(): string;
}

export interface StoredCall {
  provider: string; externalId: string; title: string; metAt: string | null;
  participants: SourceCall["participants"]; url: string; sourceSummary: string;
}

export type NotPersonnelOutcome =
  | { kind: "stored"; patch: Record<string, unknown>; cuts: number }
  | { kind: "later"; reason: string };

const errText = (e: unknown) => (e instanceof Error ? e.message : String(e)).slice(0, 200);

/** The call's turns from its source, and the source summary when the listing gave one. */
async function turnsFor(row: StoredCall, deps: NotPersonnelDeps): Promise<{ turns: Turn[]; summary: string } | string> {
  const fromFetch = async (provider: SourceCall["provider"], id: string) => {
    const r = await deps.fetchTranscript(provider, id);
    if (r.status === "ready") return { turns: r.turns, summary: "" };
    return r.status === "gone" ? `${provider === "granola" ? "Granola" : "Fathom"} no longer has this call` : "the transcript is not ready at the source yet";
  };
  if (row.provider === "granola") return fromFetch("granola", row.externalId);
  if (row.provider !== "fathom") return "an uploaded call can't be fetched again";
  // Stored Fathom rows keep the call id from the link, not the recording id the transcript endpoint takes;
  // "rec:<id>" rows carry it. Otherwise list Fathom from the day before the call and find it there.
  if (row.externalId.startsWith("rec:")) return fromFetch("fathom", row.externalId.slice(4));
  const met = row.metAt ? Date.parse(row.metAt) : NaN;
  if (Number.isNaN(met)) return "the call has no date to find it by in Fathom";
  const listed = await deps.listFathom(new Date(met - DAY_MS).toISOString());
  const call = listed.calls.find((c) => c.externalId === row.externalId);
  if (!call) return listed.rateLimited ? "Fathom is rate limiting requests" : "Fathom did not list this call";
  if (call.turns?.length) return { turns: call.turns, summary: call.sourceSummary };
  if (!call.fetchId) return "Fathom has no recording id for this call";
  const got = await fromFetch("fathom", call.fetchId);
  return typeof got === "string" ? got : { turns: got.turns, summary: call.sourceSummary };
}

/**
 * Fetches the call again and screens it for private details only (a not_personnel override drops personnel cuts).
 * "later" when the source can't be reached or the screen fails: nothing is stored, the override stays.
 */
export async function reFetchNotPersonnel(row: StoredCall, deps: NotPersonnelDeps): Promise<NotPersonnelOutcome> {
  let got: Awaited<ReturnType<typeof turnsFor>>;
  try { got = await turnsFor(row, deps); } catch (e) { return { kind: "later", reason: `the source could not be reached (${errText(e)})` }; }
  if (typeof got === "string") return { kind: "later", reason: got };
  const result = applyNotPersonnel(await deps.screen({
    provider: row.provider as SourceCall["provider"], externalId: row.externalId, title: row.title, metAt: row.metAt ?? "",
    participants: row.participants, url: row.url, sourceSummary: got.summary || row.sourceSummary, turns: got.turns,
  }));
  if (result.verdict === "error") return { kind: "later", reason: "the privacy screen could not run" };
  const kept = applyCuts(got.turns, result.cuts);
  return {
    kind: "stored",
    cuts: result.cuts.length,
    patch: { body: turnsToBody(kept), cuts: result.cuts, speakers: speakersOf(kept), status: "pending", pulled_at: deps.now() },
  };
}
