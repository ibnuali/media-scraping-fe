import { useQuery } from '@tanstack/react-query'
import { keywordsApi } from '@/lib/api'

export function useNews(keywordId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ['keywords', keywordId, 'news'],
    queryFn: () => keywordsApi.news(keywordId!),
    enabled: enabled && keywordId !== null,
  })
}