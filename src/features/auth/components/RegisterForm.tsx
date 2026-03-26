import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KeyRound, Loader2, ArrowRight } from "lucide-react"

interface RegisterFormProps {
  onSubmit: (data: {
    username: string
    password: string
    first_name?: string
    last_name?: string
    email?: string
  }) => Promise<void>
  isLoading: boolean
  error: string
}

export function RegisterForm({
  onSubmit,
  isLoading,
  error,
}: RegisterFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [localError, setLocalError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match")
      return
    }

    await onSubmit({
      username,
      password,
      first_name: firstName || undefined,
      last_name: lastName || undefined,
      email: email || undefined,
    })
  }

  const displayError = localError || error

  return (
    <div className="relative flex flex-1 flex-col justify-center overflow-y-auto p-8 sm:p-12 lg:p-16">
      <div className="relative z-10 mx-auto w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary">
            <KeyRound className="size-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-primary">KeyCrawl</span>
        </div>

        <h2 className="text-3xl font-bold tracking-tight">Create account</h2>
        <p className="mt-2 text-muted-foreground">
          Fill in your details to get started
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {displayError && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive backdrop-blur-sm">
              {displayError}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Username
            </Label>
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
              <Label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </Label>
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
              <Label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </Label>
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
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
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
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
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
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </Label>
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
            className="mt-2 h-12 w-full rounded-xl font-medium shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
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
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
