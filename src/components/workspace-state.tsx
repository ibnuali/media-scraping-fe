import type { ReactNode } from "react"
import { AlertCircle, Newspaper } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface WorkspaceStateProps {
  title: string
  description: string
  isError?: boolean
  children?: ReactNode
}

export function WorkspaceState({
  title,
  description,
  isError,
  children,
}: WorkspaceStateProps) {
  const Icon = isError ? AlertCircle : Newspaper
  return (
    <div className="workspace-state" role={isError ? "alert" : "status"}>
      <Icon
        className={
          isError ? "size-6 text-destructive" : "size-6 text-muted-foreground"
        }
      />
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </div>
  )
}

export function WorkspaceLoading() {
  return (
    <div
      className="workspace-loading"
      role="status"
      aria-label="Loading content"
    >
      {[0, 1, 2].map((key) => (
        <div key={key} className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}
