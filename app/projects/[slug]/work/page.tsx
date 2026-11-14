import { notFound } from "next/navigation";
import { getAccount } from "@/lib/data";
import { WorkView, type WorkflowDetail } from "@/components/project/WorkView";

// Work: how client work gets delivered on this account. Each workflow carries what it
// draws on and a preview of what Stella would prepare. Running it arrives with phase 2.

export default function WorkPage({ params, searchParams }: { params: { slug: string }; searchParams: { w?: string } }) {
  const b = getAccount(params.slug);
  if (!b) notFound();
  const o = b.overview;
  const open = o.deals.filter((d) => d.phase < 3);
  const detail = (slug: string): WorkflowDetail => {
    switch (slug) {
      case "health": return { kind: "table", head: ["Account OS record", "Now", "Stella drafts"], rows: o.accountOs.map((r) => [r.record, r.now, r.proposes]), lead: `Last score: ${b.account.health ? `${b.account.health.score}, ${b.account.health.band}` : "not scored"}. Stella drafts the summary and the evidence per dimension; scores stay with the pod.` };
      case "review": return { kind: "columns", columns: [["Get decided", o.decisions.slice(0, 3).map((d) => d.title)], ["Raise", o.slipping.slice(0, 4).map((s) => `${s.item}: ${s.detail}`)], ["Coming up", o.dates.slice(0, 3).map((d) => `${d.when}: ${d.what}`)]] };
      case "report": return { kind: "table", head: ["Field", "Draft"], rows: [["Status", "Left for the strategist to set."], ["Honest read", o.tiles.slice(0, 2).map((t) => t.headline).join(" ")], ["Fires and blockers", o.slipping.filter((s) => /block|risk|past/i.test(s.kind)).slice(0, 3).map((s) => s.item).join(". ") || "None recorded."], ["Expansion in motion", open.map((d) => d.name).join(", ") || "None open."]] };
      case "checkin": return { kind: "table", head: ["Workstream", "State", "Blocked by or learned"], rows: o.streams.filter((s) => s.attention).map((s) => [s.name, s.state, s.learned || s.measured]) };
      case "pulse": return { kind: "table", head: ["Piece", "Measured", "State"], rows: o.streams.map((s) => [s.name, s.measured || "Nothing measured", s.state]), lead: "Keeps the product’s numbers honest internally: what is measured, where adoption stands, and what Pulse should show." };
      case "proposal": return { kind: "table", head: ["Open deal", "Value", "Stage", "Note"], rows: open.map((d) => [d.name, d.value, d.stage, d.note]), lead: "The proposal builder runs from here: order form in, versioned proposal out." };
      case "monthly": return { kind: "table", head: ["Area", "Where it stands", "State"], rows: o.tiles.map((t) => [t.title, t.headline, t.state]) };
      default: return { kind: "none" };
    }
  };
  const items = b.workflows.map((w) => ({ ...w, detail: detail(w.slug) }));
  return <WorkView slug={b.account.slug} items={items} openSlug={searchParams.w ?? null} />;
}
