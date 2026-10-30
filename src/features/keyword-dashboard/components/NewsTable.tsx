import { useRef, useCallback } from "react"
import { ExternalLink, Loader2, Newspaper } from "lucide-react"
import { Panel, PanelHead } from "@/components/panel"
import { cn } from "@/lib/utils"
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

const sentimentStyles = {
  positive: "border-success/30 bg-success/10 text-success",
  negative: "border-destructive/30 bg-destructive/10 text-destructive",
  neutral: "border-border bg-muted text-ink-2",
} as const

function SentimentBadge({ sentiment }: { sentiment: NewsItem["sentiment"] }) {
  if (!sentiment) return <span className="text-ink-3">—</span>

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-1.5 py-0.5 font-mono text-[11px] capitalize",
        sentimentStyles[sentiment]
      )}
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
      <Panel>
        <PanelHead title="Recent news" hint="nothing scraped yet" />
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <Newspaper className="mb-3 size-7 text-ink-3" />
          <p className="text-[13px] text-ink-2">
            No articles for this keyword yet
          </p>
          <p className="mt-1 font-mono text-[11px] text-ink-3">
            run a scrape to pull the latest coverage
          </p>
        </div>
      </Panel>
    )
  }

  return (
    <Panel>
      <PanelHead
        title="Recent news"
        hint={`${articles.length} loaded`}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Published</TableHead>
            <TableHead className="w-[150px]">Source</TableHead>
            <TableHead className="min-w-[280px]">Summary</TableHead>
            <TableHead className="w-[100px]">Sentiment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article, index) => (
            <TableRow
              key={article.id}
              ref={index === articles.length - 1 ? lastElementRef : undefined}
            >
              <TableCell className="font-mono text-xs tabular-nums text-ink-3">
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
                    className="inline-flex items-center gap-1 text-[13px] font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
                  >
                    <span className="truncate">{article.published_by}</span>
                    <ExternalLink className="size-3 shrink-0" />
                  </a>
                ) : (
                  <span className="text-ink-3">—</span>
                )}
              </TableCell>
              <TableCell>
                <p className="line-clamp-2 text-[13px] text-ink-2">
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
        <div className="flex items-center justify-center border-t border-border py-3">
          <Loader2 className="size-4 animate-spin text-ink-3" />
        </div>
      )}
    </Panel>
  )
}
