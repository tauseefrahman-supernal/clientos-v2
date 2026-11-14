import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { getAccount } from "@/lib/data";
import { listSources, readSource, search, searchExpertise } from "./corpus";

// Stella: answers questions about one account from its vault, book and research, with
// citations. Manual streaming tool loop so every text delta and tool call reaches the browser.

export const MODEL = "claude-opus-5-5";
const MAX_TURNS = 8;

const RULES = `You are Stella, the strategy agent inside ClientOS at Supernal, an AI services firm. Strategists ask you about one client account at a time.

How you work:
- Answer only from what the tools return for this account. Search before you answer anything factual; read a source in full when an excerpt is not enough.
- Cite every factual claim with the source label in square brackets, exactly as the tool gave it, e.g. [File Technical Strategy/Feature-Rationale.md] or [Book, chapter 2: Why they bought]. A claim you cannot cite does not go in the answer.
- When sources disagree, say so and give both, with their citations. Never pick one silently.
- If the sources do not hold the answer, say what is missing and where it would likely be found (a meeting, Linear, Account OS, Drive). Do not guess.
- "Why" questions usually have several causes. Give each one, in order of weight.
- Write plainly for a busy strategist: lead with the answer, short paragraphs or a short list, no preamble, no closing summary. Use the account's own names for people, products and documents.
- You cannot change anything. If the strategist asks for a change, draft it and say it needs their approval.`;

// Frameworks Stella always carries: how a vault is structured and what "product" means.
const FRAMEWORKS = ["Context-Model", "Product-Suite"];
function frameworks(): string {
  const dir = join(process.cwd(), "templates", "stella", "Frameworks");
  return FRAMEWORKS.map((n) => join(dir, `${n}.md`)).filter(existsSync).map((p) => readFileSync(p, "utf8")).join("\n\n---\n\n");
}

const tools: Anthropic.Tool[] = [
  {
    name: "search_context",
    description: "Keyword search across this account's vault files (the core Sales, Deal, Technical and Delivery Strategy templates, filled for this account, plus any files added for it), book chapters, deals, this week's items and artifact list. Returns ranked excerpts with a source id and label. Use several specific queries (names, products, dates, numbers) rather than one broad one.",
    input_schema: { type: "object", properties: { query: { type: "string", description: "Words to search for" }, limit: { type: "integer", description: "Results to return, 1 to 12. Default 8." } }, required: ["query"], additionalProperties: false },
    eager_input_streaming: true,
  },
  {
    name: "read_source",
    description: "Read one source in full by the id that search_context or list_sources returned.",
    input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"], additionalProperties: false },
    eager_input_streaming: true,
  },
  {
    name: "list_sources",
    description: "List every source available for this account (vault files, book chapters, account summaries) with ids and labels.",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
    eager_input_streaming: true,
  },
  {
    name: "search_expertise",
    description: "Search the other projects Supernal has delivered, with projects in the same industry ranked first. Use it when scoping a deal, or when the strategist asks how a similar client was handled: what they bought, how the deal was structured, what the product looked like, what went wrong. Results are labelled with the project name; read one in full with read_source using its id. Never present another client's facts as this account's.",
    input_schema: { type: "object", properties: { query: { type: "string" }, limit: { type: "integer", description: "1 to 12. Default 8." } }, required: ["query"], additionalProperties: false },
    eager_input_streaming: true,
  },
];

function runTool(slug: string, name: string, input: unknown): { ok: boolean; content: string; summary: string } {
  const args = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  if (name === "search_context") {
    if (typeof args.query !== "string" || !args.query.trim()) return { ok: false, content: "query must be a non-empty string", summary: "invalid search" };
    const limit = Math.min(12, Math.max(1, Number(args.limit) || 8));
    const hits = search(slug, args.query, limit);
    return { ok: true, content: hits.length ? JSON.stringify(hits) : "No matches. Try other words: names, products, dates.", summary: `searched “${args.query}” · ${hits.length} hits` };
  }
  if (name === "read_source") {
    if (typeof args.id !== "string") return { ok: false, content: "id must be a string", summary: "invalid read" };
    const [other, inner] = args.id.includes("|") ? args.id.split("|", 2) : [slug, args.id];
    const s = readSource(other, inner);
    return s ? { ok: true, content: JSON.stringify({ id: s.id, label: s.label, text: s.text }), summary: `read ${s.label}` } : { ok: false, content: `No source with id ${args.id}. Call list_sources.`, summary: "source not found" };
  }
  if (name === "list_sources") {
    const l = listSources(slug);
    return { ok: true, content: JSON.stringify(l), summary: `listed ${l.length} sources` };
  }
  if (name === "search_expertise") {
    if (typeof args.query !== "string" || !args.query.trim()) return { ok: false, content: "query must be a non-empty string", summary: "invalid search" };
    const hits = searchExpertise(slug, args.query, Math.min(12, Math.max(1, Number(args.limit) || 8)));
    return { ok: true, content: hits.length ? JSON.stringify(hits) : "No matches in other projects.", summary: `searched other projects for “${args.query}” · ${hits.length} hits` };
  }
  return { ok: false, content: `Unknown tool ${name}`, summary: "unknown tool" };
}

