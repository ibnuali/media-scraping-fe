import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WorkspaceLoading, WorkspaceState } from "@/components/workspace-state"
import type { useJobLogs } from "../hooks/use-job-logs"
import { useLogAutoScroll } from "../hooks/use-log-auto-scroll"
import { JobLogItem } from "./JobLogItem"

export interface JobLogListProps {
  logs: ReturnType<typeof useJobLogs>["logs"]
  hasJobId: boolean
  running: boolean
  filtered?: boolean
}

export function JobLogList({
  logs,
  hasJobId,
  running,
  filtered,
}: JobLogListProps) {
  const items = logs.data?.pages.flatMap((page) => page.items) ?? []
  const { scrollRef, handleScroll, following } = useLogAutoScroll(
    items.at(-1)?.id
  )

  // Catch up to the latest page while following, including jobs with more than
  // 100 entries. Pausing the scroll also pauses automatic pagination.
  const { hasNextPage, isFetching, error, fetchNextPage } = logs
  useEffect(() => {
    if (following && hasNextPage && !isFetching && !error) {
      void fetchNextPage()
    }
  }, [following, hasNextPage, isFetching, error, fetchNextPage])

  return (
    <div
      ref={scrollRef}
      className="job-log-list-content"
      onScroll={handleScroll}
    >
      {logs.error && (
        <div className="job-log-notice" role="alert">
          <p>Could not update logs: {logs.error.message}</p>
          <Button variant="outline" onClick={() => logs.refetch()}>
            Try again
          </Button>
        </div>
      )}
      {hasJobId && logs.isLoading ? (
        <WorkspaceLoading />
      ) : !items.length && !logs.error ? (
        <WorkspaceState
          title={
            filtered
              ? "No matching logs"
              : running
                ? "Waiting for activity"
                : "No saved logs"
          }
          description={
            filtered
              ? "Choose another stage or status. New matching activity will appear here while the process runs."
              : running
                ? "The worker is preparing this job. Search activity and results will appear here automatically."
                : "This process has no saved activity or article results."
          }
        />
      ) : (
        <ol className="job-log-list" aria-label="Process activity and results">
          {items.map((log) => (
            <JobLogItem key={log.id} log={log} />
          ))}
        </ol>
      )}
      {logs.hasNextPage && (
        <div className="workspace-load-more">
          <Button
            variant="outline"
            disabled={logs.isFetching}
            onClick={() => logs.fetchNextPage()}
          >
            {logs.isFetchingNextPage && (
              <Loader2 className="size-4 animate-spin" />
            )}
            Load more logs
          </Button>
        </div>
      )}
    </div>
  )
}
