import { ResearchField, ResearchSelect } from "./ResearchFields"
export function ResearchQATimeFields() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <ResearchSelect
        label="Temporal intent"
        name="intent"
        options={["explicit", "implicit", "none"]}
      />
      <ResearchSelect
        label="Fact type"
        name="fact_type"
        options={["slow_changing", "fast_changing", "never_changing"]}
      />
      <ResearchSelect
        label="Temporal basis"
        name="temporal_basis"
        options={["publication", "event", "fact_validity"]}
      />
      <ResearchSelect
        label="Evidence availability"
        name="availability"
        options={["retrospective", "observed_as_of"]}
      />
      <ResearchField
        label="Target start (explicit intent requires a bound)"
        name="target_start"
        type="date"
      />
      <ResearchField label="Target end" name="target_end" type="date" />
      <ResearchField
        label="Reference timestamp (required for implicit / observed as of)"
        name="reference_at"
        placeholder="2025-01-31T23:59:59+07:00"
      />
    </div>
  )
}
