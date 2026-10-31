import { useParams } from "react-router-dom"
import { AlertTriangle, Loader2 } from "lucide-react"
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
import { DashboardStatsCards } from "./DashboardStatsCards"
import { SentimentChart } from "./SentimentChart"
import { TopKeywordsChart } from "./TopKeywordsChart"
import { KeywordFrequencyList } from "./KeywordFrequencyList"
import { NewsTable } from "./NewsTable"
import { KeywordSummarySection } from "./KeywordSummarySection"
import { ScrapingProgressSection } from "./ScrapingProgressSection"
import { KeywordWorkflowSection } from "./KeywordWorkflowSection"

export function KeywordDashboardPage() {
  const { keywordId } = useParams<{ keywordId: string }>()
  const { setTitle } = useHeader()
  const [generatingSummary, setGeneratingSummary] = useState(false)

  const { data: keyword, isLoading: keywordLoading } = useKeyword(
    keywordId ?? null
  )
  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useKeywordAnalytics(keywordId ?? null, !!keywordId)
  const {
    data: newsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: newsLoading,
    error: newsError,
    refetch: refetchNews,
  } = useNews(keywordId ?? null, !!keywordId)
  const summarizeMutation = useSummarizeKeyword()

  // Flatten infinite query pages into a single array
  const articles = useMemo(() => {
    if (!newsData?.pages) return []
    return newsData.pages.flatMap((page) => page.items)
  }, [newsData])

  const { getJob, startAsyncScrape, startAsyncAnalysis, isPolling } =
    useAsyncScrape()

  const scrapeJob = keywordId ? getJob(keywordId) : undefined
  const isJobRunning = keywordId ? isPolling(keywordId) : false
  const analyzedArticles = Object.values(analytics?.sentiment ?? {}).reduce(
    (sum, count) => sum + count,
    0
  )

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
      {analyticsError && (
        <p role="alert" className="text-sm text-destructive">
          Could not load analysis counts: {analyticsError.message}. Reload the
          page to try again.
        </p>
      )}
      <KeywordWorkflowSection
        lastScraped={keyword.last_scraped}
        totalArticles={analytics?.total_articles ?? 0}
        analyzedArticles={analyzedArticles}
        isBusy={isJobRunning || generatingSummary}
        job={scrapeJob}
        onScrape={handleStartScrape}
        onAnalyze={() => {
          if (keywordId) startAsyncAnalysis(keywordId)
        }}
      />

      {scrapeJob && <ScrapingProgressSection scrapeJob={scrapeJob} />}

      <DashboardStatsCards
        totalArticles={analytics?.total_articles ?? 0}
        pendingAnalysis={Math.max(
          0,
          (analytics?.total_articles ?? 0) - analyzedArticles
        )}
        positiveSentiment={analytics?.sentiment?.positive ?? 0}
        negativeSentiment={analytics?.sentiment?.negative ?? 0}
      />

      <KeywordSummarySection
        keyword={keyword}
        isGenerating={
          generatingSummary ||
          (isJobRunning && scrapeJob?.stage === "summarizing")
        }
        canGenerate={analyzedArticles > 0 && !isJobRunning}
        onRegenerate={handleRegenerateSummary}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHead
            title="Sentiment distribution"
            hint={`${analyzedArticles} analyzed articles`}
          />
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
        isLoading={newsLoading}
        error={newsError}
        onRetry={() => refetchNews()}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={fetchNextPage}
      />
    </div>
  )
}
