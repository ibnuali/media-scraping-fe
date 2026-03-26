import { TrendingUp, TrendingDown, Newspaper } from "lucide-react"

interface DashboardStatsCardsProps {
  totalArticles: number
  positiveSentiment: number
  negativeSentiment: number
}

export function DashboardStatsCards({
  totalArticles,
  positiveSentiment,
  negativeSentiment,
}: DashboardStatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="hover-lift rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
            <Newspaper className="size-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Articles</p>
            <p className="text-2xl font-bold">{totalArticles}</p>
          </div>
        </div>
      </div>

      <div className="hover-lift rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
            <TrendingUp className="size-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Positive</p>
            <p className="text-2xl font-bold">{positiveSentiment}</p>
          </div>
        </div>
      </div>

      <div className="hover-lift rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-red-500/10 text-red-600">
            <TrendingDown className="size-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Negative</p>
            <p className="text-2xl font-bold">{negativeSentiment}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
