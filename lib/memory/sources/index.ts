// Source clients for Stella's memory, one entry point per provider.
import type { SourceCall } from "../types.ts";
import { fetchFathomTranscript } from "./fathom.ts";
import { fetchGranolaTranscript } from "./granola.ts";
import type { SourceDeps, TranscriptResult } from "./shared.ts";

export { normalizeFathom, listFathom, fathomCallId } from "./fathom.ts";
export { normalizeGranola, listGranola } from "./granola.ts";
export type { ListResult, SourceDeps, TranscriptResult } from "./shared.ts";
export { SourceHttpError, RateLimitedError, isRateLimited } from "./shared.ts";

/**
 * One call's transcript from its provider: { status: "ready", turns } | { status: "not_ready" } (empty or
 * still processing; retry later) | { status: "gone" } (404, or a deleted Granola note).
 * Throws RateLimitedError on 429 (check with isRateLimited) and SourceHttpError on any other failure.
 * Pass the call's fetchId when it has one (Fathom: the recording_id), else its externalId (Granola: the note id).
 */
export function fetchTranscript(provider: SourceCall["provider"], externalId: string, d?: SourceDeps): Promise<TranscriptResult> {
  return provider === "fathom" ? fetchFathomTranscript(externalId, d) : fetchGranolaTranscript(externalId, d);
}
