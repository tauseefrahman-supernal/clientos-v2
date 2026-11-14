import { search } from "@/lib/stella/corpus";

export const dynamic = "force-dynamic";

// GET ?slug=&q= -> the ranked hits Stella's search tool would see. For checking retrieval
// without calling the model.
export async function GET(req: Request) {
  const u = new URL(req.url);
  const slug = u.searchParams.get("slug") ?? "";
  const q = u.searchParams.get("q") ?? "";
  return Response.json(await search(slug, q, Number(u.searchParams.get("limit")) || 8));
}
