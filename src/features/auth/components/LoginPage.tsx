import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { AuthHeroSection } from "./AuthHeroSection"
import { LoginForm } from "./LoginForm"

export function LoginPage() {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (username: string, password: string) => {
    setError("")
    setIsLoading(true)

    try {
      await login(username, password)
      navigate("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
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
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
    </div>
  )
}