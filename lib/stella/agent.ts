import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { getAccount, listAccounts } from "@/lib/data";
import { buildExport, type ExportPart } from "@/lib/export";
import { listSources, readSource, search, searchExpertise } from "./corpus";
import { resolveRefs, splitEvidence, stripHistory, type Evidence, type KnownSource } from "./evidence";

// Stella: answers questions about one project, several, or all of them, from their vaults, books
// and research, with the evidence for each answer; writes documents and compiles exports. Manual streaming tool
// loop so every text delta, tool call and document reaches the browser.

export const MODEL = "claude-opus-5-5";
const MAX_TURNS = 10;

const RULES = `You are Stella, the strategy agent inside ClientOS at Supernal, an AI services firm. Strategists ask you about one client project, several, or all of them; the projects in scope are listed below.

How you work:
- Answer only from what the tools return. Search before you answer anything factual; read a source in full when an excerpt is not enough. With several projects in scope, search each one that matters (pass project) or all at once (leave project out).
- Keep source labels out of the prose of a chat answer. End every factual answer with one fenced code block tagged evidence holding a JSON array, one entry per key point: {"point": the point in a few words, "source": the source label exactly as the tool gave it, e.g. "File Technical Strategy/Feature-Rationale.md" or "Heritage · Book, chapter 2: Why they bought", "quote": a short quote from that source, at most 200 characters}. Nothing comes after the block. No evidence block when the reply only announces a document. Where it matters (disagreements, changes over time, dates), refer to a source in plain words in the prose, for example "the 3 Mar kickoff call". A claim you cannot source does not go in the answer. When comparing projects, say which project each fact belongs to.
- When sources disagree, say so and give both, each with its own evidence entry. Never pick one silently.
- If the sources do not hold the answer, say what is missing and where it would likely be found (a meeting, Linear, Account OS, Drive). Do not guess.
- "Why" questions usually have several causes. Give each one, in order of weight.
- Write plainly for a busy strategist: lead with the answer, short paragraphs or a short list, no preamble, no closing summary. Use each project's own names for people, products and documents.
- Files the strategist attached to their message are in the message itself; use them and say so when you do. They are not in the vault unless the strategist saves them.
- When asked for a document (a brief, a proposal section, a summary, meeting prep, a one-pager), write it with create_document rather than in the reply, then reply in one or two lines saying what it holds. Documents leave ClientOS, so they cite inline instead: every factual claim followed by its source label in square brackets, exactly as the tool gave it, e.g. [File Technical Strategy/Feature-Rationale.md]; a claim you cannot cite does not go in.
- When asked to export or pull together context from projects (their vault files, book, artifacts), use compile_export: it assembles the material itself, so do not retype it.
- You cannot change the vault. If the strategist asks for a change, draft it as a document and say it needs their approval; they can save a document to a project's vault themselves.`;

// Frameworks Stella always carries: how a vault is structured and what "product" means.
const FRAMEWORKS = ["Context-Model", "Product-Suite"];
function frameworks(): string {
  const dir = join(process.cwd(), "templates", "stella", "Frameworks");
  return FRAMEWORKS.map((n) => join(dir, `${n}.md`)).filter(existsSync).map((p) => readFileSync(p, "utf8")).join("\n\n---\n\n");
}

const projectParam = { type: "string", description: "Project name or slug from the projects in scope. Leave out to cover every project in scope." };

