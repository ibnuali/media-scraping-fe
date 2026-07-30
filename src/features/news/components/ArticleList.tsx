import type { NewsItem } from "@/types/keyword"
import { ArticleItem } from "./ArticleItem"

interface ArticleListProps {
  articles: NewsItem[]
}

export function ArticleList({ articles }: ArticleListProps) {
  return (
    <div className="grid gap-2">
      {articles.map((article) => (
        <ArticleItem key={article.id} article={article} />
      ))}
    </div>
  )
}
