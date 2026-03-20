import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { KeyRound, LogOut, Menu, X, Sparkles, LayoutDashboard, Settings } from 'lucide-react'
import { useState } from 'react'

export function MainLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  ]

  return (
    <div className="flex min-h-screen bg-background">
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
          'fixed inset-y-0 left-0 z-50 w-72 transform border-r border-border/50 bg-sidebar transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-border/50 px-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl gradient-bg shadow-lg shadow-primary/25">
                <KeyRound className="size-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">KeyCrawl</span>
            </div>
            <Button
              variant="ghost"
              size="icon-xs"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="size-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              Navigation
            </div>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'gradient-bg text-white shadow-lg shadow-primary/25'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  )
                }
              >
                <item.icon className="size-5" />
                {item.label}
              </NavLink>
            ))}

            <div className="mt-8 mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              Quick Stats
            </div>

            {/* Quick stats card */}
            <div className="mx-1 rounded-xl border border-border/50 bg-muted/30 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="size-4 text-primary" />
                <span className="text-sm font-medium">Status</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">API Status</span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-600 font-medium">Online</span>
                  </span>
                </div>
              </div>
            </div>
          </nav>

          {/* User section */}
          <div className="border-t border-border/50 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-muted/30 p-3">
              <div className="flex size-10 items-center justify-center rounded-xl gradient-bg text-sm font-bold text-white shadow-lg shadow-primary/25">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold">{user?.username}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.email || 'Logged in'}
                </p>
              </div>
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
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-lg px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground sm:block">
              Welcome back, <span className="font-semibold text-foreground">{user?.username}</span>
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8 relative">
          <div className="absolute inset-0 mesh-gradient opacity-30 pointer-events-none" />
          <div className="relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}