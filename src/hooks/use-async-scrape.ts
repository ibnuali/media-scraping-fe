import { useState, useCallback, useRef, useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { keywordsApi } from "@/lib/api"
import {
  useScrapingProgressWebSocket,
  clearJobProgress,
  type ScrapingProgressState,
} from "@/hooks/use-scraping-progress-websocket"
import type {
  KeywordJobKind,
  PublicationDateRange,
  ScrapingJobResponse,
  ScrapingJobStatus,
} from "@/types/keyword"

interface UseAsyncScrapeOptions {
  onComplete?: (job: ScrapingJobResponse, keywordId: string) => void
  onError?: (job: ScrapingJobResponse, keywordId: string) => void
}

export interface ScrapeJob extends PublicationDateRange {
  kind: KeywordJobKind
  successful?: number
  failed?: number
  jobId: string
  keywordId: string
  status: ScrapingJobStatus
  stage?:
    | "searching"
    | "scraping"
    | "analyzing"
    | "summarizing"
    | "completed"
    | "failed"
  progress: { current: number; total: number } | null
  currentUrl?: string
  currentTitle?: string
  error: string | null
}

const STORAGE_KEY = "async_scrape_jobs"

interface StoredJob extends PublicationDateRange {
  kind?: KeywordJobKind
  jobId: string
  keywordId: string
  status: ScrapingJobStatus
  stage?: ScrapeJob["stage"]
  progress?: { current: number; total: number } | null
}

function loadStoredJobs(): StoredJob[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Only restore jobs stored less than 10 minutes ago
      if (parsed.timestamp && Date.now() - parsed.timestamp < 10 * 60 * 1000) {
        return parsed.jobs || []
      }
    }
  } catch {
    // Ignore parse errors
  }
  return []
}

function saveJobs(jobs: ScrapeJob[]) {
  const activeJobs = jobs.filter(
    (j) => j.status === "pending" || j.status === "running"
  )
  if (activeJobs.length === 0) {
    localStorage.removeItem(STORAGE_KEY)
  } else {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        jobs: activeJobs.map((j) => ({
          kind: j.kind,
          start_date: j.start_date,
          end_date: j.end_date,
          jobId: j.jobId,
          keywordId: j.keywordId,
          status: j.status,
          stage: j.stage,
          progress: j.progress,
        })),
        timestamp: Date.now(),
      })
    )
  }
}

