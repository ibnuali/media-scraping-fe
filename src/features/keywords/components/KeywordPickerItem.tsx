import { Link } from "react-router-dom"
import { MoreHorizontal, Pencil, Trash2, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatLastScraped } from "@/lib/utils"
import type { KeywordResponse } from "@/types/keyword"

interface KeywordPickerItemProps {
  keyword: KeywordResponse
  selected: boolean
  isDeleting: boolean
  onSelect: (id: string) => void
  onEdit: (keyword: KeywordResponse) => void
  onDelete: (id: string) => void
}

export function KeywordPickerItem({
  keyword,
  selected,
  isDeleting,
  onSelect,
  onEdit,
  onDelete,
}: KeywordPickerItemProps) {
  return (
    <div className="keyword-picker-row" data-selected={selected}>
      <button
        type="button"
        aria-label={`Select ${keyword.keyword}`}
        aria-pressed={selected}
        aria-controls="keyword-news-panel"
        className="keyword-select"
        onClick={() => onSelect(keyword.id)}
      >
        <span className="keyword-select-name">{keyword.keyword}</span>
        <span className="keyword-select-meta">
          {formatLastScraped(keyword.last_scraped)} · max {keyword.max_result}
        </span>
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Actions for ${keyword.keyword}`}
            />
          }
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuItem onClick={() => onEdit(keyword)}>
            <Pencil />
            Edit keyword
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link to={`/keywords/${keyword.id}`} />}>
            <BarChart3 />
            Keyword dashboard
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            disabled={isDeleting}
            onClick={() => onDelete(keyword.id)}
          >
            <Trash2 />
            Delete keyword
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
