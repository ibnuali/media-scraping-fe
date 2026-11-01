import assert from "node:assert/strict"
import { after, before, test } from "node:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { createServer } from "vite"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

let server
let JobLogItem
let keywordsApi
let JobLogDialog

before(async () => {
  server = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "error",
  })
  ;({ JobLogItem } = await server.ssrLoadModule(
    "/src/features/keywords/components/JobLogItem.tsx"
  ))
  ;({ keywordsApi } = await server.ssrLoadModule("/src/lib/api.ts"))
  ;({ JobLogDialog } = await server.ssrLoadModule(
    "/src/features/keywords/components/JobLogDialog.tsx"
  ))
})

test("minimized logs expose separate restore and close buttons", () => {
  const html = renderToStaticMarkup(
    createElement(
      QueryClientProvider,
      { client: new QueryClient() },
      createElement(JobLogDialog, {
        target: { id: "keyword-1", keyword: "electric vehicles" },
        open: false,
        onOpenChange: () => {},
        onClose: () => {},
      })
    )
  )
  assert.ok(html.includes('aria-label="Close logs"'))
  assert.ok(
    html.includes('aria-label="Open scraping logs for electric vehicles"')
  )
  assert.equal((html.match(/<button\b/g) ?? []).length, 2)
  assert.doesNotMatch(html, /<button[^>]*>(?:(?!<\/button>)[\s\S])*<button/)
})

test("job history uses the persisted per-keyword endpoint and pagination", async () => {
  const originalFetch = globalThis.fetch
  const originalStorage = globalThis.localStorage
  let requestedUrl
  const response = {
    total: 21,
    limit: 20,
    offset: 20,
    has_more: false,
    items: [],
  }
  globalThis.localStorage = { getItem: () => null }
  globalThis.fetch = async (url) => {
    requestedUrl = new URL(url)
    return new Response(JSON.stringify(response))
  }
  try {
    assert.equal(typeof keywordsApi.getJobHistory, "function")
    assert.deepEqual(
      await keywordsApi.getJobHistory("keyword-1", 20, 20),
      response
    )
    assert.equal(requestedUrl.pathname, "/keywords/keyword-1/jobs")
    assert.equal(requestedUrl.searchParams.get("limit"), "20")
    assert.equal(requestedUrl.searchParams.get("offset"), "20")
  } finally {
    globalThis.fetch = originalFetch
    globalThis.localStorage = originalStorage
  }
})

after(async () => {
  await server?.close()
})

function render(overrides = {}) {
  return renderToStaticMarkup(
    createElement(JobLogItem, {
      log: {
        id: "log-1",
        job_id: "job-1",
        url: "https://news.google.com/rss/articles/example",
        stage: "searching",
        status: "success",
        payload: {},
        error: null,
        created_at: "2026-11-01T08:40:00Z",
        ...overrides,
      },
    })
  )
}

test("HTTP search activity shows method, response, duration and original timestamp", () => {
  const html = render({
    payload: {
      event: "search_request",
      method: "POST",
      http_status: 200,
      elapsed_ms: 123.45,
      source: "google",
      phase: "decoding",
      timestamp: "2026-11-01T08:30:00Z",
    },
  })
  for (const value of [
    "Searching",
    "POST",
    "HTTP 200",
    "123.45 ms",
    "Google",
    "URL decoding",
  ])
    assert.ok(html.includes(value), `Missing ${value}`)
  assert.match(html, /datetime="2026-11-01T08:30:00Z"/i)
})

test("failed requests without a response show the error without HTTP zero", () => {
  const html = render({
    status: "failed",
    error: "Connection timed out",
    payload: {
      event: "search_request",
      method: "GET",
      http_status: null,
      elapsed_ms: 0,
    },
  })
  assert.ok(html.includes("No HTTP response"))
  assert.ok(html.includes("0 ms"))
  assert.ok(html.includes("Connection timed out"))
  assert.ok(!html.includes("HTTP 0"))
})

