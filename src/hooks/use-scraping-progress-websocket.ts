import { useEffect, useRef } from "react"
import { getAccessToken, getWebSocketUrl } from "@/lib/api"

// Scraping progress event types
export type ScrapingProgressEvent =
  | "started"
  | "google_search"
  | "google_results"
  | "scraping"
  | "result"
  | "analyzing"
  | "summarizing"
  | "completed"
  | "error"

export interface ScrapingProgressMessage {
  job_id: string
  event: ScrapingProgressEvent
  data: Record<string, unknown> & { keyword_id?: string }
}

export interface ScrapingProgressState {
  jobId: string
  keywordId?: string
  status: "pending" | "running" | "completed" | "failed"
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
  error?: string
}

type ProgressCallback = (jobId: string, progress: ScrapingProgressState) => void
type CompletedCallback = (jobId: string, keywordId: string) => void

// Module-level singleton state
let wsInstance: WebSocket | null = null
let connectionPromise: Promise<void> | null = null
const progressCallbacks = new Set<ProgressCallback>()
const completedCallbacks = new Set<CompletedCallback>()

// Track job states
const jobStates = new Map<string, ScrapingProgressState>()

// Track job_id -> keyword_id mapping
const jobToKeywordMap = new Map<string, string>()

function handleMessage(event: MessageEvent) {
  try {
    const message:
      | ScrapingProgressMessage
      | { type: "connected" | "ping" | "pong" } = JSON.parse(event.data)

    // Handle connection/ping messages
    if (
      "type" in message &&
      (message.type === "connected" ||
        message.type === "ping" ||
        message.type === "pong")
    ) {
      if (message.type === "ping" && wsInstance) {
        wsInstance.send(JSON.stringify({ type: "pong" }))
      }
      return
    }

    const { job_id, event: progressEvent, data } =
      message as ScrapingProgressMessage
    console.log("[ScrapingProgress]", progressEvent, { job_id, data })

    // Track keyword_id from data
    if (data.keyword_id) {
      jobToKeywordMap.set(job_id, data.keyword_id)
    }

    const keywordId = jobToKeywordMap.get(job_id)

    // Get or create job state
    let state = jobStates.get(job_id) || {
      jobId: job_id,
      keywordId,
      status: "pending" as const,
      progress: null,
    }

    // Update state based on event
    switch (progressEvent) {
      case "started":
        state = {
          ...state,
          status: "running",
          stage: "searching",
          progress: null,
        }
        break

      case "google_search":
        state = {
          ...state,
          status: "running",
          stage: "searching",
        }
        break

      case "google_results":
        // Google search results found, about to start scraping
        state = {
          ...state,
          stage: "searching",
        }
        break

      case "scraping":
        state = {
          ...state,
          status: "running",
          stage: "scraping",
          progress: {
            current: (data.current as number) || 0,
            total: (data.total as number) || 0,
          },
          currentUrl: data.url as string,
          currentTitle: data.title as string,
        }
        break

      case "result":
        // Result comes after page is scraped (before AI analysis)
        state = {
          ...state,
          stage: "scraping",
          progress: {
            current: (data.current as number) || 0,
            total: (data.total as number) || 0,
          },
        }
        break

      case "analyzing":
        // AI is analyzing the content
        state = {
          ...state,
          status: "running",
          stage: "analyzing",
          progress: {
            current: (data.current as number) || 0,
            total: (data.total as number) || 0,
          },
          currentUrl: data.url as string,
          currentTitle: data.title as string,
        }
        break

      case "summarizing":
        // Generating keyword summary
        state = {
          ...state,
          status: "running",
          stage: "summarizing",
        }
        break

      case "completed":
        console.log("[ScrapingProgress] Received completed event:", data)
        state = {
          ...state,
          status: "completed",
          stage: "completed",
          progress: {
            current: (data.successful as number) + (data.failed as number) || 0,
            total: (data.total as number) || 0,
          },
        }
        break

      case "error":
        console.log("[ScrapingProgress] Received error event:", data)
        state = {
          ...state,
          status: "failed",
          stage: "failed",
          error: (data.message as string) || "Unknown error",
        }
        break

      default:
        // Unknown event - log it but keep running
        console.warn("[ScrapingProgress] Unknown event:", progressEvent, data)
        break
    }

    // Ensure state is always set
    if (state) {
      jobStates.set(job_id, state)
      if (state.stage) {
        console.log(
          "[ScrapingProgress] State updated:",
          state.status,
          state.stage
        )
      }

      // Notify callbacks
      progressCallbacks.forEach((cb) => cb(job_id, state!))
    }

    // Handle completion
    if (progressEvent === "completed" || progressEvent === "error") {
      if (keywordId) {
        completedCallbacks.forEach((cb) => cb(job_id, keywordId))
      }
      // Clean up job state after a delay
      setTimeout(() => {
        jobStates.delete(job_id)
        jobToKeywordMap.delete(job_id)
      }, 5000)
    }
  } catch (err) {
    console.error("[ScrapingProgress] Error:", err)
  }
}

