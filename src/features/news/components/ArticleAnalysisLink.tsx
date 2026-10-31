import { formatNewsDate } from "@/lib/utils"
import { Link } from "react-router-dom"
import type { NewsItem } from "@/types/keyword"
import { SentimentBadge } from "./SentimentBadge"

interface ArticleAnalysisLinkProps {
  article: NewsItem
}

const DESCRIPTION_LIMIT = 200

export function ArticleAnalysisLink({ article }: ArticleAnalysisLinkProps) {
  const description = Array.from(article.description || "")
  const preview = description.slice(0, DESCRIPTION_LIMIT).join("")

  return (
    <Link
      to={`/keywords/${article.keyword_id}/news/${article.id}/analysis`}
      className="workspace-article-row"
    >
      <div className="workspace-article-title">
        <h3>{article.title || "Untitled article"}</h3>
        <SentimentBadge sentiment={article.sentiment} />
      </div>
      <div className="workspace-article-meta">
        <span>{article.published_by || "News source"}</span>
        {article.published_at && (
          <time dateTime={article.published_at}>
            {formatNewsDate(article.published_at)}
          </time>
        )}
      </div>
      <p className="workspace-article-excerpt">
        {preview
          ? `${preview}${description.length > DESCRIPTION_LIMIT ? "…" : ""}`
          : "Open this article to view its saved content."}
      </p>
    </Link>
  )
}
