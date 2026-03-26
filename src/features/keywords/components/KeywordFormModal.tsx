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
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {mode === "create" ? "Add Keyword" : "Edit Keyword"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new keyword to track."
              : "Update the keyword details."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
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
                placeholder="1-100"
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
                className="h-11 rounded-xl"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
