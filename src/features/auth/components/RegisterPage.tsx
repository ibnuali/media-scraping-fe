import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { AuthHeroSection } from "./AuthHeroSection"
import { RegisterForm } from "./RegisterForm"
import { Loader2 } from "lucide-react"

export function RegisterPage() {
  const [error, setError] = useState("")
  const [isLoadingForm, setIsLoadingForm] = useState(false)
  const { register, isAuthenticated, isLoading } = useAuth()
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
      navigate("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoadingForm(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <AuthHeroSection
        badge="Start tracking today"
        title="Start tracking"
        titleAccent="today."
        description="Create an account to manage keywords and scrape news articles automatically. Get started in minutes."
        showStats={false}
        features={[
          "Unlimited keyword tracking",
          "Real-time news scraping",
          "Background job processing",
        ]}
      />
      <RegisterForm
        onSubmit={handleRegister}
        isLoading={isLoadingForm}
        error={error}
      />
    </div>
  )
}
