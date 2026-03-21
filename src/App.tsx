import { BrowserRouter, useRoutes } from 'react-router-dom'
import { AuthProvider } from '@/contexts/auth-context'
import { routes } from '@/routes'

function AppRoutes() {
  return useRoutes(routes)
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App