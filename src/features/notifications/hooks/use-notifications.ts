import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { notificationsApi } from "@/lib/api"
import type { NotificationListParams, Notification } from "@/types/notification"
import { toast } from "sonner"

export function useNotifications(params?: NotificationListParams) {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => notificationsApi.list(params),
    staleTime: 5000, // Consider stale after 5 seconds
  })
}

export function useUnreadCount(enabled = true) {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: notificationsApi.getUnreadCount,
    enabled,
    staleTime: 5000,
    // No polling - WebSocket provides real-time updates
  })
}

export function showNotificationToast(notification: Notification) {
  const { title, message } = notification

  // Determine toast type based on title
  if (title.toLowerCase().includes("failed")) {
    toast.error(title, { description: message })
  } else if (title.toLowerCase().includes("partial")) {
    toast.warning(title, { description: message })
  } else {
    toast.success(title, { description: message })
  }
}

export function useMarkAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

export function useDeleteNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notificationsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}
