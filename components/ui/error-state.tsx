import * as React from "react"
import { AlertTriangle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type ErrorType = "retry" | "permission" | "not-found"

export interface ErrorStateProps {
  type: ErrorType
  title?: string
  description?: string
  onRetry?: () => void
  action?: React.ReactNode
  className?: string
}

const TYPE_CONFIG: Record<ErrorType, { title: string; description: string }> = {
  retry: {
    title: "Something went wrong",
    description: "Try again, or contact support if it keeps happening.",
  },
  permission: {
    title: "You don't have permission to view this",
    description: "Contact your admin to request access.",
  },
  "not-found": {
    title: "Not found",
    description: "This item may have been moved or removed.",
  },
}

export function ErrorState({
  type,
  title,
  description,
  onRetry,
  action,
  className,
}: ErrorStateProps) {
  const config = TYPE_CONFIG[type]

  return (
    <div
      role={type === "retry" ? "alert" : "status"}
      className={cn(
        "flex flex-col items-center justify-center text-center p-space-5",
        className
      )}
    >
      <AlertTriangle
        className="h-8 w-8 text-[hsl(var(--color-status-error))]"
        aria-hidden="true"
      />
      <p className="mt-space-3 text-sm font-medium text-foreground">
        {title ?? config.title}
      </p>
      <p className="mt-space-1 text-sm text-muted-foreground max-w-prose">
        {description ?? config.description}
      </p>
      {type === "retry" && onRetry ? (
        <div className="mt-space-3">
          <Button variant="secondary" onClick={onRetry}>
            Try Again
          </Button>
        </div>
      ) : null}
      {action ? <div className="mt-space-3">{action}</div> : null}
    </div>
  )
}
