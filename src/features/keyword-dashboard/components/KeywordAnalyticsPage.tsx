import { Link, useOutletContext, useParams } from "react-router-dom"
import { ArrowLeft, BrainCircuit, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WorkspaceLoading, WorkspaceState } from "@/components/workspace-state"
import { useKeyword, useKeywordAnalytics } from "@/features/keywords"
import type { KeywordWorkspaceContext } from "@/features/keywords/hooks/use-job-log-dialog"
import { KeywordJobStatus } from "@/features/keywords/components/KeywordJobStatus"
import { KeywordAnalyticsContent } from "./KeywordAnalyticsContent"

export function KeywordAnalyticsPage() {
  const { keywordId } = useParams<{ keywordId: string }>()
  const jobs = useOutletContext<KeywordWorkspaceContext>()
  const job = keywordId ? jobs.getJob(keywordId) : undefined
  const isBusy = keywordId ? jobs.isPolling(keywordId) : false
  const isAnalyzing = isBusy && job?.kind === "analysis"
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
        <div>
          <h1>Keyword analytics</h1>
          {keyword.data && <p>{keyword.data.keyword}</p>}
        </div>
        {keyword.data && (
          <div className="keyword-news-actions">
            {job && (
              <Button
                variant="outline"
                onClick={() => {
                  if (keyword.data) jobs.openJobLogs(keyword.data)
                }}
              >
                <FileText className="size-4" />
                View logs
              </Button>
            )}
            <Button
              disabled={isBusy || !analytics.data?.total_articles || !!error}
              onClick={() => {
                if (!keyword.data) return
                jobs.openJobLogs(keyword.data)
                jobs.startAsyncAnalysis(keyword.data.id)
              }}
            >
              {isAnalyzing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <BrainCircuit className="size-4" />
              )}
              {isAnalyzing ? "Analyzing…" : "Analyze sentiment"}
            </Button>
          </div>
        )}
      </header>
      {job && <KeywordJobStatus job={job} />}
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
