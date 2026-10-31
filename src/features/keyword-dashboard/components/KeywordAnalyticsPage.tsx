import { Link, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WorkspaceLoading, WorkspaceState } from "@/components/workspace-state"
import { useKeyword, useKeywordAnalytics } from "@/features/keywords"
import { KeywordAnalyticsContent } from "./KeywordAnalyticsContent"

export function KeywordAnalyticsPage() {
  const { keywordId } = useParams<{ keywordId: string }>()
  const keyword = useKeyword(keywordId ?? null)
  const analytics = useKeywordAnalytics(keywordId ?? null, !!keywordId)
  const error = keyword.error ?? analytics.error
  const backToNews = keywordId
    ? `/keywords?keyword=${encodeURIComponent(keywordId)}`
    : "/keywords"

  return (
    <div className="keyword-analytics">
      <nav className="article-analysis-nav" aria-label="Analytics navigation">
        <Link to={backToNews}>
          <ArrowLeft className="size-4" />
          Back to news
        </Link>
      </nav>
      <header className="keyword-analytics-header">
        <h1>Keyword analytics</h1>
        {keyword.data && <p>{keyword.data.keyword}</p>}
      </header>
      {keyword.isLoading || analytics.isLoading ? (
        <WorkspaceLoading />
      ) : error ? (
        <WorkspaceState
          title="Could not load analytics"
          description={error.message}
          isError
        >
          <Button
            variant="outline"
            onClick={() => {
              if (keyword.error) keyword.refetch()
              if (analytics.error) analytics.refetch()
            }}
          >
            Try again
          </Button>
        </WorkspaceState>
      ) : !keyword.data || !analytics.data ? (
        <WorkspaceState
          title="Analytics unavailable"
          description="Return to the workspace and choose a keyword."
        />
      ) : analytics.data.total_articles === 0 ? (
        <WorkspaceState
          title="No saved articles yet"
          description="Scrape news for this keyword to start collecting coverage."
        >
          <Button variant="outline" render={<Link to={backToNews} />}>
            Browse news
          </Button>
        </WorkspaceState>
      ) : (
        <KeywordAnalyticsContent analytics={analytics.data} />
      )}
    </div>
  )
}