function projectHeader(slug: string): string {
  const b = getAccount(slug)!;
  const a = b.account;
  const who = a.stage === "sales"
    ? `The deal: ${a.name}, in sales at stage ${a.deal?.stage}. Value ${a.deal?.value || "not set"}. Owner ${a.deal?.owner || "not set"}. Next step: ${a.deal?.nextStep || "none recorded"}. This deal is being scoped: most of its files are still empty templates. Use search_expertise to bring in what similar delivered projects learned, and label it as theirs.`
    : `The account: ${a.name}, in delivery. Strategist: ${a.strategist}. Pod: ${a.pod}. MRR ${a.mrr || "unknown"}, ${a.closedCount} closed deals worth ${a.closedValue || "unknown"}. Health ${a.health ? `${a.health.score} (${a.health.band})` : "not scored"}.`;
  return `${who}
Industry: ${a.industry || "not set"}. Squad: ${a.squad || "not set"}.
Book chapters: ${b.book.map((c, i) => `${i + 1}. ${c.title}`).join("; ") || "none yet"}.
Vault files: ${b.files.filter((f) => f.state === "active").map((f) => f.path).join("; ")}.`;
}

export type StellaEvent =
  | { type: "text"; delta: string }
  | { type: "tool"; name: string; summary: string }
  /** The text streamed since the last reset was working notes before a tool call, not the answer. */
  | { type: "reset" }
  | { type: "done"; stop: string; usage: { input: number; output: number; cacheRead: number } }
  | { type: "error"; message: string };

export async function* askStella(slug: string, history: { role: "user" | "assistant"; content: string }[]): AsyncGenerator<StellaEvent> {
  const client = new Anthropic();
  const messages: Anthropic.Beta.BetaMessageParam[] = history.map((m) => ({ role: m.role, content: m.content }));
  const system: Anthropic.Beta.BetaTextBlockParam[] = [
    { type: "text", text: `${RULES}\n\n# Your frameworks\n\n${frameworks()}`, cache_control: { type: "ephemeral" } },
    { type: "text", text: projectHeader(slug), cache_control: { type: "ephemeral" } },
  ];
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
      while (queue.length) yield { type: "text", delta: queue.shift()! };
    }
    while (queue.length) yield { type: "text", delta: queue.shift()! };
    if (failure) {
      yield { type: "error", message: failure instanceof Anthropic.APIError ? `Claude API error ${failure.status}: ${failure.message}` : String(failure) };
      return;
    }
    const m = message as unknown as Anthropic.Beta.BetaMessage;
    usage.input += m.usage.input_tokens; usage.output += m.usage.output_tokens; usage.cacheRead += m.usage.cache_read_input_tokens ?? 0;

    if (m.stop_reason === "refusal") { yield { type: "text", delta: "\n\nI can’t help with that request." }; yield { type: "done", stop: "refusal", usage }; return; }
    const calls = m.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");
    if (!calls.length || m.stop_reason === "end_turn") { yield { type: "done", stop: String(m.stop_reason), usage }; return; }
    if (m.stop_reason === "max_tokens") { yield { type: "error", message: "The answer ran past its length limit." }; return; }

    yield { type: "reset" };
    messages.push({ role: "assistant", content: m.content });
    const results: Anthropic.Beta.BetaToolResultBlockParam[] = calls.map((c) => {
      const r = runTool(slug, c.name, c.input);
      return { type: "tool_result", tool_use_id: c.id, content: r.content, is_error: !r.ok, _summary: r.summary } as Anthropic.Beta.BetaToolResultBlockParam & { _summary: string };
    });
    for (const r of results as (Anthropic.Beta.BetaToolResultBlockParam & { _summary: string })[]) { yield { type: "tool", name: calls.find((c) => c.id === r.tool_use_id)!.name, summary: r._summary }; delete (r as { _summary?: string })._summary; }
    messages.push({ role: "user", content: results });
  }
  yield { type: "error", message: "Stopped after too many lookups. Ask a narrower question." };
}
