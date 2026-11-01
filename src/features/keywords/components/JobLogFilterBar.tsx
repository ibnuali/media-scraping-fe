import { useId } from "react"
import { Label } from "@/components/ui/label"
import type { JobLogFilters, JobLogStage, JobLogStatus } from "@/types/keyword"

export interface JobLogFilterBarProps {
  value: JobLogFilters
  onChange: (value: JobLogFilters) => void
}

export function JobLogFilterBar({ value, onChange }: JobLogFilterBarProps) {
  const id = useId()
  return (
    <div className="job-log-filters">
      <div>
        <Label htmlFor={`${id}-stage`}>Stage</Label>
        <select
          id={`${id}-stage`}
          value={value.stage ?? ""}
          onChange={(event) =>
            onChange({
              ...value,
              stage: (event.target.value || undefined) as
                JobLogStage | undefined,
            })
          }
        >
          <option value="">All stages</option>
          <option value="searching">Searching / HTTP activity</option>
          <option value="scraping">Scraping</option>
          <option value="analyzing">Analysis</option>
          <option value="summarizing">Combined summary</option>
          <option value="legacy">Previous process</option>
        </select>
      </div>
      <div>
        <Label htmlFor={`${id}-status`}>Status</Label>
        <select
          id={`${id}-status`}
          value={value.status ?? ""}
          onChange={(event) =>
            onChange({
              ...value,
              status: (event.target.value || undefined) as
                JobLogStatus | undefined,
            })
          }
        >
          <option value="">All statuses</option>
          <option value="info">Info</option>
          <option value="success">Successful</option>
          <option value="failed">Failed</option>
          <option value="skipped">Skipped</option>
        </select>
      </div>
      <p>
        Search activity is separate from article success and failure totals.
      </p>
    </div>
  )
}
