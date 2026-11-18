// Uploading files into a project's vault: which files are accepted, how text kinds become markdown,
// and the title and header each saved file gets. Pure, so node --test imports it directly.

export type UploadKind = "markdown" | "text" | "csv" | "json" | "html" | "pdf";

/** The same limits as Stella's chat attachments. */
export const LIMITS = { pdf: 6_000_000, text: 300_000 } as const;
export const MAX_CSV_ROWS = 200;
export const ACCEPT = ".pdf,.md,.markdown,.txt,.csv,.json,.html,.htm,application/pdf,text/markdown,text/plain,text/csv,application/json,text/html";
export const UNSUPPORTED = "not a supported type (PDF, markdown, text, CSV, JSON or HTML)";

const BY_EXT: Record<string, UploadKind> = { md: "markdown", markdown: "markdown", txt: "text", csv: "csv", json: "json", html: "html", htm: "html", pdf: "pdf" };
const BY_MIME: Record<string, UploadKind> = { "text/markdown": "markdown", "text/x-markdown": "markdown", "text/plain": "text", "text/csv": "csv", "application/json": "json", "text/html": "html", "application/pdf": "pdf" };

/** What kind of upload this is, or null when it is refused. */
export function uploadKind(name: string, mime: string): UploadKind | null {
  const n = name.trim();
  if (!n) return null;
  const ext = /\.([a-z0-9]+)$/i.exec(n)?.[1]?.toLowerCase();
  if (ext && BY_EXT[ext]) return BY_EXT[ext];
  return BY_MIME[(mime.split(";")[0] ?? "").trim().toLowerCase()] ?? null;
}

/** Why a file of this size is refused, or null when it is fine. */
export function sizeRefusal(kind: UploadKind, size: number): string | null {
  if (size <= 0) return "the file is empty";
  if (kind === "pdf") return size > LIMITS.pdf ? "PDFs can be up to 6 MB" : null;
  return size > LIMITS.text ? "text files can be up to 300 KB" : null;
}

/** The file name without its extension, tidied. */
export function uploadTitle(name: string): string {
  const t = name.trim().replace(/\.[a-z0-9]{1,8}$/i, "").replace(/_+/g, " ").replace(/\s+/g, " ").trim();
  return t || "Document";
}

/** First line of every uploaded file. */
export function uploadHeader(by: string, at: Date, name: string): string {
  return `Uploaded by ${by} on ${at.toISOString().slice(0, 10)} from ${name}.`;
}

/** Text kinds to markdown. A PDF arrives already converted and is kept as is. */
export function toMarkdown(kind: UploadKind, name: string, text: string): string {
  void name;
  switch (kind) {
    case "csv": return csvTable(text);
    case "json": return jsonBlock(text);
    case "html": return htmlText(text);
    default: return text;
  }
}

/** Decide what to do with a PDF conversion: save the markdown, or refuse the file with a reason. */
export function pdfOutcome(stop: string | null | undefined, text: string): { markdown: string } | { reason: string } {
  if (stop === "refusal") return { reason: "Claude declined to convert this PDF" };
  if (stop === "max_tokens") return { reason: "too long to convert; split the PDF" };
  if (!text.trim()) return { reason: "no text could be read from this PDF" };
  return { markdown: text.trim() };
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = "", quoted = false;
  const s = text.replace(/^﻿/, "");
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (quoted) {
      if (c === '"') { if (s[i + 1] === '"') { cell += '"'; i++; } else quoted = false; }
      else cell += c;
    } else if (c === '"' && cell === "") quoted = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && s[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += c;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

function csvTable(text: string): string {
  const rows = parseCsv(text);
  if (!rows.length) return "";
  const width = Math.max(...rows.map((r) => r.length));
  const cell = (c: string) => c.replace(/\r?\n/g, " ").replace(/\|/g, "\\|").trim();
  const line = (r: string[]) => `| ${Array.from({ length: width }, (_, i) => cell(r[i] ?? "")).join(" | ")} |`;
  const [head, ...body] = rows;
  const out = [line(head), `| ${Array(width).fill("---").join(" | ")} |`, ...body.slice(0, MAX_CSV_ROWS).map(line)];
  if (body.length > MAX_CSV_ROWS) out.push("", `… ${body.length - MAX_CSV_ROWS} more rows`);
  return `${out.join("\n")}\n`;
}

function jsonBlock(text: string): string {
  let body = text.trim();
  try { body = JSON.stringify(JSON.parse(body), null, 2); } catch { /* keep it as given */ }
  return `\`\`\`json\n${body}\n\`\`\`\n`;
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function htmlText(html: string): string {
  return html
    .replace(/<(script|style|noscript|template)\b[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|tr|section|article|header|footer|blockquote|pre|table|ul|ol)\s*>/gi, "\n\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (m, e: string) => {
      if (e[0] === "#") { const code = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return Number.isFinite(code) ? String.fromCodePoint(code) : m; }
      return ENTITIES[e.toLowerCase()] ?? m;
    })
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
