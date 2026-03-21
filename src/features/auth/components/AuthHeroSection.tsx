import { KeyRound, Sparkles } from "lucide-react"

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
    <div className="hidden w-1/2 bg-primary lg:flex lg:flex-col lg:justify-between lg:p-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <KeyRound className="size-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">KeyCrawl</span>
        </div>
      </div>

      <div className="relative z-10">
        {badge && (
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
            <Sparkles className="size-4" />
            <span>{badge}</span>
          </div>
        )}
        <h1 className="text-5xl font-bold leading-tight text-white">
          {title}<br />
          {titleAccent && <span className="text-white/80">{titleAccent}</span>}
        </h1>
        <p className="mt-6 text-lg text-white/70 max-w-md">
          {description}
        </p>

        {showStats && (
          <div className="mt-10 flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">10K+</div>
              <div className="text-sm text-white/60">Keywords tracked</div>
            </div>
            <div className="h-12 w-px bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50K+</div>
              <div className="text-sm text-white/60">Articles scraped</div>
            </div>
          </div>
        )}

        {features && features.length > 0 && (
          <div className="mt-10 space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-white/90">
                <div className="flex size-8 items-center justify-center rounded-full bg-white/20">
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10 text-sm text-white/50">
        &copy; {new Date().getFullYear()} KeyCrawl. All rights reserved.
      </div>
    </div>
  )
}