import { ExternalLink, Globe, Clock } from "lucide-react"
import type { NewsItem } from "@/types/keyword"

interface ArticleItemProps {
  article: NewsItem
}

export function ArticleItem({ article }: ArticleItemProps) {
  return (
    <article className="rounded-md border border-border bg-card p-4 transition-colors hover:border-primary/30">
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="flex items-start gap-3">
          <div className="hidden size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary sm:flex">
            <Globe className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-lg font-semibold transition-colors group-hover:text-primary">
              {article.title || article.url}
            </h3>
            {article.summary && (
              <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                {article.summary}
              </p>
            )}
            {article.scraped_at && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-3.5" />
                Scraped: {new Date(article.scraped_at).toLocaleDateString()}
              </div>
            )}
          </div>
          <ExternalLink className="mt-1 size-5 shrink-0 text-muted-foreground/0 transition-all group-hover:text-muted-foreground" />
        </div>
      </a>
    </article>
  )
}
