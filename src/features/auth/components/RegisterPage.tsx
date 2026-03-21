import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { AuthHeroSection } from "./AuthHeroSection"
import { RegisterForm } from "./RegisterForm"

export function RegisterPage() {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleRegister = async (data: {
    username: string
    password: string
    first_name?: string
    last_name?: string
    email?: string
  }) => {
    setError("")
    setIsLoading(true)

    try {
      await register(data)
      navigate("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoading(false)
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
      <RegisterForm onSubmit={handleRegister} isLoading={isLoading} error={error} />
    </div>
  )
}