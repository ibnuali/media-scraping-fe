import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useUnreadCount, useMarkAllAsRead } from "../hooks/use-notifications"
import { NotificationList } from "./NotificationList"

export function NotificationBell() {
  const { data: unreadData } = useUnreadCount()
  const markAllAsRead = useMarkAllAsRead()

  const unreadCount = unreadData?.unread_count ?? 0

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={
              unreadCount > 0
                ? `Notifications, ${unreadCount} unread`
                : "Notifications"
            }
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 font-mono text-[10px] font-medium tabular-nums text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Button>
        }
      />
      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <h4 className="text-[13px] font-semibold tracking-tight">
            Notifications
          </h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
            >
              Mark all read
            </Button>
          )}
        </div>

        <NotificationList />
      </PopoverContent>
    </Popover>
  )
}
