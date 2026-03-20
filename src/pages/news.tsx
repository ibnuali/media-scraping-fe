import { useParams, useNavigate } from 'react-router-dom'
import { useNews } from '@/hooks/use-keywords'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink, Loader2, Newspaper, Clock, Globe } from 'lucide-react'

export function News() {
  const { keywordId } = useParams<{ keywordId: string }>()
  const navigate = useNavigate()
  const { data: news, isLoading, error } = useNews(keywordId ?? null, !!keywordId)
  const items = news?.items ?? []

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="rounded-xl"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">News Articles</h1>
          <p className="text-muted-foreground">
            {news?.total ?? 0} article{news?.total !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-center text-destructive">
          Failed to load news
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/30 p-16 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-muted/50 mb-4">
            <Newspaper className="size-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-semibold">No news articles found</h3>
          <p className="text-muted-foreground mt-1">Try triggering a scrape first</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((article) => (
            <article
              key={article.id}
              className="group rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover-lift transition-all"
            >
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
          ))}
        </div>
      )}
    </div>
  )
}