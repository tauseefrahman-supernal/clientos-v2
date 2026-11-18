// Shapes shared by Stella's memory: calls pulled from Granola or Fathom, and search results.
// Pure types, safe to import from client and server code.

/** One speaker turn of a call; start is seconds from the beginning when the source has it. */
export interface Turn { speaker: string; start: number | null; text: string }

/** A call as the source gives it, before screening and storage. */
export interface SourceCall {
  provider: "granola" | "fathom";
  externalId: string;
  title: string;
  metAt: string;
  participants: { name: string; email: string | null }[];
  url: string;
  sourceSummary: string;
  turns: Turn[] | null;
}

export type Layer = "vault" | "chapter" | "summary" | "transcript";

/** One row from clientos.search_chunks, with the project slug resolved. */
export interface SearchHit {
  chunkId: string;
  transcriptId: string | null;
  slug: string;
  layer: Layer;
  label: string;
  excerpt: string;
  metAt: string | null;
  speakers: string[];
  score: number;
}
