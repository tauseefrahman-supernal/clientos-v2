// Evidence behind a Stella answer. Stella ends a factual answer with one fenced block tagged
// `evidence` holding a JSON array of { point, source, quote }. The block is split off the shown
// answer and rendered as an "Evidence (N)" toggle under it. Pure: used by the agent, the chat
// storage and the browser.

export type EvidenceKind = "file" | "chapter" | "call" | "project" | "attachment" | "other";
/** url: a call's recording link (http or https only), set on call refs. */
export type EvidenceRef = { kind: EvidenceKind; slug: string | null; id: string | null; at: string | null; url?: string | null };
export type Evidence = { point: string; source: string; quote: string | null; ref: EvidenceRef };
/** A source a tool returned in this turn: its label as shown to Stella, the project, and its corpus id. */
export type KnownSource = { label: string; slug: string; id: string; url?: string | null; at?: string | null };

const KINDS: EvidenceKind[] = ["file", "chapter", "call", "project", "attachment", "other"];
const MAX_QUOTE = 200;
const OPEN = /```evidence[^\n`]*/;
const FENCE = /(^|\n)[ \t]*```/g;
const FINAL_JSON = /(^|\n)[ \t]*```json[^\n]*\n([\s\S]*?)```\s*$/;

export const noRef = (): EvidenceRef => ({ kind: "other", slug: null, id: null, at: null });

const str = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);
const webUrl = (v: unknown): string | null => { const s = str(v); return s && /^https?:\/\/[^\s]+$/i.test(s) ? s : null; };

function cleanRef(raw: unknown): EvidenceRef {
  if (!raw || typeof raw !== "object") return noRef();
  const r = raw as Record<string, unknown>;
  if (!KINDS.includes(r.kind as EvidenceKind)) return noRef();
  const ref: EvidenceRef = { kind: r.kind as EvidenceKind, slug: str(r.slug), id: str(r.id), at: str(r.at) };
  if (ref.kind === "call") ref.url = webUrl(r.url);
  return ref;
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

function parseItems(body: string): unknown[] | null {
  try { const v: unknown = JSON.parse(body); return Array.isArray(v) ? v : null; } catch { return null; }
}

const joinParts = (parts: string[]) => parts.map((p) => p.trim()).filter(Boolean).join("\n\n");

/**
 * Remove every evidence block from an answer and merge their entries; a malformed block is dropped.
 * A final ```json block that is an array of { point, source } counts as evidence too. No block leaves the text as is.
 */
export function splitEvidence(text: string): { answer: string; evidence: Evidence[] } {
  const parts: string[] = [];
  const evidence: Evidence[] = [];
  let rest = text, found = false;
  for (let open = OPEN.exec(rest); open; open = OPEN.exec(rest)) {
    found = true;
    parts.push(rest.slice(0, open.index));
    const after = rest.slice(open.index + open[0].length);
    const close = after.indexOf("```");
    const body = close >= 0 ? after.slice(0, close) : after;
    rest = close >= 0 ? after.slice(close + 3) : "";
    for (const it of parseItems(body) ?? []) { const e = cleanItem(it); if (e) evidence.push(e); }
  }
  parts.push(rest);
  let answer = found ? joinParts(parts) : text;
  const json = FINAL_JSON.exec(answer);
  const items = json ? parseItems(json[2]) : null;
  if (json && items?.length && items.every((it) => !!cleanItem(it))) {
    evidence.push(...items.map((it) => cleanItem(it)!));
    answer = answer.slice(0, json.index).trim();
  }
  return { answer, evidence };
}

/** The part of a streaming answer to show: everything before an evidence block, including one still being typed. */
export function visibleAnswer(text: string): string {
  const open = OPEN.exec(text);
  if (open) return text.slice(0, open.index).trimEnd();
  const partial = /`{1,3}(e(v(i(d(e(n(c(e)?)?)?)?)?)?)?)?$/.exec(text);
  if (partial) {
    // An odd number of fences before it means this one closes a code block, so keep it.
    const fences = (text.slice(0, partial.index).match(FENCE) ?? []).length;
    const bare = partial[0].replace(/`/g, "");
    // Mid-line backticks only count once a letter of "evidence" follows, so inline code is not cut.
    const lineStart = partial.index === 0 || text[partial.index - 1] === "\n";
    if (fences % 2 === 0 && (lineStart || (partial[0].startsWith("```") && bare))) return text.slice(0, partial.index).trimEnd();
  }
  return text;
}

/** Turns to send back to Stella: assistant turns without evidence, and never empty (so roles keep alternating). */
export function stripHistory<T extends { role: "user" | "assistant"; content: string }>(turns: T[]): T[] {
  return turns.map((t) => (t.role === "assistant" ? { ...t, content: splitEvidence(t.content).answer || "(answered)" } : t));
}

const norm = (s: string) => s.trim().replace(/^\[(.*)\]$/, "$1").replace(/ \(part \d+\)$/, "").trim().toLowerCase();
const bare = (s: string) => norm(s).replace(/^[^·]+ · /, "");

function refFor(k: KnownSource): EvidenceRef {
  const [slug, inner] = k.id.includes("|") ? (k.id.split("|", 2) as [string, string]) : [k.slug, k.id];
  const id = inner.replace(/#\d+$/, "");
  if (id.startsWith("file:")) return { kind: "file", slug, id: id.slice(5), at: null };
  if (id.startsWith("chapter:")) return { kind: "chapter", slug, id: id.slice(8), at: null };
  if (id.startsWith("account:")) return { kind: "project", slug, id, at: null };
  if (id.startsWith("call:")) return { kind: "call", slug, id: id.slice(5), at: k.at ?? null, url: webUrl(k.url) };
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

/** Where a source opens: a ClientOS page, a call's recording link (opens outside ClientOS), or null. */
export function evidenceHref(ref: EvidenceRef): string | null {
  if (ref.kind === "call") return webUrl(ref.url);
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
