import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useKeyword, useKeywordAnalytics } from "@/features/keywords"
import { useNews } from "@/features/news"
import { useSidebar } from "@/contexts/sidebar-context"
import { cn } from "@/lib/utils"
import { DashboardStatsCards } from "./DashboardStatsCards"
import { SentimentChart } from "./SentimentChart"
import { TopKeywordsChart } from "./TopKeywordsChart"
import { KeywordFrequencyList } from "./KeywordFrequencyList"
import { NewsTable } from "./NewsTable"

export function KeywordDashboardPage() {
  const { keywordId } = useParams<{ keywordId: string }>()
  const navigate = useNavigate()
  const { collapsed } = useSidebar()

  const { data: keyword, isLoading: keywordLoading } = useKeyword(keywordId ?? null)
  const { data: analytics, isLoading: analyticsLoading } = useKeywordAnalytics(
    keywordId ?? null,
    !!keywordId
  )
  const { data: newsData } = useNews(keywordId ?? null, !!keywordId)

  const isLoading = keywordLoading || analyticsLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!keyword) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
          <ArrowLeft className="size-4" />
          Back to Keywords
        </Button>
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-center text-destructive">
          Keyword not found
        </div>
      </div>
    )
  }

  const topKeywordsData =
    analytics?.top_keywords?.map((k) => ({
      keyword: k.keyword,
      count: k.count,
    })) ?? []

  return (
    <div>
      <div className={cn(
        "fixed top-0 left-0 right-0 z-10 glass-nav px-4 lg:px-8 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between transition-all duration-300",
        collapsed ? "lg:left-20" : "lg:left-72"
      )}>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{keyword.keyword}</h1>
            <p className="text-sm text-muted-foreground">Analytics Dashboard</p>
          </div>
        </div>
      </div>

      <div className="pt-16 space-y-8">
        <DashboardStatsCards
          totalArticles={analytics?.total_articles ?? 0}
          positiveSentiment={analytics?.sentiment?.positive ?? 0}
          negativeSentiment={analytics?.sentiment?.negative ?? 0}
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

        <NewsTable articles={newsData?.items ?? []} />
      </div>
    </div>
  )
}