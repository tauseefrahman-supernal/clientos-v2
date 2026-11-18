// Evidence behind a Stella answer. Stella ends a factual answer with one fenced block tagged
// `evidence` holding a JSON array of { point, source, quote }. The block is split off the shown
// answer and rendered as an "Evidence (N)" toggle under it. Pure: used by the agent, the chat
// storage and the browser.

export type EvidenceKind = "file" | "chapter" | "call" | "project" | "attachment" | "other";
export type EvidenceRef = { kind: EvidenceKind; slug: string | null; id: string | null; at: string | null };
export type Evidence = { point: string; source: string; quote: string | null; ref: EvidenceRef };
/** A source a tool returned in this turn: its label as shown to Stella, the project, and its corpus id. */
export type KnownSource = { label: string; slug: string; id: string };

const KINDS: EvidenceKind[] = ["file", "chapter", "call", "project", "attachment", "other"];
const MAX_QUOTE = 200;
const OPEN = /(^|\n)[ \t]*```evidence[^\n]*(\n|$)/;
const CLOSE = /(^|\n)[ \t]*```[ \t]*(\n|$)/;
const FENCE = /(^|\n)[ \t]*```/g;

export const noRef = (): EvidenceRef => ({ kind: "other", slug: null, id: null, at: null });

const str = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);

function cleanRef(raw: unknown): EvidenceRef {
  if (!raw || typeof raw !== "object") return noRef();
  const r = raw as Record<string, unknown>;
  if (!KINDS.includes(r.kind as EvidenceKind)) return noRef();
  return { kind: r.kind as EvidenceKind, slug: str(r.slug), id: str(r.id), at: str(r.at) };
}

function cleanItem(raw: unknown): Evidence | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const point = str(r.point);
  const source = str(r.source)?.replace(/^\[(.*)\]$/, "$1").trim();
  if (!point || !source) return null;
  let quote = str(r.quote);
  if (quote && quote.length > MAX_QUOTE) quote = `${quote.slice(0, MAX_QUOTE - 1).trimEnd()}…`;
  return { point, source, quote, ref: cleanRef(r.ref) };
}

/** Remove the evidence block from an answer and parse it. A malformed block is dropped; no block leaves the text as is. */
export function splitEvidence(text: string): { answer: string; evidence: Evidence[] } {
  const open = OPEN.exec(text);
  if (!open) return { answer: text, evidence: [] };
  const before = text.slice(0, open.index);
  const rest = text.slice(open.index + open[0].length);
  const close = CLOSE.exec(rest);
  const body = close ? rest.slice(0, close.index) : rest;
  const after = close ? rest.slice(close.index + close[0].length) : "";
  let evidence: Evidence[] = [];
  try {
    const parsed: unknown = JSON.parse(body);
    if (Array.isArray(parsed)) evidence = parsed.map(cleanItem).filter((e): e is Evidence => !!e);
  } catch { /* malformed: shown without evidence */ }
  const answer = [before.trimEnd(), after.trim()].filter(Boolean).join("\n\n");
  return { answer, evidence };
}

/** The part of a streaming answer to show: everything before an evidence block, including one still being typed. */
export function visibleAnswer(text: string): string {
  const open = OPEN.exec(text);
  if (open) return text.slice(0, open.index).trimEnd();
  const partial = /(^|\n)[ \t]*`{1,3}(e(v(i(d(e(n(c(e)?)?)?)?)?)?)?)?$/.exec(text);
  if (partial) {
    // An odd number of fences before it means this one closes a code block, so keep it.
    const fences = (text.slice(0, partial.index).match(FENCE) ?? []).length;
    if (fences % 2 === 0) return text.slice(0, partial.index).trimEnd();
  }
  return text;
}

const norm = (s: string) => s.trim().replace(/^\[(.*)\]$/, "$1").replace(/ \(part \d+\)$/, "").trim().toLowerCase();
const bare = (s: string) => norm(s).replace(/^[^·]+ · /, "");

function refFor(k: KnownSource): EvidenceRef {
  const [slug, inner] = k.id.includes("|") ? (k.id.split("|", 2) as [string, string]) : [k.slug, k.id];
  const id = inner.replace(/#\d+$/, "");
  if (id.startsWith("file:")) return { kind: "file", slug, id: id.slice(5), at: null };
  if (id.startsWith("chapter:")) return { kind: "chapter", slug, id: id.slice(8), at: null };
  if (id.startsWith("account:")) return { kind: "project", slug, id, at: null };
  return noRef();
}

/** Resolve each evidence label against the sources the tools returned in the same turn. Unknown labels stay plain. */
export function resolveRefs(evidence: Evidence[], known: KnownSource[]): Evidence[] {
  return evidence.map((e) => {
    const exact = known.find((k) => norm(k.label) === norm(e.source));
    if (exact) return { ...e, ref: refFor(exact) };
    // Same label with or without a project prefix, if it points at one source only
    const loose = [...new Map(known.filter((k) => bare(k.label) === bare(e.source)).map((k) => { const r = refFor(k); return [`${r.kind}|${r.slug}|${r.id}`, r]; })).values()];
    return loose.length === 1 ? { ...e, ref: loose[0] } : { ...e, ref: noRef() };
  });
}

/** Where a source opens in ClientOS, or null when it has no page. */
export function evidenceHref(ref: EvidenceRef): string | null {
  if (!ref.slug) return null;
  const base = `/projects/${encodeURIComponent(ref.slug)}`;
  if (ref.kind === "file" && ref.id) return `${base}/vault?file=${encodeURIComponent(ref.id)}`;
  if (ref.kind === "chapter" && ref.id && /^\d+$/.test(ref.id)) return `${base}/book?c=${ref.id}`;
  if (ref.kind === "project") return base;
  return null;
}

/** An answer with its evidence appended as a block, for storing in one text column. */
export function joinEvidence(answer: string, evidence: Evidence[]): string {
  return evidence.length ? `${answer}\n\n\`\`\`evidence\n${JSON.stringify(evidence)}\n\`\`\`` : answer;
}
