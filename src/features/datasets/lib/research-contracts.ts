import type { FactRecord, ResearchQAInput } from "@/types/research"
import type { SnapshotEntry } from "@/types/dataset"
export const formText = (form: FormData, name: string) =>
  String(form.get(name) ?? "").trim()
export const formLines = (form: FormData, name: string) =>
  formText(form, name)
    .split(/\r?\n/)
    .map((value) => value.trim())
    .filter(Boolean)
export function hasTimezone(value: string) {
  return /(Z|[+-]\d{2}:\d{2})$/.test(value) && !Number.isNaN(Date.parse(value))
}
export function validateResearchQA(
  input: ResearchQAInput,
  facts: FactRecord[],
  entries: SnapshotEntry[]
) {
  if (!input.question.trim() || !input.gold_answer.trim())
    return "Question and reference answer are required."
  if (input.fact_ids.length > 100) return "Select at most 100 facts."
  if (input.judgments.length > 1000) return "Use at most 1,000 judgments."
  if (!input.fact_ids.length)
    return "Select at least one fact from this snapshot."
  if (input.reference_at && !hasTimezone(input.reference_at))
    return "Reference time must include Z or a timezone offset."
  if (
    (input.intent === "implicit" || input.availability === "observed_as_of") &&
    !input.reference_at
  )
    return "This intent or availability mode requires a reference time."
  if (input.intent === "explicit" && !input.target_start && !input.target_end)
    return "Explicit intent requires a target date bound."
  if (
    input.target_start &&
    input.target_end &&
    input.target_start > input.target_end
  )
    return "Target dates are reversed."
  const versionIds = new Set(entries.map((entry) => entry.version_id))
  const chosen = facts.filter((fact) => input.fact_ids.includes(fact.id))
  if (
    chosen.length !== input.fact_ids.length ||
    chosen.some((fact) => !versionIds.has(fact.version_id))
  )
    return "Facts must belong to this snapshot."
  if (
    input.reviewed &&
    chosen.some((fact) => fact.verification !== "human-verified")
  )
    return "Reviewed QA requires human-verified facts."
  const required = input.false_premise ? "refutes" : "supports"
  if (!input.judgments.some((item) => item.label === required))
    return `Add ${required} evidence for this answer.`
  const spans = new Set<string>()
  for (const item of input.judgments) {
    const entry = entries.find((entry) => entry.version_id === item.version_id)
    if (
      !entry ||
      !Number.isInteger(item.start) ||
      !Number.isInteger(item.end) ||
      item.start < 0 ||
      item.end <= item.start ||
      item.end > Array.from(entry.content).length
    )
      return "Evidence must be a valid passage from this snapshot."
    const key = `${item.version_id}:${item.start}:${item.end}`
    if (spans.has(key))
      return "A passage cannot have duplicate or conflicting labels."
    spans.add(key)
  }
  if (input.availability === "observed_as_of") {
    const used = new Set([
      ...chosen.map((fact) => fact.version_id),
      ...input.judgments.map((item) => item.version_id),
    ])
    if (
      entries.some(
        (entry) =>
          used.has(entry.version_id) &&
          (!entry.fetched_at ||
            !hasTimezone(entry.fetched_at) ||
            Date.parse(entry.fetched_at) > Date.parse(input.reference_at!))
      )
    )
      return "All evidence must have been collected by the reference time."
  }
  return null
}
