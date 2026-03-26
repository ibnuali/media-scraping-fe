import { ExternalLink, Globe, Clock } from "lucide-react"
import type { NewsItem } from "@/types/keyword"

interface ArticleItemProps {
  article: NewsItem
}

export function ArticleItem({ article }: ArticleItemProps) {
  return (
    <article className="group hover-lift rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all">
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="flex items-start gap-4">
          <div className="hidden size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
            <Globe className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-lg font-semibold transition-colors group-hover:text-primary">
              {article.title || article.url}
            </h3>
            {article.summary && (
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {article.summary}
              </p>
            )}
            {article.scraped_at && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
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
