import * as React from "react"
import { BarChart3, ListX, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"

type NoDataVariant = "chart" | "list" | "recommendation"

export interface NoDataStateProps {
  variant: NoDataVariant
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
}

const VARIANT_CONFIG: Record<
  NoDataVariant,
  { Icon: typeof BarChart3; title: string; description: string }
> = {
  chart: {
    Icon: BarChart3,
    title: "No data to display",
    description: "Data will appear here once available.",
  },
  list: {
    Icon: ListX,
    title: "No items yet",
    description: "Items you create will appear here.",
  },
  recommendation: {
    Icon: Sparkles,
    title: "No recommendations yet",
    description: "Recommendations will appear here as data comes in.",
  },
}

export function NoDataState({
  variant,
  title,
  description,
  action,
  className,
}: NoDataStateProps) {
  const config = VARIANT_CONFIG[variant]
  const Icon = config.Icon

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-space-5",
        className
      )}
    >
      <Icon className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      <p className="mt-space-3 text-sm font-medium text-foreground">
        {title ?? config.title}
      </p>
      <p className="mt-space-1 text-sm text-muted-foreground max-w-prose">
        {description ?? config.description}
      </p>
      {action ? <div className="mt-space-3">{action}</div> : null}
    </div>
  )
}
