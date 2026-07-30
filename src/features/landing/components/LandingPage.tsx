import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { KeyRound, SearchCode, Newspaper, Zap } from "lucide-react"

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md bg-primary">
              <KeyRound className="size-4.5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">KeyCrawl</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Request Account</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Track Keywords.
            <br />
            <span className="text-primary">Scrape News.</span>
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Monitor your keywords and automatically scrape news articles from
            Google. Stay ahead with real-time updates and insights.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign in
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid max-w-4xl gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-border bg-card p-4 text-center">
            <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-md border border-border bg-muted">
              <SearchCode className="size-5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold">Keyword Tracking</h3>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Track unlimited keywords and monitor trends automatically.
            </p>
          </div>
          <div className="rounded-md border border-border bg-card p-4 text-center">
            <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-md border border-border bg-muted">
              <Newspaper className="size-5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold">News Scraping</h3>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Automatically scrape and analyze news articles from Google.
            </p>
          </div>
          <div className="rounded-md border border-border bg-card p-4 text-center">
            <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-md border border-border bg-muted">
              <Zap className="size-5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold">Real-time Updates</h3>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Get instant notifications when new articles are found.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} KeyCrawl. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
