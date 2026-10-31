import { useId, useState } from "react"
import { Loader2, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { PublicationDateRange } from "@/types/keyword"
import { parsePublicationDateRange } from "../lib/publication-date-range"

export interface KeywordScrapeFormProps {
  isBusy: boolean
  isScraping: boolean
  onScrape: (filters?: PublicationDateRange) => void
}

export function KeywordScrapeForm({
  isBusy,
  isScraping,
  onScrape,
}: KeywordScrapeFormProps) {
  const id = useId()
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [error, setError] = useState("")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isBusy) return
    let filters: PublicationDateRange | undefined
    try {
      filters = parsePublicationDateRange(startDate, endDate)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Check the date range.")
      return
    }
    setError("")
    onScrape(filters)
  }

  return (
    <form
      className="keyword-scrape-form"
      aria-label="Scrape news"
      onSubmit={handleSubmit}
    >
      <div className="keyword-scrape-field">
        <Label htmlFor={`${id}-start`}>Start date (optional)</Label>
        <Input
          id={`${id}-start`}
          type="date"
          value={startDate}
          max={endDate || undefined}
          disabled={isBusy}
          aria-describedby={`${id}-hint${error ? ` ${id}-error` : ""}`}
          aria-invalid={!!error}
          onChange={(event) => {
            setStartDate(event.target.value)
            setError("")
          }}
        />
      </div>
      <div className="keyword-scrape-field">
        <Label htmlFor={`${id}-end`}>End date (optional)</Label>
        <Input
          id={`${id}-end`}
          type="date"
          value={endDate}
          min={startDate || undefined}
          disabled={isBusy}
          aria-describedby={`${id}-hint${error ? ` ${id}-error` : ""}`}
          aria-invalid={!!error}
          onChange={(event) => {
            setEndDate(event.target.value)
            setError("")
          }}
        />
      </div>
      <Button type="submit" variant="outline" disabled={isBusy}>
        {isScraping ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Play className="size-4" />
        )}
        {isScraping ? "Scraping…" : "Scrape news"}
      </Button>
      <p id={`${id}-hint`} className="keyword-scrape-hint">
        Filter by publication date, including both dates. Leave either date
        empty for no limit. Articles without a publication date are skipped when
        a date is set.
      </p>
      {error && (
        <p id={`${id}-error`} className="keyword-scrape-error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
