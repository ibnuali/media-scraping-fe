import { useRef, useCallback } from "react"
import { ExternalLink, Loader2 } from "lucide-react"
import type { NewsItem } from "@/types/keyword"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface NewsTableProps {
  articles: NewsItem[]
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onLoadMore: () => void
}

function SentimentBadge({ sentiment }: { sentiment: NewsItem["sentiment"] }) {
  if (!sentiment) return <span className="text-muted-foreground">—</span>

  const colors = {
    positive:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    negative: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    neutral: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  }

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${colors[sentiment]}`}
    >
      {sentiment}
    </span>
  )
}

export function NewsTable({
  articles,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: NewsTableProps) {
  const observerRef = useRef<IntersectionObserver | null>(null)

  const lastElementRef = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (isFetchingNextPage) return

      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          onLoadMore()
        }
      })

      if (node) {
        observerRef.current.observe(node)
      }
    },
    [hasNextPage, isFetchingNextPage, onLoadMore]
  )

  if (articles.length === 0) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
        <h2 className="mb-4 text-lg font-semibold">Recent News</h2>
        <p className="py-8 text-center text-muted-foreground">
          No news articles found for this keyword.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="p-6 pb-4">
        <h2 className="text-lg font-semibold">Recent News</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[140px]">Published Date</TableHead>
            <TableHead className="w-[150px]">Source</TableHead>
            <TableHead className="min-w-[300px]">Summary</TableHead>
            <TableHead className="w-[100px]">Sentiment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article, index) => (
            <TableRow
              key={article.id}
              ref={index === articles.length - 1 ? lastElementRef : undefined}
            >
              <TableCell className="text-sm text-muted-foreground">
                {article.published_at
                  ? new Date(article.published_at).toLocaleDateString()
                  : "—"}
              </TableCell>
              <TableCell>
                {article.published_by ? (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium hover:text-primary hover:underline"
                  >
                    {article.published_by}
                    <ExternalLink className="size-3" />
                  </a>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                <p className="text-sm">
                  {article.summary || article.title || article.url}
                </p>
              </TableCell>
              <TableCell>
                <SentimentBadge sentiment={article.sentiment} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  )
}
