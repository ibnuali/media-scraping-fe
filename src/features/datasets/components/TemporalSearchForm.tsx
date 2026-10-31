import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Panel, PanelBody, PanelHead } from "@/components/panel"
import type { RetrievalParams } from "@/types/dataset"
import { datasetsApi } from "../api"
import { DatasetFeedback } from "./DatasetFeedback"
export interface TemporalSearchFormProps {
  snapshotId: string
}
export function TemporalSearchForm({ snapshotId }: TemporalSearchFormProps) {
  const [params, setParams] = useState<RetrievalParams>({
    query: "",
    semantics: "publication",
  })
  const search = useMutation({
    mutationFn: (request: RetrievalParams) =>
      datasetsApi.retrieve(snapshotId, request),
  })
  function update(key: keyof RetrievalParams, value: string) {
    setParams((current) => ({ ...current, [key]: value }))
  }
  const badTimezone =
    !!params.as_of &&
    (!/(Z|[+-]\d{2}:\d{2})$/.test(params.as_of) ||
      Number.isNaN(Date.parse(params.as_of)))
  return (
    <Panel>
      <PanelHead
        title="Temporal retrieval"
        hint="Lexical baseline · publication or human-verified event evidence · dates in WIB"
      />
      <PanelBody className="space-y-4">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            search.mutate({ ...params })
          }}
        >
          <label className="block text-xs">
            Query
            <Input
              required
              value={params.query}
              onChange={(e) => update("query", e.target.value)}
            />
          </label>
          <label className="block text-xs">
            Time semantics
            <select
              value={params.semantics}
              onChange={(e) => update("semantics", e.target.value)}
              className="mt-1 rounded-md border border-input bg-background p-2"
            >
              <option value="publication">Publication</option>
              <option value="event">Verified event</option>
            </select>
          </label>
          <div className="flex flex-wrap gap-3">
            <label className="text-xs">
              From (inclusive)
              <Input
                type="date"
                value={params.start || ""}
                onChange={(e) => update("start", e.target.value)}
              />
            </label>
            <label className="text-xs">
              Until (inclusive)
              <Input
                type="date"
                min={params.start}
                value={params.end || ""}
                onChange={(e) => update("end", e.target.value)}
              />
            </label>
          </div>
          <label className="block text-xs">
            Available as of (optional, with timezone)
            <Input
              placeholder="2025-01-31T23:59:59+07:00"
              value={params.as_of || ""}
              onChange={(e) => update("as_of", e.target.value)}
            />
          </label>
          {badTimezone && (
            <p role="alert" className="text-xs text-destructive">
              Enter an ISO timestamp with Z or a timezone offset.
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Unknown or conflicting publication dates are excluded. “Available as
            of” excludes versions collected after that instant.
          </p>
          <Button
            disabled={search.isPending || !params.query.trim() || badTimezone}
          >
            Search snapshot
          </Button>
        </form>
        <DatasetFeedback
          error={search.error}
          message={
            search.isSuccess && !search.data.length
              ? "No evidence matched the query and time constraints."
              : search.isPending
                ? "Searching…"
                : undefined
          }
        />
        {search.isSuccess && (
          <ul className="space-y-4">
            {search.data.map((hit) => (
              <li
                key={`${hit.version_id}:${hit.start}`}
                className="space-y-2 border-t border-border pt-4"
              >
                <p className="font-mono text-xs break-all text-muted-foreground">
                  {hit.version_id} · {hit.start}–{hit.end} · score {hit.score}
                </p>
                <p className="text-sm whitespace-pre-wrap">{hit.text}</p>
              </li>
            ))}
          </ul>
        )}
      </PanelBody>
    </Panel>
  )
}
