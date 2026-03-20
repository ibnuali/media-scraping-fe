import { useState } from 'react'
import type { KeywordResponse } from '@/types/keyword'

type DialogMode = 'create' | 'edit' | null

export function useKeywordDialog() {
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [editingKeyword, setEditingKeyword] = useState<KeywordResponse | null>(null)
  const [keyword, setKeyword] = useState('')
  const [maxResult, setMaxResult] = useState(10)
  const [formError, setFormError] = useState('')

  const openCreateDialog = () => {
    setKeyword('')
    setMaxResult(10)
    setFormError('')
    setDialogMode('create')
  }

  const openEditDialog = (kw: KeywordResponse) => {
    setEditingKeyword(kw)
    setKeyword(kw.keyword)
    setMaxResult(kw.max_result)
    setFormError('')
    setDialogMode('edit')
  }

  const closeDialog = () => {
    setDialogMode(null)
    setEditingKeyword(null)
    setKeyword('')
    setMaxResult(10)
    setFormError('')
  }

  return {
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
  }
}