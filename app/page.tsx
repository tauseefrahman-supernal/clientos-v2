import { myView } from "@/lib/myview";
import { MyView } from "@/components/myview/MyView";

export const dynamic = "force-dynamic";

// The first page after sign-in: what this person needs to move forward today.
export default async function MyViewPage({ searchParams }: { searchParams: { as?: string } }) {
  return <MyView data={await myView(searchParams.as ?? null)} />;
}
