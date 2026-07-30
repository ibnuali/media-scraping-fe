import { Sparkles } from "lucide-react"
import keycrawlLogo from "/icon.png"
interface AuthHeroSectionProps {
  badge?: string
  title: string
  titleAccent?: string
  description: string
  showStats?: boolean
  features?: string[]
}

export function AuthHeroSection({
  badge,
  title,
  titleAccent,
  description,
  showStats = true,
  features,
}: AuthHeroSectionProps) {
  return (
    <div className="hidden w-1/2 border-r border-border bg-card lg:flex lg:flex-col lg:justify-between lg:p-8">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md bg-primary">
            <img
              src={keycrawlLogo}
              alt="KeyCrawl"
              className="size-5 text-primary-foreground"
            />
          </div>
          <span className="text-xl font-bold text-foreground">KeyCrawl</span>
        </div>
      </div>

      <div>
        {badge && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-1.5 text-sm text-muted-foreground">
            <Sparkles className="size-3.5" />
            <span>{badge}</span>
          </div>
        )}
        <h1 className="text-3xl leading-tight font-bold text-foreground">
          {title}
          <br />
          {titleAccent && <span className="text-muted-foreground">{titleAccent}</span>}
        </h1>
        <p className="mt-4 max-w-md text-sm text-muted-foreground">{description}</p>

        {showStats && (
          <div className="mt-6 flex items-center gap-4">
            <div className="text-center">
              <div className="font-mono text-2xl font-bold text-foreground">10K+</div>
              <div className="text-xs text-muted-foreground">Keywords tracked</div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="text-center">
              <div className="font-mono text-2xl font-bold text-foreground">50K+</div>
              <div className="text-xs text-muted-foreground">Articles scraped</div>
            </div>
          </div>
        )}

        {features && features.length > 0 && (
          <div className="mt-6 space-y-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-foreground"
              >
                <div className="flex size-7 items-center justify-center rounded-md border border-border bg-muted">
                  <svg
                    className="size-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} KeyCrawl. All rights reserved.
      </div>
    </div>
  )
}
