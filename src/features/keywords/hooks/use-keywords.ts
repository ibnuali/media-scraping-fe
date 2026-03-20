import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { keywordsApi } from '@/lib/api'
import type { KeywordCreate, KeywordUpdate } from '@/types/keyword'

export function useKeywords() {
  return useQuery({
    queryKey: ['keywords'],
    queryFn: keywordsApi.list,
  })
}

export function useKeyword(keywordId: string | null) {
  return useQuery({
    queryKey: ['keywords', keywordId],
    queryFn: () => keywordsApi.get(keywordId!),
    enabled: keywordId !== null,
  })
}

export function useKeywordAnalytics(keywordId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ['keywords', keywordId, 'analytics'],
    queryFn: () => keywordsApi.analytics(keywordId!),
    enabled: enabled && keywordId !== null,
  })
}

export function useCreateKeyword() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: keywordsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keywords'] })
    },
  })
}

export function useUpdateKeyword() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: KeywordUpdate }) =>
      keywordsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keywords'] })
    },
  })
}

export function useDeleteKeyword() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: keywordsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keywords'] })
    },
  })
}

export function useScrapeKeyword() {
  return useMutation({
    mutationFn: keywordsApi.scrape,
  })
}