// The format of an artifact, read from its link and title: Google Doc, PDF, Loom video, Claude
// artifact and so on. Pure, so the table and the tests share it.

export type Format = { label: string; group: "Document" | "Spreadsheet" | "Slides" | "PDF" | "Video" | "Design" | "Web" | "Folder" | "File" | "Message" | "Not linked" };

const BY_EXT: [RegExp, Format][] = [
  [/\.pdf$/i, { label: "PDF", group: "PDF" }],
  [/\.(docx?|rtf)$/i, { label: "Word document", group: "Document" }],
  [/\.(xlsx?|csv)$/i, { label: "Excel sheet", group: "Spreadsheet" }],
  [/\.(pptx?|key)$/i, { label: "PowerPoint", group: "Slides" }],
  [/\.(mp4|mov|webm|m4v)$/i, { label: "Video file", group: "Video" }],
  [/\.(png|jpe?g|gif|svg|webp)$/i, { label: "Image", group: "Design" }],
  [/\.(md|txt)$/i, { label: "Text", group: "Document" }],
  [/\.html?$/i, { label: "HTML page", group: "Web" }],
];

export function formatOf(url: string, title = ""): Format {
  const ext = BY_EXT.find(([re]) => re.test(title.trim()) || re.test(url.split(/[?#]/)[0]));
  if (!url) return ext?.[1] ?? { label: "Not linked", group: "Not linked" };
  let host = "", path = "";
  try { const u = new URL(url); host = u.hostname.replace(/^www\./, ""); path = u.pathname; } catch { return ext?.[1] ?? { label: "Link", group: "Web" }; }
  if (host === "docs.google.com") {
    if (path.startsWith("/document")) return { label: "Google Doc", group: "Document" };
    if (path.startsWith("/spreadsheets")) return { label: "Google Sheet", group: "Spreadsheet" };
    if (path.startsWith("/presentation")) return { label: "Google Slides", group: "Slides" };
    if (path.startsWith("/forms")) return { label: "Google Form", group: "Web" };
  }
  if (host === "drive.google.com") return path.includes("/folders/") ? { label: "Drive folder", group: "Folder" } : ext?.[1] ?? { label: "Drive file", group: "File" };
  if (ext) return ext[1];
  if (host.endsWith("claude.ai")) return { label: "Claude artifact", group: "Web" };
  if (host.endsWith("loom.com")) return { label: "Loom video", group: "Video" };
  if (host.endsWith("kommodo.ai") || host.endsWith("youtube.com") || host === "youtu.be" || host.endsWith("vimeo.com")) return { label: "Video", group: "Video" };
  if (host.endsWith("figma.com")) return { label: "Figma", group: "Design" };
  if (host.endsWith("notion.so") || host.endsWith("notion.site")) return { label: "Notion page", group: "Document" };
  if (host.endsWith("slack.com")) return { label: "Slack message", group: "Message" };
  if (host.endsWith("linear.app")) return { label: "Linear", group: "Web" };
  if (host.endsWith("github.com")) return { label: "GitHub", group: "Web" };
  if (host.endsWith("granola.ai") || host.endsWith("fathom.video")) return { label: "Meeting notes", group: "Video" };
  return { label: "Web app or site", group: "Web" };
}
