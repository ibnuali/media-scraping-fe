import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Newspaper } from "lucide-react"
import { useNews } from "../hooks/use-news"
import { ArticleList } from "./ArticleList"

export function NewsPage() {
  const { keywordId } = useParams<{ keywordId: string }>()
  const navigate = useNavigate()
  const { data: news, isLoading, error } = useNews(keywordId ?? null, !!keywordId)
  const items = news?.items ?? []

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="rounded-xl"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">News Articles</h1>
          <p className="text-muted-foreground">
            {news?.total ?? 0} article{news?.total !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

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
        <ArticleList articles={items} />
      )}
    </div>
  )
}