import { Newspaper, TrendingUp, TrendingDown } from "lucide-react"
import { StatBand } from "@/components/stat-band"

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
    <StatBand
      columns={3}
      stats={[
        {
          label: "Articles",
          value: totalArticles,
          icon: Newspaper,
          tone: "accent",
        },
        {
          label: "Positive",
          value: positiveSentiment,
          icon: TrendingUp,
          tone: "success",
        },
        {
          label: "Negative",
          value: negativeSentiment,
          icon: TrendingDown,
          tone: "danger",
        },
      ]}
    />
  )
}
