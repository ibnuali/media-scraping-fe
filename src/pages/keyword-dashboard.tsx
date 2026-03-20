import { useParams, useNavigate } from "react-router-dom"
import {
  useKeyword,
  useKeywordAnalytics,
  useNews,
} from "@/hooks/use-keywords"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  Newspaper,
  Hash,
} from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

const SENTIMENT_COLORS = {
  positive: "#22c55e", // green-500
  negative: "#ef4444", // red-500
  neutral: "#6b7280", // gray-500
}

export function KeywordDashboard() {
  const { keywordId } = useParams<{ keywordId: string }>()
  const navigate = useNavigate()

  const { data: keyword, isLoading: keywordLoading } = useKeyword(
    keywordId ?? null
  )
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
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="gap-2"
        >
          <ArrowLeft className="size-4" />
          Back to Keywords
        </Button>
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-center text-destructive">
          Keyword not found
        </div>
      </div>
    )
  }

  const sentimentData = analytics?.sentiment
    ? [
        {
          name: "Positive",
          value: analytics.sentiment.positive,
          fill: SENTIMENT_COLORS.positive,
        },
        {
          name: "Negative",
          value: analytics.sentiment.negative,
          fill: SENTIMENT_COLORS.negative,
        },
        {
          name: "Neutral",
          value: analytics.sentiment.neutral,
          fill: SENTIMENT_COLORS.neutral,
        },
      ]
    : []

  const topKeywordsData =
    analytics?.top_keywords?.map((k) => ({
      keyword: k.keyword,
      count: k.count,
    })) ?? []

  const totalSentiment =
    (analytics?.sentiment?.positive ?? 0) +
    (analytics?.sentiment?.negative ?? 0) +
    (analytics?.sentiment?.neutral ?? 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {keyword.keyword}
            </h1>
            <p className="text-sm text-muted-foreground">
              Analytics Dashboard
            </p>
          </div>
        </div>
        <Button
          onClick={() => navigate(`/keywords/${keywordId}/news`)}
          className="gradient-bg h-10 rounded-xl text-white"
        >
          <Newspaper className="size-4" />
          View News ({newsData?.total ?? 0})
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="hover-lift rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <Newspaper className="size-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Articles</p>
              <p className="text-2xl font-bold">
                {analytics?.total_articles ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="hover-lift rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
              <TrendingUp className="size-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Positive</p>
              <p className="text-2xl font-bold">
                {analytics?.sentiment?.positive ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="hover-lift rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-red-500/10 text-red-600">
              <TrendingDown className="size-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Negative</p>
              <p className="text-2xl font-bold">
                {analytics?.sentiment?.negative ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sentiment Pie Chart */}
        <div className="rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-semibold">Sentiment Distribution</h2>
          {totalSentiment === 0 ? (
            <div className="flex h-64 items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Minus className="mx-auto mb-2 size-8" />
                <p>No sentiment data available</p>
                <p className="text-sm">Scrape some articles to see analytics</p>
              </div>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Top Keywords Bar Chart */}
        <div className="rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-semibold">Top Matched Keywords</h2>
          {topKeywordsData.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Hash className="mx-auto mb-2 size-8" />
                <p>No keyword matches found</p>
                <p className="text-sm">Scrape some articles to see top keywords</p>
              </div>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topKeywordsData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="keyword" type="category" width={100} />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="#3b82f6"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Top Keywords List */}
      {topKeywordsData.length > 0 && (
        <div className="rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-semibold">Keyword Frequency</h2>
          <div className="flex flex-wrap gap-2">
            {analytics?.top_keywords?.map((kw, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2"
              >
                <span className="font-medium">{kw.keyword}</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {kw.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}