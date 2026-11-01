import type { ScrapeJob } from "@/hooks/use-async-scrape"
import type { ScrapingJobResponse } from "@/types/keyword"

export const jobKindLabels = {
  scrape: "Scraping",
  analysis: "Analysis",
  summary: "Summary",
  legacy: "Legacy job",
}

export function toScrapeJob(job: ScrapingJobResponse): ScrapeJob {
  return {
    jobId: job.id,
    keywordId: job.keyword_id,
    kind: job.job_type,
    status: job.status,
    stage: job.stage,
    successful: job.successful,
    failed: job.failed,
    skipped: job.skipped,
    start_date: job.start_date,
    end_date: job.end_date,
    error: job.error_message,
    progress:
      job.total == null
        ? null
        : {
            current: job.successful + job.failed + job.skipped,
            total: job.total,
          },
  }
}
