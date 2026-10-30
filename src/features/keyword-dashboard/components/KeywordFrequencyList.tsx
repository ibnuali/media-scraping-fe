import { Panel, PanelBody, PanelHead } from "@/components/panel"

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
    <Panel>
      <PanelHead title="Keyword frequency" hint="top matched terms" />
      <PanelBody className="flex flex-wrap gap-1.5">
        {keywords.map((kw) => (
          <span
            key={kw.keyword}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1"
          >
            <span className="text-[13px] text-foreground">{kw.keyword}</span>
            <span className="rounded-[3px] bg-primary/10 px-1.5 font-mono text-[11px] font-medium tabular-nums text-primary">
              {kw.count}
            </span>
          </span>
        ))}
      </PanelBody>
    </Panel>
  )
}
