import { ProtectedRoute } from "@/components/protected-route"
import { MainLayout } from "@/components/main-layout"
import { LoginPage, RegisterPage, ProfilePage } from "@/features/auth"
import { KeywordsPage } from "@/features/keywords"
import { KeywordDashboardPage } from "@/features/keyword-dashboard"
import { NewsPage } from "@/features/news"

export const routes = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <KeywordsPage />,
      },
      {
        path: "/keywords/:keywordId",
        element: <KeywordDashboardPage />,
      },
      {
        path: "/keywords/:keywordId/news",
        element: <NewsPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
    ],
  },
]
