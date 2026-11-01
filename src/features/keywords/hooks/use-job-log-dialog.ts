import { useState } from "react"
import type { ScrapeJob, useAsyncScrape } from "@/hooks/use-async-scrape"
import type { KeywordResponse } from "@/types/keyword"

export type JobLogTarget = Pick<KeywordResponse, "id" | "keyword">

export type KeywordWorkspaceContext = ReturnType<typeof useAsyncScrape> & {
  openJobLogs: (keyword: JobLogTarget) => void
}

export function useJobLogDialog() {
  const [target, setTarget] = useState<JobLogTarget | null>(null)
  const [open, setOpen] = useState(false)
  const [job, setJob] = useState<ScrapeJob>()

  function openJobLogs(keyword: JobLogTarget, historicalJob?: ScrapeJob) {
    setTarget({ id: keyword.id, keyword: keyword.keyword })
    setJob(historicalJob)
    setOpen(true)
  }

  function closeLogs() {
    setOpen(false)
    setTarget(null)
    setJob(undefined)
  }

  return { target, job, open, setOpen, openJobLogs, closeLogs }
}
