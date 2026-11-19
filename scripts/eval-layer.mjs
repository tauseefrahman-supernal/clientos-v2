// Pure helpers for the layer evaluation in scripts/eval.mjs (no I/O, so tests/eval-layer.test.ts can import them).
// Stella's memory layers, cheapest first: the project header (always in her instructions), the vault and book
// (search_context), call summaries (search_calls depth "summaries", read_call default) and transcript passages
// (search_calls depth "transcripts", read_call with around or full).

export const LAYERS = ["header", "vault", "summaries", "transcripts"];

/** 0 header, 1 vault, 2 summaries, 3 transcripts; -1 for an unknown name. */
export const layerRank = (layer) => LAYERS.indexOf(layer);

/**
 * The layer one streamed tool event reached, from its name and the summary the route sends ({ type: "tool", name, summary }).
 * null when the call retrieved nothing (invalid input, unknown project, not found, failed, skipped) or wrote rather than read.
 */
export function toolLayer(ev) {
  const name = ev?.name ?? "";
  const summary = ev?.summary ?? "";
  if (/^(invalid \w+|unknown \w+|call not found|source not found|[a-z_]+ failed)$|^skipped:/.test(summary)) return null;
  switch (name) {
    case "search_context":
    case "read_source":
    case "list_sources":
    case "search_expertise":   // other projects' vault, book and summaries: counted as vault, its cheapest layer
    case "compile_export":
      return "vault";
    case "search_calls":
      if (/^searched call transcripts\b/.test(summary)) return "transcripts";
      if (/^searched call summaries\b/.test(summary)) return "summaries";
      return null;
    case "read_call":
      // read_call returns the summary by default; "around “…”" or "(whole transcript)" means transcript text.
      return /\(whole transcript\)| around “/.test(summary) ? "transcripts" : "summaries";
    default:
      return null;     // create_document and anything new: no retrieval layer
  }
}

/** The deepest layer any tool event reached; "header" when no tool retrieved anything. */
export function deepestLayer(events) {
  let best = 0;
  for (const ev of events ?? []) {
    const l = toolLayer(ev);
    if (l) best = Math.max(best, layerRank(l));
  }
  return LAYERS[best];
}

/** Required facts: each inner list is a set of alternatives; returns the lists none of whose alternatives appear. */
export function missingFacts(answer, must) {
  const low = (answer ?? "").toLowerCase();
  return (must ?? []).filter((alts) => !alts.some((a) => low.includes(a.toLowerCase())));
}

/**
 * Score one answer against a layer question. pass = no error, every fact found and the layer reached is not deeper
 * than expected (going deeper than needed costs tokens; staying shallower is fine if the facts are there).
 * layerExact is the soft metric: reached exactly the expected layer.
 */
export function scoreLayerAnswer(q, r) {
  const missing = missingFacts(r.answer, q.must);
  const reached = deepestLayer(r.tools);
  const facts = missing.length === 0;
  const layerOk = layerRank(reached) <= layerRank(q.layer);
  return {
    facts, missing, reached, expected: q.layer, layerOk, layerExact: reached === q.layer,
    toolCalls: (r.tools ?? []).length,
    pass: !r.error && facts && layerOk,
  };
}

/** Questions a layer run asks: todo placeholders are skipped; ids, when given, pick a subset. */
export function plannedLayerQuestions(set, ids = []) {
  const live = set.filter((q) => !q.todo);
  return ids.length ? live.filter((q) => ids.includes(q.id)) : live;
}

export const COST_PER_QUESTION = 0.25;   // rough, claude-opus-5-5 with tools; for --dry only
