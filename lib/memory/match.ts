// Pure helpers: merge the same meeting recorded twice, and match calls to projects by rules.
import type { SourceCall } from "./types.ts";

export type MergedCall = SourceCall & { altUrl: string | null };
export type Rules = Map<string, { keywords: string[]; emails: string[]; domains: string[] }>;

const WINDOW_MS = 10 * 60 * 1000;
const MIN_CONTAINED_TITLE = 8; // guards short/generic titles from matching by containment
const SHARED_EMAIL_RATIO = 0.6;

function normTitle(t: string): string {
  return t.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
}

function emailSet(c: SourceCall): Set<string> {
  const s = new Set<string>();
  for (const p of c.participants) if (p.email) s.add(p.email.trim().toLowerCase());
  return s;
}

function sameTitle(a: string, b: string): boolean {
  const x = normTitle(a), y = normTitle(b);
  if (!x || !y) return false;
  if (x === y) return true;
  const [short, long] = x.length <= y.length ? [x, y] : [y, x];
  return short.length >= MIN_CONTAINED_TITLE && ` ${long} `.includes(` ${short} `);
}

function mostlySamePeople(a: SourceCall, b: SourceCall): boolean {
  const ea = emailSet(a), eb = emailSet(b);
  const smaller = Math.min(ea.size, eb.size);
  if (smaller === 0) return false;
  let shared = 0;
  for (const e of ea) if (eb.has(e)) shared++;
  return shared / smaller >= SHARED_EMAIL_RATIO;
}

function sameMeeting(a: SourceCall, b: SourceCall): boolean {
  const gap = Math.abs(Date.parse(a.metAt) - Date.parse(b.metAt));
  if (!Number.isFinite(gap) || gap > WINDOW_MS) return false;
  return sameTitle(a.title, b.title) || mostlySamePeople(a, b);
}

/** Granola first, then lowest externalId, so the choice never depends on input order. */
function rank(a: SourceCall, b: SourceCall): number {
  if (a.provider !== b.provider) return a.provider === "granola" ? -1 : 1;
  return a.externalId < b.externalId ? -1 : a.externalId > b.externalId ? 1 : 0;
}

export function mergeDuplicates(calls: SourceCall[]): MergedCall[] {
  const parent = calls.map((_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  for (let i = 0; i < calls.length; i++)
    for (let j = i + 1; j < calls.length; j++)
      if (sameMeeting(calls[i], calls[j])) parent[find(j)] = find(i);

  const groups = new Map<number, SourceCall[]>();
  const order: number[] = [];
  calls.forEach((c, i) => {
    const r = find(i);
    if (!groups.has(r)) { groups.set(r, []); order.push(r); }
    groups.get(r)!.push(c);
  });

  return order.map((r) => {
    const members = groups.get(r)!.slice().sort(rank);
    const [keep, ...others] = members;
    if (others.length === 0) return { ...keep, altUrl: null };
    const byEmail = new Map<string, { name: string; email: string | null }>();
    const noEmail: { name: string; email: string | null }[] = [];
    for (const m of members)
      for (const p of m.participants) {
        if (!p.email) { if (!noEmail.some((n) => n.name === p.name)) noEmail.push(p); continue; }
        const k = p.email.trim().toLowerCase();
        if (!byEmail.has(k)) byEmail.set(k, { name: p.name, email: k });
      }
    return { ...keep, participants: [...byEmail.values(), ...noEmail], altUrl: others[0].url };
  });
}

function hasWord(text: string, kw: string): boolean {
  const k = kw.trim().toLowerCase().replace(/\s+/g, " ");
  if (!k) return false;
  const esc = k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s+");
  return new RegExp(`(?<![\\p{L}\\p{N}])${esc}(?![\\p{L}\\p{N}])`, "iu").test(text);
}

export function matchCall(call: SourceCall, rules: Rules): { slug: string; strength: "strong" | "mention" }[] {
  const emails = [...emailSet(call)];
  const out: { slug: string; strength: "strong" | "mention" }[] = [];
  for (const [slug, rule] of rules) {
    const ruleEmails = rule.emails.map((e) => e.trim().toLowerCase());
    const ruleDomains = rule.domains.map((d) => d.trim().toLowerCase().replace(/^@/, ""));
    const people = emails.some((e) => {
      if (ruleEmails.includes(e)) return true;
      const dom = e.slice(e.lastIndexOf("@") + 1);
      return ruleDomains.some((d) => dom === d || dom.endsWith(`.${d}`));
    });
    if (people || rule.keywords.some((k) => hasWord(call.title, k))) { out.push({ slug, strength: "strong" }); continue; }
    if (rule.keywords.some((k) => hasWord(call.sourceSummary, k))) out.push({ slug, strength: "mention" });
  }
  return out;
}
