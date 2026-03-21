import type { KeywordResponse } from "@/types/keyword"
import type { ScrapeJob } from "@/hooks/use-async-scrape"
import { KeywordCard } from "./KeywordCard"

interface KeywordListProps {
  keywords: KeywordResponse[]
  getJob: (keywordId: string) => ScrapeJob | undefined
  isPolling: (keywordId: string) => boolean
  onEdit: (keyword: KeywordResponse) => void
  onDelete: (id: string) => void
  onScrape: (keyword: KeywordResponse) => void
  isDeleting: boolean
}

export function KeywordList({
  keywords,
  getJob,
  isPolling,
  onEdit,
  onDelete,
  onScrape,
  isDeleting,
}: KeywordListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {keywords.map((kw) => (
        <KeywordCard
          key={kw.id}
          keyword={kw}
          scrapeJob={getJob(kw.id)}
          isScraping={isPolling(kw.id)}
          onEdit={onEdit}
          onDelete={onDelete}
          onScrape={onScrape}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  )
}