const tools: Anthropic.Tool[] = [
  {
    name: "search_context",
    description: "Keyword search across the vault files (the core Sales, Deal, Technical and Delivery Strategy templates filled for each project, plus files added for it), book chapters, deals, this week's items and artifact lists of the projects in scope. Returns ranked excerpts with a source id and label. Use several specific queries (names, products, dates, numbers) rather than one broad one.",
    input_schema: { type: "object", properties: { query: { type: "string", description: "Words to search for" }, project: projectParam, limit: { type: "integer", description: "Results to return, 1 to 12. Default 8." } }, required: ["query"], additionalProperties: false },
    eager_input_streaming: true,
  },
  {
    name: "read_source",
    description: "Read one source in full by the id that search_context, list_sources or search_expertise returned.",
    input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"], additionalProperties: false },
    eager_input_streaming: true,
  },
  {
    name: "list_sources",
    description: "List every source (vault files, book chapters, account summaries) of one project in scope, with ids and labels.",
    input_schema: { type: "object", properties: { project: projectParam }, additionalProperties: false },
    eager_input_streaming: true,
  },
  {
    name: "search_expertise",
    description: "Search the delivered projects outside the current scope, with projects in the same industry ranked first. Use it when scoping a deal, or when the strategist asks how a similar client was handled. Results are labelled with the project name; read one in full with read_source using its id. Never present another client's facts as this project's.",
    input_schema: { type: "object", properties: { query: { type: "string" }, limit: { type: "integer", description: "1 to 12. Default 8." } }, required: ["query"], additionalProperties: false },
    eager_input_streaming: true,
  },
  {
    name: "create_document",
    description: "Write a document the strategist can download, print or save to a project's vault: a brief, meeting prep, a proposal section, a one-pager, a comparison. Markdown, starting with a # title. Cite every factual claim inline with its source label in square brackets, exactly as the tool gave it, e.g. [File Technical Strategy/Feature-Rationale.md].",
    input_schema: { type: "object", properties: { title: { type: "string" }, content: { type: "string", description: "The full document in markdown" }, project: { type: "string", description: "The project it is about, if one" } }, required: ["title", "content"], additionalProperties: false },
    eager_input_streaming: true,
  },
  {
    name: "compile_export",
    description: "Assemble an export document from projects' own material: overview, filled vault files (optionally only some groups), book chapters and artifact list. Use for 'export', 'pull together', 'give me everything on'. The document is built from the vault directly; you get back its size, not its text.",
    input_schema: {
      type: "object",
      properties: {
        projects: { type: "array", items: { type: "string" }, description: "Project names or slugs; leave out for every project in scope" },
        parts: { type: "array", items: { type: "string", enum: ["overview", "vault", "book", "artifacts"] }, description: "Default overview, vault and book" },
        groups: { type: "array", items: { type: "string", enum: ["Sales Strategy", "Deal Strategy", "Technical Strategy", "Delivery Strategy"] }, description: "Vault groups to include; default all" },
        title: { type: "string" },
      },
      additionalProperties: false,
    },
    eager_input_streaming: true,
  },
];

export type StellaDocument = { id: string; title: string; content: string; projects: string[]; kind: "written" | "export" };

type Scope = { slugs: string[]; all: boolean; names: Map<string, string> };

function resolve(scope: Scope, key: unknown): string | null {
  if (typeof key !== "string" || !key.trim()) return null;
  const k = key.trim().toLowerCase();
  for (const s of scope.slugs) if (s === k || scope.names.get(s)?.toLowerCase() === k) return s;
  for (const s of scope.slugs) if (scope.names.get(s)?.toLowerCase().includes(k) || s.includes(k)) return s;
  return null;
}

