import { Button } from "@/components/ui/button"
import { WorkspaceLoading, WorkspaceState } from "@/components/workspace-state"
import type { ScrapingJobResponse } from "@/types/keyword"
import { useJobHistory } from "../hooks/use-job-history"
import { JobHistoryItem } from "./JobHistoryItem"

export interface JobHistoryListProps {
  keywordId: string
  onSelect: (job: ScrapingJobResponse) => void
}

export function JobHistoryList({ keywordId, onSelect }: JobHistoryListProps) {
  const history = useJobHistory(keywordId)
  const jobs = history.data?.pages.flatMap((page) => page.items) ?? []
  // A new job can move the offset boundary while older pages are loading.
  const uniqueJobs = [...new Map(jobs.map((job) => [job.id, job])).values()]
  return (
    <div className="job-history-results" aria-label="Job history">
      {history.isPending && <WorkspaceLoading />}
      {history.isError && (
        <WorkspaceState
          isError
          title="Could not load job history"
          description={history.error.message}
        >
          <Button variant="outline" size="sm" onClick={() => history.refetch()}>
            Retry
          </Button>
        </WorkspaceState>
      )}
      {history.isSuccess && !uniqueJobs.length && (
        <WorkspaceState
          title="No jobs yet"
          description="Scrape or analyze this keyword to start its history."
        />
      )}
      {uniqueJobs.length > 0 && (
        <>
          <p className="job-history-total">
            {history.data?.pages[0]?.total} jobs · Newest first
          </p>
          <ol>
            {uniqueJobs.map((job) => (
              <JobHistoryItem key={job.id} job={job} onSelect={onSelect} />
            ))}
          </ol>
        </>
      )}
      {history.hasNextPage && (
        <div className="job-history-pagination">
          <Button
            variant="outline"
            size="sm"
            disabled={history.isFetchingNextPage}
            onClick={() => history.fetchNextPage()}
          >
            {history.isFetchingNextPage ? "Loading…" : "Load older jobs"}
          </Button>
        </div>
      )}
    </div>
  )
}
