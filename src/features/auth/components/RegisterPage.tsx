import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { RegisterForm } from "./RegisterForm"
import { AuthHeroSection } from "./AuthHeroSection"
import { Wordmark } from "@/components/wordmark"
import { Loader2 } from "lucide-react"

export function RegisterPage() {
  const [error, setError] = useState("")
  const [isLoadingForm, setIsLoadingForm] = useState(false)
  const { register, isAuthenticated, isLoading } = useAuth()
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

  const handleRegister = async (data: {
    username: string
    password: string
    first_name?: string
    last_name?: string
    email?: string
  }) => {
    setError("")
    setIsLoadingForm(true)

    try {
      await register(data)
      navigate("/keywords")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoadingForm(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AuthHeroSection
        badge="Request access"
        title="Start tracking."
        titleAccent="Scrape the news behind it."
        description="Create an account to track keywords, pull the articles behind them, and get sentiment plus a summary on every scrape."
        features={[
          "Track the terms you care about",
          "Scrape articles from Google News",
          "Sentiment, matched terms, summaries",
        ]}
      />

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          <Wordmark className="lg:hidden" />
          <RegisterForm
            onSubmit={handleRegister}
            isLoading={isLoadingForm}
            error={error}
          />
        </div>
      </div>
    </div>
  )
}
