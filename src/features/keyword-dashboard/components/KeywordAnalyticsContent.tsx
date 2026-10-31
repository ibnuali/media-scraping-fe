import { Panel, PanelBody, PanelHead } from "@/components/panel"
import { WorkspaceState } from "@/components/workspace-state"
import type { KeywordAnalyticsResponse } from "@/types/keyword"
import { DashboardStatsCards } from "./DashboardStatsCards"
import { SentimentChart } from "./SentimentChart"
import { TopKeywordsChart } from "./TopKeywordsChart"
import { KeywordFrequencyList } from "./KeywordFrequencyList"

export interface KeywordAnalyticsContentProps {
  analytics: KeywordAnalyticsResponse
}

export function KeywordAnalyticsContent({
  analytics,
}: KeywordAnalyticsContentProps) {
  const analyzed = Object.values(analytics.sentiment).reduce(
    (sum, count) => sum + count,
    0
  )

  return (
    <div className="keyword-analytics-content">
      <DashboardStatsCards
        totalArticles={analytics.total_articles}
        pendingAnalysis={Math.max(0, analytics.total_articles - analyzed)}
        positiveSentiment={analytics.sentiment.positive}
        negativeSentiment={analytics.sentiment.negative}
      />
      {analyzed === 0 && analytics.top_keywords.length === 0 ? (
        <WorkspaceState
          title="No analysis yet"
          description="Run sentiment analysis from the news workspace to see sentiment and matched terms here."
        />
      ) : (
        <>
          <div className="keyword-analytics-charts">
            <Panel>
              <PanelHead
                title="Sentiment distribution"
                hint={`${analyzed} analyzed articles`}
              />
              <PanelBody>
                <SentimentChart {...analytics.sentiment} />
              </PanelBody>
            </Panel>
            <Panel>
              <PanelHead
                title="Top matched keywords"
                hint="most frequent terms"
              />
              <PanelBody>
                <TopKeywordsChart data={analytics.top_keywords} />
              </PanelBody>
            </Panel>
          </div>
          <KeywordFrequencyList keywords={analytics.top_keywords} />
        </>
      )}
    </div>
  )
}
