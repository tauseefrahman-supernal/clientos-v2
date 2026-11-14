import type { AccountBundle } from "@/lib/types";

const STOP = new Set(["and", "of", "the", "for", "a", "an", "services", "inferred"]);
const words = (s: string) => new Set(s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !STOP.has(w)));

/** Delivery projects that share an industry with this one, best match first. Falls back to none, never to everything. */
export function relatedByIndustry(target: AccountBundle, all: AccountBundle[]): { bundle: AccountBundle; shared: string[] }[] {
  const mine = words(target.account.industry);
  if (!mine.size) return [];
  return all
    .filter((b) => b.account.stage === "delivery" && b.account.slug !== target.account.slug && b.account.industry)
    .map((b) => ({ bundle: b, shared: Array.from(words(b.account.industry)).filter((w) => mine.has(w)) }))
    .filter((x) => x.shared.length)
    .sort((a, b) => b.shared.length - a.shared.length);
}
