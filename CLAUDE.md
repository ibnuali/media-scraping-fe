# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
bun dev          # Start development server
bun build        # Build for production (runs tsc then vite build)
bun lint         # Run ESLint
bun format       # Format code with Prettier
bun typecheck    # Type check without emitting
bun preview      # Preview production build
```

---

## Architecture Overview

This is a React 19 frontend for a keyword tracking / news scraping application.

### Key Technologies
- **Build**: Vite with `@` path alias (`@/` → `./src/`)
- **Styling**: Tailwind CSS v4 with `@tailwindcss/vite` plugin, shadcn/ui (base-nova style)
- **Data Fetching**: TanStack Query with shared `queryClient` instance
- **Routing**: react-router-dom with protected routes
- **Auth**: JWT-based with access/refresh token pairs stored in localStorage

### Backend API
- Default: `http://localhost:8000` (set via `VITE_API_URL`)
- Auth uses OAuth2 form-urlencoded login endpoint

---

## React Component Patterns

### 1. Component Splitting Philosophy

Every component should have **one reason to change**. Split when:
- A component exceeds ~150 lines
- A section has its own internal state
- A section could be reused elsewhere
- Logic can be extracted into a custom hook

**Naming convention by role:**

| Suffix / Folder         | Role                                              |
|-------------------------|---------------------------------------------------|
| `*Page.tsx`             | Route-level container, composes sections          |
| `*Section.tsx`          | A major visual region within a page               |
| `*Card.tsx`             | A self-contained display unit                     |
| `*List.tsx`             | Renders a collection of items                     |
| `*Item.tsx`             | Single item inside a list                         |
| `*Form.tsx`             | Owns form state and submission                    |
| `*Modal.tsx`            | Dialog / sheet wrapper                            |
| `ui/`                   | Pure, stateless presentational primitives         |

---

### 2. Folder Structure per Feature

Group by **feature**, not by type:

```
src/
├── features/
│   ├── keywords/
│   │   ├── components/
│   │   │   ├── KeywordListPage.tsx       # Route entry point
│   │   │   ├── KeywordListSection.tsx    # Layout section
│   │   │   ├── KeywordCard.tsx           # Single keyword display
│   │   │   ├── KeywordList.tsx           # Maps over keywords
│   │   │   ├── KeywordItem.tsx           # Row/tile per keyword
│   │   │   ├── AddKeywordForm.tsx        # Add keyword modal form
│   │   │   └── KeywordEmptyState.tsx     # Empty / error fallback
│   │   ├── hooks/
│   │   │   ├── use-keywords.ts           # TanStack Query for list
│   │   │   └── use-add-keyword.ts        # Mutation for adding
│   │   └── index.ts                      # Public barrel export
│   │
│   ├── news/
│   │   ├── components/
│   │   │   ├── NewsPage.tsx
│   │   │   ├── NewsSection.tsx
│   │   │   ├── ArticleList.tsx
│   │   │   ├── ArticleItem.tsx
│   │   │   └── ScrapeStatusBanner.tsx
│   │   ├── hooks/
│   │   │   └── use-news.ts
│   │   └── index.ts
│   │
│   └── auth/
│       ├── components/
│       │   ├── LoginPage.tsx
│       │   ├── RegisterPage.tsx
│       │   └── AuthForm.tsx
│       ├── hooks/
│       │   └── use-auth.ts
│       └── index.ts
│
├── components/
│   └── ui/                               # shadcn primitives (auto-generated)
│
├── contexts/
│   └── auth-context.tsx
│
├── hooks/                                # Shared / global hooks
│   └── use-async-scrape.ts
│
├── lib/
│   └── api.ts
│
└── routes/
    └── index.tsx
```

---

### 3. Page → Section → List → Item Pattern

Always compose top-down. A page should read like a table of contents.

