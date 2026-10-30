import {
  CheckCircle,
  Circle,
  Loader2,
  XCircle,
} from "lucide-react"
import { Panel, PanelBody, PanelHead } from "@/components/panel"
import { cn } from "@/lib/utils"
import type { ScrapeJob } from "@/hooks/use-async-scrape"

interface ScrapingProgressSectionProps {
  scrapeJob?: ScrapeJob
}

interface StageInfo {
  id: ScrapeJob["stage"]
  label: string
  description: string
}

const stages: StageInfo[] = [
  {
    id: "searching",
    label: "Searching",
    description: "Finding results on Google",
  },
  { id: "scraping", label: "Scraping", description: "Extracting page content" },
  { id: "analyzing", label: "Analyzing", description: "Scoring sentiment" },
  { id: "summarizing", label: "Summarizing", description: "Writing the brief" },
  { id: "completed", label: "Completed", description: "All done" },
]

function getStageIndex(stage: ScrapeJob["stage"] | undefined): number {
  if (!stage || stage === "failed") return -1
  return stages.findIndex((s) => s.id === stage)
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

  if (!scrapeJob && !isRunning && !isFailed && !isCompleted) {
    return null
  }

  const progressPercent = scrapeJob?.progress
    ? Math.round((scrapeJob.progress.current / scrapeJob.progress.total) * 100)
    : 0

  return (
    <Panel>
      <PanelHead
        title="Scrape progress"
        hint={scrapeJob?.currentTitle || scrapeJob?.currentUrl || undefined}
        actions={
          isRunning ? (
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-primary">
              <Loader2 className="size-3.5 animate-spin" />
              running
            </span>
          ) : isCompleted ? (
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-success">
              <CheckCircle className="size-3.5" />
              completed
            </span>
          ) : isFailed ? (
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-destructive">
              <XCircle className="size-3.5" />
              failed
            </span>
          ) : undefined
        }
      />

      <PanelBody className="space-y-4">
        {(isRunning || isCompleted) && scrapeJob?.progress && (
          <div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full w-full origin-left rounded-full transition-transform duration-300 ease-out",
                  isCompleted ? "bg-success" : "bg-primary"
                )}
                style={{ transform: `scaleX(${progressPercent / 100})` }}
              />
            </div>
            <p className="mt-1.5 text-right font-mono text-[11px] tabular-nums text-ink-3">
              {scrapeJob.progress.current} / {scrapeJob.progress.total} pages
            </p>
          </div>
        )}

        <ol className="space-y-0">
          {stages.map((stage, index) => {
            const isDone = index < currentStageIndex || (stage.id === "completed" && index === currentStageIndex)
            const isCurrent = index === currentStageIndex && !isDone
            const isFailedHere = isFailed && index === currentStageIndex

            return (
              <li key={stage.id} className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full",
                    isDone
                      ? "bg-success/15 text-success"
                      : isFailedHere
                        ? "bg-destructive/15 text-destructive"
                        : isCurrent
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-ink-3"
                  )}
                >
                  {isDone ? (
                    <CheckCircle className="size-3.5" />
                  ) : isFailedHere ? (
                    <XCircle className="size-3.5" />
                  ) : isCurrent ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Circle className="size-3.5" />
                  )}
                </span>
                <div className="min-w-0 flex-1 pb-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={cn(
                        "text-[13px] font-medium",
                        isDone
                          ? "text-success"
                          : isFailedHere
                            ? "text-destructive"
                            : isCurrent
                              ? "text-foreground"
                              : "text-ink-3"
                      )}
                    >
                      {stage.label}
                    </p>
                    {isCurrent &&
                      scrapeJob?.progress &&
                      (stage.id === "scraping" || stage.id === "analyzing") && (
                        <span className="font-mono text-[11px] tabular-nums text-ink-3">
                          {scrapeJob.progress.current}/
                          {scrapeJob.progress.total}
                        </span>
                      )}
                  </div>
                  <p className="text-[11px] text-ink-3">
                    {isFailedHere && scrapeJob?.error
                      ? scrapeJob.error
                      : stage.description}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>

        {isFailed && scrapeJob?.error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3">
            <p className="font-mono text-[11px] tracking-[0.08em] text-destructive uppercase">
              error
            </p>
            <p className="mt-1 text-[13px] text-destructive/90">
              {scrapeJob.error}
            </p>
          </div>
        )}
      </PanelBody>
    </Panel>
  )
}
