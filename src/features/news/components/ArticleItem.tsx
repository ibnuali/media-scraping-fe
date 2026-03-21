import { ExternalLink, Globe, Clock } from "lucide-react"
import type { NewsItem } from "@/types/keyword"

interface ArticleItemProps {
  article: NewsItem
}

export function ArticleItem({ article }: ArticleItemProps) {
  return (
    <article className="group rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover-lift transition-all">
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <Globe className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
              {article.title || article.url}
            </h3>
            {article.summary && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
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
          <ExternalLink className="size-5 text-muted-foreground/0 group-hover:text-muted-foreground transition-all shrink-0 mt-1" />
        </div>
      </a>
    </article>
  )
}