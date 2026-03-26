import { useParams } from "react-router-dom"
import { Loader2, Play } from "lucide-react"
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
      // Invalidate analytics when scraping completes
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
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!keyword) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-center text-destructive">
        Keyword not found
      </div>
    )
  }

  const topKeywordsData =
    analytics?.top_keywords?.map((k) => ({
      keyword: k.keyword,
      count: k.count,
    })) ?? []

  return (
    <div className="space-y-6">
      {/* Scrape action bar */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Last scraped:{" "}
            {keyword.last_scraped
              ? new Date(keyword.last_scraped).toLocaleString()
              : "Never"}
          </p>
        </div>
        <Button
          onClick={handleStartScrape}
          disabled={isScraping}
          className="gap-2"
        >
          {isScraping ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Scraping...
            </>
          ) : (
            <>
              <Play className="size-4" />
              Start Scrape
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

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-semibold">Sentiment Distribution</h2>
          <SentimentChart
            positive={analytics?.sentiment?.positive ?? 0}
            negative={analytics?.sentiment?.negative ?? 0}
            neutral={analytics?.sentiment?.neutral ?? 0}
          />
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-semibold">Top Matched Keywords</h2>
          <TopKeywordsChart data={topKeywordsData} />
        </div>
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
