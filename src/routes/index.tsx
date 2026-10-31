import { ProtectedRoute } from "@/components/protected-route"
import { MainLayout } from "@/components/main-layout"
import { LoginPage, RegisterPage, ProfilePage } from "@/features/auth"
import { LandingPage } from "@/features/landing"
import { KeywordsPage } from "@/features/keywords"
import { KeywordDashboardPage } from "@/features/keyword-dashboard"
import { NewsPage } from "@/features/news"
import { KeywordWorkspaceLayout } from "@/components/keyword-workspace-layout"
import { ArticleAnalysisPage } from "@/features/news/components/ArticleAnalysisPage"

export const routes = [
  {
    path: "/",
    element: <LandingPage />,
  },
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
        <KeywordWorkspaceLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/keywords", element: <KeywordsPage /> },
      {
        path: "/keywords/:keywordId/news/:articleId/analysis",
        element: <ArticleAnalysisPage />,
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
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
