// Where a workflow run tells Stella to look: the workflow's vault input files and, when the project
// has any, its calls. Pure, so the tests can check it directly.

/** Calls older than this are history; newer ones are the current state. Matches the header digest. */
export const CURRENT_DAYS = 30;

export function workflowBrief(w: { name: string; inputs: string[] }, callCount: number): string {
  const vault = w.inputs.length
    ? `It draws on these vault files: ${w.inputs.join(", ")}. Read them first, and anything else in the vault that bears on it.`
    : `Read the vault files that bear on ${w.name}.`;
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
    "In the document's evidence (its inline citations), cite each call by its title and date, using its source label exactly as the tool gave it, e.g. [Call: Weekly sync, 2026-11-12].",
  ].join("\n\n");
}
