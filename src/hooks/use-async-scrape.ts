import { useState, useCallback, useRef, useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { keywordsApi } from "@/lib/api"
import {
  useScrapingProgressWebSocket,
  clearJobProgress,
  type ScrapingProgressState,
} from "@/hooks/use-scraping-progress-websocket"
import type { ScrapingJobResponse, ScrapingJobStatus } from "@/types/keyword"

interface UseAsyncScrapeOptions {
  onComplete?: (job: ScrapingJobResponse, keywordId: string) => void
  onError?: (job: ScrapingJobResponse, keywordId: string) => void
}

export interface ScrapeJob {
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

interface StoredJob {
  jobId: string
  keywordId: string
  status: ScrapingJobStatus
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
          jobId: j.jobId,
          keywordId: j.keywordId,
          status: j.status,
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
          jobId: job.jobId,
          keywordId: job.keywordId,
          status: job.status,
          progress: null,
          error: null,
        },
      ])
    )
  })

  // Track job ID -> keyword ID mapping for WebSocket updates
  const jobToKeywordRef = useRef<Map<string, string>>(new Map())

  // Restore running jobs on mount - fetch current status from API
  useEffect(() => {
    const restoreRunningJobs = async () => {
      const stored = loadStoredJobs()
      for (const job of stored) {
        if (job.status === "pending" || job.status === "running") {
          try {
            const response = await keywordsApi.getScrapeJob(job.jobId)
            console.log(
              "[AsyncScrape] Restored job:",
              job.jobId,
              "status:",
              response.status,
              "stage:",
              response.stage
            )

            // Only restore if still running
            if (
              response.status === "running" ||
              response.status === "pending"
            ) {
              // Rebuild jobToKeyword mapping
              jobToKeywordRef.current.set(job.jobId, job.keywordId)

              setJobs((prev) => {
                const next = new Map(prev)
                next.set(job.keywordId, {
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
                  error: null,
                })
                return next
              })
            } else {
              // Job completed/failed while we were away, clear it
              setJobs((prev) => {
                const next = new Map(prev)
                next.delete(job.keywordId)
                return next
              })
            }
          } catch (err) {
            console.error(
              "[AsyncScrape] Failed to restore job:",
              job.jobId,
              err
            )
            // Remove stale job
            setJobs((prev) => {
              const next = new Map(prev)
              next.delete(job.keywordId)
              return next
            })
          }
        }
      }
    }
    restoreRunningJobs()
  }, [])

  // Handle WebSocket progress updates
  const handleProgress = useCallback(
    (jobId: string, progress: ScrapingProgressState) => {
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

        // Build the updated job state
        const updatedJob: ScrapeJob = {
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
        if (existing) {
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

  // Handle WebSocket completion - cleanup and cache invalidation
  const handleCompleted = useCallback(
    async (jobId: string, _keywordId: string) => {
      console.log("[AsyncScrape] handleCompleted called:", jobId, _keywordId)
      const keywordId = jobToKeywordRef.current.get(jobId) || _keywordId
      if (!keywordId) return

      // Fetch final job status to ensure accuracy
      try {
        const job = await keywordsApi.getScrapeJob(jobId)
        console.log("[AsyncScrape] Job status from API:", job.status)

        // Map job status to stage
        const getStageFromStatus = (status: string): ScrapeJob["stage"] => {
          switch (status) {
            case "completed":
              return "completed"
            case "failed":
              return "failed"
            default:
              return "analyzing" // Still running
          }
        }

        // Update state with final status from API
        setJobs((prev) => {
          const next = new Map(prev)
          const existing = next.get(keywordId)
          if (existing) {
            const newStage = getStageFromStatus(job.status)
            console.log("[AsyncScrape] Setting stage to:", newStage)
            next.set(keywordId, {
              ...existing,
              status: job.status,
              stage: newStage,
              progress: job.total
                ? { current: job.successful + job.failed, total: job.total }
                : null,
              error: job.error_message,
            })
          }
          return next
        })

        if (job.status === "completed" && onCompleteRef.current) {
          onCompleteRef.current(job, keywordId)
        } else if (job.status === "failed" && onErrorRef.current) {
          onErrorRef.current(job, keywordId)
        }

        // Invalidate caches
        queryClient.invalidateQueries({
          queryKey: ["keywords", keywordId, "news"],
        })
        queryClient.invalidateQueries({ queryKey: ["keywords", keywordId] })

        // Clear completed/failed job from UI after 3 seconds
        if (job.status === "completed" || job.status === "failed") {
          setTimeout(() => {
            setJobs((prev) => {
              const next = new Map(prev)
              next.delete(keywordId)
              saveJobs(Array.from(next.values()))
              return next
            })
          }, 3000)
        }
      } catch (err) {
        console.error("[AsyncScrape] Error fetching job status:", err)
      }

      // Clean up mapping only if job is done
      const job = await keywordsApi.getScrapeJob(jobId).catch(() => null)
      if (job?.status === "completed" || job?.status === "failed") {
        jobToKeywordRef.current.delete(jobId)
        clearJobProgress(jobId)
      }
    },
    [queryClient]
  )

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

  const startAsyncScrape = useCallback(async (keywordId: string) => {
    // Set initial state - no stage yet, waiting for WebSocket events
    const initialState: ScrapeJob = {
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
      const response = await keywordsApi.scrape(keywordId)

      // Map job ID to keyword ID for WebSocket updates
      jobToKeywordRef.current.set(response.job_id, keywordId)

      const jobState: ScrapeJob = {
        jobId: response.job_id,
        keywordId,
        status: response.status,
        progress: null,
        error: null,
      }

      setJobs((prev) => {
        const next = new Map(prev)
        next.set(keywordId, jobState)
        saveJobs(Array.from(next.values()))
        return next
      })
    } catch (err) {
      setJobs((prev) => {
        const next = new Map(prev)
        next.set(keywordId, {
          jobId: "",
          keywordId,
          status: "failed",
          progress: null,
          error:
            err instanceof Error ? err.message : "Failed to start scrape job",
        })
        saveJobs(Array.from(next.values()))
        return next
      })
    }
  }, [])

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
    cancelPolling,
    clearCompletedJobs,
  }
}
