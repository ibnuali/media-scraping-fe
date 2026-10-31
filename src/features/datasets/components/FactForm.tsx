import { Button } from "@/components/ui/button"
import type { EvidenceSpan } from "@/types/research"
import { researchApi } from "../research-api"
import { useResearchMutation, useResearchRecords } from "../hooks/use-research"
import { formText } from "../lib/research-contracts"
import { ResearchCheck, ResearchField, ResearchText } from "./ResearchFields"
import { DatasetFeedback } from "./DatasetFeedback"
export interface FactFormProps {
  span: EvidenceSpan
}
export function FactForm({ span }: FactFormProps) {
  const save = useResearchMutation(researchApi.fact)
  const facts = useResearchRecords("fact")
  return (
    <div className="space-y-3">
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault()
          const form = new FormData(event.currentTarget)
          save.mutate({
            ...span,
            topic: formText(form, "topic"),
            entity: formText(form, "entity"),
            attribute: formText(form, "attribute"),
            value: formText(form, "value"),
            valid_from: formText(form, "valid_from") || null,
            valid_until: formText(form, "valid_until") || null,
            verified: form.has("verified"),
          })
        }}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {["topic", "entity", "attribute"].map((name) => (
            <ResearchField
              key={name}
              label={name}
              name={name}
              maxLength={200}
              required
            />
          ))}
        </div>
        <ResearchText
          label="Fact value supported by the selected passage"
          name="value"
          maxLength={2000}
          required
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <ResearchField
            label="Valid from (optional)"
            name="valid_from"
            type="date"
          />
          <ResearchField
            label="Valid until (optional)"
            name="valid_until"
            type="date"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Empty validity bounds mean unknown. Use consistent entity and
          attribute names across revisions.
        </p>
        <ResearchCheck name="verified">
          I have verified the fact, passage and validity bounds
        </ResearchCheck>
        <Button disabled={span.end <= span.start || save.isPending}>
          Save fact
        </Button>
        <DatasetFeedback
          error={save.error}
          message={
            save.data
              ? `Fact saved: ${save.data.id} · ${save.data.verification}`
              : undefined
          }
        />
      </form>
      <DatasetFeedback
        error={facts.error}
        message={facts.isPending ? "Loading facts…" : undefined}
      />
      <ul className="space-y-2">
        {facts.data
          ?.filter((fact) => fact.version_id === span.version_id)
          .map((fact) => (
            <li key={fact.id} className="border-t border-border pt-2 text-xs">
              <p>
                {fact.entity} / {fact.attribute}: {fact.value}
              </p>
              <p className="text-muted-foreground">
                {fact.valid_from || "unknown"}–{fact.valid_until || "unknown"} ·{" "}
                {fact.verification}
              </p>
              <blockquote className="mt-1">{fact.text}</blockquote>
              <p className="font-mono break-all">{fact.id}</p>
            </li>
          ))}
      </ul>
    </div>
  )
}