test("terminal requests read as timestamp, status, method, URL and response", () => {
  const url = "https://news.google.com/rss/articles/example"
  const html = render({
    payload: {
      event: "search_request",
      method: "GET",
      http_status: 302,
      elapsed_ms: 42,
      timestamp: "2026-11-01T08:30:00.321Z",
    },
  })
  assert.ok(html.indexOf("<time") < html.indexOf("Successful"))
  assert.ok(html.indexOf("GET") < html.indexOf(`href="${url}"`))
  assert.ok(html.indexOf(`href="${url}"`) < html.indexOf("HTTP 302"))
  assert.ok(html.indexOf("HTTP 302") < html.indexOf("42 ms"))
  assert.match(html, /[.,]321/)
  assert.equal(html.split(`href="${url}"`).length - 1, 1)
})

test("source summaries include zero counts and skipped activity", () => {
  const html = render({
    status: "skipped",
    payload: {
      event: "search_source",
      source: "bing",
      entries: 5,
      accepted: 0,
      outside_date_range: 4,
      unresolved_urls: 1,
    },
  })
  for (const value of [
    "Bing",
    "Entries",
    "Accepted",
    "Outside date range",
    "Unresolved URLs",
  ])
    assert.ok(html.includes(value), `Missing ${value}`)
  assert.ok(html.includes(">0<"))
})

test("search results show discovered titles and safe URLs", () => {
  const html = render({
    url: "",
    payload: {
      event: "google_results",
      total: 2,
      new_results: [
        { title: "News result", url: "https://example.com/article" },
        { title: "Unsafe result", url: "javascript:alert(1)" },
      ],
    },
  })
  assert.ok(html.includes("View discovered articles"))
  assert.ok(html.includes("News result"))
  assert.ok(html.includes('href="https://example.com/article"'))
  assert.ok(!html.includes('href="javascript:'))
})

test("resolved URLs and warning messages are visible", () => {
  const resolved = render({
    payload: {
      event: "search_resolution",
      resolved_url: "https://example.com/resolved",
    },
  })
  assert.ok(resolved.includes('href="https://example.com/resolved"'))
  const warning = render({
    status: "failed",
    error: "Fallback failed",
    payload: { event: "search_warning", partial_results: 3 },
  })
  assert.ok(warning.includes("Search warning"))
  assert.ok(warning.includes("Partial results"))
  assert.ok(warning.includes("Fallback failed"))
})

test("informational search starts show the query and message", () => {
  const html = render({
    status: "info",
    url: "",
    payload: {
      event: "started",
      query: "electric vehicles",
      message: "Fetching RSS",
    },
  })
  assert.ok(html.includes("Info"))
  assert.ok(html.includes("electric vehicles"))
  assert.ok(html.includes("Fetching RSS"))
})

test("article snapshots still render and malformed search payloads do not crash", () => {
  const article = render({
    stage: "scraping",
    payload: {
      title: "Saved article",
      content: "Full content",
      summary: "Summary",
    },
  })
  for (const value of [
    "Saved article",
    "Full content",
    "Summary",
    "View saved result",
  ])
    assert.ok(article.includes(value))
  assert.doesNotThrow(() =>
    render({
      payload: {
        event: "google_results",
        new_results: [null, "invalid", {}],
        elapsed_ms: "invalid",
      },
    })
  )
})

test("log filters reach the API together with pagination", async () => {
  const originalFetch = globalThis.fetch
  const originalStorage = globalThis.localStorage
  let requestedUrl
  globalThis.localStorage = { getItem: () => null }
  globalThis.fetch = async (url) => {
    requestedUrl = new URL(url)
    return new Response(
      JSON.stringify({
        total: 0,
        limit: 100,
        offset: 200,
        has_more: false,
        items: [],
      })
    )
  }
  try {
    await keywordsApi.getJobLogs("job-1", 100, 200, {
      stage: "searching",
      status: "failed",
    })
    assert.equal(requestedUrl.searchParams.get("stage"), "searching")
    assert.equal(requestedUrl.searchParams.get("status"), "failed")
    assert.equal(requestedUrl.searchParams.get("offset"), "200")
    assert.equal(requestedUrl.searchParams.get("limit"), "100")
    await keywordsApi.getJobLogs("job-1")
    assert.equal(requestedUrl.searchParams.has("stage"), false)
    assert.equal(requestedUrl.searchParams.has("status"), false)
  } finally {
    globalThis.fetch = originalFetch
    globalThis.localStorage = originalStorage
  }
})
