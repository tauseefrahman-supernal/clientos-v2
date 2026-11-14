import { listAccounts } from "@/lib/data";
import { DeliveryTable, SalesTable, type DeliveryRow, type SalesRow } from "@/components/projects/ProjectTables";

const STAGE_ORDER = ["Order Form", "Proposal", "Prototype", "Concept Alignment", "Idea", "Nurture"];

export default function ProjectsPage() {
  const all = listAccounts();
  const delivery = all.filter((b) => b.account.stage === "delivery");
  const sales = all.filter((b) => b.account.stage === "sales").sort((a, b) => STAGE_ORDER.indexOf(a.account.deal!.stage) - STAGE_ORDER.indexOf(b.account.deal!.stage));
  // "Tauseef" and "Tauseef Rahman" are one person: use the fullest name that shares a first name.
  const names = delivery.map((b) => b.account.strategist).filter(Boolean);
  const fullName = (n: string) => names.filter((x) => x.split(" ")[0] === n.split(" ")[0]).sort((x, y) => y.length - x.length)[0] ?? n;
  const deliveryRows: DeliveryRow[] = delivery.map(({ account: a, book, files }) => ({ slug: a.slug, name: a.name, industry: a.industry, squad: a.squad, strategist: a.strategist ? fullName(a.strategist) : "", mrr: a.mrr, health: a.health, chapters: book.length, filled: files.filter((f) => f.content).length, files: files.length }));
  const salesRows: SalesRow[] = sales.map(({ account: a }) => ({ slug: a.slug, name: a.name, expansion: a.deal!.motion === "Expansion", stage: a.deal!.stage, industry: a.industry, value: a.deal!.value, owner: a.deal!.owner, expectedClose: a.deal!.expectedClose, nextStep: a.deal!.nextStep }));

  return (
    <div className="mx-auto flex max-w-[1240px] flex-col gap-space-6 px-space-6 py-space-5">
      <div>
        <h1 className="font-display text-3xl font-semibold">Projects</h1>
        <p className="mt-space-1 max-w-[72ch] text-sm text-muted-foreground">{delivery.length} accounts in delivery and {sales.length} deals being scoped. Every project starts from the same core templates; projects in the same industry share what they learned.</p>
      </div>

      <section className="flex flex-col gap-space-2">
        <h2 className="font-sans text-xs font-semibold uppercase tracking-widest">In delivery</h2>
        <DeliveryTable rows={deliveryRows} />
      </section>

      <section className="flex flex-col gap-space-2">
        <div className="flex flex-wrap items-baseline gap-space-3"><h2 className="font-sans text-xs font-semibold uppercase tracking-widest">In sales · scoping</h2><span className="font-mono text-xs text-muted-foreground">open deals on the Account OS board</span></div>
        {sales.length ? <SalesTable rows={salesRows} stageOrder={STAGE_ORDER} />
          : <p className="rounded-lg border border-dashed border-border px-space-4 py-space-3 text-sm text-muted-foreground">No pipeline loaded yet. The open deals arrive from Account OS into <code>data/pipeline.json</code>.</p>}
      </section>
    </div>
  );
}
