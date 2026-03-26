import { useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  useKeywords,
  useCreateKeyword,
  useUpdateKeyword,
  useDeleteKeyword,
} from "../hooks/use-keywords"
import { useKeywordDialog } from "../hooks/use-keyword-dialog"
import { KeywordsSection } from "./KeywordsSection"
import { KeywordFormModal } from "./KeywordFormModal"
import { useAsyncScrape } from "@/hooks/use-async-scrape"
import type {
  KeywordCreate,
  KeywordUpdate,
  KeywordResponse,
} from "@/types/keyword"

export function KeywordsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: keywords, isLoading, error } = useKeywords()
  const createMutation = useCreateKeyword()
  const updateMutation = useUpdateKeyword()
  const deleteMutation = useDeleteKeyword()

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
        navigate(`/keywords/${created.id}`)
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

  const handleScrape = async (kw: KeywordResponse) => {
    await startAsyncScrape(kw.id)
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-6">
      <KeywordsSection
        keywords={keywords}
        isLoading={isLoading}
        error={error}
        getJob={getJob}
        isPolling={isPolling}
        onEdit={openEditDialog}
        onDelete={handleDelete}
        onScrape={handleScrape}
        isDeleting={deleteMutation.isPending}
      />

      {/* Floating Action Button */}
      <Button
        onClick={openCreateDialog}
        size="icon"
        className="fixed right-6 bottom-6 z-40 size-14 rounded-full shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
      >
        <Plus className="size-6" />
      </Button>

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
