export interface CorpusVersion {
  id: string
  url: string
  title?: string | null
  published_by?: string | null
  fetched_at?: string | null
  content_hash: string
  quality_status: string
  publication: {
    status: string
    precision?: string
    start?: string
    end?: string
    candidates?: unknown[]
  }
}
export interface CorpusAudit {
  versions: number
  unusable: number
  uncertain_dates: number
  missing_dates: number
  invalid_dates: number
  conflicting_dates: number
  duplicates: string[][]
  periods: Record<string, number>
  publishers: Record<string, number>
}
export interface Artifact {
  id: string
  checksum: string
}
export interface SnapshotEntry extends Omit<CorpusVersion, "id"> {
  version_id: string
  content: string
}
export interface SnapshotManifest {
  record_type: "manifest"
  checksum: string
  entries: SnapshotEntry[]
  annotations: unknown[]
  config: Record<string, unknown>
  code_version: string
}
export interface RetrievalHit {
  version_id: string
  start: number
  end: number
  text: string
  score: number
}
export interface RetrievalParams {
  query: string
  start?: string
  end?: string
  semantics: "publication" | "event"
  as_of?: string
}
export interface AnnotationInput {
  version_id: string
  start: number
  end: number
  event_start: string
  event_end: string
  verified: boolean
}
export interface QAInput {
  snapshot_id: string
  question: string
  gold_answer: string
  evidence: { version_id: string; start: number; end: number }[]
  time_constraint: Record<string, string>
  reviewed: boolean
}
export interface AnalysisResult {
  status: string
  error?: string
}
