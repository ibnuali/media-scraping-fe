import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WorkspaceState, WorkspaceLoading } from "@/components/workspace-state"
import { useNews } from "@/features/news"
import { ArticleAnalysisLink } from "@/features/news/components/ArticleAnalysisLink"
import type { KeywordResponse, PublicationDateRange } from "@/types/keyword"
import type { ScrapeJob } from "@/hooks/use-async-scrape"
import { KeywordNewsToolbar } from "./KeywordNewsToolbar"
import { KeywordJobStatus } from "./KeywordJobStatus"

interface KeywordNewsPanelProps {
  keyword?: KeywordResponse
  isLoadingKeywords: boolean
  hasKeywordError: boolean
  job?: ScrapeJob
  isBusy: boolean
  onScrape: (filters?: PublicationDateRange) => void
  onAnalyze: () => void
  onAdd: () => void
}

export function KeywordNewsPanel({
  keyword,
  isLoadingKeywords,
  hasKeywordError,
  job,
  isBusy,
  onScrape,
  onAnalyze,
  onAdd,
}: KeywordNewsPanelProps) {
  const news = useNews(keyword?.id ?? null, !!keyword)
  const articles = news.data?.pages.flatMap((page) => page.items) ?? []
  const total = news.data?.pages[0]?.total

  return (
    <section
      id="keyword-news-panel"
      className="keyword-news-panel"
      aria-label="Keyword news"
    >
      {isLoadingKeywords ? (
        <WorkspaceLoading />
      ) : !keyword ? (
        <WorkspaceState
          title={
            hasKeywordError
              ? "Your workspace is unavailable"
              : "Start with a keyword"
          }
          description={
            hasKeywordError
              ? "Reload the keyword list to continue."
              : "Add a term, then scrape the news you want to follow."
          }
        >
          {!hasKeywordError && <Button onClick={onAdd}>Add keyword</Button>}
        </WorkspaceState>
      ) : (
        <>
          <KeywordNewsToolbar
            keyword={keyword}
            total={total}
            job={job}
            isBusy={isBusy}
            onScrape={onScrape}
            onAnalyze={onAnalyze}
          />
          {job && <KeywordJobStatus job={job} />}
          <div className="keyword-news-scroll" key={keyword.id}>
            {news.isLoading ? (
              <WorkspaceLoading />
            ) : news.error && !articles.length ? (
              <WorkspaceState
                title="Could not load news"
                description={news.error.message}
                isError
              >
                <Button variant="outline" onClick={() => news.refetch()}>
                  Try again
                </Button>
              </WorkspaceState>
            ) : !articles.length ? (
              <WorkspaceState
                title="No saved articles yet"
                description="Choose optional publication dates above, then scrape this keyword to collect news."
              />
            ) : (
              <>
                <div className="keyword-news-list-heading">
                  <h2>News</h2>
                  <p>Open an article to read its analysis</p>
                </div>
                <ul className="keyword-news-list">
                  {articles.map((article) => (
                    <li key={article.id}>
                      <ArticleAnalysisLink article={article} />
                    </li>
                  ))}
                </ul>
                {news.error && (
                  <p className="workspace-inline-error" role="alert">
                    More articles could not be loaded. Please try again.
                  </p>
                )}
                {news.hasNextPage && (
                  <div className="workspace-load-more">
                    <Button
                      variant="outline"
                      disabled={news.isFetchingNextPage}
                      onClick={() => news.fetchNextPage()}
                    >
                      {news.isFetchingNextPage && (
                        <Loader2 className="size-4 animate-spin" />
                      )}
                      {news.isFetchingNextPage ? "Loading…" : "Load more news"}
                    </Button>
                  </div>
                )}
                <footer className="keyword-news-footer">
                  {articles.length} of {total} articles · {keyword.keyword}
                </footer>
              </>
            )}
          </div>
        </>
      )}
    </section>
  )
}
