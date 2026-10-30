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

interface TopKeywordData {
  keyword: string
  count: number
}

interface TopKeywordsChartProps {
  data: TopKeywordData[]
}

// Token-driven so the bars follow the active theme.
const BAR_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
]

function truncateKeyword(keyword: string, maxLength = 14) {
  return keyword.length > maxLength
    ? `${keyword.slice(0, maxLength)}…`
    : keyword
}

export function TopKeywordsChart({ data }: TopKeywordsChartProps) {
  const topData = data.slice(0, 5)

  if (topData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <Hash className="mx-auto mb-2 size-7 text-ink-3" />
          <p className="text-[13px] text-ink-2">No matched keywords yet</p>
          <p className="mt-1 font-mono text-[11px] text-ink-3">
            scrape some articles to see top terms
          </p>
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
          margin={{ top: 4, right: 40, left: 0, bottom: 4 }}
          barCategoryGap="25%"
        >
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-ink-3)", fontSize: 11 }}
            allowDecimals={false}
            domain={[0, "auto"]}
          />
          <YAxis
            dataKey="keyword"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-ink-2)", fontSize: 12 }}
            tickFormatter={(value) => truncateKeyword(value)}
            width={108}
          />
          <Bar dataKey="count" radius={[0, 3, 3, 0]} barSize={22}>
            {topData.map((entry, index) => (
              <Cell
                key={entry.keyword}
                fill={BAR_COLORS[index % BAR_COLORS.length]}
              />
            ))}
            <LabelList
              dataKey="count"
              position="right"
              fill="var(--color-foreground)"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
