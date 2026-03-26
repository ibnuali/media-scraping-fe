import type { Notification } from "@/types/notification"
import { Button } from "@/components/ui/button"
import { cn, formatTimeAgo } from "@/lib/utils"
import {
  Check,
  Trash2,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"

export type NotificationItemProps = {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}

// Derive status from title text
function getStatusFromTitle(title: string): "success" | "failed" | "partial" {
  const lower = title.toLowerCase()
  if (lower.includes("failed")) return "failed"
  if (lower.includes("partial")) return "partial"
  return "success"
}

const statusIcons = {
  success: CheckCircle2,
  failed: AlertCircle,
  partial: AlertTriangle,
}

const statusColors = {
  success: "text-green-500",
  failed: "text-red-500",
  partial: "text-yellow-500",
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const status = getStatusFromTitle(notification.title)
  const StatusIcon = statusIcons[status]

  return (
    <div
      className={cn(
        "group relative flex gap-3 p-3 pr-2 transition-colors hover:bg-muted/50",
        !notification.is_read && "bg-primary/5"
      )}
    >
      {/* Unread indicator */}
      {!notification.is_read && (
        <span className="absolute top-4 left-1.5 h-2 w-2 rounded-full bg-primary" />
      )}

      {/* Status icon */}
      <div className={cn("mt-0.5 shrink-0", statusColors[status])}>
        <StatusIcon className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pr-10">
        <p className="truncate text-sm leading-tight font-medium">
          {notification.title}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
          {notification.message}
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          {formatTimeAgo(notification.created_at)}
        </p>
      </div>

      {/* Actions - positioned absolute to not affect content width */}
      <div className="absolute top-3 right-2 flex items-start gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {!notification.is_read && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onMarkAsRead(notification.id)}
            title="Mark as read"
          >
            <Check className="h-3.5 w-3.5" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => onDelete(notification.id)}
          title="Delete"
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
