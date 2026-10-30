import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Wordmark } from "@/components/wordmark"
import {
  Search,
  FileText,
  Sparkles,
  CheckCircle,
  ArrowRight,
} from "lucide-react"

const stages = [
  { label: "Search", detail: "Google News, per keyword", icon: Search },
  { label: "Scrape", detail: "Fetch and extract each article", icon: FileText },
  { label: "Analyze", detail: "Sentiment + matched terms", icon: Sparkles },
  { label: "Summarize", detail: "One readable brief per run", icon: CheckCircle },
]

const capabilities = [
  {
    title: "Keyword tracking",
    body: "Keep the terms you care about in one list and re-scrape them whenever you want fresh coverage.",
    icon: Search,
  },
  {
    title: "News scraping",
    body: "Pull articles from Google News, extract the readable content, and keep a link back to the source.",
    icon: FileText,
  },
  {
    title: "Sentiment and summary",
    body: "Every run scores sentiment across the articles and writes a summary you can read in a minute.",
    icon: Sparkles,
  },
]

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Nav — N1a, legitimate here: the page has exactly two destinations */}
      <header className="sticky top-0 z-30 border-b border-border bg-background">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 lg:px-8">
          <Wordmark />
          <div className="flex items-center gap-1.5">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Request account</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero — left-biased, height of its content, not a centred full-viewport block */}
        <section className="border-b border-border">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:py-20 lg:px-8">
            <div className="flex flex-col justify-center">
              <p className="font-mono text-[11px] tracking-[0.14em] text-primary uppercase">
                Keyword monitoring
              </p>
              <h1 className="mt-4 text-3xl leading-[1.06] font-semibold tracking-[-0.03em] text-balance text-foreground sm:text-[2.5rem]">
                Track a keyword.
                <br />
                Read what the web says.
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-2">
                KeyCrawl monitors the keywords you care about and scrapes the
                news behind them — sentiment, matched terms, and a fresh summary
                on every run.
              </p>
              <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <Link to="/register" className="sm:w-auto">
                  <Button className="w-full gap-1.5 sm:w-auto">
                    Get started
                    <ArrowRight className="size-3.5" />
                  </Button>
                </Link>
                <Link to="/login" className="sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Sign in
                  </Button>
                </Link>
              </div>
            </div>

            {/* Tier-A CSS art: the real scrape pipeline, drawn in rules and mono */}
            <div className="flex flex-col justify-center">
              <div className="overflow-hidden rounded-lg border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                  <span className="font-mono text-[11px] tracking-[0.08em] text-ink-3 uppercase">
                    Scrape pipeline
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-[11px] text-ink-3">
                    <span className="size-1.5 rounded-full bg-success" />
                    idle
                  </span>
                </div>
                <ol className="divide-y divide-border">
                  {stages.map((stage, index) => (
                    <li
                      key={stage.label}
                      className="flex items-center gap-3.5 px-4 py-3.5"
                    >
                      <span className="font-mono text-[11px] tabular-nums text-ink-3">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <stage.icon className="size-4 shrink-0 text-primary" />
                      <span className="min-w-0">
                        <span className="block text-[13px] font-medium text-foreground">
                          {stage.label}
                        </span>
                        <span className="block truncate text-xs text-ink-2">
                          {stage.detail}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities — rule-separated typographic list, not a 3-up card grid */}
        <section className="mx-auto w-full max-w-6xl px-4 py-14 lg:px-8">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            What it does
          </h2>
          <ul className="mt-6 divide-y divide-border border-y border-border">
            {capabilities.map((item) => (
              <li
                key={item.title}
                className="grid gap-2 py-6 sm:grid-cols-[0.8fr_1.2fr] sm:gap-8"
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="size-4 shrink-0 text-primary" />
                  <h3 className="text-[13px] font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                </div>
                <p className="max-w-prose text-sm leading-relaxed text-ink-2">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {/* Footer — Ft2, inline single line */}
      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row lg:px-8">
          <Wordmark size="sm" />
          <p className="font-mono text-[11px] text-ink-3">
            © {new Date().getFullYear()} KeyCrawl
          </p>
        </div>
      </footer>
    </div>
  )
}
