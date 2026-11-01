import { useRef, useState } from "react"
import { Minus, Terminal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import type { ScrapeJob } from "@/hooks/use-async-scrape"
import type { JobLogFilters } from "@/types/keyword"
import type { JobLogTarget } from "../hooks/use-job-log-dialog"
import { useJobLogs } from "../hooks/use-job-logs"
import { KeywordJobStatus } from "./KeywordJobStatus"
import { JobLogList } from "./JobLogList"
import { JobLogFilterBar } from "./JobLogFilterBar"
import { jobKindLabels } from "../lib/job-history"
import { JobLogDock } from "./JobLogDock"
import "../job-logs.css"

export interface JobLogDialogProps {
  target: JobLogTarget
  job?: ScrapeJob
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

export function JobLogDialog({
  target,
  job,
  open,
  onOpenChange,
  onClose,
}: JobLogDialogProps) {
  const [filters, setFilters] = useState<JobLogFilters>({})
  const result = useJobLogs(job, filters)
  const filtered = !!(filters.stage || filters.status)
  const dockRef = useRef<HTMLButtonElement>(null)
  const currentJob = result.job
  const label = `${jobKindLabels[currentJob?.kind ?? "scrape"]} logs`

  return (
    <>
      {!open && (
        <JobLogDock
          ref={dockRef}
          label={label}
          keyword={target.keyword}
          job={currentJob}
          running={result.running}
          onMaximize={() => onOpenChange(true)}
          onClose={onClose}
        />
      )}
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) onOpenChange(true)
          else onClose()
        }}
      >
        <DialogContent
          className="job-log-dialog"
          showCloseButton={false}
          finalFocus={() => dockRef.current ?? true}
        >
          <header className="job-log-heading">
            <div>
              <DialogTitle>
                <Terminal className="size-4 shrink-0" aria-hidden="true" />
                <span>
                  {label} · {target.keyword}
                </span>
              </DialogTitle>
              <DialogDescription>
                Search activity and saved results. Closing logs keeps the job
                running. Reopen saved logs from job history.
              </DialogDescription>
            </div>
            <div className="job-log-controls">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Minimize logs"
                onClick={() => onOpenChange(false)}
              >
                <Minus className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close logs"
                onClick={onClose}
              >
                <X className="size-4" />
              </Button>
            </div>
          </header>
          {currentJob && <KeywordJobStatus job={currentJob} />}
          <JobLogFilterBar value={filters} onChange={setFilters} />
          {result.status.error && (
            <div className="job-log-notice" role="alert">
              <p>
                Could not refresh process status: {result.status.error.message}
              </p>
              <Button variant="outline" onClick={() => result.status.refetch()}>
                Retry status
              </Button>
            </div>
          )}
          <JobLogList
            key={`${target.id}:${job?.jobId ?? ""}:${filters.stage ?? ""}:${filters.status ?? ""}`}
            logs={result.logs}
            hasJobId={!!job?.jobId}
            running={result.running}
            filtered={filtered}
          />
          <footer className="job-log-footer">
            <p>
              {result.logs.data?.pages[0]?.total ?? 0}{" "}
              {filtered ? "matching log entries" : "saved log entries"}
            </p>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Minimize logs
            </Button>
          </footer>
        </DialogContent>
      </Dialog>
    </>
  )
}
