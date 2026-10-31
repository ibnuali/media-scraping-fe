import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import type { NewsItem } from "@/types/keyword"

export interface ArticleItemProps {
  article: NewsItem
}

const sentimentStyles = {
  positive: "bg-success/10 text-success",
  negative: "bg-destructive/10 text-destructive",
  neutral: "bg-muted text-ink-2",
} as const

function getSource(article: NewsItem) {
  if (article.published_by) return article.published_by
  try {
    return new URL(article.url).hostname.replace(/^www\./, "")
  } catch {
    return "Source"
  }
}

export function ArticleItem({ article }: ArticleItemProps) {
  const dateValue = article.published_at || article.scraped_at
  const date = dateValue ? new Date(dateValue) : null
  const validDate = date && !Number.isNaN(date.getTime())

  return (
    <article className="group border-b border-border last:border-b-0">
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-md px-4 py-5 transition-colors outline-none hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-ring sm:px-6"
      >
        <div className="mb-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-ink-2">
          <span className="max-w-64 truncate font-medium">
            {getSource(article)}
          </span>
          {validDate && (
            <>
              <span aria-hidden="true" className="text-ink-3">
                ·
              </span>
              <time dateTime={date.toISOString()}>
                {article.published_at ? "Published " : "Collected "}
                {date.toLocaleDateString("id-ID", {
                  timeZone: "Asia/Jakarta",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </>
          )}
          {article.sentiment && (
            <span
              className={cn(
                "ml-auto rounded-sm px-1.5 py-0.5 text-[10px] capitalize",
                sentimentStyles[article.sentiment]
              )}
            >
              {article.sentiment}
            </span>
          )}
        </div>
        <div className="flex items-start gap-4">
          <h3 className="line-clamp-2 min-w-0 flex-1 text-[15px] leading-relaxed font-medium tracking-tight text-foreground group-hover:text-primary">
            {article.title || article.url}
          </h3>
          <ExternalLink className="mt-1 size-3.5 shrink-0 text-ink-3 transition-colors group-hover:text-primary" />
        </div>
        {article.summary && (
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-ink-2">
            {article.summary}
          </p>
        )}
      </a>
    </article>
  )
}
