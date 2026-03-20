import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/auth-context'
import { ProtectedRoute } from '@/components/protected-route'
import { MainLayout } from '@/components/main-layout'
import { Login } from '@/pages/login'
import { Register } from '@/pages/register'
import { Keywords } from '@/pages/keywords'
import { KeywordDashboard } from '@/pages/keyword-dashboard'
import { News } from '@/pages/news'

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Keywords />} />
            <Route path="/keywords/:keywordId" element={<KeywordDashboard />} />
            <Route path="/keywords/:keywordId/news" element={<News />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App