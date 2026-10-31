import { Newspaper, TrendingUp, TrendingDown, BrainCircuit } from "lucide-react"
import { StatBand } from "@/components/stat-band"

interface DashboardStatsCardsProps {
  pendingAnalysis: number
  totalArticles: number
  positiveSentiment: number
  negativeSentiment: number
}

export function DashboardStatsCards({
  pendingAnalysis,
  totalArticles,
  positiveSentiment,
  negativeSentiment,
}: DashboardStatsCardsProps) {
  return (
    <StatBand
      columns={4}
      stats={[
        {
          label: "Articles",
          value: totalArticles,
          icon: Newspaper,
          tone: "accent",
        },
        {
          label: "Not analyzed",
          value: pendingAnalysis,
          icon: BrainCircuit,
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
