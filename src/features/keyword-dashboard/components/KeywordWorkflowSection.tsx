import { BrainCircuit, Loader2, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Panel, PanelBody, PanelHead } from "@/components/panel"
import type { ScrapeJob } from "@/hooks/use-async-scrape"

interface KeywordWorkflowSectionProps {
  lastScraped: string | null
  totalArticles: number
  analyzedArticles: number
  isBusy: boolean
  job?: ScrapeJob
  onScrape: () => void
  onAnalyze: () => void
}

export function KeywordWorkflowSection({
  lastScraped,
  totalArticles,
  analyzedArticles,
  isBusy,
  job,
  onScrape,
  onAnalyze,
}: KeywordWorkflowSectionProps) {
  const pendingArticles = Math.max(0, totalArticles - analyzedArticles)
  const isJobRunning = job?.status === "pending" || job?.status === "running"
  const isScraping = isJobRunning && job?.kind === "scrape"
  const isAnalyzing = isJobRunning && job?.kind === "analysis"

  return (
    <Panel>
      <PanelHead
        title="Scraping & analysis"
        hint="Scraping saves full content. Sentiment analysis is optional."
      />
      <PanelBody className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium">1. Scrape articles</h3>
            <p className="mt-1 text-xs text-ink-2">
              Collect news without running AI analysis.
            </p>
            <p className="mt-1 font-mono text-xs text-ink-3">
              Last scraped:{" "}
              {lastScraped ? new Date(lastScraped).toLocaleString() : "never"}
            </p>
          </div>
          <Button onClick={onScrape} disabled={isBusy} className="gap-1.5">
            {isScraping ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Play className="size-4" />
            )}
            {isScraping ? "Scraping…" : "Start scrape"}
          </Button>
        </div>
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium">
              2. Analyze sentiment{" "}
              <span className="text-xs text-ink-3">· optional</span>
            </h3>
            <p className="mt-1 text-xs text-ink-2">
              Analyze saved articles and generate summaries without scraping
              again.
            </p>
            <p className="mt-1 font-mono text-xs text-ink-3" role="status">
              {totalArticles === 0
                ? "Scrape articles first"
                : `${analyzedArticles} analyzed · ${pendingArticles} not analyzed`}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={onAnalyze}
            disabled={isBusy || pendingArticles === 0}
            className="gap-1.5"
          >
            {isAnalyzing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <BrainCircuit className="size-4" />
            )}
            {isAnalyzing ? "Analyzing…" : "Analyze sentiment"}
          </Button>
        </div>
      </PanelBody>
    </Panel>
  )
}
