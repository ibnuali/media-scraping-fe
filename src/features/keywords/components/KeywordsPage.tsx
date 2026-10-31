import { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import {
  useKeywords,
  useCreateKeyword,
  useUpdateKeyword,
  useDeleteKeyword,
} from "../hooks/use-keywords"
import { useKeywordDialog } from "../hooks/use-keyword-dialog"
import { NewsFeed } from "@/features/news/components/NewsFeed"
import { KeywordWorkspaceSidebar } from "./KeywordWorkspaceSidebar"
import { KeywordFeedToolbar } from "./KeywordFeedToolbar"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { KeywordFormModal } from "./KeywordFormModal"
import { useAsyncScrape } from "@/hooks/use-async-scrape"
import { ScrapeDateRangeDialog } from "@/components/scrape-date-range-dialog"
import type {
  KeywordCreate,
  KeywordUpdate,
  KeywordResponse,
  ScrapeDateRange,
} from "@/types/keyword"

export function KeywordsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: keywords, isLoading, error } = useKeywords()
  const createMutation = useCreateKeyword()
  const updateMutation = useUpdateKeyword()
  const deleteMutation = useDeleteKeyword()
  const [scrapeTarget, setScrapeTarget] = useState<KeywordResponse | null>(null)

  const {
    dialogMode,
    editingKeyword,
    keyword,
    setKeyword,
    maxResult,
    setMaxResult,
    formError,
    setFormError,
    openCreateDialog,
    openEditDialog,
    closeDialog,
  } = useKeywordDialog()

  const { getJob, isPolling, startAsyncScrape } = useAsyncScrape({
    onComplete: (_job, keywordId) => {
      queryClient.invalidateQueries({
        queryKey: ["keywords", keywordId, "news"],
      })
      queryClient.invalidateQueries({ queryKey: ["keywords"] })
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    if (!keyword.trim()) {
      setFormError("Keyword is required")
      return
    }

    if (maxResult < 1 || maxResult > 100) {
      setFormError("Max Results must be between 1 and 100")
      return
    }

    try {
      if (dialogMode === "create") {
        const data: KeywordCreate = { keyword, max_result: maxResult }
        const created = await createMutation.mutateAsync(data)
        closeDialog()
        setSearchParams({ keyword: created.id })
        return
      } else if (dialogMode === "edit" && editingKeyword) {
        const data: KeywordUpdate = { keyword, max_result: maxResult }
        await updateMutation.mutateAsync({ id: editingKeyword.id, data })
      }
      closeDialog()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Operation failed")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this keyword?")) return
    try {
      await deleteMutation.mutateAsync(id)
    } catch (err) {
      console.error("Failed to delete keyword:", err)
    }
  }

  const handleScrapeStart = (kw: KeywordResponse, range: ScrapeDateRange) => {
    setScrapeTarget(null)
    void startAsyncScrape(kw.id, range)
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const selectedId = searchParams.get("keyword")
  const selected =
    keywords?.find((item) => item.id === selectedId) ?? keywords?.[0] ?? null
  const job = selected ? getJob(selected.id) : undefined

  const sidebarProps = {
    keywords,
    selectedId: selected?.id,
    isLoading,
    error,
    isPolling,
    onAdd: () => {
      setSidebarOpen(false)
      openCreateDialog()
    },
    onSelect: (id: string) => {
      setSearchParams({ keyword: id })
      setSidebarOpen(false)
    },
  }

  return (
    <div className="flex h-full min-h-0">
      <aside className="hidden w-64 shrink-0 border-r border-border md:block xl:w-72">
        <KeywordWorkspaceSidebar {...sidebarProps} />
      </aside>
      <Dialog open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <DialogContent
          showCloseButton
          className="top-0 bottom-0 left-0 flex h-dvh max-h-dvh w-72 max-w-[85vw] translate-x-0 translate-y-0 gap-0 rounded-none border-y-0 border-l-0 p-0 sm:max-w-72"
        >
          <DialogTitle className="sr-only">Keywords</DialogTitle>
          <DialogDescription className="sr-only">
            Choose a keyword or create a new one.
          </DialogDescription>
          <KeywordWorkspaceSidebar {...sidebarProps} />
        </DialogContent>
      </Dialog>
      <section
        className="flex min-h-0 min-w-0 flex-1 flex-col"
        aria-label="News feed"
      >
        <KeywordFeedToolbar
          keyword={selected}
          isScraping={selected ? isPolling(selected.id) : false}
          isDeleting={deleteMutation.isPending}
          onOpenSidebar={() => setSidebarOpen(true)}
          onEdit={() => selected && openEditDialog(selected)}
          onDelete={() => selected && void handleDelete(selected.id)}
          onScrape={() => selected && setScrapeTarget(selected)}
        />
        {!!job?.analysisFailed && (
          <p role="status" className="shrink-0 border-b border-border px-6 py-3 text-xs text-warning">
            {job.analysisFailed} AI analysis attempts failed. Collected articles are retained. {" "}
            <Link to="/datasets" className="underline">Review corpus and retry analysis</Link>
          </p>
        )}
        {job?.status === "failed" && (
          <p
            role="alert"
            className="shrink-0 border-b border-border px-6 py-3 text-xs text-destructive"
          >
            {job.error || "Scrape failed"}
          </p>
        )}
        <div
          key={selected?.id ?? "empty"}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
        >
          <NewsFeed keywordId={selected?.id ?? null} />
        </div>
      </section>

      <ScrapeDateRangeDialog
        open={scrapeTarget !== null}
        keyword={scrapeTarget?.keyword}
        onClose={() => setScrapeTarget(null)}
        onConfirm={(range) => {
          if (scrapeTarget) handleScrapeStart(scrapeTarget, range)
        }}
      />

      <KeywordFormModal
        open={dialogMode !== null}
        mode={dialogMode}
        editingKeyword={editingKeyword}
        keyword={keyword}
        setKeyword={setKeyword}
        maxResult={maxResult}
        setMaxResult={setMaxResult}
        formError={formError}
        isSubmitting={isSubmitting}
        onClose={closeDialog}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
