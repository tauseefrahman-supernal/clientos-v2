import { notFound } from "next/navigation";
import { getAccount } from "@/lib/data";
import { ArtifactGallery } from "@/components/project/ArtifactGallery";

export default async function ArtifactsPage({ params, searchParams }: { params: { slug: string }; searchParams: { a?: string; view?: string } }) {
  const b = (await getAccount(params.slug));
  if (!b) notFound();
  const visible = b.artifacts.filter((x) => !x.sensitive);
  const held = b.artifacts.length - visible.length;
  const view = searchParams.view === "table" || searchParams.view === "recordings" ? searchParams.view : "gallery";
  return <ArtifactGallery artifacts={visible} recordings={b.recordings} heldBack={held} project={b.account.name} openId={searchParams.a ?? null} view={view} />;
}
