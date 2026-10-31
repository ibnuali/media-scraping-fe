import type { SnapshotEntry } from "@/types/dataset"
import type { EvidenceSpan } from "@/types/research"
import { toEvidenceSpan } from "../lib/evidence"
export interface ResearchPassagePickerProps {
  entries: SnapshotEntry[]
  span: EvidenceSpan
  onChange: (span: EvidenceSpan) => void
}
export function ResearchPassagePicker({
  entries,
  span,
  onChange,
}: ResearchPassagePickerProps) {
  const text =
    entries.find((entry) => entry.version_id === span.version_id)?.content || ""
  return (
    <div className="space-y-3">
      <label className="block text-xs">
        Evidence article
        <select
          value={span.version_id}
          onChange={(e) =>
            onChange({ version_id: e.target.value, start: 0, end: 0 })
          }
          className="mt-1 block w-full rounded-md border border-input bg-background p-2"
        >
          {entries.map((entry) => (
            <option key={entry.version_id} value={entry.version_id}>
              {entry.title || entry.url} · {entry.version_id}
            </option>
          ))}
        </select>
      </label>
      <textarea
        aria-label="Select a passage as research evidence"
        readOnly
        value={text}
        className="h-56 w-full rounded-md border border-input bg-background p-3 text-sm"
        onSelect={(e) =>
          onChange({
            version_id: span.version_id,
            ...toEvidenceSpan(
              text,
              e.currentTarget.selectionStart,
              e.currentTarget.selectionEnd
            ),
          })
        }
      />
      <p className="text-xs text-muted-foreground">
        Selected characters {span.start}–{span.end}:{" "}
        {Array.from(text).slice(span.start, span.end).join("") ||
          "Select a passage above."}
      </p>
    </div>
  )
}
