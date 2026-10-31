import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Hash, Loader2, LogOut, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Wordmark } from "@/components/wordmark"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import { cn, formatLastScraped } from "@/lib/utils"
import type { KeywordResponse } from "@/types/keyword"

export interface KeywordWorkspaceSidebarProps {
  keywords: KeywordResponse[] | undefined
  selectedId?: string
  isLoading: boolean
  error: Error | null
  isPolling: (id?: string) => boolean
  onSelect: (id: string) => void
  onAdd: () => void
}

export function KeywordWorkspaceSidebar({
  keywords,
  selectedId,
  isLoading,
  error,
  isPolling,
  onSelect,
  onAdd,
}: KeywordWorkspaceSidebarProps) {
  const [search, setSearch] = useState("")
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const filtered = keywords?.filter((item) =>
    item.keyword.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex h-full min-h-0 flex-col bg-sidebar">
      <div className="flex h-14 shrink-0 items-center px-4">
        <Wordmark size="sm" />
      </div>
      <div className="space-y-3 px-3 pt-2 pb-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 bg-transparent"
          onClick={onAdd}
        >
          <Plus className="size-4" /> New keyword
        </Button>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-ink-3" />
          <Input
            aria-label="Search keywords"
            placeholder="Find a keyword…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-8 border-transparent bg-muted/50 pl-8 text-xs shadow-none"
          />
        </div>
      </div>
      <div className="flex items-center justify-between px-4 pb-2 text-[11px] font-medium text-ink-2">
        <span>Tracked keywords</span>
        <span className="font-mono tabular-nums">
          {keywords?.length ?? "—"}
        </span>
      </div>
      <nav
        aria-label="Tracked keywords"
        className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-4"
      >
        {isLoading &&
          Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="mx-2 mb-2 h-12" />
          ))}
        {error && (
          <p role="alert" className="p-3 text-xs text-destructive">
            Couldn’t load keywords. {error.message}
          </p>
        )}
        {!isLoading && !error && !filtered?.length && (
          <p className="p-3 text-xs leading-relaxed text-ink-2">
            {search
              ? "No matching keywords."
              : "Add your first keyword to start collecting news."}
          </p>
        )}
        {filtered?.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            aria-current={selectedId === item.id ? "page" : undefined}
            className={cn(
              "group flex w-full items-start gap-2.5 rounded-md border border-transparent px-3 py-2.5 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selectedId === item.id
                ? "border-border bg-sidebar-accent text-foreground"
                : "text-ink-2 hover:bg-sidebar-accent/60 hover:text-foreground"
            )}
          >
            {isPolling(item.id) ? (
              <Loader2 className="mt-0.5 size-3.5 shrink-0 animate-spin text-primary" />
            ) : (
              <Hash
                className={cn(
                  "mt-0.5 size-3.5 shrink-0",
                  selectedId === item.id ? "text-primary" : "text-ink-3"
                )}
              />
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium">
                {item.keyword}
              </span>
              <span className="mt-1 block truncate text-[11px] text-ink-3">
                {isPolling(item.id)
                  ? "Collecting articles…"
                  : formatLastScraped(item.last_scraped)}
              </span>
            </span>
          </button>
        ))}
      </nav>
      <Link to="/datasets" className="mx-3 mb-3 rounded-md border border-border px-3 py-2 text-xs outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">Corpus &amp; datasets</Link>
      <footer className="flex shrink-0 items-center gap-2 border-t border-border p-3">
        <Link
          to="/profile"
          className="flex min-w-0 flex-1 items-center gap-2.5 rounded-md p-1 outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-xs font-semibold">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </span>
          <span className="truncate text-xs font-medium">
            {user?.username || "Profile"}
          </span>
        </Link>
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Log out"
          onClick={() => {
            logout()
            navigate("/login")
          }}
        >
          <LogOut className="size-3.5 text-ink-2" />
        </Button>
      </footer>
    </div>
  )
}
