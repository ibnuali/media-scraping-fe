import { Bell } from "lucide-react"

export function NotificationEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
      <span className="flex size-10 items-center justify-center rounded-full border border-border bg-background">
        <Bell className="size-4 text-ink-3" />
      </span>
      <p className="mt-3 text-[13px] font-medium text-foreground">
        No notifications
      </p>
      <p className="mt-1 font-mono text-[11px] text-ink-3">
        you&apos;re all caught up
      </p>
    </div>
  )
}
