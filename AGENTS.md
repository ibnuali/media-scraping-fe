# Agent guidance

KeyCrawl is a React and TypeScript frontend for keyword tracking and news scraping, built with Vite, Tailwind CSS, and TanStack Query.

## Project conventions

- Group feature-specific components and hooks under `src/features/<feature>/`; place shared components and hooks in `src/components/` and `src/hooks/`. Use the `@/` alias for imports from `src/`.
- Route definitions and protected routes live in `src/routes/index.tsx`. Authentication state is provided by `src/contexts/auth-context.tsx`.
- Use the API client in `src/lib/api.ts` for backend requests and TanStack Query for server state. Preserve its token refresh and WebSocket behavior when changing authentication or live updates.
- Read `CLAUDE.md` for component, state, and form conventions; its example directory trees are illustrative, so check the current source before changing files.
- For UI changes, read `design.md` and use the existing design tokens in `tokens.css` and `src/index.css`. Reuse the shared primitives in `src/components/ui/`.

## Call graphs and execution flows

When showing how code invokes other code, including architecture traces and project overviews, apply `claude-code-skills:call-graph-format`:

- Use a plain-text arrow tree in a `ts` code fence, indenting each call by two spaces and prefixing it with `→`; do not use a rendered diagram.
- Verify every node and call against the source, and cite `path:line` in the surrounding prose, not inside the graph.
- Show separate Production and Tests graphs only when their dependency wiring differs; otherwise, use one graph.

## Development and verification

- The scripts are defined in `package.json`. The README and Dockerfile use Bun: `bun run dev`, `bun run build`, and `bun run lint`.
- Run the build and lint checks as appropriate for code changes. The build runs TypeScript project checks before Vite; the root `typecheck` script alone does not check the referenced projects.
- No test script or test suite is currently configured. Verify affected behavior with the most relevant available checks, and report any limitations.
- `format` writes to every TypeScript file; avoid running it across unrelated changes. Vite embeds `VITE_API_URL` and `VITE_WS_URL` at build time; see `.env.example`.

<!-- BEGIN bohay (managed by bohay; do not edit inside) -->
## bohay: delegating to other agents

When `$BOHAY_ENV` is `1` you are running inside bohay, a terminal multiplexer, and can hand work to other coding agents in other panes. Run `bohay skill` to learn how. Only delegate when the user asks.
<!-- END bohay -->
