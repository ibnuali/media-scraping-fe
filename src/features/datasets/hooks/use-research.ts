import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { ResearchRecordMap } from "@/types/research"
import { researchApi } from "../research-api"
export function useResearchRecords<K extends keyof ResearchRecordMap>(kind: K) {
  return useQuery({
    queryKey: ["datasets", "research", kind],
    queryFn: () => researchApi.records(kind),
  })
}
export function useResearchMutation<T, R>(
  mutationFn: (input: T) => Promise<R>
) {
  const client = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () =>
      client.invalidateQueries({ queryKey: ["datasets", "research"] }),
  })
}
export function useResearchAudit() {
  return useQuery({
    queryKey: ["datasets", "research", "audit"],
    queryFn: researchApi.audit,
  })
}
