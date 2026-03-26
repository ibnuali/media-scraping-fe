import {
  CheckCircle,
  Circle,
  Loader2,
  Search,
  FileText,
  Sparkles,
  XCircle,
} from "lucide-react"
import type { ScrapeJob } from "@/hooks/use-async-scrape"

interface ScrapingProgressSectionProps {
  scrapeJob?: ScrapeJob
}

interface StageInfo {
  id: ScrapeJob["stage"]
  label: string
  icon: React.ReactNode
  description: string
}

const stages: StageInfo[] = [
  {
    id: "searching",
    label: "Searching",
    icon: <Search className="size-4" />,
    description: "Finding results on Google",
  },
  {
    id: "scraping",
    label: "Scraping",
    icon: <FileText className="size-4" />,
    description: "Extracting page content",
  },
  {
    id: "analyzing",
    label: "Analyzing",
    icon: <Sparkles className="size-4" />,
    description: "AI processing content",
  },
  {
    id: "summarizing",
    label: "Summarizing",
    icon: <FileText className="size-4" />,
    description: "Generating keyword summary",
  },
  {
    id: "completed",
    label: "Completed",
    icon: <CheckCircle className="size-4" />,
    description: "All done!",
  },
]

function getStageIndex(stage: ScrapeJob["stage"] | undefined): number {
  if (!stage) return -1
  if (stage === "failed") return -1
  return stages.findIndex((s) => s.id === stage)
}

function StageItem({
  stage,
  currentIndex,
  stageIndex,
  progress,
  error,
}: {
  stage: StageInfo
  currentIndex: number
  stageIndex: number
  progress: { current: number; total: number } | null
  error?: string
}) {
  const isCompleted = stageIndex < currentIndex
  const isCurrent = stageIndex === currentIndex

  // Special handling for completed stage
  const isDone = stage.id === "completed" && isCurrent

  return (
    <div className="flex items-start gap-3">
      {/* Icon */}
      <div
        className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-colors ${
          isCompleted || isDone
            ? "bg-green-500/20 text-green-500"
            : isCurrent
              ? "bg-primary/20 text-primary"
              : "bg-muted text-muted-foreground"
        }`}
      >
        {isCompleted || isDone ? (
          <CheckCircle className="size-4" />
        ) : isCurrent ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Circle className="size-4" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pb-4">
        <div className="flex items-center justify-between gap-2">
          <p
            className={`text-sm font-medium ${
              isCompleted || isDone
                ? "text-green-500"
                : isCurrent
                  ? "text-foreground"
                  : "text-muted-foreground"
            }`}
          >
            {stage.label}
          </p>
          {/* Progress indicator for current stage */}
          {isCurrent && progress && stage.id === "scraping" && (
            <span className="text-xs text-muted-foreground">
              {progress.current}/{progress.total}
            </span>
          )}
          {isCurrent && progress && stage.id === "analyzing" && (
            <span className="text-xs text-muted-foreground">
              {progress.current}/{progress.total}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {isCurrent && error ? error : stage.description}
        </p>
      </div>
    </div>
  )
}

export function ScrapingProgressSection({
  scrapeJob,
}: ScrapingProgressSectionProps) {
  const currentStageIndex = getStageIndex(scrapeJob?.stage)
  const isRunning =
    scrapeJob?.status === "running" || scrapeJob?.status === "pending"
  const isFailed =
    scrapeJob?.stage === "failed" || scrapeJob?.status === "failed"
  const isCompleted = scrapeJob?.stage === "completed"

  // If not scraping, don't render
  if (!scrapeJob && !isRunning && !isFailed && !isCompleted) {
    return null
  }

  // Progress percentage
  const progressPercent = scrapeJob?.progress
    ? Math.round((scrapeJob.progress.current / scrapeJob.progress.total) * 100)
    : 0

  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Scraping Progress</h2>
        {isRunning && (
          <span className="flex items-center gap-1.5 text-sm text-primary">
            <Loader2 className="size-3.5 animate-spin" />
            In Progress
          </span>
        )}
        {isCompleted && (
          <span className="flex items-center gap-1.5 text-sm text-green-500">
            <CheckCircle className="size-3.5" />
            Completed
          </span>
        )}
        {isFailed && (
          <span className="flex items-center gap-1.5 text-sm text-destructive">
            <XCircle className="size-3.5" />
            Failed
          </span>
        )}
      </div>

      {/* Progress bar */}
      {(isRunning || isCompleted) && scrapeJob?.progress && (
        <div className="mb-6">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full transition-all duration-300 ${
                isCompleted ? "bg-green-500" : "bg-primary"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="mt-1.5 text-right text-xs text-muted-foreground">
            {scrapeJob.progress.current} of {scrapeJob.progress.total} pages
            processed
          </p>
        </div>
      )}

      {/* Status logs / Stage progression */}
      <div className="relative">
        {/* Vertical line connecting stages */}
        <div className="absolute top-8 bottom-4 left-4 w-px -translate-x-1/2 bg-border" />

        {/* Stage items */}
        <div className="space-y-0">
          {stages.map((stage, index) => (
            <StageItem
              key={stage.id}
              stage={stage}
              currentIndex={currentStageIndex}
              stageIndex={index}
              progress={scrapeJob?.progress}
              error={
                isFailed && index === currentStageIndex
                  ? scrapeJob?.error
                  : undefined
              }
            />
          ))}
        </div>

        {/* Failed state */}
        {isFailed && scrapeJob?.error && (
          <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/10 p-3">
            <p className="text-sm font-medium text-destructive">Error</p>
            <p className="mt-1 text-xs text-destructive/80">
              {scrapeJob.error}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
