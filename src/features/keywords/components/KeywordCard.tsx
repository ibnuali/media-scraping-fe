import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Clock, ArrowRight, Loader2, CheckCircle, XCircle, Calendar, BarChart3 } from "lucide-react"
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

  const getScrapeButtonContent = () => {
    if (isScraping) {
      return (
        <>
          <Loader2 className="size-4 animate-spin" />
          {scrapeJob?.progress
            ? `${scrapeJob.progress.current}/${scrapeJob.progress.total}`
            : scrapeJob?.status || "Starting..."}
        </>
      )
    }
    if (scrapeJob?.status === "completed") {
      return (
        <>
          <CheckCircle className="size-4 text-green-500" />
          Completed ({scrapeJob.progress?.total || 0} results)
        </>
      )
    }
    if (scrapeJob?.status === "failed") {
      return (
        <>
          <XCircle className="size-4 text-destructive" />
          Failed
        </>
      )
    }
    return (
      <>
        <Clock className="size-4" />
        Scrape Now
      </>
    )
  }

  return (
    <div className="group hover-lift rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="truncate text-lg font-semibold">{keyword.keyword}</h3>
          <p className="text-sm text-muted-foreground">Max {keyword.max_result} results</p>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3" />
            <span>Last scraped: {formatLastScraped(keyword.last_scraped)}</span>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onEdit(keyword)}
            className="opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onDelete(keyword.id)}
            disabled={isDeleting}
            className="text-destructive opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onScrape(keyword)}
          className="h-10 w-full rounded-xl"
        >
          {getScrapeButtonContent()}
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/keywords/${keyword.id}`)}
            className="h-10 rounded-xl"
          >
            <BarChart3 className="size-4" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/keywords/${keyword.id}/news`)}
            className="group/btn h-10 rounded-xl"
          >
            View News
            <ArrowRight className="ml-1 size-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}