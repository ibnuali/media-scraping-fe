# Temporal corpus frontend

Open **Corpus & datasets** from the keyword sidebar, or visit `/datasets` after login.

## Backend curation update (2026-10-31)

The frontend now uses `/datasets/research/*` for thesis curation, matching `app/schemas/research_dataset.py` and `app/routes/research_datasets.py` in the backend. Legacy dataset export, event annotation, analysis and lexical retrieval remain available.

1. Review the corpus and thesis audit. Research audit includes manually assessed languages, extraction reviews, changing fact groups, QA categories, relative suggestions and collection outcomes. Counts do not certify sample adequacy or comprehensive historical coverage.
2. Create a collection plan with topic, entities, changing attributes, queries, dates, window size and cap. Existing plans and recorded run/window counts can be reloaded. Saving a plan does not execute it; administrator CLI/task execution is still required.
3. Select article versions and supply the actual backend/extractor code version used for the experiment. Create a snapshot to open its frozen text. Preserve the ID or bookmark `/datasets?snapshot=UUID`; click **Open snapshot** after reopening. No snapshot-list endpoint is available.
4. In **Thesis evidence & benchmark**, select a source passage. Browser UTF-16 offsets are converted to Python Unicode character offsets.
5. Save facts with consistent entity/attribute names and evidence-backed optional validity bounds. Empty bounds mean unknown. Review language, extraction quality and source use separately. Verification defaults to unchecked.
6. Extract relative-time suggestions using validated publication dates, or pin an anchor passage and submit a manual expression/anchor. Suggestions remain unreviewed. Review each normalized interval with a rationale and an explicit human assertion; original suggestions are retained.
7. Create research QA with explicit/implicit/no-time intent, fact type, temporal basis, availability and fact IDs. Add multiple passage judgments across snapshot articles: `supports`, `refutes`, `wrong_time`, or `irrelevant`. Each exact span has one label. Implicit queries require a timezone-qualified reference timestamp; explicit queries require a date bound. Observed-as-of mode checks both fact and judgment sources against their actual collection timestamps.
8. Reviewed QA requires human-verified facts. Ordinary answers require supporting evidence; false-premise QA requires refuting evidence. The frontend validates these constraints before submission and displays backend validation errors. Source truth remains a human assessment.
9. Select reviewed research QA from the current snapshot, choose fact/topic grouping, seed and development percentage, then freeze a benchmark. Display backend warnings when only one partition is populated, inspect QA split assignments and download the frozen JSON artifact. The artifact includes the corpus, facts, QA/qrels and reviews according to the backend contract. Old research QA and benchmarks can be reopened through the research record endpoints.

Facts, reviews and QA are append-only. To verify/correct an earlier draft, submit a new checked record after review and select that record for subsequent QA/benchmarks. A saved event annotation requires a new snapshot to affect the legacy event retriever. Research fact validity does not automatically change the legacy publication/event retriever, which remains a lexical baseline.

## Deployment and limits

Deploy backend research routes along with the existing corpus database migration (`alembic upgrade head`). The latest curation update needs no additional migration. The frontend does not migrate databases or launch collection jobs.

The displayed checksums are supplied by the backend; the browser does not independently verify them. Snapshot and benchmark reads load full artifacts into memory and are intended for modest research datasets. Benchmark record listings currently include full payloads because that is the backend list contract.

Analysis retries operate on stored corpus text. A failed analysis response is a failure even with HTTP 200; backend retry limits still apply. Successful enrichment does not rewrite the keyword News projection. Final AI counters are available through WebSocket completion only; polling does not persist them.

## Verification

- `bun run build`: TypeScript project checks and production bundle.
- `bun test tests/dataset-api.test.ts`: auth/refresh and JSONL, strict research endpoint payloads, relative suggestion/review separation, plan creation without execution, benchmark warnings/export, QA evidence/verification/time validation and Unicode offsets.
- `bun run lint`: full repository lint. Existing shared layout/context/UI and scrape date-dialog violations remain outside this feature; dataset files pass targeted ESLint.

No live backend or browser end-to-end session was used for this update. HTTP tests mock network responses; frontend request types and validations were compared directly against local backend routes, schemas and service constraints.

The TypeScript aliases retain the TS 7 compiler with the TS 6 API needed by typescript-eslint, following https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0.
