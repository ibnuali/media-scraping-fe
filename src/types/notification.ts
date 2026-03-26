// Notification types matching backend schema

export interface Notification {
  id: string // UUID
  keyword_id: string // UUID
  job_id: string | null // UUID
  title: string
  message: string
  is_read: boolean
  created_at: string // datetime
}

export interface NotificationListResponse {
  total: number
  unread_count: number
  items: Notification[]
}

export interface NotificationListParams {
  limit?: number
  offset?: number
  unread_only?: boolean
}

export interface UnreadCountResponse {
  unread_count: number
}

export interface MarkAllReadResponse {
  marked_read: number
}