export function useAsyncScrape(options: UseAsyncScrapeOptions = {}) {
  const queryClient = useQueryClient()

  // Use refs for callbacks to avoid dependency issues
  const onCompleteRef = useRef(options.onComplete)
  const onErrorRef = useRef(options.onError)

  // Keep refs updated
  useEffect(() => {
    onCompleteRef.current = options.onComplete
    onErrorRef.current = options.onError
  })

  // Track jobs by keyword ID
  const [jobs, setJobs] = useState<Map<string, ScrapeJob>>(() => {
    const stored = loadStoredJobs()
    return new Map(
      stored.map((job) => [
        job.keywordId,
        {
          kind:
            job.kind ??
            (job.stage === "analyzing" || job.stage === "summarizing"
              ? "analysis"
              : "scrape"),
          jobId: job.jobId,
          keywordId: job.keywordId,
          start_date: job.start_date,
          end_date: job.end_date,
          status: job.status,
          stage: job.stage,
          progress: job.progress ?? null,
          error: null,
        },
      ])
    )
  })

  // Track job ID -> keyword ID mapping for WebSocket updates
  const jobToKeywordRef = useRef<Map<string, string>>(new Map())
  const handledJobs = useRef(new Set<string>())

  // Restore running jobs on mount - fetch current status from API
  useEffect(() => {
    let cancelled = false
    const restoreRunningJobs = async () => {
      const stored = loadStoredJobs()
      for (const job of stored) {
        if (job.status === "pending" || job.status === "running") {
          try {
            const response = await keywordsApi.getScrapeJob(job.jobId)
            if (cancelled) return
            console.log(
              "[AsyncScrape] Restored job:",
              job.jobId,
              "status:",
              response.status,
              "stage:",
              response.stage
            )

            // Rebuild jobToKeyword mapping
            jobToKeywordRef.current.set(job.jobId, job.keywordId)

            const restoredJob: ScrapeJob = {
              kind:
                job.kind ??
                (response.stage === "analyzing" ||
                response.stage === "summarizing"
                  ? "analysis"
                  : "scrape"),
              successful: response.successful,
              failed: response.failed,
              start_date: response.start_date ?? job.start_date,
              end_date: response.end_date ?? job.end_date,
              jobId: job.jobId,
              keywordId: job.keywordId,
              status: response.status,
              stage: response.stage,
              progress: response.total
                ? {
                    current: response.successful + response.failed,
                    total: response.total,
                  }
                : null,
              error: response.error_message || null,
            }

            setJobs((prev) => {
              const next = new Map(prev)
              if (next.get(job.keywordId)?.jobId !== job.jobId) return prev
              next.set(job.keywordId, restoredJob)
              saveJobs(Array.from(next.values()))
              return next
            })

            if (
              response.status === "completed" ||
              response.status === "failed"
            ) {
              handledJobs.current.add(job.jobId)
              queryClient.invalidateQueries({ queryKey: ["keywords"] })
              if (response.status === "completed") {
                onCompleteRef.current?.(response, job.keywordId)
              } else {
                onErrorRef.current?.(response, job.keywordId)
              }
            }
          } catch (err) {
            console.error(
              "[AsyncScrape] Failed to restore job:",
              job.jobId,
              err
            )
            // Keep the job from localStorage — WebSocket will update it
          }
        }
      }
    }
    restoreRunningJobs()
    return () => {
      cancelled = true
    }
  }, [queryClient])

  // Handle WebSocket progress updates
  const handleProgress = useCallback(
    (jobId: string, progress: ScrapingProgressState) => {
      if (handledJobs.current.has(jobId)) return
      // Try to get keywordId from our ref first, then from the progress data
      const keywordId = jobToKeywordRef.current.get(jobId) || progress.keywordId
      console.log("[AsyncScrape] handleProgress:", {
        jobId,
        keywordId,
        status: progress.status,
        stage: progress.stage,
        progressKeywordId: progress.keywordId,
      })

      if (!keywordId) {
        console.warn("[AsyncScrape] No keywordId found for job:", jobId)
        return
      }

      // Update the mapping for future use
      if (!jobToKeywordRef.current.has(jobId)) {
        jobToKeywordRef.current.set(jobId, keywordId)
      }

      setJobs((prev) => {
        const next = new Map(prev)
        const existing = next.get(keywordId)
        // Ignore late events from a previous job for the same keyword.
        if (
          existing?.jobId &&
          existing.jobId !== jobId &&
          (existing.status === "pending" ||
            existing.status === "running" ||
            progress.status === "completed" ||
            progress.status === "failed")
        )
          return prev

        // Build the updated job state
        const sameJob = existing?.jobId === jobId || !existing?.jobId
        const updatedJob: ScrapeJob = {
          start_date: sameJob ? existing?.start_date : undefined,
          end_date: sameJob ? existing?.end_date : undefined,
          successful: progress.successful,
          failed: progress.failed,
          kind:
            progress.stage === "analyzing" || progress.stage === "summarizing"
              ? "analysis"
              : existing?.jobId === jobId || !existing?.jobId
                ? (existing?.kind ?? "scrape")
                : "scrape",
          jobId: jobId,
          keywordId,
          status: progress.status,
          progress: progress.progress,
          currentUrl: progress.currentUrl,
          currentTitle: progress.currentTitle,
          error: progress.error || null,
        }

        // Only set stage if we have it from WebSocket
        if (progress.stage) {
          updatedJob.stage = progress.stage
        }

        // If we have existing state, preserve some fields
        if (existing?.jobId === jobId) {
          next.set(keywordId, {
            ...existing,
            ...updatedJob,
          })
        } else {
          console.log(
            "[AsyncScrape] Creating new job entry for keyword:",
            keywordId
          )
          next.set(keywordId, updatedJob)
        }

        saveJobs(Array.from(next.values()))
        console.log(
          "[AsyncScrape] Updated job state:",
          updatedJob.status,
          updatedJob.stage,
          updatedJob.progress
        )
        return next
      })
    },
    []
  )

  // Fetch the authoritative final state; polling also covers missed WebSocket events.
  const handleCompleted = useCallback(
    async (jobId: string, keywordId: string) => {
      if (handledJobs.current.has(jobId)) return
      try {
        const job = await keywordsApi.getScrapeJob(jobId)
        if (handledJobs.current.has(jobId)) return
        const isFinished = job.status === "completed" || job.status === "failed"
        if (isFinished) handledJobs.current.add(jobId)

        setJobs((prev) => {
          const existing = prev.get(keywordId)
          if (existing?.jobId !== jobId) return prev
          const next = new Map(prev)
          next.set(keywordId, {
            ...existing,
            status: job.status,
            stage: job.stage,
            successful: job.successful,
            failed: job.failed,
            start_date: job.start_date ?? existing.start_date,
            end_date: job.end_date ?? existing.end_date,
            progress:
              job.total != null
                ? { current: job.successful + job.failed, total: job.total }
                : existing.progress,
            error: job.error_message,
          })
          saveJobs(Array.from(next.values()))
          return next
        })

        if (isFinished) {
          queryClient.invalidateQueries({ queryKey: ["keywords"] })
          if (job.status === "completed")
            onCompleteRef.current?.(job, keywordId)
          else onErrorRef.current?.(job, keywordId)
          jobToKeywordRef.current.delete(jobId)
          clearJobProgress(jobId)
        }
      } catch (err) {
        console.error("[AsyncScrape] Error fetching job status:", err)
      }
    },
    [queryClient]
  )

  useEffect(() => {
    const activeJobs = Array.from(jobs.values()).filter(
      (job) => job.jobId && !handledJobs.current.has(job.jobId)
    )
    if (!activeJobs.length) return
    const timer = setInterval(() => {
      for (const job of activeJobs) handleCompleted(job.jobId, job.keywordId)
    }, 5000)
    return () => clearInterval(timer)
  }, [jobs, handleCompleted])

  // Connect to WebSocket
  useScrapingProgressWebSocket({
    onProgress: handleProgress,
    onCompleted: handleCompleted,
  })

  const getJob = useCallback(
    (keywordId: string) => {
      return jobs.get(keywordId)
    },
    [jobs]
  )

  const isPolling = useCallback(
    (keywordId?: string) => {
      if (keywordId) {
        const job = jobs.get(keywordId)
        return job
          ? job.status === "pending" || job.status === "running"
          : false
      }
      // Check if any job is active
      for (const job of jobs.values()) {
        if (job.status === "pending" || job.status === "running") return true
      }
      return false
    },
    [jobs]
  )

  const startJob = useCallback(
    async (
      keywordId: string,
      kind: KeywordJobKind,
      filters?: PublicationDateRange
    ) => {
      // Set initial state - no stage yet, waiting for WebSocket events
      const initialState: ScrapeJob = {
        ...(kind === "scrape" ? filters : undefined),
        kind,
        stage: kind === "analysis" ? "analyzing" : undefined,
        jobId: "",
        keywordId,
        status: "pending",
        progress: null,
        error: null,
      }
      setJobs((prev) => {
        const next = new Map(prev)
        next.set(keywordId, initialState)
        return next
      })

      try {
        const response = await (kind === "analysis"
          ? keywordsApi.analyze(keywordId)
          : keywordsApi.scrape(keywordId, filters))

        // Map job ID to keyword ID for WebSocket updates
        jobToKeywordRef.current.set(response.job_id, keywordId)

        const jobState: ScrapeJob = {
          ...initialState,
          jobId: response.job_id,
          keywordId,
          status: response.status,
          progress: null,
          error: null,
        }

        setJobs((prev) => {
          const next = new Map(prev)
          const existing = next.get(keywordId)
          // A fast worker may have delivered progress before the POST returned.
          next.set(
            keywordId,
            existing?.jobId === response.job_id ? existing : jobState
          )
          saveJobs(Array.from(next.values()))
          return next
        })
      } catch (err) {
        setJobs((prev) => {
          const next = new Map(prev)
          next.set(keywordId, {
            start_date: initialState.start_date,
            end_date: initialState.end_date,
            kind,
            stage: "failed",
            jobId: "",
            keywordId,
            status: "failed",
            progress: null,
            error:
              err instanceof Error
                ? err.message
                : `Failed to start ${kind} job`,
          })
          saveJobs(Array.from(next.values()))
          return next
        })
      }
    },
    []
  )

  const startAsyncScrape = useCallback(
    (keywordId: string, filters?: PublicationDateRange) =>
      startJob(keywordId, "scrape", filters),
    [startJob]
  )
  const startAsyncAnalysis = useCallback(
    (keywordId: string) => startJob(keywordId, "analysis"),
    [startJob]
  )

  const cancelPolling = useCallback(
    (keywordId: string) => {
      const job = jobs.get(keywordId)
      if (job?.jobId) {
        jobToKeywordRef.current.delete(job.jobId)
        clearJobProgress(job.jobId)
      }
      setJobs((prev) => {
        const next = new Map(prev)
        next.delete(keywordId)
        saveJobs(Array.from(next.values()))
        return next
      })
    },
    [jobs]
  )

  const clearCompletedJobs = useCallback(() => {
    setJobs((prev) => {
      const next = new Map()
      prev.forEach((job, keywordId) => {
        if (job.status === "pending" || job.status === "running") {
          next.set(keywordId, job)
        }
      })
      saveJobs(Array.from(next.values()))
      return next
    })
  }, [])

  return {
    jobs,
    getJob,
    isPolling,
    startAsyncScrape,
    startAsyncAnalysis,
    cancelPolling,
    clearCompletedJobs,
  }
}
