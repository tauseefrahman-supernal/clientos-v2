// Pure rules for call digests: cost estimate and output validation.
// No network, no DB; the server module lib/memory/digest.ts imports this.

export const DIGEST_MODEL = "claude-opus-5-5";
/** Dollars per million tokens. */
export const INPUT_PER_M = 4;
export const OUTPUT_PER_M = 20;
/** Assumed output size of one digest call, in tokens. */
export const ASSUMED_OUTPUT_TOKENS = 1500;
const CHARS_PER_TOKEN = 4;

export function estimateCost(calls: { chars: number }[]): { calls: number; inputTokens: number; dollars: number } {
  const inputTokens = calls.reduce((n, c) => n + Math.ceil(Math.max(0, c.chars) / CHARS_PER_TOKEN), 0);
  const outputTokens = calls.length * ASSUMED_OUTPUT_TOKENS;
  const dollars = (inputTokens / 1e6) * INPUT_PER_M + (outputTokens / 1e6) * OUTPUT_PER_M;
  return { calls: calls.length, inputTokens, dollars };
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
      // A section is a plain heading name: no line breaks or '#', so it cannot inject headings into the file.
      if (/[\r\n#]/.test(section)) errors.push(`suggestion ${i}: section must be a plain heading name, without line breaks or '#'`);
      else if (section.trim().length > SECTION_MAX_CHARS) errors.push(`suggestion ${i}: section is over ${SECTION_MAX_CHARS} characters`);
      if (errors.length === before) suggestions.push({ slug, filePath, section, text });
    });
  }

  if (errors.length) return { ok: false, errors };
  return { ok: true, digest: { summary, headlines, suggestions } };
}
