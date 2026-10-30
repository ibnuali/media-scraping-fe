import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PanelProps extends React.ComponentProps<"section"> {
  children: ReactNode
}

/** A single containment layer for app-page content. Never nest Panels. */
export function Panel({ className, children, ...props }: PanelProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-card",
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}

interface PanelHeadProps {
  title: string
  /** Mono caption under the title — counts, timestamps, units. */
  hint?: string
  /** Trailing slot — actions, toggles, status. */
  actions?: ReactNode
  className?: string
}

export function PanelHead({
  title,
  hint,
  actions,
  className,
}: PanelHeadProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b border-border px-4 py-3",
        className
      )}
    >
      <div className="min-w-0">
        <h2 className="truncate text-[13px] font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {hint && (
          <p className="mt-0.5 truncate font-mono text-[11px] text-ink-3">
            {hint}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-1.5">{actions}</div>}
    </div>
  )
}

export function PanelBody({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return <div className={cn("p-4", className)}>{children}</div>
}
