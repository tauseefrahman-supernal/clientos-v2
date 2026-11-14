import { listAccounts } from "@/lib/data";
import { StellaChat } from "@/components/stella/StellaChat";

export const dynamic = "force-dynamic";

export default function StellaPage({ searchParams }: { searchParams: { project?: string; chat?: string } }) {
  const projects = listAccounts().map((b) => ({
    slug: b.account.slug, name: b.account.name, stage: b.account.stage,
    suggestions: b.account.stage === "sales"
      ? ["What do we know about this deal so far?", "What have similar delivered projects taught us that should shape the proposal?", "What should we ask on the next discovery call?"]
      : [...b.overview.answers.map((x) => x.q).slice(0, 2), "What needs my attention this week?", "What changed since we closed?"].slice(0, 4),
  }));
  return <StellaChat projects={projects} initialProject={searchParams.project ?? null} initialChat={searchParams.chat ?? null} />;
}
