import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { SnapshotEntry } from "@/types/dataset"
import type { EvidenceSpan, Judgment, ResearchQAInput } from "@/types/research"
import { researchApi } from "../research-api"
import { useResearchMutation, useResearchRecords } from "../hooks/use-research"
import { formText, validateResearchQA } from "../lib/research-contracts"
import { DatasetFeedback } from "./DatasetFeedback"
import { ResearchCheck, ResearchText } from "./ResearchFields"
import { ResearchQATimeFields } from "./ResearchQATimeFields"
import { ResearchJudgments } from "./ResearchJudgments"
export interface ResearchQAFormProps {
  snapshotId: string
  entries: SnapshotEntry[]
  span: EvidenceSpan
}
export function ResearchQAForm({
  snapshotId,
  entries,
  span,
}: ResearchQAFormProps) {
  const facts = useResearchRecords("fact")
  const save = useResearchMutation(researchApi.qa)
  const [judgments, setJudgments] = useState<Judgment[]>([])
  const [error, setError] = useState<string | null>(null)
  const availableFacts =
    facts.data?.filter((fact) =>
      entries.some((entry) => entry.version_id === fact.version_id)
    ) || []
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault()
        const form = new FormData(event.currentTarget)
        const input: ResearchQAInput = {
          snapshot_id: snapshotId,
          question: formText(form, "question"),
          gold_answer: formText(form, "gold_answer"),
          intent: formText(form, "intent") as ResearchQAInput["intent"],
          fact_type: formText(
            form,
            "fact_type"
          ) as ResearchQAInput["fact_type"],
          temporal_basis: formText(
            form,
            "temporal_basis"
          ) as ResearchQAInput["temporal_basis"],
          availability: formText(
            form,
            "availability"
          ) as ResearchQAInput["availability"],
          reference_at: formText(form, "reference_at") || null,
          target_start: formText(form, "target_start") || null,
          target_end: formText(form, "target_end") || null,
          false_premise: form.has("false_premise"),
          reviewed: form.has("reviewed"),
          fact_ids: form.getAll("fact_ids").map(String),
          judgments,
        }
        const problem = validateResearchQA(input, availableFacts, entries)
        setError(problem)
        if (!problem) save.mutate(input)
      }}
    >
      <ResearchText
        label="Question"
        name="question"
        maxLength={4000}
        required
      />
      <ResearchText
        label="Reference answer"
        name="gold_answer"
        maxLength={8000}
        required
      />
      <ResearchQATimeFields />
      <ResearchCheck name="false_premise">
        The question has a false premise (requires refutes evidence)
      </ResearchCheck>
      <fieldset className="space-y-2">
        <legend className="mb-2 text-xs font-medium">
          Facts from this snapshot
        </legend>
        <DatasetFeedback
          error={facts.error}
          message={facts.isPending ? "Loading facts…" : undefined}
        />
        {!facts.isPending && !availableFacts.length && (
          <p className="text-xs text-muted-foreground">
            Save at least one fact using the evidence passage above.
          </p>
        )}
        {availableFacts.map((fact) => (
          <ResearchCheck key={fact.id} name="fact_ids" value={fact.id}>
            {fact.entity} / {fact.attribute}: {fact.value} · {fact.verification}
          </ResearchCheck>
        ))}
      </fieldset>
      <ResearchJudgments
        span={span}
        judgments={judgments}
        onChange={setJudgments}
      />
      <ResearchCheck name="reviewed">
        I have reviewed the answer, temporal labels and evidence; all selected
        facts are human-verified
      </ResearchCheck>
      <Button disabled={save.isPending || facts.isPending || facts.isError}>
        Save research QA
      </Button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <DatasetFeedback
        error={save.error}
        message={
          save.data
            ? `Research QA saved: ${save.data.id} · ${save.data.review}`
            : undefined
        }
      />
    </form>
  )
}
