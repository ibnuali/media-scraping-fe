import { useEffect, useRef } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { LogOut, User } from "lucide-react"
import { useAsyncScrape } from "@/hooks/use-async-scrape"
import { useAuth } from "@/contexts/auth-context"
import { Wordmark } from "@/components/wordmark"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationBell } from "@/features/notifications"
import { useNotificationWebSocket } from "@/hooks/use-notification-websocket"
import { showNotificationToast } from "@/features/notifications/hooks/use-notifications"

export function KeywordWorkspaceLayout() {
  const { user, isActive, logout } = useAuth()
  const navigate = useNavigate()
  const jobs = useAsyncScrape()
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 })
  }, [pathname])
  useNotificationWebSocket({
    onNotification: showNotificationToast,
    enabled: !!user,
  })

  return (
    <div className="keyword-app">
      <a href="#workspace-main" className="workspace-skip-link">
        Skip to content
      </a>
      <header className="workspace-header">
        <Link
          to="/keywords"
          aria-label="KeyCrawl keywords"
          className="workspace-brand"
        >
          <Wordmark size="sm" />
        </Link>
        <span className="workspace-header-caption">News workspace</span>
        <nav aria-label="Account" className="workspace-account">
          <ThemeToggle />
          <NotificationBell />
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Account menu" />
              }
            >
              <User className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-44">
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await logout()
                  navigate("/login")
                }}
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </header>
      {user && !isActive && (
        <p role="status" className="workspace-account-notice">
          Account pending activation. Some features are restricted. Contact
          mail@ibnua.li to request access.
        </p>
      )}
      <main
        ref={mainRef}
        id="workspace-main"
        className="workspace-main"
        tabIndex={-1}
      >
        <Outlet context={jobs} />
      </main>
    </div>
  )
}
