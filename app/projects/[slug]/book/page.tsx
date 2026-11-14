import Link from "next/link";
import { notFound } from "next/navigation";
import { getAccount } from "@/lib/data";
import { cn } from "@/lib/utils";

const LENSES = [["all", "Everyone"], ["strategy", "Strategy"], ["product", "Product"], ["engineering", "Engineering"], ["delivery", "Delivery"], ["account", "Account management"]];

export default async function BookPage({ params, searchParams }: { params: { slug: string }; searchParams: { c?: string; lens?: string } }) {
  const b = (await getAccount(params.slug));
  if (!b) notFound();
  const lens = searchParams.lens ?? "all";
  const chapters = b.book.filter((c) => lens === "all" || c.lenses.includes("all") || c.lenses.includes(lens));
  const cur = chapters[Math.min(Number(searchParams.c ?? 0) || 0, Math.max(chapters.length - 1, 0))];
  const base = `/projects/${params.slug}/book`;
  const mins = chapters.reduce((n, c) => n + c.minutes, 0);

  if (!b.book.length) return <div className="mx-auto max-w-[760px] px-space-6 py-space-5 text-sm text-muted-foreground">No book has been written for this project yet.</div>;

  return (
    <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-space-6 px-space-6 py-space-5 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="flex flex-col gap-space-3 lg:sticky lg:top-space-4 lg:self-start">
        <div><h2 className="font-display text-xl font-semibold">The book of {b.account.name}</h2><p className="font-mono text-xs text-muted-foreground">{chapters.length} chapters · {mins} min read</p></div>
        <div className="flex flex-wrap gap-1">
          {LENSES.map(([k, l]) => <Link key={k} href={`${base}?lens=${k}`} className={cn("rounded-full border px-space-2 py-0.5 text-xs no-underline", lens === k ? "border-primary bg-[hsl(var(--color-action-subtle-bg))] text-[hsl(var(--color-action-text))]" : "border-border text-muted-foreground hover:text-foreground")}>{l}</Link>)}
        </div>
        <ol className="overflow-hidden rounded-lg border border-border bg-card">
          {chapters.map((c, i) => (
            <li key={c.sort}>
              <Link href={`${base}?lens=${lens}&c=${i}`} aria-current={c === cur ? "true" : undefined} className={cn("grid grid-cols-[24px_minmax(0,1fr)_auto] gap-space-2 border-b border-border px-space-3 py-space-2 text-sm text-foreground no-underline last:border-0 hover:bg-muted/50", c === cur && "bg-[hsl(var(--color-action-subtle-bg))]")}>
                <span className="font-mono text-xs text-muted-foreground">{i + 1}</span><span className="font-medium">{c.title}</span><span className="font-mono text-xs text-muted-foreground">{c.minutes}m</span>
              </Link>
            </li>
          ))}
        </ol>
      </aside>
      {cur && (
        <article className="flex max-w-[68ch] flex-col gap-space-4">
          <h1 className="font-display text-3xl font-semibold leading-tight">{cur.title}</h1>
          {cur.body.split(/\n\n+/).map((p, i) => <p key={i} className="font-display text-[17px] leading-relaxed">{p}</p>)}
          {cur.sources.length > 0 && <div className="flex flex-wrap gap-1 border-t border-border pt-space-3">{cur.sources.map((s, i) => <span key={i} className="rounded border border-border px-1.5 py-0.5 font-mono text-xs text-muted-foreground">{s}</span>)}</div>}
        </article>
      )}
    </div>
  );
}
