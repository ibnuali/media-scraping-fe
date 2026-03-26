import { useInfiniteQuery } from "@tanstack/react-query"
import { keywordsApi } from "@/lib/api"

export function useNews(keywordId: string | null, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: ["keywords", keywordId, "news"],
    queryFn: ({ pageParam = 0 }) =>
      keywordsApi.news(keywordId!, 20, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.has_more ? lastPage.offset + lastPage.limit : undefined,
    enabled: enabled && keywordId !== null,
  })
}
