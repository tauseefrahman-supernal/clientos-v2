import { notFound } from "next/navigation";
import { getAccount } from "@/lib/data";
import { canAssign, currentAccess } from "@/lib/auth/access";
import { ArtifactGallery } from "@/components/project/ArtifactGallery";

export default async function ArtifactsPage({ params, searchParams }: { params: { slug: string }; searchParams: { a?: string; view?: string } }) {
  const b = (await getAccount(params.slug));
  if (!b) notFound();
  const visible = b.artifacts.filter((x) => !x.sensitive);
  const held = b.artifacts.length - visible.length;
  const view = searchParams.view === "table" || searchParams.view === "recordings" ? searchParams.view : "gallery";
  const access = await currentAccess();
  return <ArtifactGallery artifacts={visible} recordings={b.recordings} heldBack={held} project={b.account.name} slug={b.account.slug} canUnassign={canAssign(access, b.account.slug)} openId={searchParams.a ?? null} view={view} />;
}
