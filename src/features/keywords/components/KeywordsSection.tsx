import { Loader2 } from "lucide-react"
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
  isDeleting: boolean
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
  isDeleting,
}: KeywordsSectionProps) {
  const { data: stats } = useKeywordStats()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-center text-destructive">
        Failed to load keywords
      </div>
    )
  }

  if (!keywords || keywords.length === 0) {
    return <KeywordsEmptyState />
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
