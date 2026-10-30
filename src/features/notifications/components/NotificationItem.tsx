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
  success: "text-success",
  failed: "text-destructive",
  partial: "text-warning",
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
        "group relative flex gap-3 border-b border-border p-3 pr-2 transition-colors duration-150 last:border-b-0 hover:bg-muted/50",
        !notification.is_read && "bg-primary/5"
      )}
    >
      {!notification.is_read && (
        <span className="absolute top-3.5 left-1.5 size-1.5 rounded-full bg-primary" />
      )}

      <span className={cn("mt-0.5 shrink-0", statusColors[status])}>
        <StatusIcon className="size-4" />
      </span>

      <div className="min-w-0 flex-1 pr-10">
        <p className="truncate text-[13px] leading-tight font-medium text-foreground">
          {notification.title}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs text-ink-2">
          {notification.message}
        </p>
        <p className="mt-1 font-mono text-[11px] text-ink-3">
          {formatTimeAgo(notification.created_at)}
        </p>
      </div>

      <div className="absolute top-2.5 right-2 flex items-start gap-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
        {!notification.is_read && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onMarkAsRead(notification.id)}
            aria-label="Mark as read"
          >
            <Check className="size-3.5" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => onDelete(notification.id)}
          aria-label="Delete notification"
          className="text-ink-2 hover:text-destructive"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}
