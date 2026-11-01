import { useId, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { History } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { WorkspaceLoading, WorkspaceState } from "@/components/workspace-state"
import type { ScrapeJob } from "@/hooks/use-async-scrape"
import type { JobLogTarget } from "../hooks/use-job-log-dialog"
import { useKeywords } from "../hooks/use-keywords"
import { toScrapeJob } from "../lib/job-history"
import { JobHistoryList } from "./JobHistoryList"
import "../job-history.css"

export interface JobHistoryButtonProps {
  onSelect: (keyword: JobLogTarget, job: ScrapeJob) => void
}

function JobHistoryPanel({ onSelect }: JobHistoryButtonProps) {
  const id = useId()
  const keywords = useKeywords()
  const [searchParams] = useSearchParams()
  const { keywordId } = useParams()
  const [selectedId, setSelectedId] = useState(
    keywordId ?? searchParams.get("keyword") ?? ""
  )
  const selected =
    keywords.data?.find((keyword) => keyword.id === selectedId) ??
    keywords.data?.[0]

  if (keywords.isPending) return <WorkspaceLoading />
  if (keywords.isError)
    return (
      <WorkspaceState
        isError
        title="Could not load keywords"
        description={keywords.error.message}
      >
        <Button variant="outline" size="sm" onClick={() => keywords.refetch()}>
          Retry
        </Button>
      </WorkspaceState>
    )
  if (!selected)
    return (
      <WorkspaceState
        title="No keywords yet"
        description="Add a keyword to start scraping and view its job history."
      />
    )

  return (
    <>
      <div className="job-history-filter">
        <label htmlFor={id}>Keyword</label>
        <select
          id={id}
          value={selected.id}
          onChange={(event) => setSelectedId(event.target.value)}
        >
          {keywords.data.map((keyword) => (
            <option key={keyword.id} value={keyword.id}>
              {keyword.keyword}
            </option>
          ))}
        </select>
      </div>
      <JobHistoryList
        keywordId={selected.id}
        onSelect={(job) => onSelect(selected, toScrapeJob(job))}
      />
    </>
  )
}

export function JobHistoryButton({ onSelect }: JobHistoryButtonProps) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Scraping job history"
            title="Scraping job history"
          />
        }
      >
        <History className="size-4" />
      </PopoverTrigger>
      <PopoverContent align="end" className="job-history-popover">
        <header className="job-history-heading">
          <PopoverTitle>Job history</PopoverTitle>
        </header>
        {open && (
          <JobHistoryPanel
            onSelect={(keyword, job) => {
              setOpen(false)
              onSelect(keyword, job)
            }}
          />
        )}
      </PopoverContent>
    </Popover>
  )
}
