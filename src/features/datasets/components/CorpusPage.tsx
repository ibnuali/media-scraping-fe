import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCorpus } from "../hooks/use-corpus"
import { CorpusAuditSection } from "./CorpusAuditSection"
import { CorpusVersionList } from "./CorpusVersionList"
import { SnapshotWorkbench } from "./SnapshotWorkbench"
import { DatasetFeedback } from "./DatasetFeedback"
import { CollectionPlanForm } from "./CollectionPlanForm"
import { ResearchAuditSection } from "./ResearchAuditSection"
import { CorpusSkeleton } from "./CorpusSkeleton"
export function CorpusPage() {
  const { versions, audit, analysis } = useCorpus()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState("")
  const visible =
    versions.data?.filter((v) =>
      `${v.title || ""} ${v.url} ${v.publication.status}`
        .toLowerCase()
        .includes(filter.toLowerCase())
    ) || []
  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  const analysisMessage = analysis.data
    ? analysis.data.status === "complete"
      ? "Analysis is available for this corpus version. The keyword news list retains its original projection."
      : `Analysis ${analysis.data.status}. ${analysis.data.error || "Stored article text is retained. Failed attempts can be retried up to the backend limit."}`
    : undefined
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Manage article versions and frozen research datasets. New collections
        and keyword deletion do not alter an existing snapshot.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          disabled={versions.isFetching || audit.isFetching}
          onClick={() => {
            void versions.refetch()
            void audit.refetch()
          }}
        >
          Refresh corpus
        </Button>
        <Button
          variant="ghost"
          disabled={!selected.size}
          onClick={() => setSelected(new Set())}
        >
          Clear selection
        </Button>
      </div>
      {(versions.isLoading || audit.isLoading) && <CorpusSkeleton />}
      <DatasetFeedback error={versions.error || audit.error} />
      {(versions.isError || audit.isError) && (
        <p className="text-xs text-muted-foreground">
          Check that the backend with dataset support and its database migration
          are deployed, then retry.
        </p>
      )}
      {audit.data && <CorpusAuditSection audit={audit.data} />}
      {versions.data && (
        <>
          <Input
            aria-label="Filter article versions"
            placeholder="Filter by title, URL or date status"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <DatasetFeedback
            error={analysis.error}
            message={
              analysis.isPending
                ? "Analyzing stored article text…"
                : analysisMessage
            }
          />
          <CorpusVersionList
            versions={visible}
            selected={selected}
            onToggle={toggle}
            onAnalyze={(id) => analysis.mutate(id)}
            analyzing={analysis.isPending}
          />
        </>
      )}
      <ResearchAuditSection />
      <CollectionPlanForm />
      <SnapshotWorkbench selected={selected} />
    </div>
  )
}
