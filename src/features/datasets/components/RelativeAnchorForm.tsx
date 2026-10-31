import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { EvidenceSpan, RelativeInput } from "@/types/research"
import { researchApi } from "../research-api"
import { useResearchMutation } from "../hooks/use-research"
import { formText } from "../lib/research-contracts"
import { ResearchField, ResearchSelect } from "./ResearchFields"
import { DatasetFeedback } from "./DatasetFeedback"
export interface RelativeAnchorFormProps {
  span: EvidenceSpan
}
export function RelativeAnchorForm({ span }: RelativeAnchorFormProps) {
  const [anchor, setAnchor] = useState<EvidenceSpan | null>(null)
  const manual = useResearchMutation(researchApi.relative)
  return (
    <details>
      <summary className="cursor-pointer text-sm">
        Supply a date anchor manually
      </summary>
      <form
        className="mt-3 space-y-3"
        onSubmit={(event) => {
          event.preventDefault()
          if (!anchor) return
          const form = new FormData(event.currentTarget)
          manual.mutate({
            ...span,
            anchor_evidence: anchor,
            anchor_date: formText(form, "anchor_date"),
            anchor_source: formText(
              form,
              "anchor_source"
            ) as RelativeInput["anchor_source"],
          })
        }}
      >
        <p className="text-xs text-muted-foreground">
          Select the passage supporting the date anchor, pin it, then select the
          relative expression above.
        </p>
        <Button
          type="button"
          variant="outline"
          disabled={span.end <= span.start}
          onClick={() => setAnchor({ ...span })}
        >
          Pin selected passage as anchor evidence
        </Button>
        {anchor && (
          <p className="text-xs break-all">
            Pinned anchor: {anchor.version_id} · {anchor.start}–{anchor.end}
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <ResearchField
            label="Anchor date"
            name="anchor_date"
            type="date"
            required
          />
          <ResearchSelect
            label="Anchor source"
            name="anchor_source"
            options={["text", "publication"]}
          />
        </div>
        <Button
          disabled={!anchor || span.end <= span.start || manual.isPending}
        >
          Save relative-time suggestion
        </Button>
        <DatasetFeedback
          error={manual.error}
          message={
            manual.data
              ? `Suggestion saved: ${manual.data.id} · ${manual.data.status}`
              : undefined
          }
        />
      </form>
    </details>
  )
}
