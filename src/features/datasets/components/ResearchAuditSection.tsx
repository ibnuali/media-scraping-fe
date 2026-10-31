import { Button } from "@/components/ui/button"
import { Panel, PanelBody, PanelHead } from "@/components/panel"
import { useResearchAudit } from "../hooks/use-research"
import { CorpusSkeleton } from "./CorpusSkeleton"
import { DatasetFeedback } from "./DatasetFeedback"
export function ResearchAuditSection() {
  const audit = useResearchAudit()
  const data = audit.data
  const metrics: Record<string, number> = data
    ? {
        "Unique articles": data.unique_articles,
        "Short texts": data.short_texts,
        "Missing quality reviews": data.quality_review_missing,
        "Verified quality reviews": data.verified_quality_reviews,
        "Fact groups": data.fact_groups,
        "Changing fact groups": data.changing_fact_groups,
        "Reviewed QA": data.reviewed_questions,
        "False-premise QA": data.false_premise_questions,
      }
    : {}
  const groups: Record<string, Record<string, number>> = data
    ? {
        "Languages (manual review)": data.languages,
        "Extraction reviews": data.quality_status,
        "QA intents": data.qa_intents,
        "Fact types": data.qa_fact_types,
        "Collection outcomes": data.collection_outcomes,
        "Relative suggestions": data.relative_suggestions,
        Topics: data.topics,
      }
    : {}
  return (
    <Panel>
      <PanelHead
        title="Thesis curation audit"
        actions={
          <Button
            size="sm"
            variant="outline"
            disabled={audit.isFetching}
            onClick={() => void audit.refetch()}
          >
            Refresh
          </Button>
        }
      />
      <PanelBody className="space-y-4">
        {audit.isPending && <CorpusSkeleton />}
        <DatasetFeedback error={audit.error} />
        {data && (
          <>
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {Object.entries(metrics).map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="mt-1 font-mono text-lg">{value}</dd>
                </div>
              ))}
            </dl>
            <details>
              <summary className="cursor-pointer text-sm">
                Review coverage and categories
              </summary>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {Object.entries(groups).map(([name, counts]) => (
                  <div key={name}>
                    <h3 className="text-sm font-medium">{name}</h3>
                    {!Object.keys(counts).length && (
                      <p className="text-xs text-muted-foreground">
                        No records yet.
                      </p>
                    )}
                    <dl>
                      {Object.entries(counts).map(([label, count]) => (
                        <div
                          key={label}
                          className="flex justify-between gap-3 border-b border-border py-1 text-xs"
                        >
                          <dt>{label}</dt>
                          <dd>{count}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </details>
            <p className="text-xs text-muted-foreground">{data.caveat}</p>
          </>
        )}
      </PanelBody>
    </Panel>
  )
}
