import { Button } from "@/components/ui/button"
import type { EvidenceSpan } from "@/types/research"
import { researchApi } from "../research-api"
import { useResearchMutation, useResearchRecords } from "../hooks/use-research"
import { RelativeAnchorForm } from "./RelativeAnchorForm"
import { DatasetFeedback } from "./DatasetFeedback"
import { RelativeReviewForm } from "./RelativeReviewForm"
export interface RelativeTimeSectionProps {
  span: EvidenceSpan
  publicationValid: boolean
}
export function RelativeTimeSection({
  span,
  publicationValid,
}: RelativeTimeSectionProps) {
  const extract = useResearchMutation(researchApi.extractRelative)
  const suggestions = useResearchRecords("relative_time")
  const reviews = useResearchRecords("relative_review")
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Extraction creates unreviewed suggestions using the validated
        publication date. A human review is stored separately.
      </p>
      <Button
        variant="outline"
        disabled={!publicationValid || extract.isPending}
        onClick={() => extract.mutate(span.version_id)}
      >
        Extract relative-time suggestions
      </Button>
      {!publicationValid && (
        <p className="text-xs text-muted-foreground">
          Automatic extraction needs a valid publication date. You can supply a
          text anchor below.
        </p>
      )}
      <DatasetFeedback
        error={extract.error}
        message={
          extract.data
            ? `${extract.data.length} suggestions returned for the selected article.`
            : undefined
        }
      />
      <RelativeAnchorForm span={span} />
      <DatasetFeedback
        error={suggestions.error || reviews.error}
        message={
          suggestions.isPending || reviews.isPending
            ? "Loading suggestions and reviews…"
            : undefined
        }
      />
      {suggestions.data &&
        !suggestions.data.some(
          (item) => item.version_id === span.version_id
        ) && (
          <p className="text-xs text-muted-foreground">
            No relative-time suggestions for this article.
          </p>
        )}
      <ul className="space-y-4">
        {suggestions.data
          ?.filter((item) => item.version_id === span.version_id)
          .map((item) => (
            <li
              key={item.id}
              className="space-y-2 border-t border-border pt-3 text-xs"
            >
              <p className="font-medium">
                “{item.text}” · {item.status}
              </p>
              <p>
                Anchor: {item.anchor_date} ({item.anchor_source}) · suggested{" "}
                {item.normalized_start || "unknown"}–
                {item.normalized_end || "unknown"}
              </p>
              <p className="text-muted-foreground">{item.verification}</p>
              <RelativeReviewForm suggestion={item} />
              {reviews.data
                ?.filter((review) => review.suggestion_id === item.id)
                .map((review) => (
                  <blockquote
                    key={review.id}
                    className="border-l border-border pl-3"
                  >
                    Human review: {review.normalized_start}–
                    {review.normalized_end}
                    <p>{review.rationale}</p>
                  </blockquote>
                ))}
            </li>
          ))}
      </ul>
    </div>
  )
}
