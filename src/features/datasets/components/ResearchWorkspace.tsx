import { useState } from "react"
import { Panel, PanelBody, PanelHead } from "@/components/panel"
import type { SnapshotEntry } from "@/types/dataset"
import type { EvidenceSpan } from "@/types/research"
import { ResearchPassagePicker } from "./ResearchPassagePicker"
import { FactForm } from "./FactForm"
import { QualityReviewForm } from "./QualityReviewForm"
import { RelativeTimeSection } from "./RelativeTimeSection"
import { ResearchQAForm } from "./ResearchQAForm"
import { ResearchBenchmarkSection } from "./ResearchBenchmarkSection"
export interface ResearchWorkspaceProps {
  entries: SnapshotEntry[]
  snapshotId: string
}
export function ResearchWorkspace({
  entries,
  snapshotId,
}: ResearchWorkspaceProps) {
  const [span, setSpan] = useState<EvidenceSpan>({
    version_id: entries[0]?.version_id || "",
    start: 0,
    end: 0,
  })
  if (!entries.length)
    return (
      <Panel>
        <PanelBody>
          No article text in this snapshot. Create a snapshot containing article
          versions to curate evidence.
        </PanelBody>
      </Panel>
    )
  return (
    <Panel>
      <PanelHead
        title="Thesis evidence & benchmark"
        hint="Select evidence, curate facts and labels, then freeze reviewed QA."
      />
      <PanelBody className="space-y-4">
        <ResearchPassagePicker
          entries={entries}
          span={span}
          onChange={setSpan}
        />
        <details className="border-t border-border pt-3" open>
          <summary className="mb-3 cursor-pointer text-sm font-medium">
            1. Fact changes and validity
          </summary>
          <FactForm key={span.version_id} span={span} />
        </details>
        <details className="border-t border-border pt-3">
          <summary className="mb-3 cursor-pointer text-sm font-medium">
            2. Article quality and language
          </summary>
          <QualityReviewForm
            key={span.version_id}
            versionId={span.version_id}
          />
        </details>
        <details className="border-t border-border pt-3">
          <summary className="mb-3 cursor-pointer text-sm font-medium">
            3. Relative-time suggestions and human review
          </summary>
          <RelativeTimeSection
            span={span}
            publicationValid={
              entries.find((entry) => entry.version_id === span.version_id)
                ?.publication.status === "valid"
            }
          />
        </details>
        <details className="border-t border-border pt-3">
          <summary className="mb-3 cursor-pointer text-sm font-medium">
            4. Research QA and relevance judgments
          </summary>
          <ResearchQAForm
            snapshotId={snapshotId}
            entries={entries}
            span={span}
          />
        </details>
        <details className="border-t border-border pt-3">
          <summary className="mb-3 cursor-pointer text-sm font-medium">
            5. Freeze and export development/test benchmark
          </summary>
          <ResearchBenchmarkSection snapshotId={snapshotId} />
        </details>
      </PanelBody>
    </Panel>
  )
}
