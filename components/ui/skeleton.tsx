import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-md bg-[hsl(var(--color-surface-shape))] motion-safe:animate-pulse",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
