import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Panel, PanelBody, PanelHead } from "@/components/panel"
import type { SnapshotEntry } from "@/types/dataset"
import { datasetsApi } from "../api"
import { toEvidenceSpan } from "../lib/evidence"
import { DatasetFeedback } from "./DatasetFeedback"
export interface AnnotationFormProps {
  entries: SnapshotEntry[]
}
export function AnnotationForm({ entries }: AnnotationFormProps) {
  const [versionId, setVersionId] = useState(entries[0]?.version_id || "")
  const [span, setSpan] = useState({ start: 0, end: 0 })
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [verified, setVerified] = useState(false)
  const entry = entries.find((e) => e.version_id === versionId)
  const text = entry?.content || ""
  const selection = Array.from(text).slice(span.start, span.end).join("")
  const save = useMutation({
    mutationFn: () =>
      datasetsApi.annotate({
        version_id: versionId,
        ...span,
        event_start: startDate,
        event_end: endDate,
        verified,
      }),
  })
  return (
    <Panel>
      <PanelHead
        title="Event annotations"
        hint="Select a passage in the frozen article text."
      />
      <PanelBody>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            save.mutate()
          }}
        >
          <label className="block text-xs">
            Article version
            <select
              value={versionId}
              onChange={(e) => {
                setVersionId(e.target.value)
                setSpan({ start: 0, end: 0 })
                save.reset()
              }}
              className="mt-1 block w-full rounded-md border border-input bg-background p-2"
            >
              {entries.map((e) => (
                <option key={e.version_id} value={e.version_id}>
                  {e.title || e.url} · {e.version_id}
                </option>
              ))}
            </select>
          </label>
          <textarea
            aria-label="Article text; select a passage to annotate"
            readOnly
            value={text}
            className="h-56 w-full rounded-md border border-input bg-background p-3 text-sm"
            onSelect={(e) => {
              const target = e.currentTarget
              setSpan(
                toEvidenceSpan(text, target.selectionStart, target.selectionEnd)
              )
            }}
          />
          <p className="text-xs text-muted-foreground">
            Selected characters {span.start}–{span.end}:{" "}
            {selection || "Select a passage above."}
          </p>
          <div className="flex flex-wrap gap-3">
            <label className="text-xs">
              Event start
              <Input
                required
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label className="text-xs">
              Event end
              <Input
                required
                type="date"
                min={startDate}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
            />
            I have verified this event interval against the passage
          </label>
          <Button disabled={!selection || save.isPending}>
            Save annotation
          </Button>
          <DatasetFeedback
            error={save.error}
            message={
              save.isSuccess
                ? "Annotation saved. Create a new snapshot of these versions to include it in event retrieval."
                : undefined
            }
          />
        </form>
      </PanelBody>
    </Panel>
  )
}
