import { apiFetch } from "@/lib/api"
import type {
  AnalysisResult,
  AnnotationInput,
  Artifact,
  CorpusAudit,
  CorpusVersion,
  QAInput,
  RetrievalHit,
  RetrievalParams,
  SnapshotManifest,
} from "@/types/dataset"
const post = <T>(path: string, body?: unknown) =>
  apiFetch<T>(path, {
    method: "POST",
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  })
export const datasetsApi = {
  versions: () => apiFetch<CorpusVersion[]>("/datasets/versions"),
  audit: () => apiFetch<CorpusAudit>("/datasets/audit"),
  analyze: (id: string) =>
    post<AnalysisResult>(`/datasets/versions/${id}/analyze`),
  snapshot: (version_ids: string[], code_version: string) =>
    post<Artifact>("/datasets/snapshots", {
      version_ids,
      code_version,
      config: { purpose: "research" },
    }),
  export: (id: string) =>
    apiFetch<string>(`/datasets/snapshots/${id}/export`, {}, "text"),
  retrieve: (id: string, params: RetrievalParams) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, value]) => !!value)
    )
    return apiFetch<RetrievalHit[]>(
      `/datasets/snapshots/${id}/retrieve?${query}`
    )
  },
  annotate: (body: AnnotationInput) =>
    post<unknown>("/datasets/annotations", body),
  qa: (body: QAInput) => post<unknown>("/datasets/qa", body),
  freezeEvaluation: (id: string) =>
    post<Artifact>(`/datasets/snapshots/${id}/evaluations`),
  evaluationExport: (id: string) =>
    apiFetch<unknown>(`/datasets/evaluations/${id}/export`),
}
export function parseManifest(text: string): SnapshotManifest {
  const manifest = JSON.parse(text.trim()) as SnapshotManifest
  if (manifest.record_type !== "manifest" || !Array.isArray(manifest.entries))
    throw new Error("Invalid snapshot manifest")
  return manifest
}
export function downloadArtifact(
  text: string,
  name: string,
  type = "application/x-ndjson"
) {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = name
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
