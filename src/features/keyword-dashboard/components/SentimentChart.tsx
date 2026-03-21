import { Minus } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

const SENTIMENT_COLORS = {
  positive: "#10b981",
  negative: "#ef4444",
  neutral: "#64748b",
}

interface SentimentChartProps {
  positive: number
  negative: number
  neutral: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: {
      fill: string
    }
  }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0]
    const total = data.value
    return (
      <div className="rounded-lg border border-border/50 bg-background/95 px-3 py-2 shadow-lg backdrop-blur-sm">
        <p className="text-sm font-medium" style={{ color: data.payload.fill }}>
          {data.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {total} articles
        </p>
      </div>
    )
  }
  return null
}

export function SentimentChart({ positive, negative, neutral }: SentimentChartProps) {
  const total = positive + negative + neutral

  const data = [
    { name: "Positive", value: positive, fill: SENTIMENT_COLORS.positive },
    { name: "Negative", value: negative, fill: SENTIMENT_COLORS.negative },
    { name: "Neutral", value: neutral, fill: SENTIMENT_COLORS.neutral },
  ].filter(item => item.value > 0)

  if (total === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        <div className="text-center">
          <Minus className="mx-auto mb-2 size-8" />
          <p>No sentiment data available</p>
          <p className="text-sm">Scrape some articles to see analytics</p>
        </div>
      </div>
    )
  }

  const getPercentage = (value: number) => ((value / total) * 100).toFixed(0)

  return (
    <div className="h-64 flex items-center justify-center">
      <div className="relative">
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill}
                  className="transition-opacity hover:opacity-80"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold">{total}</span>
          <span className="text-xs text-muted-foreground">Total</span>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="ml-8 flex flex-col gap-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-3">
            <div
              className="size-3 rounded-full"
              style={{ backgroundColor: item.fill }}
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-xs text-muted-foreground">
                {item.value} ({getPercentage(item.value)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}