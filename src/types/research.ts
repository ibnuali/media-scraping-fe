import type { Artifact, CorpusAudit } from "./dataset"
export interface EvidenceSpan {
  version_id: string
  start: number
  end: number
}
export interface FactInput extends EvidenceSpan {
  topic: string
  entity: string
  attribute: string
  value: string
  valid_from: string | null
  valid_until: string | null
  verified: boolean
}
export interface FactRecord extends FactInput {
  id: string
  text: string
  verification: string
  fact_group: string
}
export interface QualityInput {
  version_id: string
  language: "id" | "other" | "unknown"
  extraction: "usable" | "truncated" | "noise" | "unknown"
  source_use: "full_text" | "metadata_and_quotes" | "unknown"
  notes: string
  verified: boolean
}
export interface PlanInput {
  topic: string
  entities: string[]
  attributes: string[]
  queries: string[]
  start_date: string
  end_date: string
  window_days: 1 | 7
  cap: number
  source_domains: string[]
}
export interface RelativeInput extends EvidenceSpan {
  anchor_date: string
  anchor_source: "publication" | "text"
  anchor_evidence: EvidenceSpan
}
export interface RelativeSuggestion extends EvidenceSpan {
  id: string
  text: string
  status: string
  anchor_date: string
  anchor_source: string
  normalized_start: string | null
  normalized_end: string | null
  verification: string
}
export interface RelativeReviewInput {
  suggestion_id: string
  normalized_start: string
  normalized_end: string
  rationale: string
}
export interface Judgment extends EvidenceSpan {
  label: "supports" | "wrong_time" | "irrelevant" | "refutes"
}
export interface ResearchQAInput {
  snapshot_id: string
  question: string
  gold_answer: string
  intent: "explicit" | "implicit" | "none"
  fact_type: "never_changing" | "slow_changing" | "fast_changing"
  false_premise: boolean
  reference_at: string | null
  target_start: string | null
  target_end: string | null
  temporal_basis: "publication" | "event" | "fact_validity"
  availability: "retrospective" | "observed_as_of"
  fact_ids: string[]
  judgments: Judgment[]
  reviewed: boolean
}
export interface ResearchQARecord extends ResearchQAInput {
  id: string
  review: string
}
export interface BenchmarkInput {
  snapshot_id: string
  qa_ids: string[]
  split_policy: "fact" | "topic"
  seed: string
  dev_percent: number
}
export interface BenchmarkResult extends Artifact {
  splits: Record<string, "dev" | "test">
  warnings: string[]
}
export interface BenchmarkRecord extends BenchmarkResult {
  config: BenchmarkInput
}
export interface ResearchRecordMap {
  fact: FactRecord
  relative_time: RelativeSuggestion
  relative_review: RelativeReviewInput & { id: string; verification: string }
  quality_review: QualityInput & { id: string }
  collection_plan: PlanInput & { id: string }
  collection_run: { id: string; plan_id: string; window_ids: string[] }
  research_qa: ResearchQARecord
  benchmark: BenchmarkRecord
}
export interface ResearchAudit {
  corpus: CorpusAudit
  unique_articles: number
  short_texts: number
  quality_review_missing: number
  verified_quality_reviews: number
  fact_groups: number
  changing_fact_groups: number
  false_premise_questions: number
  reviewed_questions: number
  caveat: string
  collection_outcomes: Record<string, number>
  relative_suggestions: Record<string, number>
  quality_status: Record<string, number>
  languages: Record<string, number>
  topics: Record<string, number>
  qa_intents: Record<string, number>
  qa_fact_types: Record<string, number>
}
