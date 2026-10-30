import { SearchCode, Newspaper } from "lucide-react"
import { StatBand } from "@/components/stat-band"

interface KeywordsStatsCardsProps {
  totalKeywords: number
  totalNews: number
}

export function KeywordsStatsCards({
  totalKeywords,
  totalNews,
}: Readonly<KeywordsStatsCardsProps>) {
  return (
    <StatBand
      columns={2}
      stats={[
        {
          label: "Keywords",
          value: totalKeywords,
          icon: SearchCode,
          tone: "accent",
        },
        {
          label: "Articles scraped",
          value: totalNews,
          icon: Newspaper,
        },
      ]}
    />
  )
}
