import { getAccount } from "@/lib/data";
import { canSee, currentAccess, NO_PROJECT_ACCESS } from "@/lib/auth/access";
import { buildExport, type ExportPart } from "@/lib/export";

export const dynamic = "force-dynamic";

// GET /api/export?projects=a,b&parts=vault,book&groups=0,2 -> a markdown file download.
export async function GET(req: Request) {
  const u = new URL(req.url);
  const slugs = (u.searchParams.get("projects") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  // getAccount already hides projects the person can't see; refuse outright rather than export a silently shorter file.
  const access = await currentAccess();
  if (slugs.some((s) => !canSee(access, s))) return new Response(NO_PROJECT_ACCESS, { status: 403 });
  const bundles = (await Promise.all(slugs.map((s) => getAccount(s)))).filter((b): b is NonNullable<typeof b> => !!b);
  if (!bundles.length) return new Response("Choose at least one project.", { status: 400 });
  const parts = (u.searchParams.get("parts") ?? "").split(",").filter((p): p is ExportPart => ["overview", "vault", "book", "artifacts"].includes(p));
  const groups = (u.searchParams.get("groups") ?? "").split(",").filter(Boolean).map(Number).filter((n) => n >= 0 && n <= 3);
  const { title, markdown } = buildExport(bundles, { parts, groups });
  const name = title.replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-").slice(0, 80) || "clientos-export";
  return new Response(markdown, { headers: { "Content-Type": "text/markdown; charset=utf-8", "Content-Disposition": `attachment; filename="${name}.md"`, "Cache-Control": "no-store" } });
}
