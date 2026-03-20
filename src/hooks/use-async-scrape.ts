import { useState, useCallback, useRef, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { keywordsApi } from '@/lib/api'
import type { ScrapingJobResponse, ScrapingJobStatus } from '@/types/keyword'

interface UseAsyncScrapeOptions {
  pollInterval?: number // milliseconds, default 2000
  onComplete?: (job: ScrapingJobResponse, keywordId: string) => void
  onError?: (job: ScrapingJobResponse, keywordId: string) => void
}

interface JobState {
  jobId: string
  keywordId: string
  status: ScrapingJobStatus
  progress: { current: number; total: number } | null
  error: string | null
}

const STORAGE_KEY = 'async_scrape_jobs'

function loadStoredJobs(): JobState[] {
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

function saveJobs(jobs: JobState[]) {
  if (jobs.length === 0) {
    localStorage.removeItem(STORAGE_KEY)
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      jobs,
      timestamp: Date.now(),
    }))
  }
}

export function useAsyncScrape(options: UseAsyncScrapeOptions = {}) {
  const { pollInterval = 2000 } = options
  const queryClient = useQueryClient()

  // Use refs for callbacks to avoid dependency issues
  const onCompleteRef = useRef(options.onComplete)
  const onErrorRef = useRef(options.onError)

  // Keep refs updated
  useEffect(() => {
    onCompleteRef.current = options.onComplete
    onErrorRef.current = options.onError
  })

  // Track multiple jobs by keyword ID
  const [jobs, setJobs] = useState<Map<string, JobState>>(() => {
    const stored = loadStoredJobs()
    return new Map(stored.map(job => [job.keywordId, job]))
  })

  const pollTimeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const mountedRef = useRef(true)

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      pollTimeoutsRef.current.forEach(timeout => clearTimeout(timeout))
    }
  }, [])

  const getJob = useCallback((keywordId: string) => {
    return jobs.get(keywordId)
  }, [jobs])

  const isPolling = useCallback((keywordId?: string) => {
    if (keywordId) {
      const job = jobs.get(keywordId)
      return job ? job.status === 'pending' || job.status === 'running' : false
    }
    // Check if any job is polling
    for (const job of jobs.values()) {
      if (job.status === 'pending' || job.status === 'running') return true
    }
    return false
  }, [jobs])

  const pollJob = useCallback(async (jobId: string, keywordId: string) => {
    try {
      const job = await keywordsApi.getScrapeJob(jobId)

      if (!mountedRef.current) return

      const jobState: JobState = {
        jobId,
        keywordId,
        status: job.status,
        progress: job.total ? { current: job.successful + job.failed, total: job.total } : null,
        error: job.error_message,
      }

      setJobs(prev => {
        const next = new Map(prev)
        next.set(keywordId, jobState)
        saveJobs(Array.from(next.values()))
        return next
      })

      // Check if job is done
      if (job.status === 'completed') {
        pollTimeoutsRef.current.delete(keywordId)
        if (onCompleteRef.current) {
          onCompleteRef.current(job, keywordId)
        }
        // Invalidate news cache for this keyword
        queryClient.invalidateQueries({ queryKey: ['keywords', keywordId, 'news'] })
      } else if (job.status === 'failed') {
        pollTimeoutsRef.current.delete(keywordId)
        if (onErrorRef.current) {
          onErrorRef.current(job, keywordId)
        }
      } else {
        // Continue polling
        const timeout = setTimeout(() => pollJob(jobId, keywordId), pollInterval)
        pollTimeoutsRef.current.set(keywordId, timeout)
      }
    } catch (err) {
      if (!mountedRef.current) return
      setJobs(prev => {
        const next = new Map(prev)
        const existing = next.get(keywordId)
        if (existing) {
          next.set(keywordId, {
            ...existing,
            status: 'failed',
            error: err instanceof Error ? err.message : 'Failed to check job status',
          })
        }
        saveJobs(Array.from(next.values()))
        return next
      })
      pollTimeoutsRef.current.delete(keywordId)
    }
  }, [pollInterval, queryClient])

  // Resume polling on mount if there are stored jobs
  useEffect(() => {
    jobs.forEach((job) => {
      if (job.status === 'pending' || job.status === 'running') {
        const timeout = setTimeout(() => pollJob(job.jobId, job.keywordId), 500)
        pollTimeoutsRef.current.set(job.keywordId, timeout)
      }
    })
  }, []) // Only run on mount

  const startAsyncScrape = useCallback(async (keywordId: string) => {
    // Clear previous timeout for this keyword if any
    const existingTimeout = pollTimeoutsRef.current.get(keywordId)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
    }

    // Set initial state
    const initialState: JobState = {
      jobId: '',
      keywordId,
      status: 'pending',
      progress: null,
      error: null,
    }
    setJobs(prev => {
      const next = new Map(prev)
      next.set(keywordId, initialState)
      return next
    })

    try {
      const response = await keywordsApi.scrapeAsync(keywordId)

      if (!mountedRef.current) return

      const jobState: JobState = {
        jobId: response.job_id,
        keywordId,
        status: response.status,
        progress: null,
        error: null,
      }

      setJobs(prev => {
        const next = new Map(prev)
        next.set(keywordId, jobState)
        saveJobs(Array.from(next.values()))
        return next
      })

      // Start polling
      const timeout = setTimeout(() => pollJob(response.job_id, keywordId), pollInterval)
      pollTimeoutsRef.current.set(keywordId, timeout)
    } catch (err) {
      if (!mountedRef.current) return
      setJobs(prev => {
        const next = new Map(prev)
        next.set(keywordId, {
          jobId: '',
          keywordId,
          status: 'failed',
          progress: null,
          error: err instanceof Error ? err.message : 'Failed to start scrape job',
        })
        saveJobs(Array.from(next.values()))
        return next
      })
    }
  }, [pollJob, pollInterval])

  const cancelPolling = useCallback((keywordId: string) => {
    const timeout = pollTimeoutsRef.current.get(keywordId)
    if (timeout) {
      clearTimeout(timeout)
      pollTimeoutsRef.current.delete(keywordId)
    }
    setJobs(prev => {
      const next = new Map(prev)
      next.delete(keywordId)
      saveJobs(Array.from(next.values()))
      return next
    })
  }, [])

  const clearCompletedJobs = useCallback(() => {
    setJobs(prev => {
      const next = new Map()
      prev.forEach((job, keywordId) => {
        if (job.status === 'pending' || job.status === 'running') {
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