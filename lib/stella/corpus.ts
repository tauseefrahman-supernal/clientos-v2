import "server-only";
import { getAccount, listTemplates } from "@/lib/data";
import { fileMarkdown } from "@/lib/data/render";

// Stella's readable sources for one account: its vault files (core templates filled with the account's
// research), book chapters and account summaries, for list_sources and read_source. Built from what the
// strategist can see, minus anything hidden, archived, deleted or sensitive. Searching is done by
// lib/memory/search.ts over the indexed chunks, not here.

export interface Source { id: string; kind: "file" | "chapter" | "account"; label: string; text: string }

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

export async function corpus(slug: string): Promise<Source[]> {
  const b = await getAccount(slug);
  if (!b) return [];
  const stamp = b.files.map((f) => `${f.path}:${f.state}:${f.content.length}`).join("|");
  const hit = cache.get(slug);
  if (hit && hit.stamp === stamp) return hit.sources;

  const templates = await listTemplates();
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
  if (b.recordings.length) out.push(...split("account:recordings", "account", "Account: recordings list", b.recordings.map((m) => `${m.date.slice(0, 10)} · ${m.title} (${m.provider}, ${m.kind}${m.participants.length ? `; ${m.participants.slice(0, 6).join(", ")}` : ""}): ${m.headline || m.summary}`).join("\n")));
  out.push({ id: "account:disagreements", kind: "account", label: "Account: where sources disagree", text: o.disagreements.join("\n") });

  cache.set(slug, { stamp, sources: out });
  return out;
}

export async function readSource(slug: string, id: string): Promise<Source | null> {
  const docs = await corpus(slug);
  const exact = docs.find((d) => d.id === id);
  if (exact) return exact;
  const parts = docs.filter((d) => d.id.startsWith(`${id}#`));
  return parts.length ? { ...parts[0], id, label: parts[0].label.replace(/ \(part \d+\)$/, ""), text: parts.map((p) => p.text).join("\n\n") } : null;
}

export async function listSources(slug: string) {
  const seen = new Set<string>();
  return (await corpus(slug)).map((d) => ({ id: d.id.split("#")[0], label: d.label.replace(/ \(part \d+\)$/, "") })).filter((d) => !seen.has(d.id) && seen.add(d.id));
}
