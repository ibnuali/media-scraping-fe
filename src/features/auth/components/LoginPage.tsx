import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "./LoginForm"
import { Loader2, KeyRound } from "lucide-react"

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
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
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
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary">
            <KeyRound className="size-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">KeyCrawl</span>
        </div>

        <LoginForm
          onSubmit={handleLogin}
          isLoading={isLoadingForm}
          error={error}
        />
      </div>
    </div>
  )
}
