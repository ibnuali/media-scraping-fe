import { Button } from "@/components/ui/button"
import type { QualityInput } from "@/types/research"
import { researchApi } from "../research-api"
import { useResearchMutation, useResearchRecords } from "../hooks/use-research"
import { formText } from "../lib/research-contracts"
import { ResearchCheck, ResearchSelect, ResearchText } from "./ResearchFields"
import { DatasetFeedback } from "./DatasetFeedback"
export interface QualityReviewFormProps {
  versionId: string
}
export function QualityReviewForm({ versionId }: QualityReviewFormProps) {
  const save = useResearchMutation(researchApi.quality)
  const reviews = useResearchRecords("quality_review")
  return (
    <div className="space-y-3">
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault()
          const form = new FormData(event.currentTarget)
          save.mutate({
            version_id: versionId,
            language: formText(form, "language") as QualityInput["language"],
            extraction: formText(
              form,
              "extraction"
            ) as QualityInput["extraction"],
            source_use: formText(
              form,
              "source_use"
            ) as QualityInput["source_use"],
            notes: formText(form, "notes"),
            verified: form.has("verified"),
          })
        }}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <ResearchSelect
            label="Language"
            name="language"
            options={["unknown", "id", "other"]}
          />
          <ResearchSelect
            label="Extraction"
            name="extraction"
            options={["unknown", "usable", "truncated", "noise"]}
          />
          <ResearchSelect
            label="Source use"
            name="source_use"
            options={["unknown", "full_text", "metadata_and_quotes"]}
          />
        </div>
        <ResearchText
          label="Review notes"
          name="notes"
          maxLength={4000}
          required
        />
        <ResearchCheck name="verified">
          I have verified this quality assessment
        </ResearchCheck>
        <Button disabled={save.isPending}>Save quality review</Button>
        <DatasetFeedback
          error={save.error}
          message={
            save.data ? `Quality review saved: ${save.data.id}` : undefined
          }
        />
      </form>
      <DatasetFeedback
        error={reviews.error}
        message={reviews.isPending ? "Loading quality reviews…" : undefined}
      />
      <ul className="space-y-2">
        {reviews.data
          ?.filter((review) => review.version_id === versionId)
          .map((review) => (
            <li key={review.id} className="border-t border-border pt-2 text-xs">
              {review.language} · {review.extraction} · {review.source_use} ·{" "}
              {review.verified ? "human-verified" : "unreviewed"}
              <p className="mt-1">{review.notes}</p>
            </li>
          ))}
      </ul>
    </div>
  )
}
