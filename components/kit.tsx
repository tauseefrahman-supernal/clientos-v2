import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ShareStatus, Tone } from "@/lib/types";

const TONE: Record<string, "success" | "warning" | "error" | "info" | undefined> = { ok: "success", warn: "warning", err: "error", info: "info" };

export function Pill({ tone, children, className }: { tone?: Tone | string; children: React.ReactNode; className?: string }) {
  const t = TONE[tone ?? ""];
  return t ? <Badge tone={t} className={cn("font-medium", className)}>{children}</Badge> : <Badge variant="secondary" className={cn("font-medium", className)}>{children}</Badge>;
}

const STATUS: Record<ShareStatus, { label: string; tone: Tone }> = {
  standard: { label: "Standard", tone: "" },
  shared: { label: "Shared", tone: "ok" },
  proposed: { label: "Proposed", tone: "warn" },
  local: { label: "Local", tone: "info" },
};

export function StatusTag({ status }: { status: ShareStatus }) {
  const s = STATUS[status];
  return <Pill tone={s.tone} className="uppercase tracking-wider text-xs px-1.5 py-0">{s.label}</Pill>;
}

export function Section({ title, aside, children }: { title: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-space-2">
      <div className="flex flex-wrap items-baseline gap-space-3">
        <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground">{title}</h2>
        {aside && <div className="ml-auto flex flex-wrap items-center gap-space-2">{aside}</div>}
      </div>
      {children}
    </section>
  );
}

export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-lg border border-border bg-card", className)}>{children}</div>;
}

export function Rows({ children }: { children: React.ReactNode }) {
  return <ul className="divide-y divide-[var(--color-border-default)]">{children}</ul>;
}

export function Row({ title, detail, right }: { title: React.ReactNode; detail?: React.ReactNode; right?: React.ReactNode }) {
  return (
    <li className="flex items-start gap-space-3 px-space-4 py-space-3">
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        {detail && <div className="mt-0.5 text-xs text-muted-foreground">{detail}</div>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </li>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-lg border border-dashed border-border bg-muted/40 px-space-4 py-space-3 text-xs text-muted-foreground">{children}</p>;
}
