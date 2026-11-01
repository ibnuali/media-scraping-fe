import { logNumber, logText, safeLogUrl } from "../lib/job-log"

export interface JobSearchLogDetailsProps {
  payload: Record<string, unknown>
  url?: string
}

const sources: Record<string, string> = { google: "Google", bing: "Bing" }
const phases: Record<string, string> = {
  rss: "RSS feed",
  decoding: "URL decoding",
  web_search: "Web search",
}
const countLabels = [
  ["entries", "Entries"],
  ["accepted", "Accepted"],
  ["outside_date_range", "Outside date range"],
  ["unresolved_urls", "Unresolved URLs"],
  ["total", "Results found"],
  ["partial_results", "Partial results"],
  ["page", "Page"],
  ["attempt", "Attempt"],
] as const

export function JobSearchLogDetails({
  payload,
  url,
}: JobSearchLogDetailsProps) {
  const event = logText(payload.event)
  const method = logText(payload.method)
  const httpStatus = logNumber(payload.http_status)
  const elapsed = logNumber(payload.elapsed_ms)
  const source = logText(payload.source)
  const phase = logText(payload.phase)
  const query = logText(payload.query)
  const message = logText(payload.message)
  const resolvedUrl = safeLogUrl(payload.resolved_url)
  const requestUrl = safeLogUrl(url)
  const counts = countLabels.flatMap(([key, label]) => {
    const value = logNumber(payload[key])
    return value === undefined ? [] : [{ label, value }]
  })
  const results = Array.isArray(payload.new_results)
    ? payload.new_results.flatMap((value: unknown) => {
        if (!value || typeof value !== "object") return []
        const result = value as Record<string, unknown>
        const title = logText(result.title)
        const url = logText(result.url)
        return title || url ? [{ title, url }] : []
      })
    : []

  return (
    <div className="job-search-details">
      {(method ||
        event === "search_request" ||
        source ||
        phase ||
        elapsed != null) && (
        <p className="job-search-request">
          {method && (
            <>
              <span className="job-search-method">{method}</span>{" "}
            </>
          )}
          {url && (
            <>
              {requestUrl ? (
                <a
                  href={requestUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={url}
                >
                  {url}
                </a>
              ) : (
                <span>{url}</span>
              )}{" "}
            </>
          )}
          {event === "search_request" && (
            <span className="job-search-http">
              {httpStatus == null ? "No HTTP response" : `HTTP ${httpStatus}`}
            </span>
          )}
          {elapsed != null && (
            <>
              {" "}
              <span className="job-search-context">{elapsed} ms</span>
            </>
          )}
          {source && (
            <>
              {" "}
              <span className="job-search-context">
                {sources[source] ?? source}
              </span>
            </>
          )}
          {phase && (
            <>
              {" "}
              <span className="job-search-context">
                {phases[phase] ?? phase}
              </span>
            </>
          )}
        </p>
      )}
      {query && <p>Query: {query}</p>}
      {message && <p>{message}</p>}
      {counts.length > 0 && (
        <dl className="job-search-counts">
          {counts.map(({ label, value }) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {resolvedUrl && (
        <p>
          Resolved URL:{" "}
          <a href={resolvedUrl} target="_blank" rel="noopener noreferrer">
            {resolvedUrl}
          </a>
        </p>
      )}
      {results.length > 0 && (
        <details>
          <summary>View discovered articles ({results.length})</summary>
          <ul className="job-search-results">
            {results.map((result) => {
              const url = safeLogUrl(result.url)
              return (
                <li key={result.url || result.title}>
                  {url ? (
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {result.title || result.url}
                    </a>
                  ) : (
                    <span>{result.title || result.url}</span>
                  )}
                </li>
              )
            })}
          </ul>
        </details>
      )}
    </div>
  )
}
