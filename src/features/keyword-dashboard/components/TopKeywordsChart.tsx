import { Hash } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts"
import { useTheme } from "@/components/theme-provider"

interface TopKeywordData {
  keyword: string
  count: number
}

interface TopKeywordsChartProps {
  data: TopKeywordData[]
}

const COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"]

function getCSSVarColor(varName: string): string {
  if (typeof window === "undefined") return "#000"
  const style = getComputedStyle(document.documentElement)
  const value = style.getPropertyValue(varName).trim()
  return value || "#000"
}

function truncateKeyword(keyword: string, maxLength = 14) {
  return keyword.length > maxLength ? `${keyword.slice(0, maxLength)}...` : keyword
}

export function TopKeywordsChart({ data }: TopKeywordsChartProps) {
  const topData = data.slice(0, 5)
  const { theme } = useTheme()

  // Force re-render colors when theme changes
  const foregroundColor = getCSSVarColor("--foreground")
  const mutedColor = getCSSVarColor("--muted-foreground")

  if (topData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        <div className="text-center">
          <Hash className="mx-auto mb-2 size-8" />
          <p>No keyword matches found</p>
          <p className="text-sm">Scrape some articles to see top keywords</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={topData}
          layout="vertical"
          margin={{ top: 5, right: 50, left: 10, bottom: 5 }}
          barCategoryGap="25%"
        >
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fill: mutedColor, fontSize: 12 }}
            allowDecimals={false}
            domain={[0, 'auto']}
          />
          <YAxis
            dataKey="keyword"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{ fill: foregroundColor, fontSize: 13, fontWeight: 500 }}
            tickFormatter={(value) => truncateKeyword(value)}
            width={110}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24}>
            {topData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.85} />
            ))}
            <LabelList
              dataKey="count"
              position="right"
              fill={foregroundColor}
              fontSize={13}
              fontWeight={600}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}