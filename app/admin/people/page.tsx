import Link from "next/link";
import { notFound } from "next/navigation";
import { currentAccess } from "@/lib/auth/access";
import { listPeople } from "@/lib/data/team";
import { RoleToggle } from "@/components/admin/RoleToggle";

export const dynamic = "force-dynamic";

// Admins only: everyone on the team, whether they have signed in, how many projects they are on, and their role.
export default async function PeoplePage() {
  const access = await currentAccess();
  if (!access.admin || !access.person) notFound();
  const people = await listPeople();
  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-space-4 px-space-6 py-space-5">
      <div>
        <h1 className="font-display text-3xl font-semibold">People</h1>
        <p className="mt-space-1 max-w-[72ch] text-sm text-muted-foreground">Admins see every project. Everyone else sees the projects they are assigned to: from Account OS pods and deals on each import, or added on a project’s team bar by an admin or its strategist. People are linked to their Google sign-in the first time they log in.</p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[820px] border-collapse text-sm">
          <thead className="bg-muted text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"><tr>{["Name", "Title", "Squad", "Signed in", "Projects", "Role"].map((h) => <th key={h} className="px-space-3 py-space-2">{h}</th>)}</tr></thead>
          <tbody>{people.map((p) => (
            <tr key={p.id} className="border-t border-border">
              <td className="px-space-3 py-space-2 font-semibold"><Link href={`/?as=${p.id}`} className="text-foreground no-underline hover:underline" title="See their My View">{p.name}</Link>{p.email && <div className="text-xs font-normal text-muted-foreground">{p.email}</div>}</td>
              <td className="px-space-3 py-space-2">{p.title ?? "—"}</td>
              <td className="px-space-3 py-space-2">{p.squad ?? "—"}</td>
              <td className="px-space-3 py-space-2">{p.linked ? "Yes" : <span className="text-muted-foreground">Not yet</span>}</td>
              <td className="px-space-3 py-space-2 tabular-nums">{p.projects}</td>
              <td className="px-space-3 py-space-2"><RoleToggle id={p.id} role={p.role} self={p.id === access.person!.id} /></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
