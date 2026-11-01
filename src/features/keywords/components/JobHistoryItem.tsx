import { ChevronRight, Loader2 } from "lucide-react"
import type { ScrapingJobResponse } from "@/types/keyword"
import { jobKindLabels } from "../lib/job-history"

export interface JobHistoryItemProps {
  job: ScrapingJobResponse
  onSelect: (job: ScrapingJobResponse) => void
}

export function JobHistoryItem({ job, onSelect }: JobHistoryItemProps) {
  const active = job.status === "pending" || job.status === "running"
  const status =
    job.status === "completed" && job.failed > 0
      ? "Completed with failures"
      : job.status
  return (
    <li>
      <button
        type="button"
        className="job-history-item"
        onClick={() => onSelect(job)}
      >
        <span className="job-history-item-heading">
          <strong>{jobKindLabels[job.job_type]}</strong>
          <span className="job-history-status" data-status={job.status}>
            {active && (
              <Loader2 className="size-3 animate-spin" aria-hidden="true" />
            )}
            {status}
          </span>
          <ChevronRight className="size-4 shrink-0" aria-hidden="true" />
        </span>
        <time dateTime={job.created_at}>
          {new Date(job.created_at).toLocaleString()}
        </time>
        <span className="job-history-counts">
          {job.successful} successful · {job.failed} failed · {job.skipped}{" "}
          skipped
        </span>
        {(job.start_date || job.end_date) && (
          <span>
            Publication: {job.start_date || "Any"} – {job.end_date || "Any"}
          </span>
        )}
        {job.error_message && (
          <span className="text-destructive">{job.error_message}</span>
        )}
        <span className="font-mono text-ink-3">Job {job.id}</span>
        <span className="text-primary">View logs</span>
      </button>
    </li>
  )
}
