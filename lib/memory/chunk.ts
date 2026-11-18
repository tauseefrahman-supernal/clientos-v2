// Pure chunking for Stella's memory: transcripts on speaker turns, markdown on headings.
// No server-only imports, so node --test can load it directly.
import type { Turn } from "./types.ts";

/** Cut text into pieces of at most `limit` characters, on sentence ends, hard cuts as a last resort. */
function splitSentences(text: string, limit: number): string[] {
  const out: string[] = [];
  let cur = "";
  const push = () => { if (cur) { out.push(cur); cur = ""; } };
  for (const s of text.split(/(?<=[.!?])\s+/)) {
    if (!s) continue;
    if (s.length > limit) {
      push();
      for (let i = 0; i < s.length; i += limit) out.push(s.slice(i, i + limit));
      continue;
    }
    if (cur && cur.length + 1 + s.length > limit) push();
    cur = cur ? `${cur} ${s}` : s;
  }
  push();
  return out;
}

/** Split speaker turns into chunks of about `target` characters, carrying whole trailing turns (at most `overlap` characters) forward. */
export function chunkTurns(turns: Turn[], target = 1200, overlap = 150): { seq: number; text: string; speakers: string[] }[] {
  const max = target * 2;
  const units: { speaker: string; line: string }[] = [];
  for (const t of turns) {
    const text = t.text.trim();
    if (!text) continue;
    const prefix = t.speaker ? `${t.speaker}: ` : "";
    if (prefix.length + text.length <= max) { units.push({ speaker: t.speaker, line: prefix + text }); continue; }
    for (const piece of splitSentences(text, Math.max(1, max - prefix.length))) units.push({ speaker: t.speaker, line: prefix + piece });
  }

  const size = (us: typeof units) => us.reduce((n, u) => n + u.line.length, 0) + Math.max(0, us.length - 1);
  const chunks: { seq: number; text: string; speakers: string[] }[] = [];
  let cur: typeof units = [];
  let fresh = 0; // units in cur that are new rather than carried overlap
  const flush = () => {
    if (!fresh) return;
    const speakers: string[] = [];
    for (const u of cur) if (u.speaker && !speakers.includes(u.speaker)) speakers.push(u.speaker);
    chunks.push({ seq: chunks.length, text: cur.map((u) => u.line).join("\n"), speakers });
    // carry trailing whole turns totalling at most `overlap`
    const carry: typeof units = [];
    for (let i = cur.length - 1; i >= 0; i--) {
      if (size([cur[i], ...carry]) > overlap) break;
      carry.unshift(cur[i]);
    }
    cur = carry;
    fresh = 0;
  };
  for (const u of units) {
    if (fresh && size([...cur, u]) > target) flush();
    if (size([...cur, u]) > max) cur = []; // overlap would push past the hard limit
    cur.push(u);
    fresh++;
  }
  flush();
  return chunks;
}

/** Split markdown on headings, then blank-line paragraphs packed up to `target`; the heading leads each of its section's chunks. */
export function chunkText(markdown: string, target = 1200): { seq: number; text: string }[] {
  const max = target * 2;
  const sections: { heading: string; body: string[] }[] = [{ heading: "", body: [] }];
  let para: string[] = [];
  let fenced = false;
  const endPara = () => {
    const p = para.join("\n").trim();
    if (p) sections[sections.length - 1].body.push(p);
    para = [];
  };
  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
    if (!fenced && /^#{1,6}\s+\S/.test(line)) { endPara(); sections.push({ heading: line.trim(), body: [] }); continue; }
    if (!fenced && !line.trim()) { endPara(); continue; }
    para.push(line);
  }
  endPara();

  const out: { seq: number; text: string }[] = [];
  const emit = (text: string) => { if (text.trim()) out.push({ seq: out.length, text }); };
  for (const sec of sections) {
    const lead = sec.heading ? sec.heading + "\n\n" : "";
    const room = Math.max(1, max - lead.length);
    const paras = sec.body.flatMap((p) => (p.length > room ? splitSentences(p, room) : [p]));
    if (!paras.length) { emit(sec.heading); continue; }
    let cur = "";
    for (const p of paras) {
      if (cur && lead.length + cur.length + 2 + p.length > target) { emit(lead + cur); cur = ""; }
      cur = cur ? `${cur}\n\n${p}` : p;
    }
    emit(lead + cur);
  }
  return out;
}
