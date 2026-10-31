export interface DatasetFeedbackProps {
  error?: Error | null
  message?: string
}
export function DatasetFeedback({ error, message }: DatasetFeedbackProps) {
  if (error)
    return (
      <p role="alert" className="text-sm text-destructive">
        {error.message}
      </p>
    )
  if (message)
    return (
      <p role="status" className="text-sm text-muted-foreground">
        {message}
      </p>
    )
  return null
}
