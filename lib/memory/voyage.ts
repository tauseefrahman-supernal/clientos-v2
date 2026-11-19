// Voyage embeddings client with batching and back-off on rate limits. Fetch, key and sleep are passed in,
// so unit tests run it without the network. No "server-only" import; lib/memory/embed.ts wires it to the env.
import { EMBED_BATCH, batches } from "./index-rules.ts";

export const VOYAGE_URL = "https://api.voyageai.com/v1/embeddings";
export const VOYAGE_MODEL = "voyage-3.5";
export const EMBED_DIM = 1024;
const MAX_TRIES = 5;
const BASE_WAIT_MS = 1000;

export type EmbedKind = "document" | "query";
type FetchLike = (url: string, init: { method: string; headers: Record<string, string>; body: string }) =>
  Promise<{ ok: boolean; status: number; json: () => Promise<unknown>; text: () => Promise<string> }>;

export interface VoyageDeps { key: string | undefined; fetch: FetchLike; sleep: (ms: number) => Promise<void> }

/** Returns an embedder: vectors in input order and the tokens Voyage counted. */
export function voyageEmbedder(deps: VoyageDeps) {
  return async (texts: string[], kind: EmbedKind): Promise<{ vectors: number[][]; tokens: number }> => {
    if (!texts.length) return { vectors: [], tokens: 0 };
    if (!deps.key) throw new Error("VOYAGE_API_KEY is not set");
    const vectors: number[][] = [];
    let tokens = 0;
    for (const batch of batches(texts, EMBED_BATCH)) {
      const body = JSON.stringify({ input: batch, model: VOYAGE_MODEL, input_type: kind, output_dimension: EMBED_DIM });
      for (let attempt = 1; ; attempt++) {
        const res = await deps.fetch(VOYAGE_URL, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${deps.key}` }, body });
        if (res.status === 429 && attempt < MAX_TRIES) { await deps.sleep(BASE_WAIT_MS * 2 ** (attempt - 1)); continue; }
        if (!res.ok) throw new Error(`Voyage embeddings failed (HTTP ${res.status}${res.status === 429 ? `, still rate-limited after ${MAX_TRIES} tries` : ""}): ${(await res.text()).slice(0, 300)}`);
        const data = (await res.json()) as { data?: { index: number; embedding: number[] }[]; usage?: { total_tokens?: number } };
        const rows = [...(data.data ?? [])].sort((a, b) => a.index - b.index);
        if (rows.length !== batch.length) throw new Error(`Voyage returned ${rows.length} embeddings for ${batch.length} texts`);
        vectors.push(...rows.map((r) => r.embedding));
        tokens += data.usage?.total_tokens ?? 0;
        break;
      }
    }
    return { vectors, tokens };
  };
}
