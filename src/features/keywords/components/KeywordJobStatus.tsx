import { CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import type { ScrapeJob } from "@/hooks/use-async-scrape"

interface KeywordJobStatusProps {
  job: ScrapeJob
}

const stageLabels = {
  searching: "Finding news",
  scraping: "Saving article content",
  analyzing: "Analyzing saved articles",
  summarizing: "Generating summaries",
  completed: "Completed",
  failed: "Failed",
}

export function KeywordJobStatus({ job }: KeywordJobStatusProps) {
  const running = job.status === "pending" || job.status === "running"
  const failed = job.status === "failed"
  const Icon = running
    ? Loader2
    : failed || job.failed
      ? AlertCircle
      : CheckCircle2
  return (
    <div
      className="keyword-job-status"
      data-status={job.status}
      role={failed ? "alert" : "status"}
    >
      <Icon
        className={running ? "size-4 shrink-0 animate-spin" : "size-4 shrink-0"}
      />
      <div>
        <p>
          {job.kind === "analysis" ? "Analysis" : "Scraping"} ·{" "}
          {job.status === "pending"
            ? "Waiting for a worker"
            : job.stage
              ? stageLabels[job.stage]
              : job.status}
          {job.progress && job.progress.total > 0
            ? ` · ${job.progress.current}/${job.progress.total}`
            : ""}
        </p>
        {failed ? (
          <p>{job.error || "Please try again."}</p>
        ) : (
          !running && (
            <p>
              {job.successful ?? 0} successful · {job.failed ?? 0} failed
              {job.failed ? ". Run the action again to retry." : ""}
            </p>
          )
        )}
      </div>
    </div>
  )
}