async function connectWebSocket() {
  if (wsInstance?.readyState === WebSocket.OPEN) {
    return
  }

  if (connectionPromise) {
    return connectionPromise
  }

  const token = getAccessToken()
  if (!token) return

  connectionPromise = new Promise((resolve) => {
    const wsUrl = getWebSocketUrl("/ws/scraping-progress")
    const url = `${wsUrl}?token=${encodeURIComponent(token)}`

    console.log("[ScrapingProgress] Connecting to:", wsUrl)
    const ws = new WebSocket(url)
    wsInstance = ws

    ws.onopen = () => {
      console.log("[ScrapingProgress] Connected")
      resolve()
    }

    ws.onmessage = handleMessage

    ws.onclose = (event) => {
      console.log("[ScrapingProgress] Closed:", event.code)
      wsInstance = null
      connectionPromise = null
    }

    ws.onerror = (err) => {
      console.error("[ScrapingProgress] Error:", err)
      wsInstance = null
      connectionPromise = null
      resolve()
    }
  })

  return connectionPromise
}

function disconnectWebSocket() {
  if (wsInstance) {
    wsInstance.close()
    wsInstance = null
    connectionPromise = null
  }
}

export function getJobProgress(
  jobId: string
): ScrapingProgressState | undefined {
  return jobStates.get(jobId)
}

export function clearJobProgress(jobId: string) {
  jobStates.delete(jobId)
}

interface UseScrapingProgressWebSocketOptions {
  onProgress?: (jobId: string, progress: ScrapingProgressState) => void
  onCompleted?: (jobId: string, keywordId: string) => void
  enabled?: boolean
}

export function useScrapingProgressWebSocket({
  onProgress,
  onCompleted,
  enabled = true,
}: UseScrapingProgressWebSocketOptions = {}) {
  const onProgressRef = useRef(onProgress)
  const onCompletedRef = useRef(onCompleted)

  // Keep refs updated
  useEffect(() => {
    onProgressRef.current = onProgress
    onCompletedRef.current = onCompleted
  })

  useEffect(() => {
    if (!enabled) {
      return
    }

    // Create wrapper callbacks
    const progressWrapper: ProgressCallback = (jobId, progress) => {
      console.log(
        "[ScrapingProgress] progressWrapper called:",
        jobId,
        progress.status
      )
      onProgressRef.current?.(jobId, progress)
    }

    const completedWrapper: CompletedCallback = (jobId, keywordId) => {
      console.log(
        "[ScrapingProgress] completedWrapper called:",
        jobId,
        keywordId
      )
      onCompletedRef.current?.(jobId, keywordId)
    }

    // Register callbacks (always register both to ensure they're called)
    progressCallbacks.add(progressWrapper)
    completedCallbacks.add(completedWrapper)

    // Connect if not already connected
    connectWebSocket()

    console.log("[ScrapingProgress] Hooks registered, connecting WebSocket")

    return () => {
      progressCallbacks.delete(progressWrapper)
      completedCallbacks.delete(completedWrapper)

      // If no more callbacks, disconnect
      if (progressCallbacks.size === 0 && completedCallbacks.size === 0) {
        disconnectWebSocket()
      }
    }
  }, [enabled])

  return {
    isConnected: wsInstance?.readyState === WebSocket.OPEN,
    getJobProgress,
    clearJobProgress,
  }
}
