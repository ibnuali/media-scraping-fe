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
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-md border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md bg-blue-500/10 text-blue-600">
            <Newspaper className="size-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Articles</p>
            <p className="font-mono text-xl font-bold">{totalArticles}</p>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md bg-green-500/10 text-green-600">
            <TrendingUp className="size-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Positive</p>
            <p className="font-mono text-xl font-bold">{positiveSentiment}</p>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md bg-red-500/10 text-red-600">
            <TrendingDown className="size-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Negative</p>
            <p className="font-mono text-xl font-bold">{negativeSentiment}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
