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

/** Last `budget` characters of text, cut at a sentence start when one falls inside the window, else at a word boundary. */
function tailOf(text: string, budget: number): string {
  if (text.length <= budget) return text;
  const win = text.slice(text.length - budget);
  const sentence = /[.!?]\s+(?=\S)/.exec(win);
  if (sentence) return win.slice(sentence.index + sentence[0].length);
  if (/\s/.test(text[text.length - budget - 1]) || /^\s/.test(win)) return win.trimStart();
  const ws = win.search(/\s/);
  return ws === -1 ? win : win.slice(ws).trimStart();
}

type Unit = { speaker: string; prefix: string; text: string };
const lineOf = (u: Unit) => u.prefix + u.text;

/**
 * Split speaker turns into chunks. `target` bounds a chunk's fresh content; the carried overlap is extra.
 * Overlap is the trailing whole turns of the previous chunk when they total at most `overlap` characters,
 * otherwise the tail of its last turn (at most `overlap` characters of text, plus the speaker prefix).
 */
export function chunkTurns(turns: Turn[], target = 1200, overlap = 150): { seq: number; text: string; speakers: string[] }[] {
  const max = target * 2;
  const units: Unit[] = [];
  for (const t of turns) {
    const text = t.text.trim();
    if (!text) continue;
    const prefix = t.speaker ? `${t.speaker}: ` : "";
    if (prefix.length + text.length <= max) { units.push({ speaker: t.speaker, prefix, text }); continue; }
    for (const piece of splitSentences(text, Math.max(1, max - prefix.length))) units.push({ speaker: t.speaker, prefix, text: piece });
  }

  const size = (us: Unit[]) => us.reduce((n, u) => n + lineOf(u).length, 0) + Math.max(0, us.length - 1);
  const chunks: { seq: number; text: string; speakers: string[] }[] = [];
  let cur: Unit[] = [];
  let fresh = 0; // units at the end of cur that are new rather than carried overlap
  const flush = () => {
    if (!fresh) return;
    const speakers: string[] = [];
    for (const u of cur) if (u.speaker && !speakers.includes(u.speaker)) speakers.push(u.speaker);
    chunks.push({ seq: chunks.length, text: cur.map(lineOf).join("\n"), speakers });
    const carry: Unit[] = [];
    for (let i = cur.length - 1; i >= 0; i--) {
      if (size([cur[i], ...carry]) > overlap) break;
      carry.unshift(cur[i]);
    }
    if (!carry.length && overlap > 0) {
      const last = cur[cur.length - 1];
      const tail = tailOf(last.text, overlap);
      if (tail) carry.push({ speaker: last.speaker, prefix: last.prefix, text: tail });
    }
    cur = carry;
    fresh = 0;
  };
  for (const u of units) {
    if (fresh && size(cur.slice(cur.length - fresh).concat(u)) > target) flush();
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
  let pending = ""; // headings of sections with no body, merged into the next section's lead
  const emitHard = (text: string) => { for (let i = 0; i < text.length; i += target) emit(text.slice(i, i + target)); };
  for (const sec of sections) {
    if (sec.heading) pending = pending ? `${pending}\n\n${sec.heading}` : sec.heading;
    if (!sec.body.length) continue;
    let lead = pending ? pending + "\n\n" : "";
    pending = "";
    if (lead.length > target / 2) { emitHard(lead.trim()); lead = ""; } // heading too long to repeat; keep it whole elsewhere
    const room = Math.max(1, max - lead.length);
    const paras = sec.body.flatMap((p) => (p.length > room ? splitSentences(p, room) : [p]));
    let cur = "";
    for (const p of paras) {
      if (cur && lead.length + cur.length + 2 + p.length > target) { emit(lead + cur); cur = ""; }
      cur = cur ? `${cur}\n\n${p}` : p;
    }
    emit(lead + cur);
  }
  if (pending) emitHard(pending);
  return out;
}