async function runTool(scope: Scope, name: string, input: unknown, emit: (d: StellaDocument) => void): Promise<{ ok: boolean; content: string; summary: string; sources?: KnownSource[] }> {
  const args = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const multi = scope.slugs.length > 1;
  const pick = (): string[] | { error: string } => {
    if (args.project === undefined || args.project === "") return scope.slugs;
    const one = resolve(scope, args.project);
    return one ? [one] : { error: `No project "${String(args.project)}" in scope. In scope: ${scope.slugs.map((x) => scope.names.get(x)).join(", ")}.` };
  };

  if (name === "search_context") {
    if (typeof args.query !== "string" || !args.query.trim()) return { ok: false, content: "query must be a non-empty string", summary: "invalid search" };
    const which = pick();
    if ("error" in which) return { ok: false, content: which.error, summary: "unknown project" };
    const limit = Math.min(12, Math.max(1, Number(args.limit) || 8));
    const per = which.length > 1 ? Math.max(3, Math.ceil(limit / Math.min(which.length, 4))) : limit;
    const all = (await Promise.all(which.map(async (slug) => (await search(slug, args.query as string, per)).map((h) => multi ? { ...h, id: `${slug}|${h.id}`, label: `${scope.names.get(slug)} · ${h.label}` } : h)))).flat();
    const hits = all.sort((a, b) => b.score - a.score).slice(0, limit);
    const where = which.length === 1 && multi ? ` in ${scope.names.get(which[0])}` : "";
    return { ok: true, content: hits.length ? JSON.stringify(hits) : "No matches. Try other words: names, products, dates.", summary: `searched “${args.query}”${where} · ${hits.length} hits`, sources: hits.map((h) => ({ label: h.label, slug: which[0], id: h.id })) };
  }
  if (name === "read_source") {
    if (typeof args.id !== "string") return { ok: false, content: "id must be a string", summary: "invalid read" };
    const [other, inner] = args.id.includes("|") ? args.id.split("|", 2) : [scope.slugs[0], args.id];
    const s = await readSource(other, inner);
    const label = s && (other !== scope.slugs[0] || multi) ? `${(await getAccount(other))?.account.name ?? other} · ${s.label}` : s?.label;
    return s ? { ok: true, content: JSON.stringify({ id: args.id, label, text: s.text }), summary: `read ${label}`, sources: [{ label: label ?? s.label, slug: other, id: inner }] } : { ok: false, content: `No source with id ${args.id}. Call list_sources.`, summary: "source not found" };
  }
  if (name === "list_sources") {
    const which = pick();
    if ("error" in which) return { ok: false, content: which.error, summary: "unknown project" };
    const slug = which[0];
    const l = (await listSources(slug)).map((x) => multi ? { id: `${slug}|${x.id}`, label: `${scope.names.get(slug)} · ${x.label}` } : x);
    return { ok: true, content: JSON.stringify(l), summary: `listed ${l.length} sources${multi ? ` in ${scope.names.get(slug)}` : ""}`, sources: l.map((x) => ({ label: x.label, slug, id: x.id })) };
  }
  if (name === "search_expertise") {
    if (typeof args.query !== "string" || !args.query.trim()) return { ok: false, content: "query must be a non-empty string", summary: "invalid search" };
    const inScope = new Set(scope.slugs);
    const hits = (await searchExpertise(scope.slugs[0], args.query, 16)).filter((h) => !inScope.has(h.id.split("|")[0])).slice(0, Math.min(12, Math.max(1, Number(args.limit) || 8)));
    return { ok: true, content: hits.length ? JSON.stringify(hits) : "No matches in other projects.", summary: `searched other projects for “${args.query}” · ${hits.length} hits`, sources: hits.map((h) => ({ label: h.label, slug: h.id.split("|")[0], id: h.id })) };
  }
  if (name === "create_document") {
    if (typeof args.title !== "string" || typeof args.content !== "string" || !args.content.trim()) return { ok: false, content: "title and content (markdown) are required", summary: "invalid document" };
    const proj = resolve(scope, args.project);
    const doc: StellaDocument = { id: crypto.randomUUID(), title: args.title.trim(), content: args.content, projects: proj ? [proj] : scope.slugs.length <= 3 ? scope.slugs : [], kind: "written" };
    emit(doc);
    return { ok: true, content: `Document "${doc.title}" created (${doc.content.length} characters). It is shown to the strategist with download and save options.`, summary: `wrote “${doc.title}”` };
  }
  if (name === "compile_export") {
    const keys = Array.isArray(args.projects) && args.projects.length ? args.projects : scope.slugs;
    const slugs = keys.map((k) => resolve(scope, k)).filter((x): x is string => !!x);
    if (!slugs.length) return { ok: false, content: `None of those projects are in scope. In scope: ${scope.slugs.map((x) => scope.names.get(x)).join(", ")}.`, summary: "unknown project" };
    const bundles = (await Promise.all(slugs.map((x) => getAccount(x)))).filter((b): b is NonNullable<typeof b> => !!b);
    const groupNames = ["Sales Strategy", "Deal Strategy", "Technical Strategy", "Delivery Strategy"];
    const groups = Array.isArray(args.groups) ? args.groups.map((g) => groupNames.indexOf(String(g))).filter((n) => n >= 0) : undefined;
    const parts = Array.isArray(args.parts) ? (args.parts.filter((p) => ["overview", "vault", "book", "artifacts"].includes(String(p))) as ExportPart[]) : [];
    const out = buildExport(bundles, { parts, groups, title: typeof args.title === "string" ? args.title : undefined });
    emit({ id: crypto.randomUUID(), title: out.title, content: out.markdown, projects: slugs, kind: "export" });
    return { ok: true, content: `Export "${out.title}" built: ${out.stats.projects} projects, ${out.stats.files} vault files, ${out.stats.chapters} book chapters, ${Math.round(out.markdown.length / 1000)}k characters. It is shown to the strategist with download and save options.`, summary: `compiled “${out.title}”` };
  }
  return { ok: false, content: `Unknown tool ${name}`, summary: "unknown tool" };
}