```tsx
// KeywordListPage.tsx  — only layout + data orchestration
export default function KeywordListPage() {
  const { data: keywords, isLoading, isError } = useKeywords();

  return (
    <main className="container py-8">
      <KeywordListSection keywords={keywords} isLoading={isLoading} isError={isError} />
    </main>
  );
}

// KeywordListSection.tsx  — owns the section chrome
function KeywordListSection({ keywords, isLoading, isError }) {
  if (isLoading) return <KeywordListSkeleton />;
  if (isError)   return <ErrorState />;
  if (!keywords?.length) return <KeywordEmptyState />;

  return (
    <section>
      <SectionHeader title="Keywords" action={<AddKeywordButton />} />
      <KeywordList keywords={keywords} />
    </section>
  );
}

// KeywordList.tsx  — pure list renderer
function KeywordList({ keywords }: { keywords: Keyword[] }) {
  return (
    <ul className="grid gap-3">
      {keywords.map((kw) => (
        <KeywordItem key={kw.id} keyword={kw} />
      ))}
    </ul>
  );
}

// KeywordItem.tsx  — single item, self-contained interactions
function KeywordItem({ keyword }: { keyword: Keyword }) {
  return (
    <li>
      <Link to={`/keywords/${keyword.id}`}>{keyword.name}</Link>
    </li>
  );
}
```

---

### 4. Custom Hook Patterns

#### Data hook (TanStack Query)
```ts
// hooks/use-keywords.ts
export function useKeywords() {
  return useQuery({
    queryKey: ['keywords'],
    queryFn: keywordsApi.list,
  });
}
```

#### Mutation hook
```ts
// hooks/use-add-keyword.ts
export function useAddKeyword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: keywordsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keywords'] });
    },
  });
}
```

#### UI state hook (colocation)
Keep transient UI state (open/close, selected tab) inside a dedicated hook when shared between ≥2 components:

```ts
// hooks/use-keyword-filter.ts
export function useKeywordFilter(keywords: Keyword[]) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => keywords.filter((k) => k.name.toLowerCase().includes(query.toLowerCase())),
    [keywords, query]
  );

  return { query, setQuery, filtered };
}
```

**Rules:**
- One hook = one concern
- Hooks that call the API live in `features/<name>/hooks/`
- Hooks shared across features live in `src/hooks/`
- Never put JSX in a hook

---

### 5. State Management Rules

| State type            | Where it lives                              |
|-----------------------|---------------------------------------------|
| Server / async data   | TanStack Query (`useQuery` / `useMutation`) |
| Global auth state     | `AuthContext` + `useAuth()`                 |
| Feature-scoped UI     | `useState` inside the feature component     |
| Cross-component UI    | Lifted to nearest common ancestor or hook   |
| URL state             | `useSearchParams` from react-router-dom     |

**Do not** reach for a global store (Zustand, Redux) unless TanStack Query + context is genuinely insufficient.

---

### 6. Form Pattern

Use a dedicated `*Form.tsx` component. Keep form state local. Delegate submission to a mutation hook.

```tsx
// AddKeywordForm.tsx
export function AddKeywordForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState('');
  const { mutate, isPending, error } = useAddKeyword();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate({ name }, { onSuccess });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input value={name} onChange={(e) => setName(e.target.value)} />
      {error && <FormError message={error.message} />}
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Adding…' : 'Add Keyword'}
      </Button>
    </form>
  );
}
```

---

### 7. Component Props Rules

- Export a named `*Props` type for every non-trivial component
- Use `children` for slot composition rather than deeply nested props
- Avoid prop drilling beyond 2 levels — lift to context or compose differently

```ts
// Good
type KeywordCardProps = {
  keyword: Keyword;
  onDelete?: (id: string) => void;
};

export function KeywordCard({ keyword, onDelete }: KeywordCardProps) { ... }
```

---

### 8. Async / Loading States

Every data-fetching component must handle all three states:

```tsx
if (isLoading) return <SkeletonLoader />;
if (isError)   return <ErrorState error={error} />;
if (!data)     return <EmptyState />;
return <ActualContent data={data} />;
```

Provide dedicated `*Skeleton.tsx`, `*ErrorState.tsx`, and `*EmptyState.tsx` components for each major section — never inline loading text.

---

### 9. Adding shadcn Components

The project uses shadcn v4:

```bash
bunx shadcn@latest add <component-name>
```

- All shadcn primitives land in `src/components/ui/` — **do not edit them directly**
- Wrap primitives with feature-specific components when you need custom behaviour

---

### 10. Code Style Checklist

- [ ] Component is < 150 lines — split if longer
- [ ] No business logic in JSX — extract to hook or util
- [ ] No inline API calls — use `lib/api.ts` methods
- [ ] All async states handled (loading / error / empty)
- [ ] Props typed with a named interface
- [ ] No magic strings — use constants or enums
- [ ] `key` props use stable IDs, never array indices
