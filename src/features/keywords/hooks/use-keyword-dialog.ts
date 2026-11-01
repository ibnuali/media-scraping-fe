import { useState } from "react"
import type { KeywordResponse } from "@/types/keyword"

type DialogMode = "create" | "edit" | null

export function useKeywordDialog() {
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [editingKeyword, setEditingKeyword] = useState<KeywordResponse | null>(
    null
  )
  const [keyword, setKeyword] = useState("")
  const [formError, setFormError] = useState("")

  const openCreateDialog = () => {
    setKeyword("")
    setFormError("")
    setDialogMode("create")
  }

  const openEditDialog = (kw: KeywordResponse) => {
    setEditingKeyword(kw)
    setKeyword(kw.keyword)
    setFormError("")
    setDialogMode("edit")
  }

  const closeDialog = () => {
    setDialogMode(null)
    setEditingKeyword(null)
    setKeyword("")
    setFormError("")
  }

  return {
    dialogMode,
    editingKeyword,
    keyword,
    setKeyword,
    formError,
    setFormError,
    openCreateDialog,
    openEditDialog,
    closeDialog,
  }
}
