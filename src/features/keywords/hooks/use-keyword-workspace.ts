import { useSearchParams } from "react-router-dom"
import { useState } from "react"
import {
  useKeywords,
  useCreateKeyword,
  useUpdateKeyword,
  useDeleteKeyword,
} from "./use-keywords"
import { useKeywordDialog } from "./use-keyword-dialog"

export function useKeywordWorkspace() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filter, setFilter] = useState("")
  const query = useKeywords()
  const dialog = useKeywordDialog()
  const createMutation = useCreateKeyword()
  const updateMutation = useUpdateKeyword()
  const deleteMutation = useDeleteKeyword()
  const keywords = query.data ?? []
  const selectedKeyword =
    keywords.find((item) => item.id === searchParams.get("keyword")) ??
    keywords[0]
  const filteredKeywords = keywords.filter((item) =>
    item.keyword.toLowerCase().includes(filter.toLowerCase())
  )

  const selectKeyword = (id: string) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      next.set("keyword", id)
      return next
    })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    dialog.setFormError("")
    if (!dialog.keyword.trim()) {
      dialog.setFormError("Keyword is required")
      return
    }
    if (dialog.maxResult < 1 || dialog.maxResult > 100) {
      dialog.setFormError("Max Results must be between 1 and 100")
      return
    }
    try {
      const data = {
        keyword: dialog.keyword.trim(),
        max_result: dialog.maxResult,
      }
      if (dialog.dialogMode === "create") {
        const created = await createMutation.mutateAsync(data)
        setFilter("")
        selectKeyword(created.id)
      } else if (dialog.editingKeyword) {
        await updateMutation.mutateAsync({ id: dialog.editingKeyword.id, data })
      }
      dialog.closeDialog()
    } catch (error) {
      dialog.setFormError(
        error instanceof Error ? error.message : "Could not save the keyword"
      )
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this keyword and its saved articles?")) return
    try {
      await deleteMutation.mutateAsync(id)
      if (id === selectedKeyword?.id) {
        const next = keywords.find((item) => item.id !== id)
        if (next) selectKeyword(next.id)
        else setSearchParams({})
      }
    } catch {
      /* The mutation displays the API error. */
    }
  }

  return {
    query,
    dialog,
    keywords,
    selectedKeyword,
    filteredKeywords,
    filter,
    setFilter,
    selectKeyword,
    handleSubmit,
    handleDelete,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
