import { AlertTriangle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { KeywordsStatsCards } from "./KeywordsStatsCards"
import { KeywordList } from "./KeywordList"
import { KeywordsEmptyState } from "./KeywordsEmptyState"
import { useKeywordStats } from "../hooks/use-keywords"
import type { KeywordResponse } from "@/types/keyword"
import type { ScrapeJob } from "@/hooks/use-async-scrape"

interface KeywordsSectionProps {
  keywords: KeywordResponse[] | undefined
  isLoading: boolean
  error: Error | null
  getJob: (keywordId: string) => ScrapeJob | undefined
  isPolling: (keywordId: string) => boolean
  onEdit: (keyword: KeywordResponse) => void
  onDelete: (id: string) => void
  onScrape: (keyword: KeywordResponse) => void
  onAdd: () => void
  isDeleting: boolean
}

function KeywordListSkeleton() {
  return (
    <div className="space-y-1.5">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5"
        >
          <Skeleton className="size-8 shrink-0 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function KeywordsSection({
  keywords,
  isLoading,
  error,
  getJob,
  isPolling,
  onEdit,
  onDelete,
  onScrape,
  onAdd,
  isDeleting,
}: KeywordsSectionProps) {
  const { data: stats } = useKeywordStats()

  if (isLoading) {
    return <KeywordListSkeleton />
  }

  if (error) {
    return (
      <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
        <div>
          <p className="text-[13px] font-medium">Couldn&apos;t load keywords</p>
          <p className="mt-0.5 text-xs text-destructive/80">
            {error.message || "Something went wrong. Try reloading the page."}
          </p>
        </div>
      </div>
    )
  }

  if (!keywords || keywords.length === 0) {
    return <KeywordsEmptyState onAdd={onAdd} />
  }

  return (
    <>
      <KeywordsStatsCards
        totalKeywords={keywords.length}
        totalNews={stats?.total_news ?? 0}
      />
      <KeywordList
        keywords={keywords}
        getJob={getJob}
        isPolling={isPolling}
        onEdit={onEdit}
        onDelete={onDelete}
        onScrape={onScrape}
        isDeleting={isDeleting}
      />
    </>
  )
}
