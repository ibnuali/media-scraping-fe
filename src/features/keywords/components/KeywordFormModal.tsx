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
import { AlertCircle, Loader2 } from "lucide-react"
import type { KeywordResponse } from "@/types/keyword"

interface KeywordFormModalProps {
  open: boolean
  mode: "create" | "edit" | null
  editingKeyword: KeywordResponse | null
  keyword: string
  setKeyword: (value: string) => void
  maxResult: number
  setMaxResult: (value: number) => void
  formError: string
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => Promise<void>
}

export function KeywordFormModal({
  open,
  mode,
  keyword,
  setKeyword,
  maxResult,
  setMaxResult,
  formError,
  isSubmitting,
  onClose,
  onSubmit,
}: KeywordFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold tracking-tight">
            {mode === "create" ? "Add keyword" : "Edit keyword"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new keyword to track."
              : "Update the keyword details."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-3.5 py-3">
            {formError && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-2.5 text-[13px] text-destructive"
              >
                <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="keyword">Keyword</Label>
              <Input
                id="keyword"
                type="text"
                placeholder="e.g. electric vehicles"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                required
                disabled={isSubmitting}
                autoFocus
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="maxResult">Max results</Label>
              <Input
                id="maxResult"
                type="number"
                min={1}
                max={100}
                placeholder="1–100"
                value={maxResult || ""}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === "") {
                    setMaxResult(0)
                    return
                  }
                  const parsed = parseInt(value)
                  if (!isNaN(parsed)) {
                    setMaxResult(parsed)
                  }
                }}
                disabled={isSubmitting}
                className="h-10 font-mono tabular-nums"
              />
              <p className="font-mono text-[11px] text-ink-3">
                articles pulled per scrape · 1–100
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-1.5">
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {isSubmitting ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
