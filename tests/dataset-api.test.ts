import { researchApi } from "../src/features/datasets/research-api"
import { validateResearchQA } from "../src/features/datasets/lib/research-contracts"
import type { ResearchQAInput } from "../src/types/research"
import { toEvidenceSpan } from "../src/features/datasets/lib/evidence"
import { afterEach, beforeEach, describe, expect, spyOn, test } from "bun:test"
import { apiFetch, setTokens } from "../src/lib/api"
import { datasetsApi, parseManifest } from "../src/features/datasets/api"

const originalStorage = Object.getOwnPropertyDescriptor(
  globalThis,
  "localStorage"
)
let fetchSpy: ReturnType<typeof spyOn>
beforeEach(() => {
  const values = new Map<string, string>()
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    },
  })
  fetchSpy = spyOn(globalThis, "fetch")
})
afterEach(() => {
  fetchSpy.mockRestore()
  if (originalStorage)
    Object.defineProperty(globalThis, "localStorage", originalStorage)
  else Reflect.deleteProperty(globalThis, "localStorage")
})

describe("dataset API contracts", () => {
  test("exports preserve JSONL bytes and use bearer authentication", async () => {
    const text = '{"record_type":"manifest","entries":[],"checksum":"abc"}\n'
    setTokens({
      access_token: "access",
      refresh_token: "refresh",
      token_type: "bearer",
    })
    fetchSpy.mockResolvedValueOnce(
      new Response(text, {
        headers: { "Content-Type": "application/x-ndjson" },
      })
    )
    expect(await datasetsApi.export("snapshot-id")).toBe(text)
    const [url, options] = fetchSpy.mock.calls[0]
    expect(url).toEndWith("/datasets/snapshots/snapshot-id/export")
    expect(options.headers.get("Authorization")).toBe("Bearer access")
    expect(parseManifest(text).entries).toEqual([])
  })
  test("export retries once with the refreshed access token", async () => {
    setTokens({
      access_token: "old",
      refresh_token: "refresh",
      token_type: "bearer",
    })
    fetchSpy
      .mockResolvedValueOnce(new Response("", { status: 401 }))
      .mockResolvedValueOnce(
        Response.json({ access_token: "new", refresh_token: "rotated" })
      )
      .mockResolvedValueOnce(new Response("manifest\n"))
    expect(await datasetsApi.export("snapshot-id")).toBe("manifest\n")
    expect(fetchSpy).toHaveBeenCalledTimes(3)
    expect(fetchSpy.mock.calls[2][1].headers.get("Authorization")).toBe(
      "Bearer new"
    )
  })
  test("validation details remain readable to form users", async () => {
    fetchSpy.mockResolvedValueOnce(
      Response.json(
        { detail: [{ msg: "Invalid date interval" }] },
        { status: 422 }
      )
    )
    await expect(apiFetch("/datasets/annotations")).rejects.toThrow(
      "Invalid date interval"
    )
  })
  test("snapshot requests identify exact versions and code provenance", async () => {
    fetchSpy.mockResolvedValueOnce(
      Response.json({ id: "snapshot", checksum: "checksum" })
    )
    await datasetsApi.snapshot(["version-1", "version-2"], "git-sha")
    expect(JSON.parse(fetchSpy.mock.calls[0][1].body)).toEqual({
      version_ids: ["version-1", "version-2"],
      code_version: "git-sha",
      config: { purpose: "research" },
    })
  })
  test("temporal query preserves timezone offsets and WIB date bounds", async () => {
    fetchSpy.mockResolvedValueOnce(Response.json([]))
    await datasetsApi.retrieve("snapshot", {
      query: "kebijakan baru",
      semantics: "event",
      start: "2025-01-01",
      end: "2025-01-31",
      as_of: "2025-02-01T00:00:00+07:00",
    })
    const url = new URL(fetchSpy.mock.calls[0][0])
    expect(url.searchParams.get("as_of")).toBe("2025-02-01T00:00:00+07:00")
    expect(url.searchParams.get("semantics")).toBe("event")
    expect(url.searchParams.get("start")).toBe("2025-01-01")
  })
  test("non-manifest exports are rejected", () => {
    expect(() => parseManifest('{"items":[]}')).toThrow(
      "Invalid snapshot manifest"
    )
  })
})

test("evidence offsets match Python characters after emoji", () => {
  const text = "A😀 berita"
  const span = toEvidenceSpan(text, 4, text.length)
  expect(span).toEqual({ start: 3, end: 9 })
  expect(Array.from(text).slice(span.start, span.end).join("")).toBe("berita")
})

