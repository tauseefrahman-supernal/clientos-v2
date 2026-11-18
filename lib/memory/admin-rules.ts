// Pure rules for the memory admin page, the override / gone / rule actions and the transcript side panel:
// request validation, the lists the admin page shows, the transcript gate and the cut-marker split.
// No "server-only" import, so node --test can load it directly; safe to import from client code.
import { bodyToTurns, recordingShown } from "./index-rules.ts";

export class InvalidRequest extends Error {}

export const OVERRIDE_ACTIONS = ["assign", "unassign", "personnel", "not_personnel"] as const;
export type OverrideAction = (typeof OVERRIDE_ACTIONS)[number];
export const RULE_KINDS = ["keyword", "email", "domain"] as const;
export type RuleKind = (typeof RULE_KINDS)[number];

type Body = Record<string, unknown>;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function callId(body: Body): string {
  const id = body.transcriptId;
  if (typeof id !== "string" || !UUID.test(id)) throw new InvalidRequest("transcriptId must be a call id.");
  return id;
}

function slugOf(body: Body): string {
  const s = typeof body.slug === "string" ? body.slug.trim() : "";
  if (!s) throw new InvalidRequest("slug must name a project.");
  return s;
}

/**
 * { action: "override", override, transcriptId, slug? }: the override kind travels in `override`, because `action`
 * already names the route action. assign and unassign need a project; personnel ones ignore it.
 */
export function parseOverride(body: Body): { transcriptId: string; slug: string | null; action: OverrideAction } {
  const transcriptId = callId(body);
  const action = body.override;
  if (typeof action !== "string" || !(OVERRIDE_ACTIONS as readonly string[]).includes(action))
    throw new InvalidRequest(`override must be one of: ${OVERRIDE_ACTIONS.join(", ")}.`);
  const a = action as OverrideAction;
  return { transcriptId, slug: a === "assign" || a === "unassign" ? slugOf(body) : null, action: a };
}

/** gone { transcriptId, keep }: keep clears the gone mark, otherwise the call is deleted for good. */
export function parseGone(body: Body): { transcriptId: string; keep: boolean } {
  const transcriptId = callId(body);
  if (typeof body.keep !== "boolean") throw new InvalidRequest("keep must be true or false.");
  return { transcriptId, keep: body.keep };
}

/** rule { slug, kind, value, remove? }: keywords keep their case (spaces collapsed); emails and domains are lower-cased. */
export function parseRule(body: Body): { slug: string; kind: RuleKind; value: string; remove: boolean } {
  const slug = slugOf(body);
  const kind = body.kind;
  if (typeof kind !== "string" || !(RULE_KINDS as readonly string[]).includes(kind)) throw new InvalidRequest(`kind must be one of: ${RULE_KINDS.join(", ")}.`);
  let value = typeof body.value === "string" ? body.value.replace(/\s+/g, " ").trim() : "";
  if (kind === "keyword") {
    if (value.length < 2 || value.length > 80) throw new InvalidRequest("A keyword is 2 to 80 characters.");
  } else if (kind === "email") {
    value = value.toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new InvalidRequest("That is not an email address.");
  } else {
    value = value.toLowerCase().replace(/^https?:\/\//, "").replace(/^@/, "").replace(/^www\./, "").replace(/\/.*$/, "");
    if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(value)) throw new InvalidRequest("That is not a domain, such as example.com.");
  }
  return { slug, kind: kind as RuleKind, value, remove: body.remove === true };
}

// ---------------------------------------------------------------- transcript panel

/**
 * Whether the transcript panel may open a call: it exists, the person can see at least one of its projects (or is an
 * admin), it is not a personnel call and it has not been gone from its source for more than 14 days. 404 otherwise,
 * so a refused call looks the same as a missing one.
 */
export function transcriptGate(call: { status: string; goneAt: string | null } | null, canSeeAny: boolean, now: Date): 200 | 404 {
  if (!call || !canSeeAny) return 404;
  return recordingShown({ status: call.status, gone_at: call.goneAt }, now) ? 200 : 404;
}

export type Segment = { removed: false; text: string } | { removed: true; reason: "personnel" | "private"; minutes: number };

const MARKER = /\[(personnel section|private details) removed, (\d+) min\]/g;

/** Splits the screen's cut markers out of a line of text, so the panel shows them as "Removed for privacy". */
export function splitMarkers(text: string): Segment[] {
  const out: Segment[] = [];
  let at = 0;
  for (const m of text.matchAll(MARKER)) {
    if (m.index! > at) out.push({ removed: false, text: text.slice(at, m.index) });
    out.push({ removed: true, reason: m[1] === "personnel section" ? "personnel" : "private", minutes: Number(m[2]) });
    at = m.index! + m[0].length;
  }
  if (at < text.length || !out.length) out.push({ removed: false, text: text.slice(at) });
  return out;
}

export interface PanelTurn { speaker: string; start: number | null; segments: Segment[] }

