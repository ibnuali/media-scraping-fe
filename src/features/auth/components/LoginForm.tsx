import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KeyRound, Loader2, ArrowRight } from "lucide-react"

interface LoginFormProps {
  onSubmit: (username: string, password: string) => Promise<void>
  isLoading: boolean
  error: string
}

export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(username, password)
  }

  return (
    <div className="flex flex-1 flex-col justify-center p-8 sm:p-12 lg:p-16 relative">
      <div className="mx-auto w-full max-w-sm relative z-10">
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary">
            <KeyRound className="size-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-primary">KeyCrawl</span>
        </div>

        <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
        <p className="mt-2 text-muted-foreground">Enter your credentials to sign in</p>

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
            className="h-12 w-full rounded-xl font-medium shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
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
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}