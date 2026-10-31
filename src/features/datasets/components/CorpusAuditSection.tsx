import { Panel, PanelBody, PanelHead } from "@/components/panel"
import type { CorpusAudit } from "@/types/dataset"
export interface CorpusAuditSectionProps {
  audit: CorpusAudit
}
export function CorpusAuditSection({ audit }: CorpusAuditSectionProps) {
  const metrics = [
    ["Versions", audit.versions],
    ["Uncertain dates", audit.uncertain_dates],
    ["Missing dates", audit.missing_dates],
    ["Invalid dates", audit.invalid_dates],
    ["Conflicting dates", audit.conflicting_dates],
    ["Extraction needs review", audit.unusable],
    ["Duplicate groups", audit.duplicates.length],
  ] as const
  return (
    <Panel>
      <PanelHead
        title="Corpus audit"
        hint="Counts refer to retained versions, not distinct stories."
      />
      <PanelBody>
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {metrics.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="mt-1 font-mono text-lg">{value}</dd>
            </div>
          ))}
        </dl>
        <details className="mt-4 text-sm">
          <summary className="cursor-pointer">
            Publisher and publication coverage (WIB)
          </summary>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {[audit.publishers, audit.periods].map((counts, i) => (
              <dl key={i} className="max-h-64 overflow-auto">
                {Object.entries(counts)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between gap-3 border-b border-border py-1"
                    >
                      <dt>{label}</dt>
                      <dd className="font-mono">{value}</dd>
                    </div>
                  ))}
              </dl>
            ))}
          </div>
        </details>
      </PanelBody>
    </Panel>
  )
}
