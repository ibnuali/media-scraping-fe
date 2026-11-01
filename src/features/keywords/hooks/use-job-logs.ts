import { useEffect } from "react"
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { ScrapeJob } from "@/hooks/use-async-scrape"
import { keywordsApi } from "@/lib/api"
import type { JobLogFilters } from "@/types/keyword"

const POLL_INTERVAL = 2000

export function useJobLogs(job?: ScrapeJob, filters: JobLogFilters = {}) {
  const queryClient = useQueryClient()
  const jobId = job?.jobId ?? ""
  const status = useQuery({
    queryKey: ["keyword-job", jobId],
    queryFn: () => keywordsApi.getScrapeJob(jobId),
    enabled: !!jobId,
    staleTime: 0,
    refetchInterval: (query) => {
      const state = query.state.data?.status
      return state === "completed" || state === "failed" ? false : POLL_INTERVAL
    },
    refetchIntervalInBackground: true,
  })
  const running =
    (status.data?.status ?? job?.status) === "pending" ||
    (status.data?.status ?? job?.status) === "running"
  const logs = useInfiniteQuery({
    queryKey: ["keyword-job-logs", jobId, filters.stage, filters.status],
    queryFn: ({ pageParam }) =>
      keywordsApi.getJobLogs(jobId, 100, pageParam, filters),
    initialPageParam: 0,
    getNextPageParam: (page) =>
      page.has_more ? page.offset + page.limit : undefined,
    enabled: !!jobId,
    staleTime: 0,
    refetchInterval: running ? POLL_INTERVAL : false,
    refetchIntervalInBackground: true,
  })

  // Read final results again after the terminal status is observed. A logs
  // request made just before completion may not include the last transaction.
  const serverStatus = status.data?.status
  useEffect(() => {
    if (jobId && (serverStatus === "completed" || serverStatus === "failed")) {
      queryClient.invalidateQueries({ queryKey: ["keyword-job-logs", jobId] })
    }
  }, [jobId, serverStatus, queryClient])

  const detail = status.data
  const currentJob: ScrapeJob | undefined = job && {
    ...job,
    ...(detail && {
      status: detail.status,
      stage: detail.stage,
      successful: detail.successful,
      failed: detail.failed,
      skipped: detail.skipped,
      start_date: detail.start_date,
      end_date: detail.end_date,
      error: detail.error_message,
      progress:
        detail.total == null
          ? job.progress
          : {
              current:
                detail.successful + detail.failed + (detail.skipped ?? 0),
              total: detail.total,
            },
    }),
  }

  return { logs, status, job: currentJob, running }
}
