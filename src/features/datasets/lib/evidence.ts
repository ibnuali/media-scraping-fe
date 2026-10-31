// Browser selections use UTF-16 offsets; the backend validates Python Unicode offsets.
export function toEvidenceSpan(text: string, start: number, end: number) {
  return {
    start: Array.from(text.slice(0, start)).length,
    end: Array.from(text.slice(0, end)).length,
  }
}
