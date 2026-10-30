import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { Newspaper, AlertTriangle } from "lucide-react"
import { useNews } from "../hooks/use-news"
import { ArticleList } from "./ArticleList"
import { useHeader } from "@/components/main-layout"
import { Panel } from "@/components/panel"
import { Skeleton } from "@/components/ui/skeleton"

export function NewsPage() {
  const { keywordId } = useParams<{ keywordId: string }>()
  const { setTitle, setDescription } = useHeader()
  const {
    data: news,
    isLoading,
    error,
  } = useNews(keywordId ?? null, !!keywordId)

  const items = news?.pages.flatMap((p) => p.items) ?? []
  const total = news?.pages[0]?.total ?? 0

  useEffect(() => {
    setTitle("News articles")
    setDescription(
      total > 0 ? `${total} article${total !== 1 ? "s" : ""} found` : null
    )
    return () => {
      setTitle(null)
      setDescription(null)
    }
  }, [total, setTitle, setDescription])

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-border bg-card p-3.5"
          >
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="mt-2 h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-32" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
        <div>
          <p className="text-[13px] font-medium">Couldn&apos;t load news</p>
          <p className="mt-0.5 text-xs text-destructive/80">
            {error.message || "Try reloading the page."}
          </p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <Panel>
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <span className="mb-4 flex size-11 items-center justify-center rounded-lg border border-border bg-background">
            <Newspaper className="size-5 text-ink-3" />
          </span>
          <h2 className="text-sm font-semibold tracking-tight">
            No articles yet
          </h2>
          <p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-ink-2">
            Run a scrape from the keyword dashboard and the articles will show
            up here.
          </p>
        </div>
      </Panel>
    )
  }

  return <ArticleList articles={items} />
}
