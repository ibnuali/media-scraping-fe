import type { JobLogResponse } from "@/types/keyword"
import { logText as text, safeLogUrl, searchEventLabels } from "../lib/job-log"
import { JobSearchLogDetails } from "./JobSearchLogDetails"

export interface JobLogItemProps {
  log: JobLogResponse
}

const stages: Record<string, string> = {
  searching: "Searching",
  scraping: "Scraping",
  analyzing: "Analysis",
  summarizing: "Combined summary",
  legacy: "Previous process",
}
const statuses: Record<string, string> = {
  info: "Info",
  success: "Successful",
  failed: "Failed",
  skipped: "Skipped",
}
const skipReasons: Record<string, string> = {
  duplicate: "Already saved",
  outside_date_range: "Outside publication date range",
  unknown_publication_date: "Publication date unavailable",
  already_analyzed: "Already analyzed",
  no_analyzed_articles: "No analyzed articles available",
}

export function JobLogItem({ log }: JobLogItemProps) {
  const title = text(log.payload.title)
  const summary = text(log.payload.summary)
  const content = text(log.payload.content) || text(log.payload.description)
  const sentiment = text(log.payload.sentiment)
  const skipReason = text(log.payload.skip_reason)
  const safeUrl = safeLogUrl(log.url)
  const searching = log.stage === "searching"
  const event = text(log.payload.event)
  const request = searching && event === "search_request"
  const eventLabel = searching ? searchEventLabels[event] : undefined
  const originalTimestamp = searching ? text(log.payload.timestamp) : ""
  const timestamp =
    originalTimestamp && Number.isFinite(Date.parse(originalTimestamp))
      ? originalTimestamp
      : log.created_at
  const date = new Date(timestamp)

  return (
    <li className="job-log-item" data-result={log.status}>
      <div className="job-log-item-meta">
        <time dateTime={timestamp} title={date.toLocaleString()}>
          {date.toLocaleTimeString([], {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            fractionalSecondDigits: 3,
          })}
        </time>
        <span className="job-log-result">
          {statuses[log.status] ?? log.status}
        </span>
        <span className="job-log-stage">{stages[log.stage] ?? log.stage}</span>
      </div>
      <div className="job-log-item-body">
        {!request && (
          <p className="job-log-item-title">
            {eventLabel ||
              title ||
              (log.stage === "summarizing"
                ? "Combined summary"
                : "Process result")}
          </p>
        )}
        {searching && title && eventLabel && <p>{title}</p>}
        {log.url && !request && (
          <p className="job-log-source">
            {safeUrl ? (
              <a
                href={safeUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={log.url}
              >
                {log.url}
              </a>
            ) : (
              log.url
            )}
          </p>
        )}
        {searching && (
          <JobSearchLogDetails
            payload={log.payload}
            url={request ? log.url : undefined}
          />
        )}
        {log.error && <p className="job-log-error">{log.error}</p>}
        {skipReason && <p>{skipReasons[skipReason] ?? skipReason}</p>}
        {(summary || content || sentiment) && (
          <details>
            <summary>View saved result</summary>
            {sentiment && <p>Sentiment: {sentiment}</p>}
            {summary && <p className="job-log-snapshot">{summary}</p>}
            {content && <p className="job-log-snapshot">{content}</p>}
          </details>
        )}
      </div>
    </li>
  )
}
