import type { ResearchQARecord } from "@/types/research"
import { ResearchCheck } from "./ResearchFields"
export interface ResearchQASelectionProps {
  questions: ResearchQARecord[]
  selected: Set<string>
  onToggle: (id: string) => void
}
export function ResearchQASelection({
  questions,
  selected,
  onToggle,
}: ResearchQASelectionProps) {
  return (
    <>
      {questions.map((qa) => (
        <div key={qa.id} className="border-t border-border pt-2">
          <ResearchCheck
            disabled={qa.review !== "human-reviewed"}
            checked={selected.has(qa.id)}
            onChange={() => onToggle(qa.id)}
          >
            {qa.question} · {qa.intent} · {qa.review}
          </ResearchCheck>
          <details className="mt-1 text-xs">
            <summary className="cursor-pointer">Answer and judgments</summary>
            <p className="mt-2">{qa.gold_answer}</p>
            <p>
              {qa.temporal_basis} · {qa.availability} ·{" "}
              {qa.reference_at || "no reference timestamp"}
            </p>
            <p className="font-mono break-all">{qa.id}</p>
            <ul>
              {qa.judgments.map((item) => (
                <li key={`${item.version_id}:${item.start}:${item.end}`}>
                  {item.version_id} · {item.start}–{item.end} · {item.label}
                </li>
              ))}
            </ul>
          </details>
        </div>
      ))}
    </>
  )
}
