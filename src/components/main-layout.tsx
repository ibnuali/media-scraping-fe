import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { useSidebar } from "@/contexts/sidebar-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  KeyRound,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  SearchCode,
  ArrowLeft,
  User,
  AlertTriangle,
} from "lucide-react"
import { useState, createContext, useContext } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { NotificationBell } from "@/features/notifications"
import { ThemeToggle } from "@/components/theme-toggle"
import { useNotificationWebSocket } from "@/hooks/use-notification-websocket"
import { showNotificationToast } from "@/features/notifications/hooks/use-notifications"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Header context for child pages to set custom header content
type HeaderContextType = {
  setTitle: (title: string | null) => void
  setDescription: (description: string | null) => void
}

const HeaderContext = createContext<HeaderContextType | null>(null)

export function useHeader() {
  const context = useContext(HeaderContext)
  if (!context) {
    throw new Error("useHeader must be used within MainLayout")
  }
  return context
}

// Page header configuration for static routes
const pageHeaders: Record<string, { title: string; description: string }> = {
  "/keywords": {
    title: "Keywords",
    description: "Manage your tracked keywords",
  },
  "/profile": {
    title: "Profile",
    description: "Manage your account settings",
  },
}

export function MainLayout() {
  const { user, logout, isActive } = useAuth()
  const { collapsed, setCollapsed } = useSidebar()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Dynamic header state (for child pages to override)
  const [dynamicTitle, setDynamicTitle] = useState<string | null>(null)
  const [dynamicDescription, setDynamicDescription] = useState<string | null>(
    null
  )

  // Check if we're on a detail page (has back button)
  const isDetailPage =
    location.pathname.startsWith("/keywords/") && location.pathname !== "/"

  // Get page header info
  const pageInfo = pageHeaders[location.pathname]
  const title = dynamicTitle ?? pageInfo?.title
  const description = dynamicDescription ?? pageInfo?.description

  // WebSocket connection for real-time notifications
  useNotificationWebSocket({
    onNotification: (notification) => {
      showNotificationToast(notification)
    },
    enabled: !!user,
  })

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleBack = () => {
    navigate("/keywords")
  }

  const navItems = [{ to: "/keywords", label: "Keywords", icon: SearchCode }]

  const headerContextValue: HeaderContextType = {
    setTitle: setDynamicTitle,
    setDescription: setDynamicDescription,
  }

  return (
    <HeaderContext.Provider value={headerContextValue}>
      <div className="flex min-h-screen bg-background">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-sidebar transition-[width] duration-200 lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            collapsed ? "w-16" : "w-60"
          )}
        >
          {/* Logo */}
          <div
            className={cn(
              "flex h-12 items-center border-b border-border transition-all duration-200",
              collapsed ? "justify-center px-2" : "justify-between px-4"
            )}
          >
            <div
              className={cn(
                "flex items-center",
                collapsed ? "justify-center" : "gap-2.5"
              )}
            >
              <div className="flex size-8 items-center justify-center rounded-md bg-primary">
                <KeyRound className="size-4 text-primary-foreground" />
              </div>
              {!collapsed && (
                <span className="text-sm font-semibold tracking-tight text-foreground">
                  KeyCrawl
                </span>
              )}
            </div>
            {!collapsed && (
              <Button
                variant="ghost"
                size="icon-xs"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="size-4" />
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-0.5 p-3">
            {!collapsed && (
              <div className="mb-1.5 px-2 text-[10px] font-medium tracking-widest text-muted-foreground/60 uppercase">
                Navigation
              </div>
            )}
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2.5 rounded-md text-[13px] font-medium transition-colors duration-150",
                    collapsed ? "justify-center px-2 py-2" : "px-2.5 py-2",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger
                      render={<item.icon className="size-4" />}
                    ></TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                ) : (
                  <>
                    <item.icon className="size-4" />
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User section */}
          <div className="border-t border-border p-3">
            {collapsed ? (
              <div className="flex flex-col items-center gap-2">
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => navigate("/profile")}
                        className="flex size-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground"
                      >
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </Button>
                    }
                  />

                  <TooltipContent side="right">
                    <p className="font-medium">{user?.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email || "Logged in"}
                    </p>
                  </TooltipContent>
                </Tooltip>
                <div className="flex items-center gap-0.5">
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => navigate("/profile")}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <User className="size-3.5" />
                        </Button>
                      }
                    />
                    <TooltipContent side="right">Profile</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={handleLogout}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <LogOut className="size-3.5" />
                        </Button>
                      }
                    />

                    <TooltipContent side="right">Logout</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 rounded-md border border-border bg-sidebar p-2">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => navigate("/profile")}
                  className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/90"
                >
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </Button>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-[13px] font-medium">
                    @{user?.username}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {user?.email || "Logged in"}
                  </p>
                </div>
                <div className="flex items-center gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => navigate("/profile")}
                    title="Profile"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <User className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={handleLogout}
                    title="Logout"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <LogOut className="size-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Collapse toggle button - desktop only */}
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setCollapsed(!collapsed)}
            className="absolute top-14 -right-3 z-50 hidden size-6 rounded-full border border-border bg-background hover:bg-muted lg:flex"
          >
            {collapsed ? (
              <ChevronRight className="size-3" />
            ) : (
              <ChevronLeft className="size-3" />
            )}
          </Button>
        </aside>

        {/* Main content */}
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col transition-[margin] duration-200",
            collapsed ? "lg:ml-16" : "lg:ml-60"
          )}
        >
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-11 items-center justify-between gap-3 border-b border-border bg-background px-4 lg:px-6">
            <div className="flex min-w-0 items-center gap-2">
              {isDetailPage && (
                <Button variant="ghost" size="icon-xs" onClick={handleBack}>
                  <ArrowLeft className="size-4" />
                </Button>
              )}
              {title && (
                <div className="min-w-0">
                  <h1 className="truncate text-sm font-semibold tracking-tight">
                    {title}
                  </h1>
                  {description && (
                    <p className="truncate text-xs text-muted-foreground">
                      {description}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-0.5">
              <ThemeToggle />
              <NotificationBell />
            </div>
          </header>

          {/* Inactive user banner */}
          {user && !isActive && (
            <div className="border-b border-border bg-background px-4 py-3 lg:px-6">
              <Alert variant="destructive">
                <AlertTriangle className="size-4" />
                <AlertDescription className="text-xs">
                  Account pending activation. Some features are restricted.
                  please send a request to email mail@ibnua.li
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Page content */}
          <main className="relative flex-1 overflow-y-auto bg-background p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </HeaderContext.Provider>
  )
}
