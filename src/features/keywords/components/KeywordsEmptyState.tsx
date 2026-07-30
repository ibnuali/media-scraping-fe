import { Search } from "lucide-react"

export function KeywordsEmptyState() {
  return (
    <div className="rounded-md border border-dashed border-border bg-card p-10 text-center">
      <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-md bg-muted/50">
        <Search className="size-6 text-muted-foreground/50" />
      </div>
      <h3 className="text-lg font-semibold">No keywords yet</h3>
      <p className="mt-1 text-muted-foreground">
        Click "Add Keyword" to create your first keyword
      </p>
    </div>
  )
}
