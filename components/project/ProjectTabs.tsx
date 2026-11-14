"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [["", "Overview"], ["book", "Book"], ["artifacts", "Artifacts"], ["vault", "Vault"], ["work", "Work"]] as const;

export function ProjectTabs({ slug, hasBook = true, hasArtifacts = true }: { slug: string; hasBook?: boolean; hasArtifacts?: boolean }) {
  const path = usePathname();
  const current = path.split("/")[3] ?? "";
  const tabs = TABS.filter(([seg]) => (seg !== "book" || hasBook) && (seg !== "artifacts" || hasArtifacts));
  return (
    <nav aria-label="Project pages" className="mt-space-3 flex gap-0.5 overflow-x-auto">
      {tabs.map(([seg, label]) => (
        <Link key={seg} href={`/projects/${slug}${seg ? "/" + seg : ""}`} aria-current={current === seg ? "page" : undefined}
          className={cn("whitespace-nowrap border-b-2 px-space-3 py-space-2 text-sm font-medium no-underline", current === seg ? "border-primary font-semibold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
