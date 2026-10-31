import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { BenchmarkInput } from "@/types/research"
import { researchApi } from "../research-api"
import { useResearchMutation, useResearchRecords } from "../hooks/use-research"
import { formText } from "../lib/research-contracts"
import { ResearchBenchmarkList } from "./ResearchBenchmarkList"
import { DatasetFeedback } from "./DatasetFeedback"
import { ResearchQASelection } from "./ResearchQASelection"
import { ResearchField, ResearchSelect } from "./ResearchFields"
export interface ResearchBenchmarkSectionProps {
  snapshotId: string
}
export function ResearchBenchmarkSection({
  snapshotId,
}: ResearchBenchmarkSectionProps) {
  const questions = useResearchRecords("research_qa")
  const benchmarks = useResearchRecords("benchmark")
  const freeze = useResearchMutation(researchApi.benchmark)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const current =
    questions.data?.filter((qa) => qa.snapshot_id === snapshotId) || []
  const eligible = current.filter(
    (qa) => qa.review === "human-reviewed" && selected.has(qa.id)
  )
  const artifacts =
    benchmarks.data?.filter((item) => item.config.snapshot_id === snapshotId) ||
    []
  return (
    <div className="space-y-4">
      <Button
        size="sm"
        variant="outline"
        disabled={questions.isFetching || benchmarks.isFetching}
        onClick={() => {
          void questions.refetch()
          void benchmarks.refetch()
        }}
      >
        Refresh QA and benchmarks
      </Button>
      <DatasetFeedback
        error={questions.error || benchmarks.error}
        message={
          questions.isPending || benchmarks.isPending
            ? "Loading QA and benchmarks…"
            : undefined
        }
      />
      {questions.isSuccess && !current.length && (
        <p className="text-xs text-muted-foreground">
          No research QA for this snapshot yet.
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Draft QA remains unreviewed. To verify a draft, submit a new QA after
        reviewing its facts and judgments.
      </p>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault()
          const form = new FormData(event.currentTarget)
          freeze.mutate({
            snapshot_id: snapshotId,
            qa_ids: eligible.map((item) => item.id),
            split_policy: formText(
              form,
              "split_policy"
            ) as BenchmarkInput["split_policy"],
            seed: formText(form, "seed"),
            dev_percent: Number(formText(form, "dev_percent")),
          })
        }}
      >
        <fieldset className="space-y-3">
          <legend className="mb-2 text-xs font-medium">
            Select reviewed QA for this benchmark
          </legend>
          <ResearchQASelection
            questions={current}
            selected={selected}
            onToggle={(id) =>
              setSelected((previous) => {
                const next = new Set(previous)
                if (next.has(id)) next.delete(id)
                else next.add(id)
                return next
              })
            }
          />
        </fieldset>
        <div className="grid gap-3 sm:grid-cols-3">
          <ResearchSelect
            label="Group split by"
            name="split_policy"
            options={["fact", "topic"]}
          />
          <ResearchField
            label="Seed"
            name="seed"
            defaultValue="thesis-v1"
            maxLength={100}
            required
          />
          <ResearchField
            label="Development percent"
            name="dev_percent"
            type="number"
            min={1}
            max={99}
            defaultValue={30}
            required
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Fact/source/duplicate components stay together. The actual dev/test
          ratio may differ; add independent evidence groups if one partition is
          empty.
        </p>
        <Button
          disabled={
            !eligible.length ||
            eligible.length > 10000 ||
            freeze.isPending ||
            questions.isError
          }
        >
          Freeze benchmark ({eligible.length})
        </Button>
        <DatasetFeedback
          error={freeze.error}
          message={
            freeze.data
              ? `Benchmark frozen: ${freeze.data.id} · checksum ${freeze.data.checksum}`
              : undefined
          }
        />
        {freeze.data?.warnings.map((warning) => (
          <p role="status" key={warning} className="text-xs text-warning">
            {warning}
          </p>
        ))}
      </form>
      <ResearchBenchmarkList
        artifacts={artifacts}
        loaded={benchmarks.isSuccess}
      />
    </div>
  )
}
