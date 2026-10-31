import { BrainCircuit, Loader2, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { KeywordResponse } from "@/types/keyword"
import type { ScrapeJob } from "@/hooks/use-async-scrape"

interface KeywordNewsToolbarProps {
  keyword: KeywordResponse
  total?: number
  analyzed?: number
  isBusy: boolean
  job?: ScrapeJob
  onScrape: () => void
  onAnalyze: () => void
}

export function KeywordNewsToolbar({
  keyword,
  total,
  analyzed,
  isBusy,
  job,
  onScrape,
  onAnalyze,
}: KeywordNewsToolbarProps) {
  const pending =
    total != null && analyzed != null
      ? Math.max(0, total - analyzed)
      : undefined
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
        <Button variant="outline" onClick={onScrape} disabled={isBusy}>
          {isBusy && job?.kind === "scrape" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Play className="size-4" />
          )}
          {isBusy && job?.kind === "scrape" ? "Scraping…" : "Scrape news"}
        </Button>
        <Button
          onClick={onAnalyze}
          disabled={isBusy || pending == null || pending === 0}
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
      <p className="keyword-news-analysis-note">
        {pending == null
          ? "Analysis counts unavailable while loading."
          : total === 0
            ? "Scrape news first. Sentiment analysis is optional."
            : pending > 0
              ? `${pending} not analyzed. Analysis is optional and uses saved content.`
              : "All saved articles have been analyzed."}
      </p>
    </header>
  )
}
