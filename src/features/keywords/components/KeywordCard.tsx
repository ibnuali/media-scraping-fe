import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pencil,
  Trash2,
  Loader2,
  XCircle,
  MoreVertical,
  BarChart3,
  Play,
  Search,
  FileText,
  Sparkles,
  CheckCircle,
} from "lucide-react"
import { formatLastScraped } from "@/lib/utils"
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

function getStageInfo(
  stage: ScrapeJob["stage"],
  progress: { current: number; total: number } | null
) {
  switch (stage) {
    case "searching":
      return {
        icon: <Search className="size-3.5 animate-pulse" />,
        label: "Searching...",
        color: "text-blue-500",
      }
    case "scraping":
      return {
        icon: <FileText className="size-3.5 animate-pulse" />,
        label: progress
          ? `Scraping ${progress.current}/${progress.total}`
          : "Scraping...",
        color: "text-amber-500",
      }
    case "analyzing":
      return {
        icon: <Sparkles className="size-3.5 animate-pulse" />,
        label: progress
          ? `Analyzing ${progress.current}/${progress.total}`
          : "Analyzing...",
        color: "text-purple-500",
      }
    case "summarizing":
      return {
        icon: <FileText className="size-3.5 animate-pulse" />,
        label: "Summarizing...",
        color: "text-cyan-500",
      }
    case "completed":
      return {
        icon: <CheckCircle className="size-3.5" />,
        label: "Done",
        color: "text-green-500",
      }
    case "failed":
      return {
        icon: <XCircle className="size-3.5" />,
        label: "Failed",
        color: "text-destructive",
      }
    default:
      // No stage yet - waiting for job to start
      return {
        icon: <Loader2 className="size-3.5 animate-spin" />,
        label: "Starting...",
        color: "text-muted-foreground",
      }
  }
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

  const getScrapeStatus = () => {
    if (isScraping && scrapeJob) {
      const stageInfo = getStageInfo(scrapeJob.stage, scrapeJob.progress)
      return {
        icon: stageInfo.icon,
        label: stageInfo.label,
        color: stageInfo.color,
      }
    }
    if (scrapeJob?.status === "failed" || scrapeJob?.stage === "failed") {
      return {
        icon: <XCircle className="size-3.5 text-destructive" />,
        label: scrapeJob.error || "Failed",
        color: "text-destructive",
      }
    }
    if (scrapeJob?.stage === "completed") {
      return {
        icon: <CheckCircle className="size-3.5 text-green-500" />,
        label: "Done",
        color: "text-green-500",
      }
    }
    return null
  }

  const status = getScrapeStatus()

  return (
    <div className="group flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-card/50 px-4 py-3 backdrop-blur-sm transition-colors hover:bg-muted/50">
      {/* Left: Keyword info */}
      <button
        onClick={() => navigate(`/keywords/${keyword.id}`)}
        className="flex flex-1 items-center gap-3 text-left"
      >
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <BarChart3 className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{keyword.keyword}</p>
          <p className="text-xs text-muted-foreground">
            Max {keyword.max_result} • {formatLastScraped(keyword.last_scraped)}
          </p>
        </div>
      </button>

      {/* Right: Status + Actions */}
      <div className="flex items-center gap-2">
        {/* Scrape status or Scrape button */}
        {status ? (
          <div className={`flex items-center gap-1.5 text-xs ${status.color}`}>
            {status.icon}
            <span>{status.label}</span>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onScrape(keyword)}
            className="h-8 gap-1.5 text-xs"
          >
            <Play className="size-3.5" />
            Scrape
          </Button>
        )}

        {/* More actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                className="opacity-0 group-hover:opacity-100"
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
