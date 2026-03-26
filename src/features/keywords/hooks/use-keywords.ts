import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { keywordsApi } from "@/lib/api"
import type { KeywordUpdate } from "@/types/keyword"

export function useKeywords() {
  return useQuery({
    queryKey: ["keywords"],
    queryFn: keywordsApi.list,
  })
}

export function useKeywordStats() {
  return useQuery({
    queryKey: ["keywords", "stats"],
    queryFn: keywordsApi.stats,
  })
}

export function useKeyword(keywordId: string | null) {
  return useQuery({
    queryKey: ["keywords", keywordId],
    queryFn: () => keywordsApi.get(keywordId!),
    enabled: keywordId !== null,
  })
}

export function useKeywordAnalytics(
  keywordId: string | null,
  enabled: boolean
) {
  return useQuery({
    queryKey: ["keywords", keywordId, "analytics"],
    queryFn: () => keywordsApi.analytics(keywordId!),
    enabled: enabled && keywordId !== null,
  })
}

export function useCreateKeyword() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: keywordsApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["keywords"] })
      toast.success("Keyword created", {
        description: `"${data.keyword}" has been added`,
      })
    },
    onError: (error) => {
      toast.error("Failed to create keyword", {
        description:
          error instanceof Error ? error.message : "Please try again",
      })
    },
  })
}

export function useUpdateKeyword() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: KeywordUpdate }) =>
      keywordsApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["keywords"] })
      toast.success("Keyword updated", {
        description: `"${data.keyword}" has been updated`,
      })
    },
    onError: (error) => {
      toast.error("Failed to update keyword", {
        description:
          error instanceof Error ? error.message : "Please try again",
      })
    },
  })
}

export function useDeleteKeyword() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => keywordsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["keywords"] })
      toast.success("Keyword deleted", {
        description: "The keyword has been removed",
      })
    },
    onError: (error) => {
      toast.error("Failed to delete keyword", {
        description:
          error instanceof Error ? error.message : "Please try again",
      })
    },
  })
}

export function useSummarizeKeyword() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => keywordsApi.summarize(id),
    onSuccess: (data) => {
      // Don't invalidate immediately - the summary is generated in background
      // The WebSocket will notify when complete
      toast.success("Generating summary...", {
        description: "You will be notified when complete",
      })
    },
    onError: (error) => {
      toast.error("Failed to start summary generation", {
        description:
          error instanceof Error ? error.message : "Please try again",
      })
    },
  })
}
