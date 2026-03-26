// Keyword types
export interface KeywordResponse {
  id: string // UUID
  user_id: string // UUID
  keyword: string
  max_result: number
  last_scraped: string | null
  keyword_summary: string | null
}

export interface KeywordCreate {
  keyword: string
  max_result?: number
}

export interface KeywordUpdate {
  keyword?: string
  max_result?: number
}

export interface NewsResponse {
  id: string // UUID
  keyword_id: string // UUID
  title: string | null
  url: string
  summary?: string
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
export type ScrapingJobStatus = "pending" | "running" | "completed" | "failed"

export type ScrapingJobStage =
  | "searching"
  | "scraping"
  | "analyzing"
  | "summarizing"
  | "completed"
  | "failed"

export interface ScrapingJobResponse {
  id: string // UUID
  keyword_id: string // UUID
  status: ScrapingJobStatus
  stage: ScrapingJobStage
  total: number | null
  successful: number
  failed: number
  error_message: string | null
  started_at: string | null
  completed_at: string | null
  created_at: string
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
