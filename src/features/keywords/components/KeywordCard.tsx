import {
  SearchCode,
  Play,
  MoreVertical,
  Pencil,
  Trash2,
  XCircle,
  Loader2,
  CheckCircle,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn, formatLastScraped } from "@/lib/utils"
import type { KeywordResponse } from "@/types/keyword"
import type { ScrapeJob } from "@/hooks/use-async-scrape"

interface KeywordCardProps {
  keyword: KeywordResponse
  scrapeJob?: ScrapeJob
  isScraping: boolean
  onEdit: (keyword: KeywordResponse) => void
  onDelete: (id: string) => void
  onScrape: (keyword: KeywordResponse) => void
  isDeleting: boolean
}

type Status = {
  icon: React.ReactNode
  label: string
  color: string
}

function getStatus(
  scrapeJob: ScrapeJob | undefined,
  isScraping: boolean
): Status | null {
  if (isScraping && scrapeJob) {
    switch (scrapeJob.stage) {
      case "searching":
        return {
          icon: <Loader2 className="size-3.5 animate-spin" />,
          label: "Searching",
          color: "text-primary",
        }
      case "scraping":
        return {
          icon: <Loader2 className="size-3.5 animate-spin" />,
          label: scrapeJob.progress
            ? `Scraping ${scrapeJob.progress.current}/${scrapeJob.progress.total}`
            : "Scraping",
          color: "text-warning",
        }
      case "analyzing":
        return {
          icon: <Loader2 className="size-3.5 animate-spin" />,
          label: scrapeJob.progress
            ? `Analyzing ${scrapeJob.progress.current}/${scrapeJob.progress.total}`
            : "Analyzing",
          color: "text-primary",
        }
      case "summarizing":
        return {
          icon: <Loader2 className="size-3.5 animate-spin" />,
          label: "Summarizing",
          color: "text-primary",
        }
      case "completed":
        return {
          icon: <CheckCircle className="size-3.5" />,
          label:
            scrapeJob?.kind === "analysis"
              ? "Analysis complete"
              : "Scrape complete",
          color: "text-success",
        }
      case "failed":
        return {
          icon: <XCircle className="size-3.5" />,
          label: scrapeJob.error || "Failed",
          color: "text-destructive",
        }
      default:
        return {
          icon: <Loader2 className="size-3.5 animate-spin" />,
          label:
            scrapeJob.kind === "analysis" ? "Analysis queued" : "Scrape queued",
          color: "text-ink-2",
        }
    }
  }

  if (scrapeJob?.status === "failed" || scrapeJob?.stage === "failed") {
    return {
      icon: <XCircle className="size-3.5" />,
      label: scrapeJob.error || "Failed",
      color: "text-destructive",
    }
  }

  if (scrapeJob?.stage === "completed") {
    return {
      icon: <CheckCircle className="size-3.5" />,
      label:
        scrapeJob?.kind === "analysis"
          ? "Analysis complete"
          : "Scrape complete",
      color: "text-success",
    }
  }

  return null
}

export function KeywordCard({
  keyword,
  scrapeJob,
  isScraping,
  onEdit,
  onDelete,
  onScrape,
  isDeleting,
}: KeywordCardProps) {
  const navigate = useNavigate()
  const status = getStatus(scrapeJob, isScraping)

  return (
    <div className="group flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 transition-colors duration-150 hover:border-primary/40">
      <button
        onClick={() =>
          navigate(`/keywords?keyword=${encodeURIComponent(keyword.id)}`)
        }
        className="flex min-w-0 flex-1 basis-40 items-center gap-3 rounded-md text-left focus-visible:outline-none"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <SearchCode className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-foreground">
            {keyword.keyword}
          </span>
          <span className="block truncate font-mono text-[11px] text-ink-3 tabular-nums">
            max {keyword.max_result} · {formatLastScraped(keyword.last_scraped)}
          </span>
        </span>
      </button>

      <div className="ml-auto flex max-w-full flex-wrap items-center gap-1.5">
        {status && (
          <span
            className={cn(
              "flex items-center gap-1.5 font-mono text-[11px] whitespace-nowrap",
              status.color
            )}
          >
            {status.icon}
            <span className="max-w-40 truncate">{status.label}</span>
          </span>
        )}
        {!isScraping && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onScrape(keyword)}
            className="gap-1.5 text-xs"
          >
            <Play className="size-3.5" />
            Scrape
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label={`Actions for ${keyword.keyword}`}
              >
                <MoreVertical className="size-4" />
              </Button>
            }
          />

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(keyword)}>
              <Pencil className="size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(keyword.id)}
              disabled={isDeleting}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
