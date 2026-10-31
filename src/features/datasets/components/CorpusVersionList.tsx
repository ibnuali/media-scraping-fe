import { Button } from "@/components/ui/button"
import { Panel, PanelHead } from "@/components/panel"
import type { CorpusVersion } from "@/types/dataset"
export interface CorpusVersionListProps {
  versions: CorpusVersion[]
  selected: Set<string>
  onToggle: (id: string) => void
  onAnalyze: (id: string) => void
  analyzing: boolean
}
export function CorpusVersionList({
  versions,
  selected,
  onToggle,
  onAnalyze,
  analyzing,
}: CorpusVersionListProps) {
  return (
    <Panel>
      <PanelHead
        title="Article versions"
        hint={`${selected.size} selected · snapshots retain exact versions`}
      />
      {!versions.length && (
        <p className="p-4 text-sm text-muted-foreground">
          No corpus versions yet. Run a keyword scrape after the backend
          migration.
        </p>
      )}
      <ul>
        {versions.map((version) => (
          <li
            key={version.id}
            className="flex items-start gap-3 border-t border-border p-4"
          >
            <input
              type="checkbox"
              className="mt-1"
              aria-label={`Select ${version.title || version.url}`}
              checked={selected.has(version.id)}
              onChange={() => onToggle(version.id)}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium break-words">
                {version.title || version.url}
              </p>
              <p className="mt-1 text-xs break-all text-muted-foreground">
                {version.published_by || version.url}
              </p>
              <p className="mt-2 text-xs">
                Publication: {version.publication.status} ·{" "}
                {version.publication.precision || "unknown precision"} ·
                Extraction: {version.quality_status}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Collected:{" "}
                {version.fetched_at
                  ? new Date(version.fetched_at).toLocaleString("id-ID", {
                      timeZone: "Asia/Jakarta",
                    }) + " WIB"
                  : "unknown"}
              </p>
              <details className="mt-2 text-xs">
                <summary className="cursor-pointer">
                  Date evidence and version ID
                </summary>
                <p className="mt-2 font-mono break-all">{version.id}</p>
                <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap">
                  {JSON.stringify(version.publication, null, 2)}
                </pre>
              </details>
            </div>
            <Button
              size="sm"
              variant="outline"
              disabled={analyzing}
              onClick={() => onAnalyze(version.id)}
            >
              Analyze
            </Button>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
