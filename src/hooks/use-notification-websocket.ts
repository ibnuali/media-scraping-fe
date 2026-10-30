import { useEffect, useRef } from "react"
import { useQueryClient, type QueryClient } from "@tanstack/react-query"
import { getAccessToken, getWebSocketUrl } from "@/lib/api"
import type { Notification } from "@/types/notification"

interface WebSocketMessage {
  type: "connected" | "notification" | "ping" | "pong" | "summary_generated"
  data?: Notification | { keyword_id: string; keyword: string }
}

type NotificationCallback = (notification: Notification) => void
type SummaryGeneratedCallback = (keywordId: string) => void

// Module-level singleton state
let wsInstance: WebSocket | null = null
let connectionPromise: Promise<void> | null = null
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let reconnectAttempts = 0
let manualClose = false
const notificationCallbacks = new Set<NotificationCallback>()
const summaryGeneratedCallbacks = new Set<SummaryGeneratedCallback>()
let queryClientRef: QueryClient | null = null

function handleMessage(event: MessageEvent) {
  try {
    const message: WebSocketMessage = JSON.parse(event.data)
    console.log("[WS] Message:", message.type)

    if (message.type === "notification" && message.data) {
      console.log("[WS] Notification:", message.data)
      queryClientRef?.invalidateQueries({ queryKey: ["notifications"] })
      notificationCallbacks.forEach((cb) => cb(message.data as Notification))
    }

    if (message.type === "summary_generated" && message.data) {
      const { keyword_id } = message.data as {
        keyword_id: string
        keyword: string
      }
      console.log("[WS] Summary generated for keyword:", keyword_id)
      queryClientRef?.invalidateQueries({ queryKey: ["keywords", keyword_id] })
      summaryGeneratedCallbacks.forEach((cb) => cb(keyword_id))
    }

    if (message.type === "ping" && wsInstance) {
      wsInstance.send(JSON.stringify({ type: "pong" }))
    }
  } catch (err) {
    console.error("[WS] Error:", err)
  }
}

function scheduleReconnect() {
  if (manualClose || reconnectTimer) return
  // Exponential backoff: 1s, 2s, 4s, ... capped at 30s.
  const delay = Math.min(1000 * 2 ** reconnectAttempts, 30000)
  reconnectAttempts += 1
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    connectWebSocket()
  }, delay)
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

  manualClose = false

  connectionPromise = new Promise((resolve) => {
    const wsUrl = getWebSocketUrl("/ws/notifications")
    const url = `${wsUrl}?token=${encodeURIComponent(token)}`

    console.log("[WS] Connecting to:", wsUrl)
    const ws = new WebSocket(url)
    wsInstance = ws

    ws.onopen = () => {
      console.log("[WS] Open")
      reconnectAttempts = 0
      resolve()
    }

    ws.onmessage = handleMessage

    ws.onclose = (event) => {
      console.log("[WS] Close:", event.code)
      wsInstance = null
      connectionPromise = null
      resolve()
      scheduleReconnect()
    }

    ws.onerror = (err) => {
      // A failed connection is always followed by onclose, which handles
      // teardown and reconnect scheduling.
      console.error("[WS] Error event:", err)
    }
  })

  return connectionPromise
}

function disconnectWebSocket() {
  manualClose = true
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  reconnectAttempts = 0
  if (wsInstance) {
    wsInstance.close()
    wsInstance = null
  }
  connectionPromise = null
}

interface UseNotificationWebSocketOptions {
  onNotification?: (notification: Notification) => void
  onSummaryGenerated?: (keywordId: string) => void
  enabled?: boolean
}

export function useNotificationWebSocket({
  onNotification,
  onSummaryGenerated,
  enabled = true,
}: UseNotificationWebSocketOptions = {}) {
  const queryClient = useQueryClient()

  // Store refs to callbacks
  const onNotificationRef = useRef(onNotification)
  const onSummaryGeneratedRef = useRef(onSummaryGenerated)

  // Keep refs updated
  useEffect(() => {
    onNotificationRef.current = onNotification
    onSummaryGeneratedRef.current = onSummaryGenerated
  })

  // Register callbacks and manage connection
  useEffect(() => {
    if (!enabled) {
      return
    }

    // Set queryClient ref
    queryClientRef = queryClient

    // Create wrapper callbacks that use refs
    const notificationWrapper: NotificationCallback = (notification) => {
      onNotificationRef.current?.(notification)
    }

    const summaryWrapper: SummaryGeneratedCallback = (keywordId) => {
      onSummaryGeneratedRef.current?.(keywordId)
    }

    // Register callbacks
    if (onNotification) {
      notificationCallbacks.add(notificationWrapper)
    }
    if (onSummaryGenerated) {
      summaryGeneratedCallbacks.add(summaryWrapper)
    }

    // Connect if not already connected
    connectWebSocket()

    // Cleanup - remove callbacks but don't disconnect
    return () => {
      notificationCallbacks.delete(notificationWrapper)
      summaryGeneratedCallbacks.delete(summaryWrapper)

      // If no more callbacks, disconnect
      if (
        notificationCallbacks.size === 0 &&
        summaryGeneratedCallbacks.size === 0
      ) {
        disconnectWebSocket()
      }
    }
  }, [enabled, queryClient])

  return {
    isConnected: wsInstance?.readyState === WebSocket.OPEN,
  }
}
