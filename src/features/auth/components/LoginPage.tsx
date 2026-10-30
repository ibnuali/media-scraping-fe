import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "./LoginForm"
import { AuthHeroSection } from "./AuthHeroSection"
import { Wordmark } from "@/components/wordmark"
import { Loader2 } from "lucide-react"

export function LoginPage() {
  const [error, setError] = useState("")
  const [isLoadingForm, setIsLoadingForm] = useState(false)
  const { login, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/keywords", { replace: true })
    }
  }, [isAuthenticated, navigate])

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-ink-3" />
      </div>
    )
  }

  const handleLogin = async (username: string, password: string) => {
    setError("")
    setIsLoadingForm(true)

    try {
      await login(username, password)
      navigate("/keywords")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoadingForm(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AuthHeroSection
        badge="Keyword monitoring"
        title="Welcome back."
        titleAccent="Pick up where you left off."
        description="Sign in to review your tracked keywords, the articles behind them, and the summaries from your latest scrape."
        features={[
          "Every keyword in one list",
          "Articles with sentiment and matches",
          "A fresh summary on every run",
        ]}
      />

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          <Wordmark className="lg:hidden" />
          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoadingForm}
            error={error}
          />
        </div>
      </div>
    </div>
  )
}
