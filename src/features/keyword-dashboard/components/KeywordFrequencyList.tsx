interface KeywordFrequencyItem {
  keyword: string
  count: number
}

interface KeywordFrequencyListProps {
  keywords: KeywordFrequencyItem[]
}

export function KeywordFrequencyList({ keywords }: KeywordFrequencyListProps) {
  if (keywords.length === 0) return null

  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
      <h2 className="mb-4 text-lg font-semibold">Keyword Frequency</h2>
      <div className="flex flex-wrap gap-2">
        {keywords.map((kw, index) => (
          <div
            key={index}
            className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2"
          >
            <span className="font-medium">{kw.keyword}</span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {kw.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
