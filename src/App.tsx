import { BrowserRouter, useRoutes } from "react-router-dom"
import { AuthProvider } from "@/contexts/auth-context"
import { routes } from "@/routes"
import { Toaster } from "@/components/ui/sonner"

function AppRoutes() {
  return useRoutes(routes)
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <Toaster />
    </AuthProvider>
  )
}

export default App
