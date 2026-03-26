import {
  useNotifications,
  useMarkAsRead,
  useDeleteNotification,
} from "../hooks/use-notifications"
import { NotificationItem } from "./NotificationItem"
import { NotificationEmptyState } from "./NotificationEmptyState"
import { Skeleton } from "@/components/ui/skeleton"

export type NotificationListProps = {
  limit?: number
}

export function NotificationList({ limit = 10 }: NotificationListProps) {
  const { data, isLoading, isError } = useNotifications({ limit })
  const markAsRead = useMarkAsRead()
  const deleteNotification = useDeleteNotification()

  if (isLoading) {
    return (
      <div className="space-y-3 p-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-5 w-5 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-sm text-destructive">
        Failed to load notifications
      </div>
    )
  }

  if (!data?.items?.length) {
    return <NotificationEmptyState />
  }

  return (
    <div className="max-h-[400px] overflow-y-auto">
      {data.items.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={(id) => markAsRead.mutate(id)}
          onDelete={(id) => deleteNotification.mutate(id)}
        />
      ))}
    </div>
  )
}
