import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { KeyRound, SearchCode, Newspaper, Zap, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary">
              <KeyRound className="size-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">KeyCrawl</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button>Request Account</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Track Keywords.
            <br />
            <span className="text-primary">Scrape News.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Monitor your keywords and automatically scrape news articles from
            Google. Stay ahead with real-time updates and insights.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
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
        <div className="mt-16 grid max-w-4xl gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-border/50 bg-muted/30 p-6 text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <SearchCode className="size-6 text-primary" />
            </div>
            <h3 className="font-semibold">Keyword Tracking</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Track unlimited keywords and monitor trends automatically.
            </p>
          </div>
          <div className="rounded-xl border border-border/50 bg-muted/30 p-6 text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <Newspaper className="size-6 text-primary" />
            </div>
            <h3 className="font-semibold">News Scraping</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Automatically scrape and analyze news articles from Google.
            </p>
          </div>
          <div className="rounded-xl border border-border/50 bg-muted/30 p-6 text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <Zap className="size-6 text-primary" />
            </div>
            <h3 className="font-semibold">Real-time Updates</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get instant notifications when new articles are found.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} KeyCrawl. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
