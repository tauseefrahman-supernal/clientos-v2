// Scoping progress for a deal: the eight scoping workflows, the file each produces, and the
// deal stage by which each should be done. A step is done when its file is filled or its latest
// run was approved; "now" when it belongs to the deal's current stage; "behind" when the stage
// says it should be done and it is not. Pure, so the tests and the pages share it.

export const DEAL_STAGES = ["Idea", "Nurture", "Concept Alignment", "Prototype", "Proposal", "Order Form"] as const;

export const SCOPING_STEPS = [
  { slug: "intake", name: "Sales intake", file: "Sales-Intake", by: "Idea" },
  { slug: "research", name: "Client research", file: "Sales-Research", by: "Nurture" },
  { slug: "discovery", name: "Discovery readout", file: "Discovery-Readout", by: "Concept Alignment" },
  { slug: "concept", name: "Concept alignment", file: "Concept-Alignment", by: "Concept Alignment" },
  { slug: "prototype", name: "Prototype brief", file: "Prototype-Summary", by: "Prototype" },
  { slug: "proposal", name: "Proposal", file: "Proposal", by: "Proposal" },
  { slug: "deal-desk", name: "Deal desk review", file: null, by: "Proposal" },
  { slug: "order-form", name: "Order form", file: null, by: "Order Form" },
] as const;

export type StepState = "done" | "now" | "behind" | "later";
export type Step = { slug: string; name: string; file: string | null; state: StepState };

export function stageIndex(stage: string): number {
  const i = (DEAL_STAGES as readonly string[]).indexOf(stage);
  return i < 0 ? 0 : i;
}

/** filled: names of vault files with content; approved: workflow slugs whose latest run was approved. */
export function scopingTrack(stage: string, filled: Iterable<string>, approved: Iterable<string> = []): Step[] {
  const f = new Set(filled), ok = new Set(approved), at = stageIndex(stage);
  return SCOPING_STEPS.map((s) => {
    const done = (s.file !== null && f.has(s.file)) || ok.has(s.slug);
    const by = stageIndex(s.by);
    const state: StepState = done ? "done" : by === at ? "now" : by < at ? "behind" : "later";
    return { slug: s.slug, name: s.name, file: s.file, state };
  });
}

/** The step to run next: the earliest behind, else the first that is due now, else the next later one. */
export function nextStep(track: Step[]): Step | null {
  return track.find((s) => s.state === "behind") ?? track.find((s) => s.state === "now") ?? track.find((s) => s.state === "later") ?? null;
}

/** Order deals for a work queue: furthest stage first, then soonest close date (none last). */
export function byPriority<T extends { stage: string; close: string }>(a: T, b: T): number {
  return stageIndex(b.stage) - stageIndex(a.stage) || (a.close || "9999").localeCompare(b.close || "9999");
}

/** Days from today to a YYYY-MM-DD date; null when no date. */
export function daysUntil(date: string, today = new Date()): number | null {
  if (!/^\d{4}-\d{2}-\d{2}/.test(date)) return null;
  const t = Date.UTC(+date.slice(0, 4), +date.slice(5, 7) - 1, +date.slice(8, 10));
  const n = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((t - n) / 86400000);
}
