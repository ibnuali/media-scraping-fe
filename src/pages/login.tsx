import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { KeyRound, Loader2, Sparkles, ArrowRight } from 'lucide-react'

export function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(username, password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Hero */}
      <div className="hidden w-1/2 gradient-bg lg:flex lg:flex-col lg:justify-between lg:p-12 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
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
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
            <Sparkles className="size-4" />
            <span>Automated keyword tracking</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight text-white">
            Track keywords.<br />
            <span className="text-white/80">Scrape news.</span>
          </h1>
          <p className="mt-6 text-lg text-white/70 max-w-md">
            Monitor your keywords and automatically scrape news articles from Google. Stay ahead with real-time updates.
          </p>

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
        </div>

        <div className="relative z-10 text-sm text-white/50">
          &copy; {new Date().getFullYear()} KeyCrawl. All rights reserved.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-1 flex-col justify-center p-8 sm:p-12 lg:p-16 relative">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="mx-auto w-full max-w-sm relative z-10">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-xl gradient-bg">
              <KeyRound className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">KeyCrawl</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
          <p className="mt-2 text-muted-foreground">
            Enter your credentials to sign in
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive backdrop-blur-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="username"
                className="h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm transition-all focus:border-primary focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="current-password"
                className="h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm transition-all focus:border-primary focus:ring-primary/20"
              />
            </div>
            <Button
              type="submit"
              className="h-12 w-full rounded-xl gradient-bg text-white font-medium shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 size-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}