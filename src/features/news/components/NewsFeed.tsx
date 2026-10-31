import { useEffect, useRef } from "react"
import { AlertTriangle, Loader2, Newspaper } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArticleList } from "./ArticleList"
import { useNews } from "../hooks/use-news"

export function NewsFeed({ keywordId }: { keywordId: string | null }) {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useNews(keywordId, !!keywordId)
  const sentinel = useRef<HTMLDivElement>(null)
  const articles = data?.pages.flatMap((page) => page.items) ?? []

  useEffect(() => {
    const node = sentinel.current
    if (!node || !hasNextPage || isFetchingNextPage || isFetchNextPageError)
      return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void fetchNextPage()
      },
      { rootMargin: "200px" }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    keywordId,
  ])

  if (!keywordId)
    return (
      <EmptyFeed
        title="Select a keyword"
        description="Choose a keyword to see its collected articles."
      />
    )
  if (isLoading)
    return (
      <div
        aria-label="Loading articles"
        className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-8"
      >
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="space-y-3 border-b border-border py-6">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    )
  if (isError && !data)
    return (
      <div role="alert" className="flex gap-2 p-6 text-sm text-destructive">
        <AlertTriangle className="size-4 shrink-0" />
        {error.message}
      </div>
    )
  if (!articles.length)
    return (
      <EmptyFeed
        title="No articles yet"
        description="Start a scrape to collect news for this keyword."
      />
    )

  return (
    <div className="mx-auto w-full max-w-3xl px-2 py-6 sm:px-8 sm:py-8">
      <div className="mb-2 flex items-center justify-between border-b border-border px-4 pb-4 sm:px-6">
        <h2 className="text-xs font-medium text-ink-2">Collected articles</h2>
        <span className="font-mono text-[11px] text-ink-3 tabular-nums">
          {data?.pages[0]?.total ?? 0} articles
        </span>
      </div>
      <ArticleList articles={articles} />
      <div
        ref={sentinel}
        className="flex justify-center py-6"
        aria-live="polite"
      >
        {isFetchingNextPage && (
          <span className="flex items-center gap-2 text-xs text-ink-2">
            <Loader2 className="size-4 animate-spin" /> Loading more articles…
          </span>
        )}
        {isFetchNextPageError && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => void fetchNextPage()}
          >
            Retry loading articles
          </Button>
        )}
        {hasNextPage && !isFetchingNextPage && !isFetchNextPageError && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void fetchNextPage()}
          >
            Load more
          </Button>
        )}
        {!hasNextPage && (
          <span className="text-xs text-ink-3">You’re all caught up</span>
        )}
      </div>
    </div>
  )
}

function EmptyFeed({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex h-full min-h-80 flex-col items-center justify-center p-6 text-center">
      <span className="mb-5 flex size-12 items-center justify-center rounded-xl border border-border bg-card">
        <Newspaper className="size-5 text-ink-2" />
      </span>
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="mt-2 max-w-xs text-sm text-ink-2">{description}</p>
    </div>
  )
}
