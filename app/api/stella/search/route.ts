import { canSee, currentAccess } from "@/lib/auth/access";
import { searchChunks } from "@/lib/memory/search";
import type { Layer } from "@/lib/memory/types";

export const dynamic = "force-dynamic";

const LAYERS: Layer[] = ["vault", "chapter", "summary", "transcript"];

// GET ?slug=&q=[&layers=vault,summary][&limit=] -> the ranked hits Stella's search tools would see, for
// checking retrieval without calling the model. Only projects the signed-in person may see.
export async function GET(req: Request) {
  const u = new URL(req.url);
  const slug = u.searchParams.get("slug") ?? "";
  const q = u.searchParams.get("q") ?? "";
  const access = await currentAccess();
  if (!slug || !canSee(access, slug)) return Response.json([]);
  const asked = (u.searchParams.get("layers") ?? "").split(",").filter((l): l is Layer => LAYERS.includes(l as Layer));
  return Response.json(await searchChunks({ slugs: [slug], query: q, layers: asked.length ? asked : ["vault", "chapter"], k: Number(u.searchParams.get("limit")) || 6 }));
}
