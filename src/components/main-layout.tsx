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
    title: "",
    description: "",
  },
  "/profile": {
    title: "Profile",
    description: "Manage your account settings and preferences",
  },
}

export function MainLayout() {
  const { user, logout } = useAuth()
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
      <div className="liquid-gradient flex min-h-screen bg-background">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "glass-sidebar fixed inset-y-0 left-0 z-50 transform border-r border-border/50 transition-all duration-300 ease-in-out lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            collapsed ? "w-20" : "w-72"
          )}
        >
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div
              className={cn(
                "flex h-16 items-center border-b border-border/50 transition-all duration-300",
                collapsed ? "justify-center px-2" : "justify-between px-6"
              )}
            >
              <div
                className={cn(
                  "flex items-center",
                  collapsed ? "justify-center" : "gap-3"
                )}
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
                  <KeyRound className="size-5 text-primary-foreground" />
                </div>
                {!collapsed && (
                  <span className="text-xl font-bold text-primary">
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
            <nav className="flex-1 space-y-1 p-4">
              {!collapsed && (
                <div className="mb-2 px-3 text-xs font-semibold tracking-wider text-muted-foreground/60 uppercase">
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
                      "flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200",
                      collapsed ? "justify-center px-3 py-3" : "px-3 py-2.5",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )
                  }
                >
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger
                        render={<item.icon className="size-5" />}
                      ></TooltipTrigger>
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  ) : (
                    <>
                      <item.icon className="size-5" />
                      {item.label}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* User section */}
            <div className="border-t border-border/50 p-4">
              {collapsed ? (
                <div className="flex flex-col items-center gap-3">
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => navigate("/profile")}
                          className="flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25"
                        >
                          {user?.username?.charAt(0).toUpperCase() || "U"}
                        </Button>
                      }
                    />

                    <TooltipContent side="right">
                      <p className="font-semibold">{user?.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email || "Logged in"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => navigate("/profile")}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <User className="size-4" />
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
                            <LogOut className="size-4" />
                          </Button>
                        }
                      />

                      <TooltipContent side="right">Logout</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ) : (
                <div className="glass-card flex items-center gap-3 rounded-xl p-3">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => navigate("/profile")}
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
                  >
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </Button>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-semibold">
                      @{user?.username}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user?.email || "Logged in"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => navigate("/profile")}
                      title="Profile"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <User className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={handleLogout}
                      title="Logout"
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <LogOut className="size-4" />
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
              className="absolute top-20 -right-3 z-50 hidden size-6 rounded-full border border-border bg-background shadow-md hover:bg-muted lg:flex"
            >
              {collapsed ? (
                <ChevronRight className="size-3" />
              ) : (
                <ChevronLeft className="size-3" />
              )}
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col transition-all duration-300",
            collapsed ? "lg:ml-20" : "lg:ml-72"
          )}
        >
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-border/50 bg-background px-4 lg:px-6">
            <div className="flex min-w-0 items-center gap-3">
              {isDetailPage && (
                <Button variant="ghost" size="icon-xs" onClick={handleBack}>
                  <ArrowLeft className="size-4" />
                </Button>
              )}
              {title && (
                <div className="min-w-0">
                  <h1 className="truncate text-lg font-semibold tracking-tight">
                    {title}
                  </h1>
                  {description && (
                    <p className="truncate text-sm text-muted-foreground">
                      {description}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <NotificationBell />
            </div>
          </header>

          {/* Page content */}
          <main className="relative flex-1 overflow-y-auto bg-background p-4 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </HeaderContext.Provider>
  )
}
