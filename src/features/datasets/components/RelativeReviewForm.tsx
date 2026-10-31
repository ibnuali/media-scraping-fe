import { Button } from "@/components/ui/button"
import type { RelativeSuggestion } from "@/types/research"
import { researchApi } from "../research-api"
import { useResearchMutation } from "../hooks/use-research"
import { formText } from "../lib/research-contracts"
import { ResearchCheck, ResearchField, ResearchText } from "./ResearchFields"
import { DatasetFeedback } from "./DatasetFeedback"
export interface RelativeReviewFormProps {
  suggestion: RelativeSuggestion
}
export function RelativeReviewForm({ suggestion }: RelativeReviewFormProps) {
  const save = useResearchMutation(researchApi.reviewRelative)
  return (
    <details>
      <summary className="cursor-pointer text-xs">
        Review normalized interval
      </summary>
      <form
        className="mt-3 space-y-3"
        onSubmit={(event) => {
          event.preventDefault()
          const form = new FormData(event.currentTarget)
          save.mutate({
            suggestion_id: suggestion.id,
            normalized_start: formText(form, "start"),
            normalized_end: formText(form, "end"),
            rationale: formText(form, "rationale"),
          })
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <ResearchField
            label="Normalized start"
            name="start"
            type="date"
            defaultValue={suggestion.normalized_start || ""}
            required
          />
          <ResearchField
            label="Normalized end"
            name="end"
            type="date"
            defaultValue={suggestion.normalized_end || ""}
            required
          />
        </div>
        <ResearchText
          label="Reason for this interpretation"
          name="rationale"
          maxLength={2000}
          required
        />
        <ResearchCheck required>
          I have checked the expression and its date anchor
        </ResearchCheck>
        <Button disabled={save.isPending}>Save human review</Button>
        <DatasetFeedback
          error={save.error}
          message={
            save.data ? `Human review saved: ${save.data.id}` : undefined
          }
        />
      </form>
    </details>
  )
}
