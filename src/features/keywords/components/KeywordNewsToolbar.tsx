import { Link } from "react-router-dom"
import { BarChart3, BrainCircuit, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { KeywordResponse, PublicationDateRange } from "@/types/keyword"
import type { ScrapeJob } from "@/hooks/use-async-scrape"
import { KeywordScrapeForm } from "./KeywordScrapeForm"

interface KeywordNewsToolbarProps {
  keyword: KeywordResponse
  total?: number
  isBusy: boolean
  job?: ScrapeJob
  onScrape: (filters?: PublicationDateRange) => void
  onAnalyze: () => void
}

export function KeywordNewsToolbar({
  keyword,
  total,
  isBusy,
  job,
  onScrape,
  onAnalyze,
}: KeywordNewsToolbarProps) {
  return (
    <header className="keyword-news-heading">
      <div className="keyword-news-heading-copy">
        <h1>{keyword.keyword}</h1>
        <p>
          {total == null
            ? "Loading coverage…"
            : `${total} ${total === 1 ? "article" : "articles"}`}
          <span aria-hidden="true"> · </span>Saved news, ready to explore
        </p>
      </div>
      <div className="keyword-news-actions">
        <Button
          variant="outline"
          render={
            <Link
              to={`/keywords/${encodeURIComponent(keyword.id)}/analytics`}
            />
          }
        >
          <BarChart3 className="size-4" />
          Analytics
        </Button>
        <Button
          onClick={onAnalyze}
          disabled={isBusy || total == null || total === 0}
        >
          {isBusy && job?.kind === "analysis" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <BrainCircuit className="size-4" />
          )}
          {isBusy && job?.kind === "analysis"
            ? "Analyzing…"
            : "Analyze sentiment"}
        </Button>
      </div>
      {total === 0 && (
        <p className="keyword-news-analysis-note">
          Scrape news first. Sentiment analysis is optional.
        </p>
      )}
      <KeywordScrapeForm
        key={keyword.id}
        isBusy={isBusy}
        isScraping={isBusy && job?.kind === "scrape"}
        onScrape={onScrape}
      />
    </header>
  )
}
