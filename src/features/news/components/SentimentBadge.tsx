import { cn } from "@/lib/utils"
import type { NewsItem } from "@/types/keyword"

const sentimentStyles = {
  positive: "border-success/30 bg-success/10 text-success",
  negative: "border-destructive/30 bg-destructive/10 text-destructive",
  neutral: "border-border bg-muted text-ink-2",
} as const

export function SentimentBadge({
  sentiment,
}: {
  sentiment: NewsItem["sentiment"]
}) {
  return (
    <span
      data-sentiment={sentiment ?? "unanalyzed"}
      className={cn(
        "inline-flex items-center rounded-sm border px-1.5 py-0.5 font-mono text-[11px]",
        sentiment ? sentimentStyles[sentiment] : "border-border text-ink-3"
      )}
    >
      {sentiment ?? "Not analyzed"}
    </span>
  )
}
