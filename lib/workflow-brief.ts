// Where a workflow run tells Stella to look: the workflow's vault input files and, when the project
// has any, its calls. Pure, so the tests can check it directly.

/** Calls older than this are history; newer ones are the current state. Matches the header digest. */
export const CURRENT_DAYS = 30;

/** How documents cite calls: inline, as every source is cited in a document. */
const CITE = "The document cites calls inline by title and date, like every other source: after each claim from a call, its label in square brackets as [Call: <title>, <date>], exactly as the tool gave it, e.g. [Call: Weekly sync, 2026-11-12].";

/**
 * PostgREST filter (on transcripts) for calls Stella can search: digested or holding a transcript body,
 * never personnel, and not gone since before `cutoff` (ISO). One or() so it cannot clash with another.
 */
export function searchableCallFilter(cutoff: string): string {
  const searchable = ["status.eq.digested", "and(body.not.is.null,status.neq.personnel)"];
  const present = ["gone_at.is.null", `gone_at.gte."${cutoff}"`];
  return searchable.flatMap((s) => present.map((g) => `and(${s},${g})`)).join(",");
}

/** callCount null: the count failed, so the brief neither claims calls nor says there are none. */
export function workflowBrief(w: { name: string; inputs: string[] }, callCount: number | null): string {
  const vault = w.inputs.length
    ? `It draws on these vault files: ${w.inputs.join(", ")}. Read them first, and anything else in the vault that bears on it.`
    : `Read the vault files that bear on ${w.name}.`;
  if (callCount === null) {
    return [
      vault,
      "Check search_calls for this project's calls (Granola and Fathom), summaries first, then transcripts for exact wording, who said what, and dates. If it returns nothing, mark anything that would come from a call (what the client said, who wants what, decisions and their dates) as a gap rather than guessing.",
      CITE,
    ].join("\n\n");
  }
  if (callCount <= 0) {
    return [
      vault,
      "This project has no calls yet. Anything that would come from a call (what the client said, who wants what, decisions and their dates) is a gap: mark it as one rather than guessing.",
    ].join("\n\n");
  }
  return [
    vault,
    `This project also has ${callCount} ${callCount === 1 ? "call" : "calls"} (Granola and Fathom). Search them alongside the vault files with search_calls: summaries first (depth "summaries"), then transcripts (depth "transcripts", then read_call) for exact wording, who said what, and dates.`,
    `Facts from calls more than ${CURRENT_DAYS} days old are history; facts from newer calls are the current state. Where a call and the vault disagree, say so and give the newer one with its date.`,
    CITE,
  ].join("\n\n");
}
