import { Minus } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const SENTIMENT_COLORS = {
  positive: "var(--color-success)",
  negative: "var(--color-destructive)",
  neutral: "var(--color-ink-3)",
} as const

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
    payload: { fill: string }
  }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className="rounded-md border border-border bg-popover px-3 py-2">
        <p
          className="text-[13px] font-medium"
          style={{ color: data.payload.fill }}
        >
          {data.name}
        </p>
        <p className="font-mono text-[11px] text-ink-2 tabular-nums">
          {data.value} articles
        </p>
      </div>
    )
  }
  return null
}

export function SentimentChart({
  positive,
  negative,
  neutral,
}: SentimentChartProps) {
  const total = positive + negative + neutral

  const data = [
    { name: "Positive", value: positive, fill: SENTIMENT_COLORS.positive },
    { name: "Negative", value: negative, fill: SENTIMENT_COLORS.negative },
    { name: "Neutral", value: neutral, fill: SENTIMENT_COLORS.neutral },
  ].filter((item) => item.value > 0)

  if (total === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <Minus className="mx-auto mb-2 size-7 text-ink-3" />
          <p className="text-[13px] text-ink-2">No sentiment data yet</p>
          <p className="mt-1 font-mono text-[11px] text-ink-3">
            run optional sentiment analysis to see analytics
          </p>
        </div>
      </div>
    )
  }

  const percentage = (value: number) => ((value / total) * 100).toFixed(0)

  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-8 py-4 sm:flex-row">
      <div className="relative">
        <ResponsiveContainer width={180} height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={82}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-semibold tabular-nums">
            {total}
          </span>
          <span className="font-mono text-[11px] text-ink-3">analyzed</span>
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {data.map((item) => (
          <li key={item.name} className="flex items-center gap-2.5">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.fill }}
            />
            <span>
              <span className="block text-[13px] font-medium text-foreground">
                {item.name}
              </span>
              <span className="block font-mono text-[11px] text-ink-3 tabular-nums">
                {item.value} · {percentage(item.value)}%
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
