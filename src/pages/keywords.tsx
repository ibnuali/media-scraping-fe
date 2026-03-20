import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import {
  useKeywords,
  useCreateKeyword,
  useUpdateKeyword,
  useDeleteKeyword,
} from "@/hooks/use-keywords"
import { useAsyncScrape } from "@/hooks/use-async-scrape"
import type {
  KeywordResponse,
  KeywordCreate,
  KeywordUpdate,
} from "@/types/keyword"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  CheckCircle,
  XCircle,
  Calendar,
  BarChart3,
} from "lucide-react"

type DialogMode = "create" | "edit" | null

// Helper to format date (backend returns UTC)
function formatLastScraped(dateStr: string | null): string {
  if (!dateStr) return "Never"
  // Append 'Z' if not present to indicate UTC, then JS converts to local timezone
  const utcStr = dateStr.endsWith('Z') ? dateStr : `${dateStr}Z`
  const date = new Date(utcStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export function Keywords() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: keywords, isLoading, error } = useKeywords()
  const createMutation = useCreateKeyword()
  const updateMutation = useUpdateKeyword()
  const deleteMutation = useDeleteKeyword()

  // Async scrape (background, multiple jobs)
  const { jobs, getJob, isPolling, startAsyncScrape } = useAsyncScrape({
    onComplete: (job, keywordId) => {
      queryClient.invalidateQueries({
        queryKey: ["keywords", keywordId, "news"],
      })
      queryClient.invalidateQueries({
        queryKey: ["keywords"],
      })
    },
  })

  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [editingKeyword, setEditingKeyword] = useState<KeywordResponse | null>(
    null
  )
  const [keyword, setKeyword] = useState("")
  const [maxResult, setMaxResult] = useState(10)
  const [formError, setFormError] = useState("")

  // Count active scrapes
  const activeScrapeCount = useMemo(() => {
    let count = 0
    jobs.forEach((job) => {
      if (job.status === "pending" || job.status === "running") {
        count++
      }
    })
    return count
  }, [jobs])

  const openCreateDialog = () => {
    setKeyword("")
    setMaxResult(10)
    setFormError("")
    setDialogMode("create")
  }

  const openEditDialog = (kw: KeywordResponse) => {
    setEditingKeyword(kw)
    setKeyword(kw.keyword)
    setMaxResult(kw.max_result)
    setFormError("")
    setDialogMode("edit")
  }

  const closeDialog = () => {
    setDialogMode(null)
    setEditingKeyword(null)
    setKeyword("")
    setMaxResult(10)
    setFormError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    try {
      if (dialogMode === "create") {
        const data: KeywordCreate = { keyword, max_result: maxResult }
        await createMutation.mutateAsync(data)
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

  const handleAsyncScrape = async (kw: KeywordResponse) => {
    await startAsyncScrape(kw.id)
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Keywords</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your tracked keywords and trigger scrapes
          </p>
        </div>
        <Button
          onClick={openCreateDialog}
          className="gradient-bg h-11 rounded-xl font-medium text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
        >
          <Plus className="size-5" />
          Add Keyword
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="hover-lift rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="gradient-bg flex size-12 items-center justify-center rounded-xl shadow-lg shadow-primary/25">
              <TrendingUp className="size-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Keywords</p>
              <p className="text-2xl font-bold">{keywords?.length ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="hover-lift rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
              <Sparkles className="size-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Scrapes</p>
              <p className="text-2xl font-bold">{activeScrapeCount}</p>
            </div>
          </div>
        </div>

        <div className="hover-lift rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <Search className="size-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Max Results Total</p>
              <p className="text-2xl font-bold">
                {keywords?.reduce((acc, kw) => acc + kw.max_result, 0) ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Keywords Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-center text-destructive">
          Failed to load keywords
        </div>
      ) : !keywords || keywords.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/30 p-16 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-muted/50">
            <Search className="size-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-semibold">No keywords yet</h3>
          <p className="mt-1 text-muted-foreground">
            Click "Add Keyword" to create your first keyword
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {keywords.map((kw) => {
            const asyncJob = getJob(kw.id)
            const isThisKeywordScraping = isPolling(kw.id)

            return (
              <div
                key={kw.id}
                className="group hover-lift rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="truncate text-lg font-semibold">
                      {kw.keyword}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Max {kw.max_result} results
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="size-3" />
                      <span>Last scraped: {formatLastScraped(kw.last_scraped)}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => openEditDialog(kw)}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleDelete(kw.id)}
                      disabled={deleteMutation.isPending}
                      className="text-destructive opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {/* Background scrape button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAsyncScrape(kw)}
                    disabled={false} // Always allow starting a background job
                    className="h-10 w-full rounded-xl"
                  >
                    {isPolling(kw.id) ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        {asyncJob?.progress
                          ? `${asyncJob.progress.current}/${asyncJob.progress.total}`
                          : asyncJob?.status || "Starting..."}
                      </>
                    ) : asyncJob?.status === "completed" ? (
                      <>
                        <CheckCircle className="size-4 text-green-500" />
                        Completed ({asyncJob.progress?.total || 0} results)
                      </>
                    ) : asyncJob?.status === "failed" ? (
                      <>
                        <XCircle className="size-4 text-destructive" />
                        Failed
                      </>
                    ) : (
                      <>
                        <Clock className="size-4" />
                        Scrape Now
                      </>
                    )}
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/keywords/${kw.id}`)}
                      className="h-10 rounded-xl"
                    >
                      <BarChart3 className="size-4" />
                      Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/keywords/${kw.id}/news`)}
                      className="group/btn h-10 rounded-xl"
                    >
                      View News
                      <ArrowRight className="ml-1 size-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Dialog */}
      <Dialog
        open={dialogMode !== null}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {dialogMode === "create" ? "Add Keyword" : "Edit Keyword"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "create"
                ? "Create a new keyword to track."
                : "Update the keyword details."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {formError && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                  {formError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="keyword">Keyword</Label>
                <Input
                  id="keyword"
                  type="text"
                  placeholder="Enter keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxResult">Max Results</Label>
                <Input
                  id="maxResult"
                  type="number"
                  min={1}
                  max={100}
                  value={maxResult}
                  onChange={(e) => setMaxResult(parseInt(e.target.value) || 10)}
                  disabled={isSubmitting}
                  className="h-11 rounded-xl"
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                disabled={isSubmitting}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="gradient-bg rounded-xl text-white"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
