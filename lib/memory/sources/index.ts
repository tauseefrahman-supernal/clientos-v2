// Source clients for Stella's memory, one entry point per provider.
import type { SourceCall, Turn } from "../types.ts";
import { fetchFathomTranscript } from "./fathom.ts";
import { fetchGranolaTranscript } from "./granola.ts";
import type { SourceDeps } from "./shared.ts";

export { normalizeFathom, listFathom } from "./fathom.ts";
export { normalizeGranola, listGranola } from "./granola.ts";
export type { ListResult, SourceDeps } from "./shared.ts";
export { SourceHttpError } from "./shared.ts";

/** One call's transcript from its provider; null when the provider has none. */
export function fetchTranscript(provider: SourceCall["provider"], externalId: string, d?: SourceDeps): Promise<Turn[] | null> {
  return provider === "fathom" ? fetchFathomTranscript(externalId, d) : fetchGranolaTranscript(externalId, d);
}
