import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WorkspaceLoading, WorkspaceState } from "@/components/workspace-state"
import { KeywordPickerItem } from "./KeywordPickerItem"
import type { KeywordResponse } from "@/types/keyword"

interface KeywordPickerProps {
  keywords: KeywordResponse[]
  total: number
  selectedId?: string
  filter: string
  onFilter: (value: string) => void
  onSelect: (id: string) => void
  onAdd: () => void
  onEdit: (keyword: KeywordResponse) => void
  onDelete: (id: string) => void
  isDeleting: boolean
  isLoading: boolean
  error: Error | null
  onRetry: () => void
}

export function KeywordPicker({
  keywords,
  total,
  selectedId,
  filter,
  onFilter,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  isDeleting,
  isLoading,
  error,
  onRetry,
}: KeywordPickerProps) {
  return (
    <section className="keyword-picker" aria-labelledby="keyword-picker-title">
      <div className="keyword-picker-heading">
        <div>
          <h2 id="keyword-picker-title">
            Keywords <span className="workspace-count">{total}</span>
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onAdd}
          aria-label="Add keyword"
        >
          <Plus className="size-4" />
        </Button>
      </div>
      <div className="keyword-filter">
        <label htmlFor="keyword-filter" className="sr-only">
          Filter keywords
        </label>
        <Search className="size-4" aria-hidden="true" />
        <Input
          id="keyword-filter"
          placeholder="Search keywords…"
          value={filter}
          onChange={(event) => onFilter(event.target.value)}
        />
      </div>
      <div className="keyword-picker-list">
        {isLoading ? (
          <WorkspaceLoading />
        ) : error ? (
          <WorkspaceState
            title="Could not load keywords"
            description={error.message}
            isError
          >
            <Button variant="outline" onClick={onRetry}>
              Try again
            </Button>
          </WorkspaceState>
        ) : total > 0 && !keywords.length ? (
          <WorkspaceState
            title="No matching keywords"
            description="Try a different search term."
          >
            <Button variant="outline" onClick={() => onFilter("")}>
              Clear filter
            </Button>
          </WorkspaceState>
        ) : (
          keywords.map((keyword) => (
            <KeywordPickerItem
              key={keyword.id}
              keyword={keyword}
              selected={keyword.id === selectedId}
              isDeleting={isDeleting}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
      <footer className="keyword-picker-footer">
        {total} tracked {total === 1 ? "keyword" : "keywords"}
      </footer>
    </section>
  )
}