async function projectHeader(slug: string): Promise<string> {
  const b = (await getAccount(slug))!;
  const a = b.account;
  const who = a.stage === "sales"
    ? `The deal: ${a.name}, in sales at stage ${a.deal?.stage}. Value ${a.deal?.value || "not set"}. Owner ${a.deal?.owner || "not set"}. Next step: ${a.deal?.nextStep || "none recorded"}. This deal is being scoped: most of its files are still empty templates. Use search_expertise to bring in what similar delivered projects learned, and label it as theirs.`
    : `The account: ${a.name}, in delivery. Strategist: ${a.strategist}. Pod: ${a.pod}. MRR ${a.mrr || "unknown"}, ${a.closedCount} closed deals worth ${a.closedValue || "unknown"}. Health ${a.health ? `${a.health.score} (${a.health.band})` : "not scored"}.`;
  return `${who}
Industry: ${a.industry || "not set"}. Squad: ${a.squad || "not set"}.
Book chapters: ${b.book.map((c, i) => `${i + 1}. ${c.title}`).join("; ") || "none yet"}.
Vault files: ${b.files.filter((f) => f.state === "active").map((f) => f.path).join("; ")}.`;
}

async function scopeHeader(scope: Scope): Promise<string> {
  if (scope.slugs.length === 1) return `Project in scope (slug ${scope.slugs[0]}):
${await projectHeader(scope.slugs[0])}`;
  const rows = await Promise.all(scope.slugs.map(async (slug) => {
    const a = (await getAccount(slug))!.account;
    const state = a.stage === "sales" ? `in sales, ${a.deal?.stage ?? ""}${a.deal?.value ? `, ${a.deal.value}` : ""}` : `in delivery${a.health ? `, health ${a.health.score} ${a.health.band}` : ""}${a.mrr ? `, MRR ${a.mrr}` : ""}`;
    return `- ${a.name} (slug ${slug}): ${state}; industry ${a.industry || "not set"}; squad ${a.squad || "not set"}`;
  }));
  return `${scope.all ? "Every project is in scope" : `${scope.slugs.length} projects are in scope`}. Search across them, or pass project to search one.
${rows.join("\n")}`;
}

export type StellaEvent =
  | { type: "text"; delta: string }
  | { type: "tool"; name: string; summary: string }
  /** The text streamed since the last reset was working notes before a tool call, not the answer. */
  | { type: "reset" }
  | { type: "document"; doc: StellaDocument }
  /** Where the answer's points came from, split off the end of the answer text; sent once, before done. */
  | { type: "evidence"; items: Evidence[] }
  | { type: "done"; stop: string; usage: { input: number; output: number; cacheRead: number } }
  | { type: "error"; message: string };

export type Attachment = { name: string; kind: "text" | "pdf"; text?: string; data?: string };
export type Turn = { role: "user" | "assistant"; content: string; attachments?: Attachment[] };

function userContent(t: Turn): Anthropic.Beta.BetaMessageContentParam {
  if (!t.attachments?.length) return t.content;
  const blocks: Anthropic.Beta.BetaContentBlockParam[] = [];
  for (const a of t.attachments) {
    if (a.kind === "pdf" && a.data) blocks.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: a.data }, title: a.name });
    else if (a.text) blocks.push({ type: "text", text: `Attached file: ${a.name}\n\n${a.text}` });
  }
  blocks.push({ type: "text", text: t.content });
  return blocks;
}

