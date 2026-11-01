export function logText(value: unknown): string {
  return typeof value === "string" ? value : ""
}

export function logNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined
}

export function safeLogUrl(value: unknown): string | undefined {
  const url = logText(value)
  try {
    const parsed = new URL(url)
    return parsed.protocol === "https:" || parsed.protocol === "http:"
      ? url
      : undefined
  } catch {
    return undefined
  }
}

export const searchEventLabels: Record<string, string> = {
  started: "Search started",
  google_search: "Searching news",
  google_results: "Search results found",
  search_request: "HTTP request",
  search_source: "Search source results",
  search_resolution: "Article URL resolution",
  search_warning: "Search warning",
}
