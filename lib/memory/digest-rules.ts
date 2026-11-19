// Pure rules for call digests: cost estimate and output validation.
// No network, no DB; the server module lib/memory/digest.ts imports this.

export const DIGEST_MODEL = "claude-opus-5-5";
/** Dollars per million tokens. */
export const INPUT_PER_M = 4;
export const OUTPUT_PER_M = 20;
/** Prompt cache prices on claude-opus-5-5: reads $0.20/M, 5-minute writes 1.25x input. */
export const CACHE_READ_PER_M = 0.2;
export const CACHE_WRITE_PER_M = 5;
/** Assumed output size of one digest call, in tokens, until a run has measured it (measured 1,865 over 4 live calls, 18 Nov). */
export const ASSUMED_OUTPUT_TOKENS = 1900;
const CHARS_PER_TOKEN = 4;
/**
 * claude-opus-5-5's tokenizer makes more tokens than the usual 4 characters per token for these transcripts: a live run
 * averaged 25,445 input tokens per call where chars/4 predicted far fewer. Character counts are scaled by this factor.
 */
export const TOKENS_PER_CHAR_FACTOR = 1.35;

/** Estimated tokens for a character count: chars / 4 x TOKENS_PER_CHAR_FACTOR, rounded up. */
export function tokensForChars(chars: number): number {
  return Math.max(0, Math.ceil((Math.max(0, chars) / CHARS_PER_TOKEN) * TOKENS_PER_CHAR_FACTOR - 1e-9));
}

/** Calls are digested from this many days back unless since or transcriptIds says otherwise. */
export const DEFAULT_WINDOW_DAYS = 30;

/** Which calls a digest or estimate covers: a met_at window (default the last 30 days, or since), or chosen call ids at any date. */
export function digestSelection(o: { since?: string; transcriptIds?: string[] }, now: Date):
  { kind: "window"; since: string; label: string } | { kind: "ids"; ids: string[]; label: string } {
  if (o.transcriptIds?.length) {
    const ids = [...new Set(o.transcriptIds)];
    return { kind: "ids", ids, label: `${ids.length} chosen call${ids.length === 1 ? "" : "s"}, any date` };
  }
  if (o.since) {
    const since = new Date(Date.parse(o.since)).toISOString();
    return { kind: "window", since, label: `calls since ${since.slice(0, 10)} (given)` };
  }
  const since = new Date(now.getTime() - DEFAULT_WINDOW_DAYS * 86_400_000).toISOString();
  return { kind: "window", since, label: `calls since ${since.slice(0, 10)} (the last ${DEFAULT_WINDOW_DAYS} days, the default)` };
}

export function estimateCost(calls: { chars: number }[]): { calls: number; inputTokens: number; dollars: number } {
  const inputTokens = calls.reduce((n, c) => n + tokensForChars(c.chars), 0);
  const outputTokens = calls.length * ASSUMED_OUTPUT_TOKENS;
  const dollars = (inputTokens / 1e6) * INPUT_PER_M + (outputTokens / 1e6) * OUTPUT_PER_M;
  return { calls: calls.length, inputTokens, dollars };
}

export type Usage = { input: number; output: number; cacheRead?: number; cacheWrite?: number };
export type Dollars = { input: number; cacheRead: number; cacheWrite: number; output: number; total: number };

/** What a call's token usage cost, by part. */
export function costOf(u: Usage): Dollars {
  const input = (u.input / 1e6) * INPUT_PER_M;
  const cacheRead = ((u.cacheRead ?? 0) / 1e6) * CACHE_READ_PER_M;
  const cacheWrite = ((u.cacheWrite ?? 0) / 1e6) * CACHE_WRITE_PER_M;
  const output = (u.output / 1e6) * OUTPUT_PER_M;
  return { input, cacheRead, cacheWrite, output, total: input + cacheRead + cacheWrite + output };
}

/**
 * The estimate of the real requests: each call's stable prefix (system prompt + its projects' outline, stableChars) is
 * a cache write on the first call of its group and a cache read after; its transcript is plain input; output is the
 * measured average, else ASSUMED_OUTPUT_TOKENS. Calls are counted in the order given (the order they will run).
 * A group marked cacheable: false (prefix under the model's cache minimum) pays its prefix as plain input every call.
 */
export function estimateRun(calls: { chars: number; group: string; stableChars: number; cacheable?: boolean }[], o: { outputTokens?: number } = {}) {
  const tok = tokensForChars;
  const out = Math.max(0, Math.round(o.outputTokens ?? ASSUMED_OUTPUT_TOKENS));
  const seen = new Set<string>();
  let inputTokens = 0, cacheWriteTokens = 0, cacheReadTokens = 0;
  const perCall = calls.map((c) => {
    const stable = tok(c.stableChars);
    // A prefix too short to cache is plain input on every call.
    if (c.cacheable === false) {
      const input = tok(c.chars) + stable;
      inputTokens += input;
      return costOf({ input, output: out }).total;
    }
    const input = tok(c.chars);
    const first = !seen.has(c.group);
    seen.add(c.group);
    inputTokens += input;
    if (first) cacheWriteTokens += stable; else cacheReadTokens += stable;
    return costOf({ input, output: out, cacheWrite: first ? stable : 0, cacheRead: first ? 0 : stable }).total;
  });
  return { calls: calls.length, inputTokens, cacheWriteTokens, cacheReadTokens, outputTokens: out * calls.length, dollars: perCall.reduce((a, b) => a + b, 0), perCall };
}

