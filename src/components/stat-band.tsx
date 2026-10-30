import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type StatTone = "default" | "accent" | "success" | "warning" | "danger"

export interface Stat {
  label: string
  value: string | number
  icon?: LucideIcon
  tone?: StatTone
}

interface StatBandProps {
  stats: Stat[]
  columns?: 2 | 3 | 4
  className?: string
}

const toneClass: Record<StatTone, string> = {
  default: "text-ink-3",
  accent: "text-primary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
}

const columnsClass = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const

export function StatBand({ stats, columns = 3, className }: StatBandProps) {
  return (
    <div
      className={cn(
        "grid divide-y divide-border overflow-hidden rounded-lg border border-border bg-card sm:divide-y-0 sm:divide-x",
        columnsClass[columns],
        className
      )}
    >
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="flex items-start justify-between gap-3 px-4 py-3.5"
          >
            <div className="min-w-0">
              <p className="text-[11px] font-medium tracking-[0.08em] text-ink-3 uppercase">
                {stat.label}
              </p>
              <p className="mt-1.5 font-mono text-xl leading-none font-semibold tracking-tight tabular-nums text-foreground">
                {stat.value}
              </p>
            </div>
            {Icon && (
              <Icon className={cn("size-4 shrink-0", toneClass[stat.tone ?? "default"])} />
            )}
          </div>
        )
      })}
    </div>
  )
}
