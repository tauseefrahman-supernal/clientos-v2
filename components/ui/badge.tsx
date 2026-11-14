import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center whitespace-nowrap shrink-0 rounded-md border px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        default:
          "bg-[hsl(var(--color-indicator-default-bg))] text-[hsl(var(--color-indicator-default-text))] border-[var(--color-indicator-default-border)]",
        secondary: "border-transparent bg-muted text-muted-foreground",
        outline: "border-border bg-transparent text-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        inverse:
          "bg-[hsl(var(--color-indicator-inverse-bg))] text-[hsl(var(--color-indicator-inverse-text))] border-[var(--color-indicator-inverse-border)]",
      },
      tone: {
        success:
          "border-[hsl(var(--color-status-success-border))] bg-[hsl(var(--color-status-success-bg))] text-[hsl(var(--color-status-success-text))]",
        warning:
          "border-[hsl(var(--color-status-warning-border))] bg-[hsl(var(--color-status-warning-bg))] text-[hsl(var(--color-status-warning-text))]",
        error:
          "border-[hsl(var(--color-status-error-border))] bg-[hsl(var(--color-status-error-bg))] text-[hsl(var(--color-status-error-text))]",
        info:
          "border-[hsl(var(--color-status-info-border))] bg-[hsl(var(--color-status-info-bg))] text-[hsl(var(--color-status-info-text))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, tone, ...props }: BadgeProps) {
  // tone takes precedence over variant for status semantics; when tone is set,
  // do not also apply variant token classes (they would conflict).
  const computed = tone
    ? badgeVariants({ tone })
    : badgeVariants({ variant })
  return <div className={cn(computed, className)} {...props} />
}

export { Badge, badgeVariants }