// Research endpoints intentionally use stricter contracts than legacy /datasets/qa.
describe("thesis curation API", () => {
  test("research QA sends fact and relevance labels to the new endpoint", async () => {
    fetchSpy.mockResolvedValueOnce(
      Response.json({ id: "qa", review: "manual-unreviewed" })
    )
    const input = sampleQA()
    await researchApi.qa(input)
    expect(fetchSpy.mock.calls[0][0]).toEndWith("/datasets/research/qa")
    const body = JSON.parse(fetchSpy.mock.calls[0][1].body)
    expect(body).toEqual(input)
    expect(body).not.toHaveProperty("time_constraint")
    expect(body.reviewed).toBe(false)
  })
  test("fact and quality assessments preserve explicit human verification", async () => {
    fetchSpy.mockImplementation(async () => Response.json({ id: "record" }))
    await researchApi.fact({
      version_id: "version",
      start: 0,
      end: 5,
      topic: "Policy",
      entity: "X",
      attribute: "status",
      value: "planned",
      valid_from: "2024-01-01",
      valid_until: null,
      verified: false,
    })
    expect(JSON.parse(fetchSpy.mock.calls[0][1].body).valid_until).toBeNull()
    expect(JSON.parse(fetchSpy.mock.calls[0][1].body).verified).toBe(false)
    await researchApi.quality({
      version_id: "version",
      language: "id",
      extraction: "usable",
      source_use: "metadata_and_quotes",
      notes: "Manually checked",
      verified: true,
    })
    expect(fetchSpy.mock.calls[1][0]).toEndWith("/datasets/research/quality")
    expect(JSON.parse(fetchSpy.mock.calls[1][1].body).verified).toBe(true)
  })
  test("relative extraction does not promote suggestions to human reviews", async () => {
    fetchSpy.mockResolvedValueOnce(
      Response.json([
        { id: "suggestion", verification: "unreviewed-suggestion" },
      ])
    )
    const result = await researchApi.extractRelative("version")
    expect(result[0].verification).toBe("unreviewed-suggestion")
    expect(JSON.parse(fetchSpy.mock.calls[0][1].body)).toEqual({
      version_id: "version",
    })
    fetchSpy.mockResolvedValueOnce(Response.json({ id: "review" }))
    await researchApi.reviewRelative({
      suggestion_id: "suggestion",
      normalized_start: "2024-01-01",
      normalized_end: "2024-01-01",
      rationale: "Verified publication anchor",
    })
    expect(fetchSpy.mock.calls[1][0]).toEndWith(
      "/datasets/research/relative-time/reviews"
    )
  })
  test("manual relative expressions retain a separate anchor passage", async () => {
    fetchSpy.mockResolvedValueOnce(Response.json({ id: "suggestion" }))
    const body = {
      version_id: "version",
      start: 20,
      end: 27,
      anchor_date: "2024-01-02",
      anchor_source: "text" as const,
      anchor_evidence: { version_id: "version", start: 0, end: 10 },
    }
    await researchApi.relative(body)
    expect(JSON.parse(fetchSpy.mock.calls[0][1].body)).toEqual(body)
  })
  test("saving a collection plan never calls a collection execution endpoint", async () => {
    fetchSpy.mockResolvedValueOnce(Response.json({ id: "plan" }))
    await researchApi.plan({
      topic: "X",
      entities: ["X"],
      attributes: ["status"],
      queries: ["X berlaku"],
      source_domains: [],
      start_date: "2024-01-01",
      end_date: "2024-06-30",
      window_days: 7,
      cap: 100,
    })
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(fetchSpy.mock.calls[0][0]).toEndWith("/datasets/research/plans")
    expect(JSON.parse(fetchSpy.mock.calls[0][1].body).window_days).toBe(7)
  })
  test("benchmark keeps dev/test warnings and exports the frozen artifact", async () => {
    fetchSpy.mockResolvedValueOnce(
      Response.json({
        id: "benchmark",
        checksum: "hash",
        splits: { qa: "dev" },
        warnings: ["Only one partition populated"],
      })
    )
    const result = await researchApi.benchmark({
      snapshot_id: "snapshot",
      qa_ids: ["qa"],
      split_policy: "fact",
      seed: "fixed",
      dev_percent: 30,
    })
    expect(result.warnings).toEqual(["Only one partition populated"])
    expect(result.splits).toEqual({ qa: "dev" })
    fetchSpy.mockResolvedValueOnce(Response.json({ checksum: "hash", qa: [] }))
    expect(await researchApi.exportBenchmark(result.id)).toEqual({
      checksum: "hash",
      qa: [],
    })
    expect(fetchSpy.mock.calls[1][0]).toEndWith(
      "/datasets/research/benchmarks/benchmark/export"
    )
  })
  test("records are read by the backend kind names", async () => {
    for (const kind of [
      "fact",
      "research_qa",
      "relative_time",
      "relative_review",
      "quality_review",
      "collection_plan",
      "collection_run",
      "benchmark",
    ] as const) {
      fetchSpy.mockResolvedValueOnce(Response.json([]))
      expect(await researchApi.records(kind)).toEqual([])
      expect(fetchSpy.mock.lastCall?.[0]).toEndWith(
        `/datasets/research/records/${kind}`
      )
    }
  })
})

