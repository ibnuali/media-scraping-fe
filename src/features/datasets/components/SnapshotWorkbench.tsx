import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Panel, PanelHead, PanelBody } from "@/components/panel"
import { datasetsApi, downloadArtifact, parseManifest } from "../api"
import { DatasetFeedback } from "./DatasetFeedback"
import { TemporalSearchForm } from "./TemporalSearchForm"
import { ResearchWorkspace } from "./ResearchWorkspace"
import { AnnotationForm } from "./AnnotationForm"
export interface SnapshotWorkbenchProps {
  selected: Set<string>
}
export function SnapshotWorkbench({ selected }: SnapshotWorkbenchProps) {
  const [params, setParams] = useSearchParams()
  const snapshotId = params.get("snapshot") || ""
  const [codeVersion, setCodeVersion] = useState("")
  const [openId, setOpenId] = useState(snapshotId)
  const create = useMutation({
    mutationFn: () => datasetsApi.snapshot([...selected], codeVersion.trim()),
    onSuccess: (artifact) => {
      setParams({ snapshot: artifact.id })
      setOpenId(artifact.id)
      load.mutate(artifact.id)
    },
  })
  const load = useMutation({
    mutationFn: async (id: string) => {
      const text = await datasetsApi.export(id)
      return { id, text, manifest: parseManifest(text) }
    },
    onSuccess: (result) => setParams({ snapshot: result.id }),
  })
  const loaded = load.data?.id === snapshotId ? load.data : undefined
  return (
    <div className="space-y-4">
      <Panel>
        <PanelHead
          title="Dataset snapshots"
          hint="Immutable copies of selected versions and annotations."
        />
        <PanelBody className="space-y-4">
          <form
            className="flex flex-wrap items-end gap-3"
            onSubmit={(e) => {
              e.preventDefault()
              create.mutate()
            }}
          >
            <label className="min-w-48 flex-1 text-xs">
              Code version / Git SHA
              <Input
                className="mt-1"
                required
                maxLength={100}
                value={codeVersion}
                onChange={(e) => setCodeVersion(e.target.value)}
              />
            </label>
            <Button
              disabled={
                !selected.size ||
                selected.size > 10000 ||
                !codeVersion.trim() ||
                create.isPending
              }
            >
              Create snapshot ({selected.size})
            </Button>
          </form>
          <DatasetFeedback
            error={create.error}
            message={
              create.data
                ? `Snapshot created. Checksum: ${create.data.checksum}`
                : undefined
            }
          />
          <form
            className="flex flex-wrap items-end gap-3"
            onSubmit={(e) => {
              e.preventDefault()
              load.mutate(openId.trim())
            }}
          >
            <label className="min-w-48 flex-1 text-xs">
              Snapshot ID
              <Input
                required
                value={openId}
                onChange={(e) => setOpenId(e.target.value)}
                className="mt-1"
              />
            </label>
            <Button variant="outline" disabled={load.isPending}>
              Open snapshot
            </Button>
          </form>
          <p className="text-xs text-muted-foreground">
            Keep the snapshot ID or bookmark this page to reopen it. Loading a
            snapshot reads its full exported dataset.
          </p>
          <DatasetFeedback
            error={load.error}
            message={load.isPending ? "Loading snapshot…" : undefined}
          />
          {loaded && (
            <div className="space-y-3">
              <p className="text-xs break-all">
                {loaded.manifest.entries.length} versions · Checksum:{" "}
                {loaded.manifest.checksum}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    downloadArtifact(
                      loaded.text,
                      `snapshot-${snapshotId}.jsonl`
                    )
                  }
                >
                  Download JSONL
                </Button>
              </div>
            </div>
          )}
        </PanelBody>
      </Panel>
      {loaded && (
        <>
          <ResearchWorkspace
            key={snapshotId}
            snapshotId={snapshotId}
            entries={loaded.manifest.entries}
          />
          <AnnotationForm key={snapshotId} entries={loaded.manifest.entries} />
          <TemporalSearchForm key={snapshotId} snapshotId={snapshotId} />
        </>
      )}
    </div>
  )
}
