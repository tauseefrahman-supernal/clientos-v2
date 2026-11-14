import "server-only";
import { getAccount, listAccounts, listTemplates } from "@/lib/data";
import { relatedByIndustry } from "@/lib/data/related";
import { fileMarkdown } from "@/lib/data/render";

// Stella's searchable memory for one account: its vault files (core templates filled with the
// account's research), book chapters and account summaries. Built from what the strategist can see, minus
// anything hidden, archived, deleted or sensitive. Keyword ranking today; the `chunks` table
// with embeddings replaces it once the Supabase backend is in.

export interface Source { id: string; kind: "file" | "chapter" | "account"; label: string; text: string }
export interface Hit { id: string; label: string; excerpt: string; score: number }

const CHUNK = 1600;

function split(id: string, kind: Source["kind"], label: string, text: string): Source[] {
  if (text.length <= CHUNK) return [{ id, kind, label, text }];
  const parts: Source[] = [];
  const paras = text.split(/\n\n+/);
  let buf = "";
  for (const p of paras) {
    if (buf && buf.length + p.length > CHUNK) { parts.push({ id: `${id}#${parts.length + 1}`, kind, label: `${label} (part ${parts.length + 1})`, text: buf }); buf = ""; }
    buf += (buf ? "\n\n" : "") + p;
  }
  if (buf) parts.push({ id: `${id}#${parts.length + 1}`, kind, label: parts.length ? `${label} (part ${parts.length + 1})` : label, text: buf });
  return parts;
}

const cache = new Map<string, { stamp: string; sources: Source[] }>();

export function corpus(slug: string): Source[] {
  const b = getAccount(slug);
  if (!b) return [];
  const stamp = b.files.map((f) => `${f.path}:${f.state}:${f.content.length}`).join("|");
  const hit = cache.get(slug);
  if (hit && hit.stamp === stamp) return hit.sources;

  const templates = listTemplates();
  const out: Source[] = [];
  for (const f of b.files.filter((x) => x.state === "active")) {
    const { markdown } = fileMarkdown(b, f, templates);
    out.push(...split(`file:${f.path}`, "file", `File ${f.path}.md`, markdown));
  }
  b.book.forEach((c, i) => out.push(...split(`chapter:${i}`, "chapter", `Book, chapter ${i + 1}: ${c.title}`, `${c.body}\n\nSources: ${c.sources.join("; ")}`)));
  const o = b.overview;
  const artifacts = b.artifacts.filter((a) => !a.sensitive);
  out.push({ id: "account:deals", kind: "account", label: "Account: deals", text: o.deals.map((d) => `${d.name} · ${d.value} · ${d.stage}. ${d.note}`).join("\n") + (o.lost ? `\nLost: ${o.lost}` : "") });
  out.push({ id: "account:this-week", kind: "account", label: "Account: this week", text: [...o.decisions.map((d) => `Decision: ${d.title}. ${d.detail}`), ...o.slipping.map((s) => `${s.kind}: ${s.item}. ${s.detail}`), ...o.dates.map((d) => `${d.when}: ${d.what}`)].join("\n") });
  out.push({ id: "account:artifacts", kind: "account", label: "Account: artifacts list", text: artifacts.map((a) => `${a.kind}: ${a.title} (${a.dated}) ${a.description}${a.url ? ` <${a.url}>` : ""}`).join("\n") });
  out.push({ id: "account:disagreements", kind: "account", label: "Account: where sources disagree", text: o.disagreements.join("\n") });

  cache.set(slug, { stamp, sources: out });
  return out;
}

const STOP = new Set("the a an and or of to in on for with is are was were be by at as it its this that from what why how who when which did does do".split(" "));
const IRREGULAR: Record<string, string> = { bought: "buy", buying: "buy", sold: "sell", won: "win", paid: "pay", built: "build", chose: "choose", chosen: "choose", decided: "decide", decision: "decide", decisions: "decide" };
const stem = (w: string) => IRREGULAR[w] ?? (w.length > 5 ? w.replace(/(ations?|ings?|edly|ed|es|s)$/, "") : w.length > 3 ? w.replace(/s$/, "") : w);
const terms = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}$%.]+/gu, " ").split(" ").filter((w) => w.length > 1 && !STOP.has(w)).map(stem);

/** BM25-style ranking over the account's sources. */
export function search(slug: string, query: string, limit = 8): Hit[] {
  const docs = corpus(slug);
  const q = Array.from(new Set(terms(query)));
  if (!q.length) return [];
  const toks = docs.map((d) => { const l = terms(d.label); return [...l, ...l, ...l, ...terms(d.text)]; }); // label words count three times
  const avg = toks.reduce((n, t) => n + t.length, 0) / Math.max(toks.length, 1);
  const df = new Map(q.map((w) => [w, toks.filter((t) => t.includes(w)).length]));
  const scored = docs.map((d, i) => {
    const t = toks[i];
    let s = 0;
    for (const w of q) {
      const f = t.filter((x) => x === w).length;
      if (!f) continue;
      const idf = Math.log(1 + (docs.length - df.get(w)! + 0.5) / (df.get(w)! + 0.5));
      s += idf * ((f * 2.2) / (f + 1.2 * (0.25 + 0.75 * (t.length / avg))));
    }
    return { d, s };
  }).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, limit);
  return scored.map(({ d, s }) => ({ id: d.id, label: d.label, score: Math.round(s * 100) / 100, excerpt: excerpt(d.text, q) }));
}

function excerpt(text: string, q: string[]): string {
  const lower = text.toLowerCase();
  const at = Math.max(0, Math.min(...q.map((w) => { const i = lower.indexOf(w); return i < 0 ? Infinity : i; }).filter(Number.isFinite), text.length) - 200);
  return (at > 0 ? "…" : "") + text.slice(at, at + 700) + (at + 700 < text.length ? "…" : "");
}

export function readSource(slug: string, id: string): Source | null {
  const docs = corpus(slug);
  const exact = docs.find((d) => d.id === id);
  if (exact) return exact;
  const parts = docs.filter((d) => d.id.startsWith(`${id}#`));
  return parts.length ? { ...parts[0], id, label: parts[0].label.replace(/ \(part \d+\)$/, ""), text: parts.map((p) => p.text).join("\n\n") } : null;
}

export function listSources(slug: string) {
  const seen = new Set<string>();
  return corpus(slug).map((d) => ({ id: d.id.split("#")[0], label: d.label.replace(/ \(part \d+\)$/, "") })).filter((d) => !seen.has(d.id) && seen.add(d.id));
}

/** Search the delivered projects other than this one. Projects in the same industry rank first. */
export function searchExpertise(slug: string, query: string, limit = 8): (Hit & { project: string; sameIndustry: boolean })[] {
  const me = getAccount(slug);
  if (!me) return [];
  const same = new Set(relatedByIndustry(me, listAccounts()).map((r) => r.bundle.account.slug));
  const out: (Hit & { project: string; sameIndustry: boolean })[] = [];
  for (const b of listAccounts()) {
    if (b.account.slug === slug || b.account.stage !== "delivery") continue;
    const boost = same.has(b.account.slug) ? 1.5 : 1;
    for (const h of search(b.account.slug, query, 4)) out.push({ ...h, id: `${b.account.slug}|${h.id}`, label: `${b.account.name} · ${h.label}`, score: Math.round(h.score * boost * 100) / 100, project: b.account.name, sameIndustry: boost > 1 });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, limit);
}
