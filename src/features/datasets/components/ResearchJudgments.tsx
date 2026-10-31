import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { EvidenceSpan, Judgment } from "@/types/research"
import { ResearchSelect } from "./ResearchFields"
export interface ResearchJudgmentsProps {
  span: EvidenceSpan
  judgments: Judgment[]
  onChange: (judgments: Judgment[]) => void
}
export function ResearchJudgments({
  span,
  judgments,
  onChange,
}: ResearchJudgmentsProps) {
  const [label, setLabel] = useState<Judgment["label"]>("supports")
  const same = (item: Judgment) =>
    item.version_id === span.version_id &&
    item.start === span.start &&
    item.end === span.end
  return (
    <div className="space-y-3">
      <ResearchSelect
        label="Relevance of the selected passage"
        value={label}
        onChange={(e) => setLabel(e.target.value as Judgment["label"])}
        options={["supports", "refutes", "wrong_time", "irrelevant"]}
      />
      <Button
        type="button"
        variant="outline"
        disabled={span.end <= span.start}
        onClick={() =>
          onChange([
            ...judgments.filter((item) => !same(item)),
            { ...span, label },
          ])
        }
      >
        Add / replace passage judgment
      </Button>
      <p className="text-xs text-muted-foreground">
        Select passages in any snapshot article to add multiple judgments.
        False-premise questions need refuting evidence; other questions need
        supporting evidence.
      </p>
      <ul className="space-y-2">
        {judgments.map((item) => (
          <li
            key={`${item.version_id}:${item.start}:${item.end}`}
            className="flex flex-wrap items-center gap-2 text-xs"
          >
            <span className="min-w-0 flex-1 break-all">
              {item.version_id} · {item.start}–{item.end} · {item.label}
            </span>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() =>
                onChange(judgments.filter((candidate) => candidate !== item))
              }
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
