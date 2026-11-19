import { notFound } from "next/navigation";
import { currentAccess } from "@/lib/auth/access";
import { dbEnabled } from "@/lib/data/db";
import { loadMemoryAdmin } from "@/lib/memory/admin";
import { MemoryAdmin } from "@/components/admin/MemoryAdmin";

export const dynamic = "force-dynamic";

// Admins only: Stella's memory. Last sync per provider, Sync now, calls the privacy screen touched (with overrides),
// calls no longer in Granola or Fathom, calls on no project, and each project's match rules.
export default async function MemoryPage() {
  const access = await currentAccess();
  if (!access.admin) notFound();
  if (!dbEnabled()) return <p className="px-space-6 py-space-5 text-sm text-muted-foreground">Stella’s memory needs Supabase, which is not configured here.</p>;
  return <MemoryAdmin data={await loadMemoryAdmin()} />;
}
