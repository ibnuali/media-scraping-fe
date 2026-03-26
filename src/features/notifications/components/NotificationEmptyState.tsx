import { Bell } from "lucide-react"

export function NotificationEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="rounded-full bg-muted p-3">
        <Bell className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="mt-3 text-sm font-medium">No notifications</p>
      <p className="mt-1 text-xs text-muted-foreground">
        You're all caught up!
      </p>
    </div>
  )
}
