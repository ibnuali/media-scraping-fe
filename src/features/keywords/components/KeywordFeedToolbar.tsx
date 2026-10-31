import { Link } from "react-router-dom"
import {
  BarChart3,
  Hash,
  Loader2,
  MoreHorizontal,
  PanelLeft,
  Pencil,
  Play,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationBell } from "@/features/notifications"
import type { KeywordResponse } from "@/types/keyword"

export interface KeywordFeedToolbarProps {
  keyword: KeywordResponse | null
  isScraping: boolean
  isDeleting: boolean
  onOpenSidebar: () => void
  onEdit: () => void
  onDelete: () => void
  onScrape: () => void
}

export function KeywordFeedToolbar({
  keyword,
  isScraping,
  isDeleting,
  onOpenSidebar,
  onEdit,
  onDelete,
  onScrape,
}: KeywordFeedToolbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4 sm:px-6">
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={onOpenSidebar}
        aria-label="Open keywords"
      >
        <PanelLeft className="size-4" />
      </Button>
      <Hash className="hidden size-4 shrink-0 text-ink-3 md:block" />
      <h1 className="min-w-0 flex-1 truncate text-sm font-semibold">
        {keyword?.keyword ?? "News workspace"}
      </h1>
      <div className="flex shrink-0 items-center gap-2">
        {keyword && (
          <>
            <Button size="sm" onClick={onScrape} disabled={isScraping}>
              {isScraping ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Play className="size-3.5" />
              )}
              {isScraping ? "Scraping…" : "Scrape"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Keyword options"
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  render={<Link to={`/keywords/${keyword.id}`} />}
                >
                  <BarChart3 className="size-4" />
                  View analytics
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil className="size-4" />
                  Edit keyword
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={isDeleting}
                  onClick={onDelete}
                  className="text-destructive"
                >
                  <Trash2 className="size-4" />
                  Delete keyword
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
        <span className="h-4 border-l border-border" />
        <NotificationBell />
      </div>
    </header>
  )
}
