import { apiFetch } from "@/lib/api"
import type {
  BenchmarkInput,
  BenchmarkResult,
  FactInput,
  FactRecord,
  PlanInput,
  QualityInput,
  RelativeInput,
  RelativeReviewInput,
  RelativeSuggestion,
  ResearchAudit,
  ResearchQAInput,
  ResearchQARecord,
  ResearchRecordMap,
} from "@/types/research"
const root = "/datasets/research"
function post<T>(path: string, body: unknown) {
  return apiFetch<T>(root + path, {
    method: "POST",
    body: JSON.stringify(body),
  })
}
export const researchApi = {
  audit: () => apiFetch<ResearchAudit>(root + "/audit"),
  records: <K extends keyof ResearchRecordMap>(kind: K) =>
    apiFetch<ResearchRecordMap[K][]>(root + `/records/${kind}`),
  plan: (body: PlanInput) =>
    post<ResearchRecordMap["collection_plan"]>("/plans", body),
  fact: (body: FactInput) => post<FactRecord>("/facts", body),
  quality: (body: QualityInput) =>
    post<ResearchRecordMap["quality_review"]>("/quality", body),
  relative: (body: RelativeInput) =>
    post<RelativeSuggestion>("/relative-time", body),
  extractRelative: (version_id: string) =>
    post<RelativeSuggestion[]>("/relative-time/extract", { version_id }),
  reviewRelative: (body: RelativeReviewInput) =>
    post<ResearchRecordMap["relative_review"]>("/relative-time/reviews", body),
  qa: (body: ResearchQAInput) => post<ResearchQARecord>("/qa", body),
  benchmark: (body: BenchmarkInput) =>
    post<BenchmarkResult>("/benchmarks", body),
  exportBenchmark: (id: string) =>
    apiFetch<unknown>(root + `/benchmarks/${id}/export`),
}
