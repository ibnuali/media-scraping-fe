import { formatNewsDate } from "@/lib/utils"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WorkspaceLoading, WorkspaceState } from "@/components/workspace-state"
import { useArticle } from "../hooks/use-article"
import { useKeyword } from "@/features/keywords"
import { SentimentBadge } from "./SentimentBadge"

export function ArticleAnalysisPage() {
  const { keywordId, articleId } = useParams<{
    keywordId: string
    articleId: string
  }>()
  const articleQuery = useArticle(keywordId ?? null, articleId ?? null)
  const { data: keyword } = useKeyword(keywordId ?? null)
  const article = articleQuery.data
  const backToNews = keywordId
    ? `/keywords?keyword=${encodeURIComponent(keywordId)}`
    : "/keywords"

  return (
    <div className="article-analysis">
      <nav className="article-analysis-nav" aria-label="Article navigation">
        <Link to={backToNews}>
          <ArrowLeft className="size-4" />
          Back to news
        </Link>
        {article && (
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            Original source
            <ArrowUpRight className="size-4" />
          </a>
        )}
      </nav>
      {articleQuery.isLoading ? (
        <WorkspaceLoading />
      ) : articleQuery.error ? (
        <WorkspaceState
          title="Could not load this article"
          description={articleQuery.error.message}
          isError
        >
          <Button variant="outline" onClick={() => articleQuery.refetch()}>
            Try again
          </Button>
        </WorkspaceState>
      ) : !article ? (
        <WorkspaceState
          title="Article not found"
          description="This article is no longer available under this keyword."
        >
          <Button variant="outline" render={<Link to={backToNews} />}>
            Back to news
          </Button>
        </WorkspaceState>
      ) : (
        <article>
          <header className="article-analysis-header">
            <div className="article-analysis-meta">
              {keyword && <span>{keyword.keyword}</span>}
              {article.published_by && <span>{article.published_by}</span>}
              {article.published_at && (
                <time dateTime={article.published_at}>
                  {formatNewsDate(article.published_at)}
                </time>
              )}
            </div>
            <h1>{article.title || "Untitled article"}</h1>
            {article.sentiment && (
              <div className="article-analysis-sentiment">
                <span>Sentiment</span>
                <SentimentBadge sentiment={article.sentiment} />
              </div>
            )}
          </header>
          <section
            className="article-analysis-summary"
            aria-labelledby="article-summary-heading"
          >
            <h2 id="article-summary-heading">Summary</h2>
            <p>{article.summary?.trim() || "-"}</p>
          </section>
          <section
            className="article-analysis-content"
            aria-labelledby="article-content-heading"
          >
            <h2 id="article-content-heading">Full content</h2>
            <div>
              {article.description ||
                "Full content is not available for this article."}
            </div>
          </section>
        </article>
      )}
    </div>
  )
}
