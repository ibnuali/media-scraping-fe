import { Button } from "@/components/ui/button"
import { Panel, PanelBody, PanelHead } from "@/components/panel"
import { researchApi } from "../research-api"
import { useResearchMutation, useResearchRecords } from "../hooks/use-research"
import { formLines, formText } from "../lib/research-contracts"
import { DatasetFeedback } from "./DatasetFeedback"
import { ResearchField, ResearchText, ResearchSelect } from "./ResearchFields"
export function CollectionPlanForm() {
  const save = useResearchMutation(researchApi.plan)
  const plans = useResearchRecords("collection_plan")
  const runs = useResearchRecords("collection_run")
  return (
    <Panel>
      <PanelHead
        title="Collection plans"
        hint="Plan sampling by topic and fact changes before collecting."
      />
      <PanelBody className="space-y-4">
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault()
            const form = new FormData(event.currentTarget)
            save.mutate({
              topic: formText(form, "topic"),
              entities: formLines(form, "entities"),
              attributes: formLines(form, "attributes"),
              queries: formLines(form, "queries"),
              source_domains: formLines(form, "source_domains"),
              start_date: formText(form, "start_date"),
              end_date: formText(form, "end_date"),
              window_days: Number(formText(form, "window_days")) as 1 | 7,
              cap: Number(formText(form, "cap")),
            })
          }}
        >
          <ResearchField label="Topic" name="topic" required maxLength={200} />
          <div className="grid gap-3 sm:grid-cols-2">
            <ResearchText
              label="Entities (one per line)"
              name="entities"
              required
            />
            <ResearchText
              label="Attributes that change (one per line)"
              name="attributes"
              required
            />
            <ResearchText
              label="Search queries (one per line)"
              name="queries"
              required
            />
            <ResearchText
              label="Source domains (optional, one per line)"
              name="source_domains"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            <ResearchField
              label="Start date"
              name="start_date"
              type="date"
              required
            />
            <ResearchField
              label="End date"
              name="end_date"
              type="date"
              required
            />
            <ResearchSelect
              label="Window days"
              name="window_days"
              options={["1", "7"]}
              defaultValue="7"
            />
            <ResearchField
              label="Result cap"
              name="cap"
              type="number"
              min={1}
              max={100}
              defaultValue={100}
              required
            />
          </div>
          <Button disabled={save.isPending}>Save collection plan</Button>
          <DatasetFeedback
            error={save.error}
            message={
              save.data
                ? `Plan saved: ${save.data.id}. An administrator can execute this plan.`
                : undefined
            }
          />
        </form>
        <p className="text-xs text-muted-foreground">
          Saving a plan does not start collection. Execution remains an
          administrator CLI/task operation.
        </p>
        <Button
          size="sm"
          variant="outline"
          disabled={plans.isFetching || runs.isFetching}
          onClick={() => {
            void plans.refetch()
            void runs.refetch()
          }}
        >
          Refresh plans and runs
        </Button>
        <DatasetFeedback
          error={plans.error || runs.error}
          message={
            plans.isPending || runs.isPending ? "Loading plans…" : undefined
          }
        />
        {plans.data?.length === 0 && (
          <p className="text-xs text-muted-foreground">
            No collection plans yet.
          </p>
        )}
        <ul className="space-y-3">
          {plans.data?.map((plan) => (
            <li key={plan.id} className="border-t border-border pt-3 text-xs">
              <p className="font-medium">
                {plan.topic} · {plan.start_date}–{plan.end_date}
              </p>
              <p className="mt-1 font-mono break-all">{plan.id}</p>
              <p className="mt-1 text-muted-foreground">
                {plan.queries.join("; ")} · {plan.window_days}-day windows · cap{" "}
                {plan.cap}
              </p>
              <p className="mt-1">
                {runs.data?.filter((run) => run.plan_id === plan.id).length ??
                  0}{" "}
                recorded runs
              </p>
              {runs.data
                ?.filter((run) => run.plan_id === plan.id)
                .map((run) => (
                  <p key={run.id} className="break-all text-muted-foreground">
                    Run {run.id}: {run.window_ids.length} window records
                  </p>
                ))}
            </li>
          ))}
        </ul>
      </PanelBody>
    </Panel>
  )
}
