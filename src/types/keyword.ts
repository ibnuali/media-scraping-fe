// Keyword types
export interface KeywordResponse {
  id: string // UUID
  user_id: string // UUID
  keyword: string
  last_scraped: string | null
  keyword_summary: string | null
}

export interface KeywordCreate {
  keyword: string
}

export interface KeywordUpdate {
  keyword?: string
}

export interface NewsResponse {
  id: string // UUID
  keyword_id: string // UUID
  title: string | null
  url: string
  description?: string | null
  summary?: string | null
  published_at?: string | null
  published_by?: string | null
  sentiment?: "positive" | "negative" | "neutral" | null
  keyword_matches?: { keyword: string; count: number }[]
  status?: string
  error?: string | null
  scraped_at?: string
}

export type NewsItem = NewsResponse

export interface PaginatedNewsResponse {
  total: number
  limit: number
  offset: number
  has_more: boolean
  items: NewsResponse[]
}

// Scraping Job types
export interface PublicationDateRange {
  start_date?: string | null
  end_date?: string | null
}

export type ScrapingJobStatus = "pending" | "running" | "completed" | "failed"
export type KeywordJobKind = "scrape" | "analysis"
export type KeywordJobType = KeywordJobKind | "summary" | "legacy"

export type ScrapingJobStage =
  | "searching"
  | "scraping"
  | "analyzing"
  | "summarizing"
  | "completed"
  | "failed"

export interface ScrapingJobResponse extends PublicationDateRange {
  id: string // UUID
  keyword_id: string // UUID
  job_type: KeywordJobType
  status: ScrapingJobStatus
  stage: ScrapingJobStage
  total: number | null
  successful: number
  failed: number
  skipped: number
  error_message: string | null
  started_at: string | null
  completed_at: string | null
  created_at: string
}

export interface PaginatedJobHistoryResponse {
  total: number
  limit: number
  offset: number
  has_more: boolean
  items: ScrapingJobResponse[]
}

export interface JobLogResponse {
  id: string
  job_id: string
  url: string
  stage: string
  status: string
  payload: Record<string, unknown>
  error: string | null
  created_at: string
}

export type JobLogStage =
  "searching" | "scraping" | "analyzing" | "summarizing" | "legacy"

export type JobLogStatus = "info" | "success" | "failed" | "skipped"

export interface JobLogFilters {
  stage?: JobLogStage
  status?: JobLogStatus
}

export interface PaginatedJobLogsResponse {
  total: number
  limit: number
  offset: number
  has_more: boolean
  items: JobLogResponse[]
}

export interface ScrapingJobStartResponse {
  job_id: string // UUID
  keyword_id: string // UUID
  status: ScrapingJobStatus
  message: string
}

// Analytics types
export interface SentimentBreakdown {
  positive: number
  negative: number
  neutral: number
}

export interface TopKeyword {
  keyword: string
  count: number
}

export interface KeywordAnalyticsResponse {
  total_articles: number
  sentiment: SentimentBreakdown
  top_keywords: TopKeyword[]
}

export interface KeywordStatsResponse {
  total_keywords: number
  total_news: number
}
