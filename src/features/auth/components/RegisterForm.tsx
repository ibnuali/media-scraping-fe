import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react"

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

function PasswordInput({
  id,
  label,
  value,
  onChange,
  disabled,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  disabled: boolean
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          placeholder="password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          disabled={disabled}
          autoComplete="new-password"
          className="h-10 pr-10"
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-3 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
          tabIndex={-1}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  )
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
    <Card className="rounded-lg">
      <CardHeader className="space-y-1 border-b pb-3">
        <CardTitle className="text-base font-semibold tracking-tight">
          Request account
        </CardTitle>
        <p className="text-[13px] text-ink-2">
          Fill in your details to get started
        </p>
      </CardHeader>
      <CardContent className="pt-1">
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {displayError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-2.5 text-[13px] text-destructive"
            >
              <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
              <span>{displayError}</span>
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="username"
              className="h-10"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isLoading}
                autoComplete="given-name"
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isLoading}
                autoComplete="family-name"
                className="h-10"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoComplete="email"
              className="h-10"
            />
          </div>
          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={setPassword}
            disabled={isLoading}
          />
          <PasswordInput
            id="confirmPassword"
            label="Confirm password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            disabled={isLoading}
          />
          <Button type="submit" className="h-10 w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating account…
              </>
            ) : (
              "Request account"
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-[13px] text-ink-2">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
