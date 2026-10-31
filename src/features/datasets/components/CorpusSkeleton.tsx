import { Skeleton } from "@/components/ui/skeleton"
export function CorpusSkeleton() {
  return (
    <div role="status" aria-label="Loading corpus" className="space-y-3">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  )
}