const entry = {
  version_id: "version",
  url: "https://example.com/news",
  content: "Berita kebijakan X",
  content_hash: "hash",
  quality_status: "extracted",
  publication: { status: "valid" },
  fetched_at: "2024-01-02T00:00:00+07:00",
}
const fact = {
  id: "fact",
  version_id: "version",
  start: 0,
  end: 6,
  topic: "Policy",
  entity: "X",
  attribute: "status",
  value: "planned",
  valid_from: null,
  valid_until: null,
  verified: true,
  verification: "human-verified",
  text: "Berita",
  fact_group: "group",
}
function sampleQA(): ResearchQAInput {
  return {
    snapshot_id: "snapshot",
    question: "Status X pada Januari 2024?",
    gold_answer: "Planned",
    intent: "explicit",
    fact_type: "slow_changing",
    false_premise: false,
    reference_at: null,
    target_start: "2024-01-01",
    target_end: "2024-01-31",
    temporal_basis: "fact_validity",
    availability: "retrospective",
    fact_ids: ["fact"],
    judgments: [{ version_id: "version", start: 0, end: 6, label: "supports" }],
    reviewed: false,
  }
}
const validate = (input: ResearchQAInput, facts = [fact]) =>
  validateResearchQA(input, facts, [entry])
describe("research QA validation", () => {
  test("accepts supported retrospective QA without inventing an availability cutoff", () => {
    expect(validate(sampleQA())).toBeNull()
  })
  test("requires reference time for implicit intent and timezone for supplied timestamps", () => {
    expect(validate({ ...sampleQA(), intent: "implicit" })).toContain(
      "reference time"
    )
    expect(
      validate({
        ...sampleQA(),
        intent: "implicit",
        reference_at: "2024-01-31T12:00:00",
      })
    ).toContain("timezone")
    expect(
      validate({
        ...sampleQA(),
        intent: "implicit",
        reference_at: "2024-01-31T12:00:00+07:00",
      })
    ).toBeNull()
  })
  test("requires an explicit bound and rejects reversed target intervals", () => {
    expect(
      validate({ ...sampleQA(), target_start: null, target_end: null })
    ).toContain("bound")
    expect(validate({ ...sampleQA(), target_end: "2023-01-01" })).toContain(
      "reversed"
    )
  })
  test("false premise needs refuting evidence and ordinary QA needs support", () => {
    expect(validate({ ...sampleQA(), false_premise: true })).toContain(
      "refutes"
    )
    expect(
      validate({
        ...sampleQA(),
        judgments: [
          { version_id: "version", start: 0, end: 6, label: "wrong_time" },
        ],
      })
    ).toContain("supports")
    expect(
      validate({
        ...sampleQA(),
        false_premise: true,
        judgments: [
          { version_id: "version", start: 0, end: 6, label: "refutes" },
        ],
      })
    ).toBeNull()
  })
  test("reviewed QA rejects unverified facts, but a draft may keep them", () => {
    const unreviewed = [
      { ...fact, verified: false, verification: "manual-unreviewed" },
    ]
    expect(validate({ ...sampleQA(), reviewed: true }, unreviewed)).toContain(
      "human-verified"
    )
    expect(validate(sampleQA(), unreviewed)).toBeNull()
  })
  test("all facts and judgment spans must belong to the snapshot", () => {
    expect(validate({ ...sampleQA(), fact_ids: [] })).toContain(
      "at least one fact"
    )
    expect(validate({ ...sampleQA(), fact_ids: ["other-fact"] })).toContain(
      "snapshot"
    )
    expect(
      validate({
        ...sampleQA(),
        judgments: [
          { version_id: "other-version", start: 0, end: 6, label: "supports" },
        ],
      })
    ).toContain("snapshot")
    expect(
      validate({
        ...sampleQA(),
        judgments: [
          { version_id: "version", start: 0, end: 600, label: "supports" },
        ],
      })
    ).toContain("passage")
  })
  test("duplicate and conflicting judgments cannot be sent", () => {
    const input = sampleQA()
    expect(
      validate({
        ...input,
        judgments: [
          ...input.judgments,
          { ...input.judgments[0], label: "wrong_time" },
        ],
      })
    ).toContain("conflicting")
  })
  test("historical availability rejects evidence collected after the reference", () => {
    expect(
      validate({ ...sampleQA(), availability: "observed_as_of" })
    ).toContain("reference time")
    expect(
      validate({
        ...sampleQA(),
        availability: "observed_as_of",
        reference_at: "2024-01-01T23:59:59+07:00",
      })
    ).toContain("collected")
    expect(
      validate({
        ...sampleQA(),
        availability: "observed_as_of",
        reference_at: "2024-01-02T00:00:00+07:00",
      })
    ).toBeNull()
  })
})