/** Caps actual spend: a call starts only if spent + in-flight reservations + its estimate stay within the cap. */
export class SpendGate {
  spent = 0;
  reserved = 0;
  readonly max: number;
  constructor(max: number) { this.max = max; }
  tryReserve(estimate: number): boolean {
    if (this.spent + this.reserved + estimate > this.max + 1e-9) return false;
    this.reserved += estimate;
    return true;
  }
  /** A reserved call finished: release its estimate and record what it really cost. */
  settle(estimate: number, actual: number) {
    this.reserved = Math.max(0, this.reserved - estimate);
    this.spent += actual;
  }
}

export type Suggestion = { slug: string; filePath: string; section: string; text: string };
export type Digest = { summary: string; headlines: Record<string, string>; suggestions: Suggestion[] };
export type DigestContext = { linkedSlugs: string[]; vaultPaths: Record<string, string[]> };

export const SUMMARY_MIN_LINES = 5;
export const SUMMARY_MAX_LINES = 8;
export const HEADLINE_MAX_CHARS = 200;
export const SECTION_MAX_CHARS = 80;
export const SUGGESTION_MAX_CHARS = 600;

export function validateDigest(
  raw: unknown,
  ctx: DigestContext,
): { ok: true; digest: Digest } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { ok: false, errors: ["digest must be an object"] };
  const r = raw as Record<string, unknown>;

  let summary = "";
  if (typeof r.summary !== "string") errors.push("summary must be a string");
  else {
    summary = r.summary;
    const n = summary.split("\n").filter((l) => l.trim() !== "").length;
    if (n < SUMMARY_MIN_LINES || n > SUMMARY_MAX_LINES)
      errors.push(`summary must be ${SUMMARY_MIN_LINES} to ${SUMMARY_MAX_LINES} lines, got ${n}`);
  }

  const headlines: Record<string, string> = {};
  if (r.headlines == null) {
    // no headlines is acceptable
  } else if (typeof r.headlines !== "object" || Array.isArray(r.headlines)) errors.push("headlines must be an object");
  else {
    for (const [slug, h] of Object.entries(r.headlines as Record<string, unknown>)) {
      if (!ctx.linkedSlugs.includes(slug)) errors.push(`headline for unlinked project "${slug}"`);
      else if (typeof h !== "string") errors.push(`headline for "${slug}" must be a string`);
      else if (h.length > HEADLINE_MAX_CHARS) errors.push(`headline for "${slug}" is over ${HEADLINE_MAX_CHARS} characters`);
      else headlines[slug] = h;
    }
  }

  const suggestions: Suggestion[] = [];
  if (r.suggestions == null) {
    // none is acceptable
  } else if (!Array.isArray(r.suggestions)) errors.push("suggestions must be an array");
  else {
    r.suggestions.forEach((s, i) => {
      const o = (s && typeof s === "object" ? s : {}) as Record<string, unknown>;
      const slug = typeof o.slug === "string" ? o.slug : "";
      const filePath = typeof o.filePath === "string" ? o.filePath : "";
      const section = typeof o.section === "string" ? o.section : "";
      const text = typeof o.text === "string" ? o.text : "";
      const before = errors.length;
      if (!ctx.linkedSlugs.includes(slug)) errors.push(`suggestion ${i}: project "${slug}" is not linked`);
      else if (!(ctx.vaultPaths[slug] ?? []).includes(filePath))
        errors.push(`suggestion ${i}: "${filePath}" is not a vault file of "${slug}"`);
      if (text.trim() === "") errors.push(`suggestion ${i}: text is empty`);
      else if (text.length > SUGGESTION_MAX_CHARS) errors.push(`suggestion ${i}: text is over ${SUGGESTION_MAX_CHARS} characters`);
      // A section is a plain heading name: no line breaks, '#', or markdown/HTML characters, so it cannot inject headings, images or links.
      if (/[\r\n#[\]()<>!`]/.test(section)) errors.push(`suggestion ${i}: section must be a plain heading name, without line breaks or any of # [ ] ( ) < > ! \``);
      else if (section.trim().length > SECTION_MAX_CHARS) errors.push(`suggestion ${i}: section is over ${SECTION_MAX_CHARS} characters`);
      if (errors.length === before) suggestions.push({ slug, filePath, section, text });
    });
  }

  if (errors.length) return { ok: false, errors };
  return { ok: true, digest: { summary, headlines, suggestions } };
}
