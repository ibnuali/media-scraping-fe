import type { PublicationDateRange } from "@/types/keyword"

export function parsePublicationDateRange(
  startDate: string,
  endDate: string
): PublicationDateRange | undefined {
  for (const value of [startDate, endDate]) {
    if (!value) continue
    const date = new Date(`${value}T00:00:00Z`)
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
      Number.isNaN(date.getTime()) ||
      date.getUTCFullYear() < 1 ||
      date.toISOString().slice(0, 10) !== value
    ) {
      throw new Error("Enter a valid date in YYYY-MM-DD format.")
    }
  }
  if (startDate && endDate && startDate > endDate) {
    throw new Error("Start date must be on or before the end date.")
  }
  if (!startDate && !endDate) return undefined
  return {
    ...(startDate ? { start_date: startDate } : {}),
    ...(endDate ? { end_date: endDate } : {}),
  }
}
