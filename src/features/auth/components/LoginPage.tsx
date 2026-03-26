import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { AuthHeroSection } from "./AuthHeroSection"
import { LoginForm } from "./LoginForm"
import { Loader2 } from "lucide-react"

export function LoginPage() {
  const [error, setError] = useState("")
  const [isLoadingForm, setIsLoadingForm] = useState(false)
  const { login, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true })
    }
  }, [isAuthenticated, navigate])

  // Show loading while checking auth status
  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const handleLogin = async (username: string, password: string) => {
    setError("")
    setIsLoadingForm(true)

    try {
      await login(username, password)
      navigate("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoadingForm(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <AuthHeroSection
        badge="Automated keyword tracking"
        title="Track keywords."
        titleAccent="Scrape news."
        description="Monitor your keywords and automatically scrape news articles from Google. Stay ahead with real-time updates."
        showStats={true}
      />
      <LoginForm
        onSubmit={handleLogin}
        isLoading={isLoadingForm}
        error={error}
      />
    </div>
  )
}
