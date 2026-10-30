import { useParams } from "react-router-dom"
import { AlertTriangle, Loader2, Play } from "lucide-react"
import { Panel, PanelBody, PanelHead } from "@/components/panel"
import {
  useKeyword,
  useKeywordAnalytics,
  useSummarizeKeyword,
} from "@/features/keywords"
import { useNews } from "@/features/news"
import { useHeader } from "@/components/main-layout"
import { useNotificationWebSocket } from "@/hooks/use-notification-websocket"
import { useAsyncScrape } from "@/hooks/use-async-scrape"
import { useEffect, useState, useMemo } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { DashboardStatsCards } from "./DashboardStatsCards"
import { SentimentChart } from "./SentimentChart"
import { TopKeywordsChart } from "./TopKeywordsChart"
import { KeywordFrequencyList } from "./KeywordFrequencyList"
import { NewsTable } from "./NewsTable"
import { KeywordSummarySection } from "./KeywordSummarySection"
import { ScrapingProgressSection } from "./ScrapingProgressSection"

export function KeywordDashboardPage() {
  const { keywordId } = useParams<{ keywordId: string }>()
  const { setTitle } = useHeader()
  const [generatingSummary, setGeneratingSummary] = useState(false)
  const queryClient = useQueryClient()

  const { data: keyword, isLoading: keywordLoading } = useKeyword(
    keywordId ?? null
  )
  const { data: analytics, isLoading: analyticsLoading } = useKeywordAnalytics(
    keywordId ?? null,
    !!keywordId
  )
  const {
    data: newsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNews(keywordId ?? null, !!keywordId)
  const summarizeMutation = useSummarizeKeyword()

  // Flatten infinite query pages into a single array
  const articles = useMemo(() => {
    if (!newsData?.pages) return []
    return newsData.pages.flatMap((page) => page.items)
  }, [newsData])

  // Async scrape hook for tracking progress
  const { getJob, startAsyncScrape, isPolling } = useAsyncScrape({
    onComplete: () => {
      queryClient.invalidateQueries({
        queryKey: ["keywords", keywordId, "analytics"],
      })
      queryClient.invalidateQueries({
        queryKey: ["keywords", keywordId, "news"],
      })
    },
  })

  const scrapeJob = keywordId ? getJob(keywordId) : undefined
  const isScraping = keywordId ? isPolling(keywordId) : false

  // WebSocket callback for when summary is generated
  useNotificationWebSocket({
    onSummaryGenerated: (completedKeywordId) => {
      if (completedKeywordId === keywordId) {
        setGeneratingSummary(false)
      }
    },
  })

  const isLoading = keywordLoading || analyticsLoading

  // Set header title when keyword loads
  useEffect(() => {
    if (keyword) {
      setTitle(keyword.keyword)
    }
    return () => {
      setTitle(null)
    }
  }, [keyword, setTitle])

  const handleRegenerateSummary = () => {
    if (keywordId) {
      setGeneratingSummary(true)
      summarizeMutation.mutate(keywordId, {
        onError: () => {
          setGeneratingSummary(false)
        },
      })
    }
  }

  const handleStartScrape = () => {
    if (keywordId) {
      startAsyncScrape(keywordId)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-ink-3" />
      </div>
    )
  }

  if (!keyword) {
    return (
      <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
        <p className="text-[13px] font-medium">Keyword not found</p>
      </div>
    )
  }

  const topKeywordsData =
    analytics?.top_keywords?.map((k) => ({
      keyword: k.keyword,
      count: k.count,
    })) ?? []

  return (
    <div className="space-y-4">
      {/* Action row */}
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] tracking-[0.08em] text-ink-3">
          last scraped ·{" "}
          {keyword.last_scraped
            ? new Date(keyword.last_scraped).toLocaleString()
            : "never"}
        </p>
        <Button onClick={handleStartScrape} disabled={isScraping} className="gap-1.5">
          {isScraping ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Scraping…
            </>
          ) : (
            <>
              <Play className="size-4" />
              Start scrape
            </>
          )}
        </Button>
      </div>

      {/* Scraping progress - show when scraping or completed/failed */}
      {(isScraping ||
        scrapeJob?.stage === "completed" ||
        scrapeJob?.stage === "failed") && (
        <ScrapingProgressSection scrapeJob={scrapeJob} />
      )}

      <DashboardStatsCards
        totalArticles={analytics?.total_articles ?? 0}
        positiveSentiment={analytics?.sentiment?.positive ?? 0}
        negativeSentiment={analytics?.sentiment?.negative ?? 0}
      />

      <KeywordSummarySection
        keyword={keyword}
        isGenerating={generatingSummary}
        onRegenerate={handleRegenerateSummary}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHead title="Sentiment distribution" hint="across all articles" />
          <PanelBody>
            <SentimentChart
              positive={analytics?.sentiment?.positive ?? 0}
              negative={analytics?.sentiment?.negative ?? 0}
              neutral={analytics?.sentiment?.neutral ?? 0}
            />
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHead title="Top matched keywords" hint="most frequent terms" />
          <PanelBody>
            <TopKeywordsChart data={topKeywordsData} />
          </PanelBody>
        </Panel>
      </div>

      <KeywordFrequencyList keywords={analytics?.top_keywords ?? []} />

      <NewsTable
        articles={articles}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={fetchNextPage}
      />
    </div>
  )
}
