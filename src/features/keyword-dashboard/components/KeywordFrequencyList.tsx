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
    <div className="rounded-md border border-border bg-card p-4">
      <h2 className="mb-3 text-lg font-semibold">Keyword Frequency</h2>
      <div className="flex flex-wrap gap-2">
        {keywords.map((kw, index) => (
          <div
            key={index}
            className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5"
          >
            <span className="font-medium">{kw.keyword}</span>
            <span className="rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-xs font-medium text-primary">
              {kw.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
