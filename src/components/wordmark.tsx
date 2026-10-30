import { KeyRound } from "lucide-react"
import { cn } from "@/lib/utils"

interface WordmarkProps {
  /** Icon square size — controls the type size alongside it. */
  size?: "sm" | "md" | "lg"
  /** Hide the "KeyCrawl" label and render the icon mark only. */
  iconOnly?: boolean
  className?: string
}

const sizes = {
  sm: { mark: "size-7 rounded-md", glyph: "size-3.5", text: "text-sm" },
  md: { mark: "size-9 rounded-lg", glyph: "size-4", text: "text-base" },
  lg: { mark: "size-10 rounded-lg", glyph: "size-4.5", text: "text-lg" },
} as const

export function Wordmark({
  size = "md",
  iconOnly = false,
  className,
}: WordmarkProps) {
  const s = sizes[size]

  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center bg-primary text-primary-foreground",
          s.mark
        )}
      >
        <KeyRound className={s.glyph} />
      </span>
      {!iconOnly && (
        <span
          className={cn(
            "font-semibold tracking-tight text-foreground",
            s.text
          )}
        >
          KeyCrawl
        </span>
      )}
    </span>
  )
}
