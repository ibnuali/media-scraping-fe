import {
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query"
import { keywordsApi } from "@/lib/api"
import type { PaginatedNewsResponse } from "@/types/keyword"

export function useArticle(keywordId: string | null, articleId: string | null) {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: ["keywords", keywordId, "article", articleId],
    enabled: !!keywordId && !!articleId,
    initialData: () =>
      queryClient
        .getQueryData<InfiniteData<PaginatedNewsResponse>>([
          "keywords",
          keywordId,
          "news",
        ])
        ?.pages.flatMap((page) => page.items)
        .find((article) => article.id === articleId),
    queryFn: async ({ signal }) => {
      let offset = 0
      while (true) {
        signal.throwIfAborted()
        const page = await keywordsApi.news(keywordId!, 100, offset)
        signal.throwIfAborted()
        const article = page.items.find((item) => item.id === articleId)
        if (article) return article
        if (!page.has_more || !page.items.length) return null
        offset = page.offset + page.limit
      }
    },
  })
}
