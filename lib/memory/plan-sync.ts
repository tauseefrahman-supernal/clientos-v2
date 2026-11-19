// Pure planner for a memory sync: given what the sources listed, what is stored and the manual
// overrides, decide what to upsert, link, mark gone, un-gone and hide. No clock, network or DB.
import type { MergedCall } from "./match.ts";
import type { Turn } from "./types.ts";

const HIDE_AFTER_MS = 14 * 24 * 60 * 60 * 1000;

export type IncomingCall = MergedCall & { matches: { slug: string; strength: string }[] };

export interface PlanInput {
  incoming: IncomingCall[];
  existing: { provider: string; externalId: string; goneAt: string | null; status: string }[];
  /** In the order they were made; a later override for the same call (and slug) wins. */
  overrides: { externalKey: string; slug: string | null; action: string }[];
  listedInFull: boolean;
  now: string;
}

/**
 * "pending": needs screening and storage (new calls, calls still pending, personnel rows released by
 * a not_personnel override). "keep": an existing digested/failed row; only its metadata
 * (title, url, altUrl, participants) is refreshed, never its status or body. "personnel": store or
 * keep a title-only row with status personnel, no body and no chunks; such a call carries no turns
 * and no summary in the plan.
 */
export interface PlannedCall {
  externalKey: string;
  provider: "granola" | "fathom";
  externalId: string;
  title: string;
  metAt: string;
  participants: { name: string; email: string | null }[];
  url: string;
  altUrl: string | null;
  sourceSummary: string;
  turns: Turn[] | null;
  status: "pending" | "keep" | "personnel";
  dropBody: boolean;
  isNew: boolean;
}

export interface SyncPlan {
  upserts: PlannedCall[];
  links: { externalKey: string; slug: string; source: "auto" | "manual" }[];
  /** Mention-strength matches; runSync decides these with a model call before linking. */
  mentions: { externalKey: string; slug: string }[];
  markGone: string[];
  /** The goneAt to stamp on markGone rows (the input `now`). */
  goneAt: string;
  unGone: string[];
  hide: string[];
  /** Stored rows whose body must be absent: an active personnel override, or a stored personnel row. */
  dropBodies: string[];
  /** Every active unassign override, re-asserted on each sync whether or not the call was listed. */
  unlinks: { externalKey: string; slug: string }[];
}

const keyOf = (provider: string, externalId: string) => `${provider}:${externalId}`;
const cmp = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

export function planSync(input: PlanInput): SyncPlan {
  const { incoming, existing, overrides, listedInFull, now } = input;
  const nowMs = Date.parse(now);
  if (!Number.isFinite(nowMs)) throw new Error(`planSync: now is not a date: ${JSON.stringify(now)}`);

  // Last word per (call, slug) for assign/unassign, and per call for personnel/not_personnel.
  const slugVerdict = new Map<string, Map<string, "assign" | "unassign">>();
  const personnel = new Map<string, boolean>();
  for (const o of overrides) {
    if ((o.action === "assign" || o.action === "unassign") && o.slug) {
      if (!slugVerdict.has(o.externalKey)) slugVerdict.set(o.externalKey, new Map());
      slugVerdict.get(o.externalKey)!.set(o.slug, o.action);
    } else if (o.action === "personnel") personnel.set(o.externalKey, true);
    else if (o.action === "not_personnel") personnel.set(o.externalKey, false);
  }

  // A call is personnel if the latest override says so, or it is stored as personnel and not released.
  const personnelNow = (key: string, storedStatus: string | undefined) =>
    personnel.get(key) ?? storedStatus === "personnel";

  const stored = new Map(existing.map((e) => [keyOf(e.provider, e.externalId), e]));
  const seen = new Set<string>();
  const upserts: PlannedCall[] = [];
  const links = new Map<string, { externalKey: string; slug: string; source: "auto" | "manual" }>();
  const mentions: { externalKey: string; slug: string }[] = [];
  const unGone: string[] = [];

  for (const call of incoming) {
    const externalKey = keyOf(call.provider, call.externalId);
    if (seen.has(externalKey)) continue;
    seen.add(externalKey);
    const row = stored.get(externalKey);
    const isPersonnel = personnelNow(externalKey, row?.status);
    const released = personnel.get(externalKey) === false && row?.status === "personnel";

    let status: PlannedCall["status"];
    if (isPersonnel) status = "personnel";
    else if (released) status = "pending";
    else if (row && row.status !== "pending") status = "keep";
    else status = "pending";

    upserts.push({
      externalKey, provider: call.provider, externalId: call.externalId, title: call.title,
      metAt: call.metAt, participants: call.participants, url: call.url, altUrl: call.altUrl,
      sourceSummary: isPersonnel ? "" : call.sourceSummary, turns: isPersonnel ? null : call.turns,
      status, dropBody: isPersonnel, isNew: !row,
    });
    if (row?.goneAt) unGone.push(externalKey);

    const verdicts = slugVerdict.get(externalKey);
    for (const m of call.matches) {
      if (verdicts?.get(m.slug) === "unassign") continue;
      if (m.strength === "strong") links.set(`${externalKey}|${m.slug}`, { externalKey, slug: m.slug, source: "auto" });
      else if (m.strength === "mention") mentions.push({ externalKey, slug: m.slug });
    }
  }

  // Manual assigns apply whether or not the call came in this run.
  for (const [externalKey, verdicts] of slugVerdict)
    for (const [slug, action] of verdicts)
      if (action === "assign") links.set(`${externalKey}|${slug}`, { externalKey, slug, source: "manual" });

  const dropBodies = [...stored].filter(([key, row]) => personnelNow(key, row.status)).map(([key]) => key);
  const unlinks: { externalKey: string; slug: string }[] = [];
  for (const [externalKey, verdicts] of slugVerdict)
    for (const [slug, action] of verdicts) if (action === "unassign") unlinks.push({ externalKey, slug });

  const markGone: string[] = [];
  const hide: string[] = [];
  for (const [key, row] of stored) {
    if (seen.has(key)) continue;
    if (row.goneAt) {
      if (nowMs - Date.parse(row.goneAt) > HIDE_AFTER_MS) hide.push(key);
    } else if (listedInFull) markGone.push(key);
  }

  const linkList = [...links.values()];
  const mentionList = mentions.filter((m) => !links.has(`${m.externalKey}|${m.slug}`));
  const byKeySlug = (a: { externalKey: string; slug: string }, b: { externalKey: string; slug: string }) =>
    cmp(a.externalKey, b.externalKey) || cmp(a.slug, b.slug);

  return {
    upserts: upserts.sort((a, b) => cmp(a.externalKey, b.externalKey)),
    links: linkList.sort(byKeySlug),
    mentions: mentionList.sort(byKeySlug),
    markGone: markGone.sort(cmp),
    goneAt: now,
    unGone: unGone.sort(cmp),
    hide: hide.sort(cmp),
    dropBodies: dropBodies.sort(cmp),
    unlinks: unlinks.sort(byKeySlug),
  };
}
