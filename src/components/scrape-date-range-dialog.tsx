import { useEffect, useState } from "react"
import { AlertCircle, CalendarRange } from "lucide-react"
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
import type { ScrapeDateRange } from "@/types/keyword"

interface ScrapeDateRangeDialogProps {
  open: boolean
  keyword?: string | null
  onClose: () => void
  onConfirm: (range: ScrapeDateRange) => void
}

export function ScrapeDateRangeDialog({
  open,
  keyword,
  onClose,
  onConfirm,
}: ScrapeDateRangeDialogProps) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      setStartDate("")
      setEndDate("")
      setError("")
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (startDate && endDate && startDate > endDate) {
      setError("Start date must be on or before end date")
      return
    }
    onConfirm({
      start_date: startDate || null,
      end_date: endDate || null,
    })
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold tracking-tight">
            Publication date range
          </DialogTitle>
          <DialogDescription>
            {keyword ? (
              <>
                Narrow the news search for{" "}
                <span className="font-medium text-foreground">{keyword}</span>.
                Leave both empty to search the latest articles.
              </>
            ) : (
              <>
                Narrow the news search. Leave both empty to search the latest
                articles.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-3.5 py-3">
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-2.5 text-[13px] text-destructive"
              >
                <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="scrape-start-date">From</Label>
                <Input
                  id="scrape-start-date"
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(e) => {
                    setStartDate(e.target.value)
                    setError("")
                  }}
                  className="h-10 font-mono tabular-nums"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="scrape-end-date">To</Label>
                <Input
                  id="scrape-end-date"
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => {
                    setEndDate(e.target.value)
                    setError("")
                  }}
                  className="h-10 font-mono tabular-nums"
                />
              </div>
            </div>
            <p className="flex items-center gap-1.5 font-mono text-[11px] text-ink-3">
              <CalendarRange className="size-3.5" />
              publication dates, WIB · inclusive
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Start scrape</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
