import type { Ref } from "react"
import { FileText, Loader2, Maximize2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ScrapeJob } from "@/hooks/use-async-scrape"

export interface JobLogDockProps {
  label: string
  keyword: string
  job?: ScrapeJob
  running: boolean
  ref: Ref<HTMLButtonElement>
  onMaximize: () => void
  onClose: () => void
}

export function JobLogDock({
  label,
  keyword,
  job,
  running,
  ref,
  onMaximize,
  onClose,
}: JobLogDockProps) {
  return (
    <div className="job-log-dock">
      <button
        ref={ref}
        type="button"
        className="job-log-restore"
        aria-label={`Open ${label.toLowerCase()} for ${keyword}`}
        aria-haspopup="dialog"
        onClick={onMaximize}
      >
        {running ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <FileText className="size-4" />
        )}
        <span>
          <strong>
            {label} · {keyword}
          </strong>
          <span>
            {running ? "In progress · " : `${job?.status ?? "pending"} · `}
            {job?.successful ?? 0} successful · {job?.failed ?? 0} failed ·{" "}
            {job?.skipped ?? 0} skipped
          </span>
        </span>
        <Maximize2 className="size-4" />
      </button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Close logs"
        onClick={onClose}
      >
        <X className="size-4" />
      </Button>
    </div>
  )
}
