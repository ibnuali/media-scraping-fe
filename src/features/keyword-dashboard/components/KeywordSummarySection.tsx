import { Loader2, RefreshCw, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Panel, PanelBody, PanelHead } from "@/components/panel"
import type { KeywordResponse } from "@/types/keyword"

interface KeywordSummarySectionProps {
  keyword: KeywordResponse
  isGenerating: boolean
  canGenerate: boolean
  onRegenerate: () => void
}

export function KeywordSummarySection({
  keyword,
  isGenerating,
  canGenerate,
  onRegenerate,
}: KeywordSummarySectionProps) {
  const hasSummary = !!keyword.keyword_summary

  return (
    <Panel>
      <PanelHead
        title="Keyword summary"
        hint={hasSummary ? "generated from analyzed articles" : "not generated"}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            disabled={isGenerating || !canGenerate}
            className="gap-1.5"
          >
            {isGenerating ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <RefreshCw className="size-3.5" />
            )}
            {hasSummary ? "Regenerate" : "Generate"}
          </Button>
        }
      />
      <PanelBody>
        {isGenerating && !hasSummary ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Loader2 className="mb-3 size-6 animate-spin text-ink-3" />
            <p className="font-mono text-[11px] text-ink-3">
              generating summary…
            </p>
          </div>
        ) : hasSummary ? (
          <p className="max-w-prose text-sm leading-relaxed whitespace-pre-wrap text-ink-2">
            {keyword.keyword_summary}
          </p>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="mb-3 size-7 text-ink-3" />
            <p className="text-[13px] text-ink-2">No summary yet</p>
            <p className="mt-1 font-mono text-[11px] text-ink-3">
              run optional sentiment analysis to generate a summary
            </p>
          </div>
        )}
      </PanelBody>
    </Panel>
  )
}
