import { SearchCode, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface KeywordsEmptyStateProps {
  onAdd: () => void
}

export function KeywordsEmptyState({ onAdd }: KeywordsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-border bg-card px-6 py-14 text-center">
      <span className="mb-4 flex size-11 items-center justify-center rounded-lg border border-border bg-background">
        <SearchCode className="size-5 text-primary" />
      </span>
      <h3 className="text-sm font-semibold tracking-tight text-foreground">
        No keywords yet
      </h3>
      <p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-ink-2">
        Add a term to track. KeyCrawl scrapes the news behind it and keeps a
        summary up to date.
      </p>
      <Button onClick={onAdd} className="mt-5 gap-1.5">
        <Plus className="size-4" />
        Add keyword
      </Button>
    </div>
  )
}
