import { Search } from "lucide-react"

export function KeywordsEmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/30 p-16 text-center">
      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-muted/50">
        <Search className="size-8 text-muted-foreground/50" />
      </div>
      <h3 className="text-lg font-semibold">No keywords yet</h3>
      <p className="mt-1 text-muted-foreground">
        Click "Add Keyword" to create your first keyword
      </p>
    </div>
  )
}