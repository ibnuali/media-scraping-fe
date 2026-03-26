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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
      <div className="hover-lift rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
            <TrendingUp className="size-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Keywords</p>
            <p className="text-2xl font-bold">{totalKeywords}</p>
          </div>
        </div>
      </div>
      <div className="hover-lift rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
            <Newspaper className="size-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total News</p>
            <p className="text-2xl font-bold">{totalNews}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
