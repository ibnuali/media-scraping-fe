import { CheckCircle, Circle, Loader2, XCircle } from "lucide-react"
import { Panel, PanelBody, PanelHead } from "@/components/panel"
import { cn } from "@/lib/utils"
import type { ScrapeJob } from "@/hooks/use-async-scrape"

interface ScrapingProgressSectionProps {
  scrapeJob: ScrapeJob
}

const scrapingStages = [
  {
    id: "searching",
    label: "Searching",
    description: "Finding results on Google",
  },
  {
    id: "scraping",
    label: "Scraping",
    description: "Saving full article content",
  },
  {
    id: "completed",
    label: "Completed",
    description: "Articles ready to read or analyze",
  },
]
const analysisStages = [
  {
    id: "analyzing",
    label: "Analyzing",
    description: "Analyzing saved articles",
  },
  {
    id: "summarizing",
    label: "Summarizing",
    description: "Writing the keyword summary",
  },
  {
    id: "completed",
    label: "Completed",
    description: "Analysis results ready",
  },
]

export function ScrapingProgressSection({
  scrapeJob: job,
}: ScrapingProgressSectionProps) {
  const isAnalysis = job.kind === "analysis"
  const stages = isAnalysis ? analysisStages : scrapingStages
  const currentStageIndex = stages.findIndex((stage) => stage.id === job.stage)
  const isRunning = job.status === "running" || job.status === "pending"
  const isFailed = job.status === "failed"
  const isCompleted = job.status === "completed"
  const progressPercent =
    job.progress && job.progress.total > 0
      ? Math.min(
          100,
          Math.max(
            0,
            Math.round((job.progress.current / job.progress.total) * 100)
          )
        )
      : 0
  const StatusIcon = isFailed ? XCircle : isCompleted ? CheckCircle : Loader2

  return (
    <Panel>
      <PanelHead
        title={isAnalysis ? "Analysis progress" : "Scrape progress"}
        hint={isRunning ? job.currentTitle || job.currentUrl : undefined}
        actions={
          <span
            role="status"
            className={cn(
              "flex items-center gap-1.5 font-mono text-xs",
              isFailed
                ? "text-destructive"
                : isCompleted
                  ? "text-success"
                  : "text-primary"
            )}
          >
            <StatusIcon
              className={cn("size-3.5", isRunning && "animate-spin")}
            />
            {job.status}
          </span>
        }
      />
      <PanelBody className="space-y-4">
        {job.status === "pending" && (
          <p className="text-xs text-ink-2">Waiting for a worker…</p>
        )}
        {job.progress && job.progress.total > 0 && (
          <div>
            <div
              role="progressbar"
              aria-label={isAnalysis ? "Article analysis" : "Article scraping"}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPercent}
              className="h-1.5 overflow-hidden rounded-full bg-muted"
            >
              <div
                className={cn(
                  "h-full origin-left rounded-full transition-transform",
                  isFailed
                    ? "bg-destructive"
                    : isCompleted
                      ? "bg-success"
                      : "bg-primary"
                )}
                style={{ transform: `scaleX(${progressPercent / 100})` }}
              />
            </div>
            <p className="mt-1 text-right font-mono text-xs text-ink-3">
              {job.progress.current} / {job.progress.total} articles
            </p>
          </div>
        )}
        {!isFailed && (
          <ol className="space-y-3">
            {stages.map((stage, index) => {
              const isDone = isCompleted || index < currentStageIndex
              const isCurrent =
                isRunning &&
                job.status !== "pending" &&
                index === currentStageIndex
              const Icon = isDone ? CheckCircle : isCurrent ? Loader2 : Circle
              return (
                <li key={stage.id} className="flex items-start gap-3">
                  <Icon
                    className={cn(
                      "mt-0.5 size-4 shrink-0",
                      isDone
                        ? "text-success"
                        : isCurrent
                          ? "animate-spin text-primary"
                          : "text-ink-3"
                    )}
                  />
                  <div>
                    <p className="text-sm font-medium">{stage.label}</p>
                    <p className="text-xs text-ink-3">{stage.description}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        )}
        {isCompleted && (
          <p
            role="status"
            className={cn(
              "text-xs",
              job.failed ? "text-warning" : "text-ink-2"
            )}
          >
            {job.successful ?? 0} successful · {job.failed ?? 0} failed.
            {job.failed
              ? isAnalysis
                ? " Run analysis again to retry articles without sentiment."
                : " You can run another scrape to retry."
              : !isAnalysis
                ? " Sentiment analysis is available as an optional next step."
                : ""}
          </p>
        )}
        {isFailed && (
          <p role="alert" className="text-sm text-destructive">
            {job.error || "The job failed. Please try again."}
          </p>
        )}
      </PanelBody>
    </Panel>
  )
}
