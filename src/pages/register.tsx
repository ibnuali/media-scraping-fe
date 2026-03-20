import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { KeyRound, Loader2, Sparkles, ArrowRight } from 'lucide-react'

export function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      await register({
        username,
        password,
        first_name: firstName || undefined,
        last_name: lastName || undefined,
        email: email || undefined,
      })
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
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
            <span>Start tracking today</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight text-white">
            Start tracking<br />
            <span className="text-white/80">today.</span>
          </h1>
          <p className="mt-6 text-lg text-white/70 max-w-md">
            Create an account to manage keywords and scrape news articles automatically. Get started in minutes.
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3 text-white/90">
              <div className="flex size-8 items-center justify-center rounded-full bg-white/20">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Unlimited keyword tracking</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="flex size-8 items-center justify-center rounded-full bg-white/20">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Real-time news scraping</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="flex size-8 items-center justify-center rounded-full bg-white/20">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Background job processing</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-white/50">
          &copy; {new Date().getFullYear()} KeyCrawl. All rights reserved.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-1 flex-col justify-center p-8 sm:p-12 lg:p-16 relative overflow-y-auto">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="mx-auto w-full max-w-sm relative z-10">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-xl gradient-bg">
              <KeyRound className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">KeyCrawl</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight">Create account</h2>
          <p className="mt-2 text-muted-foreground">
            Fill in your details to get started
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="username"
                className="h-11 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm transition-all focus:border-primary focus:ring-primary/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isLoading}
                  autoComplete="given-name"
                  className="h-11 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm transition-all focus:border-primary focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isLoading}
                  autoComplete="family-name"
                  className="h-11 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm transition-all focus:border-primary focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
                className="h-11 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm transition-all focus:border-primary focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="new-password"
                className="h-11 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm transition-all focus:border-primary focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="new-password"
                className="h-11 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm transition-all focus:border-primary focus:ring-primary/20"
              />
            </div>
            <Button
              type="submit"
              className="h-12 w-full rounded-xl gradient-bg text-white font-medium shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="ml-2 size-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}