/** Ask Stella. scope: project slugs, or ["*"] for every project. */
export async function* askStella(scopeIn: string[], history: Turn[]): AsyncGenerator<StellaEvent> {
  const client = new Anthropic();
  const everyone = await listAccounts();
  const names = new Map(everyone.map((b) => [b.account.slug, b.account.name]));
  const all = scopeIn.includes("*");
  const slugs = all ? everyone.map((b) => b.account.slug) : scopeIn.filter((x) => names.has(x));
  if (!slugs.length) { yield { type: "error", message: "Choose at least one project." }; return; }
  const scope: Scope = { slugs, all, names };
  const messages: Anthropic.Beta.BetaMessageParam[] = stripHistory(history).map((m): Anthropic.Beta.BetaMessageParam => ({ role: m.role, content: m.role === "user" ? userContent(m) : m.content }));
  const system: Anthropic.Beta.BetaTextBlockParam[] = [
    { type: "text", text: `${RULES}\n\n# Your frameworks\n\n${frameworks()}`, cache_control: { type: "ephemeral" } },
    { type: "text", text: await scopeHeader(scope), cache_control: { type: "ephemeral" } },
  ];
  const docs: StellaDocument[] = [];
  const known: KnownSource[] = [];   // every source a tool returned this turn, to resolve evidence labels
  let said = "";                     // the answer text since the last reset
  const usage = { input: 0, output: 0, cacheRead: 0 };

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 64000,
      system,
      tools,
      messages,
      output_config: { effort: "medium" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
    });

    const queue: string[] = [];
    stream.on("text", (d) => queue.push(d));
    let message: Anthropic.Beta.BetaMessage | null = null;
    let failure: unknown = null;
    const done = stream.finalMessage().then((m) => { message = m; }, (e) => { failure = e; });
    while (!message && !failure) {
      await Promise.race([done, new Promise((r) => setTimeout(r, 60))]);
      while (queue.length) { const d = queue.shift()!; said += d; yield { type: "text", delta: d }; }
    }
    while (queue.length) { const d = queue.shift()!; said += d; yield { type: "text", delta: d }; }
    if (failure) {
      yield { type: "error", message: failure instanceof Anthropic.APIError ? `Claude API error ${failure.status}: ${failure.message}` : String(failure) };
      return;
    }
    const m = message as unknown as Anthropic.Beta.BetaMessage;
    usage.input += m.usage.input_tokens; usage.output += m.usage.output_tokens; usage.cacheRead += m.usage.cache_read_input_tokens ?? 0;

    if (m.stop_reason === "refusal") { yield { type: "text", delta: "\n\nI can’t help with that request." }; yield { type: "done", stop: "refusal", usage }; return; }
    const calls = m.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");
    if (!calls.length || m.stop_reason === "end_turn") {
      const { evidence } = splitEvidence(said);
      if (evidence.length) yield { type: "evidence", items: resolveRefs(evidence, known) };
      yield { type: "done", stop: String(m.stop_reason), usage };
      return;
    }
    if (m.stop_reason === "max_tokens") { yield { type: "error", message: "The answer ran past its length limit." }; return; }

    yield { type: "reset" };
    said = "";
    messages.push({ role: "assistant", content: m.content });
    const results: Anthropic.Beta.BetaToolResultBlockParam[] = await Promise.all(calls.map(async (c) => {
      const r = await runTool(scope, c.name, c.input, (d) => docs.push(d));
      if (r.sources) known.push(...r.sources);
      return { type: "tool_result", tool_use_id: c.id, content: r.content, is_error: !r.ok, _summary: r.summary } as Anthropic.Beta.BetaToolResultBlockParam & { _summary: string };
    }));
    for (const r of results as (Anthropic.Beta.BetaToolResultBlockParam & { _summary: string })[]) { yield { type: "tool", name: calls.find((c) => c.id === r.tool_use_id)!.name, summary: r._summary }; delete (r as { _summary?: string })._summary; }
    while (docs.length) yield { type: "document", doc: docs.shift()! };
    messages.push({ role: "user", content: results });
  }
  yield { type: "error", message: "Stopped after too many lookups. Ask a narrower question." };
}
