import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import type { BenchmarkRecord } from "@/types/research"
import { researchApi } from "../research-api"
import { downloadArtifact } from "../api"
import { DatasetFeedback } from "./DatasetFeedback"
export interface ResearchBenchmarkListProps {
  artifacts: BenchmarkRecord[]
  loaded: boolean
}
export function ResearchBenchmarkList({
  artifacts,
  loaded,
}: ResearchBenchmarkListProps) {
  const download = useMutation({
    mutationFn: async (id: string) => {
      const artifact = await researchApi.exportBenchmark(id)
      downloadArtifact(
        JSON.stringify(artifact, null, 2),
        `benchmark-${id}.json`,
        "application/json"
      )
    },
  })
  return (
    <div className="space-y-3">
      <DatasetFeedback error={download.error} />
      {loaded && !artifacts.length && (
        <p className="text-xs text-muted-foreground">
          No frozen benchmarks for this snapshot.
        </p>
      )}
      <ul className="space-y-3">
        {artifacts.map((item) => (
          <li
            key={item.id}
            className="space-y-2 border-t border-border pt-3 text-xs"
          >
            <p className="font-mono break-all">{item.id}</p>
            <p className="break-all">Checksum: {item.checksum}</p>
            <details>
              <summary className="cursor-pointer">QA split assignments</summary>
              <dl>
                {Object.entries(item.splits).map(([id, partition]) => (
                  <div
                    key={id}
                    className="flex flex-wrap justify-between gap-2"
                  >
                    <dt className="break-all">{id}</dt>
                    <dd>{partition}</dd>
                  </div>
                ))}
              </dl>
            </details>
            {item.warnings.map((warning) => (
              <p className="text-warning" key={warning}>
                {warning}
              </p>
            ))}
            <Button
              size="sm"
              variant="outline"
              disabled={download.isPending}
              onClick={() => download.mutate(item.id)}
            >
              Download benchmark JSON
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
