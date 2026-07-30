import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Newspaper } from "lucide-react"
import { useNews } from "../hooks/use-news"
import { ArticleList } from "./ArticleList"

export function NewsPage() {
  const { keywordId } = useParams<{ keywordId: string }>()
  const navigate = useNavigate()
  const {
    data: news,
    isLoading,
    error,
  } = useNews(keywordId ?? null, !!keywordId)
  const items = news?.pages.flatMap((p) => p.items) ?? []
  const total = news?.pages[0]?.total ?? 0

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/keywords")}
          className="rounded-md"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">News Articles</h1>
          <p className="text-muted-foreground">
            {total} article{total !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="rounded-md border border-destructive/20 bg-destructive/10 p-6 text-center text-destructive">
          Failed to load news
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-md border border-dashed border-border bg-card p-12 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-md bg-muted/50">
            <Newspaper className="size-6 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-semibold">No news articles found</h3>
          <p className="mt-1 text-muted-foreground">
            Try triggering a scrape first
          </p>
        </div>
      ) : (
        <ArticleList articles={items} />
      )}
    </div>
  )
}
