import { ExternalLink, Globe, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { NewsItem } from "@/types/keyword"

interface ArticleItemProps {
  article: NewsItem
}

const sentimentStyles = {
  positive: "border-success/30 bg-success/10 text-success",
  negative: "border-destructive/30 bg-destructive/10 text-destructive",
  neutral: "border-border bg-muted text-ink-2",
} as const

export function ArticleItem({ article }: ArticleItemProps) {
  const dateValue = article.published_at || article.scraped_at

  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-card transition-colors duration-150 hover:border-primary/40">
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-3 p-3.5"
      >
        <span className="mt-0.5 hidden size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary sm:flex">
          <Globe className="size-4" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-[13px] leading-snug font-medium text-foreground transition-colors group-hover:text-primary">
              {article.title || article.url}
            </h3>
            <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-ink-3 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100" />
          </div>

          {article.summary && (
            <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-ink-2">
              {article.summary}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tabular-nums text-ink-3">
            {dateValue && (
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3" />
                {new Date(dateValue).toLocaleDateString()}
              </span>
            )}
            {article.sentiment && (
              <span
                className={cn(
                  "inline-flex items-center rounded-sm border px-1.5 capitalize",
                  sentimentStyles[article.sentiment]
                )}
              >
                {article.sentiment}
              </span>
            )}
          </div>
        </div>
      </a>
    </article>
  )
}
