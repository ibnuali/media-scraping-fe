import { TrendingUp, Newspaper } from "lucide-react"

interface KeywordsStatsCardsProps {
  totalKeywords: number
  totalNews: number
}

export function KeywordsStatsCards({
  totalKeywords,
  totalNews,
}: Readonly<KeywordsStatsCardsProps>) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
      <div className="rounded-md border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md bg-primary">
            <TrendingUp className="size-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Keywords</p>
            <p className="font-mono text-xl font-bold">{totalKeywords}</p>
          </div>
        </div>
      </div>
      <div className="rounded-md border border-border bg-card p-4 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md bg-blue-500/10 text-blue-600">
            <Newspaper className="size-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total News</p>
            <p className="font-mono text-xl font-bold">{totalNews}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
