import { revalidatePath } from "next/cache";
import { addDocumentFile, getAccount } from "@/lib/data";
import { canSee, currentAccess } from "@/lib/auth/access";
import { pdfToMarkdown } from "@/lib/stella/pdf-markdown";
import { sizeRefusal, toMarkdown, UNSUPPORTED, uploadHeader, uploadKind, uploadTitle } from "@/lib/vault-upload";
import type { GroupId } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const MAX_FILES = 10;

// POST multipart { slug, group, file... } -> { saved: { name, path }[]; refused: { name, reason }[] }.
// Text kinds become markdown here; a PDF is transcribed to markdown by one Claude call.
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  if (!form) return new Response("Send the files as multipart form data.", { status: 400 });
  const slug = form.get("slug");
  if (typeof slug !== "string" || !slug) return new Response("slug is required.", { status: 400 });
  const access = await currentAccess();
  if (!canSee(access, slug)) return new Response("You do not have access to this project.", { status: 403 });
  if (!(await getAccount(slug))) return new Response("No such project.", { status: 404 });
  const g = Number(form.get("group") ?? 0);
  const group = (Number.isInteger(g) && g >= 0 && g <= 3 ? g : 0) as GroupId;
  const by = access.person?.name ?? "You";
  const files = form.getAll("file").filter((f): f is File => typeof f !== "string");
  if (!files.length) return new Response("Choose at least one file.", { status: 400 });

  const saved: { name: string; path: string }[] = [], refused: { name: string; reason: string }[] = [];
  for (const [i, f] of files.entries()) {
    const name = f.name || "file";
    if (i >= MAX_FILES) { refused.push({ name, reason: `upload up to ${MAX_FILES} files at a time` }); continue; }
    const kind = uploadKind(f.name, f.type);
    if (!kind) { refused.push({ name, reason: UNSUPPORTED }); continue; }
    const tooBig = sizeRefusal(kind, f.size);
    if (tooBig) { refused.push({ name, reason: tooBig }); continue; }
    let markdown: string;
    try {
      if (kind === "pdf") {
        const out = await pdfToMarkdown(Buffer.from(await f.arrayBuffer()).toString("base64"), name);
        if ("reason" in out) { refused.push({ name, reason: out.reason }); continue; }
        markdown = out.markdown;
      } else markdown = toMarkdown(kind, name, await f.text());
    } catch (e) {
      refused.push({ name, reason: `could not be read (${e instanceof Error ? e.message : String(e)})` });
      continue;
    }
    if (!markdown.trim()) { refused.push({ name, reason: "no text could be read from it" }); continue; }
    const content = `${uploadHeader(by, new Date(), name)}\n\n${markdown}`.slice(0, 500_000);
    const file = await addDocumentFile(slug, group, uploadTitle(name), content, by).catch(() => null);
    if (file) saved.push({ name, path: file.path });
    else refused.push({ name, reason: "it could not be saved to the vault" });
  }
  if (saved.length) revalidatePath("/", "layout");
  return Response.json({ saved, refused });
}