/** The stored body as turns for the panel; text stays plain (rendered as text, never as HTML or markdown). */
export function turnsForPanel(body: string | null | undefined): PanelTurn[] {
  if (!body || !body.trim()) return [];
  return bodyToTurns(body).map((t) => ({ speaker: t.speaker, start: t.start, segments: splitMarkers(t.text) }));
}

// ---------------------------------------------------------------- admin lists

const newestFirst = (a: { date: string | null }, b: { date: string | null }) => (b.date ?? "").localeCompare(a.date ?? "");

export interface CallRowLite { id: string; title: string; met_at: string | null; provider: string }

export interface ScreenedItem {
  id: string; title: string; date: string | null; provider: string;
  personnel: boolean; personnelCuts: number; privateCuts: number;
  /** The last personnel / not_personnel override, if an admin made one. */
  byHand: "personnel" | "not_personnel" | null;
}

/** Calls the screen touched (personnel, or with cuts) and calls an admin overrode, newest first. */
export function screenedList(
  rows: (CallRowLite & { status: string; cuts: unknown })[],
  overrides: { transcript_id: string; action: string; at: string }[],
): ScreenedItem[] {
  const byHand = new Map<string, "personnel" | "not_personnel">();
  for (const o of [...overrides].sort((a, b) => a.at.localeCompare(b.at)))
    if (o.action === "personnel" || o.action === "not_personnel") byHand.set(o.transcript_id, o.action);
  const out: ScreenedItem[] = [];
  for (const r of rows) {
    const cuts = Array.isArray(r.cuts) ? (r.cuts as { reason?: string }[]) : [];
    const personnel = r.status === "personnel";
    if (!personnel && !cuts.length && !byHand.has(r.id)) continue;
    out.push({
      id: r.id, title: r.title, date: r.met_at, provider: r.provider, personnel,
      personnelCuts: cuts.filter((c) => c.reason === "personnel").length,
      privateCuts: cuts.filter((c) => c.reason === "private").length,
      byHand: byHand.get(r.id) ?? null,
    });
  }
  return out.sort(newestFirst);
}

export interface GoneItem { id: string; title: string; date: string | null; provider: string; goneAt: string; days: number; hidden: boolean }

/** Calls no longer in Granola or Fathom, longest gone first; hidden once search has dropped them (over 14 days). */
export function goneList(rows: (CallRowLite & { gone_at: string | null })[], now: Date): GoneItem[] {
  return rows
    .filter((r) => r.gone_at)
    .map((r) => ({
      id: r.id, title: r.title, date: r.met_at, provider: r.provider, goneAt: r.gone_at!,
      days: Math.floor((now.getTime() - Date.parse(r.gone_at!)) / 86_400_000),
      hidden: !recordingShown({ status: "pending", gone_at: r.gone_at }, now),
    }))
    .sort((a, b) => a.goneAt.localeCompare(b.goneAt));
}

export interface UnassignedItem { id: string; title: string; date: string | null; provider: string }

/** Calls with no project link (personnel calls left out), newest first. */
export function unassignedList(rows: (CallRowLite & { status: string })[], linked: Set<string>): UnassignedItem[] {
  return rows
    .filter((r) => !linked.has(r.id) && r.status !== "personnel")
    .map((r) => ({ id: r.id, title: r.title, date: r.met_at, provider: r.provider }))
    .sort(newestFirst);
}

export interface RuleGroup { slug: string; name: string; rules: { kind: string; value: string; source: string }[] }

/** Every project with its match rules, projects by name, rules keywords first then emails then domains. */
export function rulesByProject(
  rules: { account_id: string; kind: string; value: string; source: string }[],
  accounts: { id: string; slug: string; name: string }[],
): RuleGroup[] {
  const order = (k: string) => (RULE_KINDS as readonly string[]).indexOf(k);
  return accounts
    .map((a) => ({
      slug: a.slug, name: a.name,
      rules: rules.filter((r) => r.account_id === a.id)
        .sort((x, y) => order(x.kind) - order(y.kind) || x.value.localeCompare(y.value))
        .map((r) => ({ kind: r.kind, value: r.value, source: r.source })),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export interface ProviderStatus { provider: "granola" | "fathom"; label: string; lastRunAt: string | null; lastError: string | null; more: boolean }

/** Last sync per provider; more is true when a saved cursor means the listing has more to fetch. */
export function syncStatus(state: { provider: string; last_run_at: string | null; last_error: string | null; cursor: string | null }[]): ProviderStatus[] {
  return (["granola", "fathom"] as const).map((provider) => {
    const s = state.find((x) => x.provider === provider);
    return { provider, label: provider === "granola" ? "Granola" : "Fathom", lastRunAt: s?.last_run_at ?? null, lastError: s?.last_error ?? null, more: !!s?.cursor };
  });
}

/** The URL when it is an absolute http(s) link, else null: provider links from the sources render only then. */
export function httpUrl(u: string | null | undefined): string | null {
  const s = (u ?? "").trim();
  if (!s) return null;
  try {
    const url = new URL(s);
    return url.protocol === "http:" || url.protocol === "https:" ? s : null;
  } catch { return null; }
}
