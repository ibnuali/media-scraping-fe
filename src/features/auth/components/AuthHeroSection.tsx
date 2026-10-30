import { Check, Sparkles } from "lucide-react"
import { Wordmark } from "@/components/wordmark"

interface AuthHeroSectionProps {
  badge?: string
  title: string
  titleAccent?: string
  description: string
  features?: string[]
}

export function AuthHeroSection({
  badge,
  title,
  titleAccent,
  description,
  features,
}: AuthHeroSectionProps) {
  return (
    <div className="hidden w-1/2 flex-col justify-between border-r border-border bg-card p-10 lg:flex">
      <Wordmark />

      <div>
        {badge && (
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1 font-mono text-[11px] tracking-[0.08em] text-ink-2 uppercase">
            <Sparkles className="size-3" />
            <span>{badge}</span>
          </div>
        )}
        <h1 className="text-3xl leading-[1.1] font-semibold tracking-[-0.03em] text-foreground">
          {title}
          {titleAccent && (
            <>
              <br />
              <span className="text-ink-2">{titleAccent}</span>
            </>
          )}
        </h1>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-2">
          {description}
        </p>

        {features && features.length > 0 && (
          <ul className="mt-7 space-y-2.5">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-sm border border-border bg-background">
                  <Check className="size-3 text-primary" />
                </span>
                <span className="text-[13px] text-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="font-mono text-[11px] text-ink-3">
        © {new Date().getFullYear()} KeyCrawl
      </p>
    </div>
  )
}
