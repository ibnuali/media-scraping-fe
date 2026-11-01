import { useInfiniteQuery } from "@tanstack/react-query"
import { keywordsApi } from "@/lib/api"

export function useJobHistory(keywordId?: string) {
  return useInfiniteQuery({
    queryKey: ["keyword-job-history", keywordId],
    queryFn: ({ pageParam }) =>
      keywordsApi.getJobHistory(keywordId!, 20, pageParam),
    initialPageParam: 0,
    getNextPageParam: (page) =>
      page.has_more ? page.offset + page.limit : undefined,
    enabled: !!keywordId,
    staleTime: 0,
    refetchInterval: 5000,
  })
}
