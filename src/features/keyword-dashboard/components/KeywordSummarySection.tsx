import { Loader2, RefreshCw, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { KeywordResponse } from "@/types/keyword"

interface KeywordSummarySectionProps {
  keyword: KeywordResponse
  isGenerating: boolean
  onRegenerate: () => void
}

export function KeywordSummarySection({
  keyword,
  isGenerating,
  onRegenerate,
}: KeywordSummarySectionProps) {
  const hasSummary = !!keyword.keyword_summary

  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="size-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Keyword Summary</h2>
          {isGenerating && (
            <span className="ml-2 flex items-center gap-1 text-xs text-muted-foreground">
              <Loader2 className="size-3 animate-spin" />
              Generating...
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 size-4" />
              {hasSummary ? "Regenerate" : "Generate"}
            </>
          )}
        </Button>
      </div>

      {isGenerating && !hasSummary ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Loader2 className="mb-3 size-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Generating summary...</p>
        </div>
      ) : hasSummary ? (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
            {keyword.keyword_summary}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <FileText className="mb-3 size-12 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No summary available yet.
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            Scrape some articles first, then generate a summary.
          </p>
        </div>
      )}
    </div>
  )
}
