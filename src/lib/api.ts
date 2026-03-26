import type { PasswordChange, Token, UserProfileUpdate } from "@/types/auth"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"
const WS_URL = import.meta.env.VITE_WS_URL || API_URL.replace(/^http/, "ws")

// Token storage
const TOKEN_KEY = "access_token"
const REFRESH_TOKEN_KEY = "refresh_token"

export function getWebSocketUrl(endpoint: string): string {
  return WS_URL + endpoint
}

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setTokens(tokens: Token): void {
  localStorage.setItem(TOKEN_KEY, tokens.access_token)
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token)
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

// API Error class
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// Refresh token if needed
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!response.ok) {
      clearTokens()
      return null
    }

    const tokens: Token = await response.json()
    setTokens(tokens)
    return tokens.access_token
  } catch {
    clearTokens()
    return null
  }
}

// Base fetch wrapper with auth
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`
  const headers = new Headers(options.headers)

  // Add JSON content type for non-FormData bodies
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json")
  }

  // Add auth token if available
  const token = getAccessToken()
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  let response = await fetch(url, {
    ...options,
    headers,
  })

  // Try to refresh token on 401
  if (
    response.status === 401 &&
    endpoint !== "/auth/login" &&
    endpoint !== "/auth/refresh"
  ) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      headers.set("Authorization", `Bearer ${newToken}`)
      response = await fetch(url, {
        ...options,
        headers,
      })
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(
      response.status,
      errorData.detail || `Request failed with status ${response.status}`
    )
  }

  // Handle empty responses (e.g. 204 No Content)
  const text = await response.text()
  if (!text) return undefined as T
  return JSON.parse(text) as T
}

// Auth API
export const authApi = {
  login: async (username: string, password: string): Promise<Token> => {
    // OAuth2 form data
    const formData = new URLSearchParams()
    formData.append("username", username)
    formData.append("password", password)

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.detail || "Login failed")
    }

    return response.json()
  },

  register: async (data: {
    username: string
    password: string
    first_name?: string
    last_name?: string
    email?: string
  }): Promise<Token> => {
    return apiFetch<Token>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  logout: async (): Promise<void> => {
    const refreshToken = getRefreshToken()
    if (refreshToken) {
      try {
        await apiFetch("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refresh_token: refreshToken }),
        })
      } catch {
        // Ignore logout errors
      }
    }
    clearTokens()
  },

  me: async () => {
    return apiFetch<{
      id: string
      username: string
      first_name?: string
      last_name?: string
      email?: string
      created_at: string
    }>("/auth/me")
  },

  updateProfile: async (data: UserProfileUpdate) => {
    return apiFetch<import("@/types/auth").UserResponse>("/auth/me/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  changePassword: async (data: PasswordChange) => {
    return apiFetch<void>("/auth/me/password", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
}

// Keywords API
export const keywordsApi = {
  list: async () => {
    return apiFetch<import("@/types/keyword").KeywordResponse[]>("/keywords/")
  },

  stats: async () => {
    return apiFetch<import("@/types/keyword").KeywordStatsResponse>(
      "/keywords/stats"
    )
  },

  get: async (id: string) => {
    return apiFetch<import("@/types/keyword").KeywordResponse>(
      `/keywords/${id}`
    )
  },

  create: async (data: import("@/types/keyword").KeywordCreate) => {
    return apiFetch<import("@/types/keyword").KeywordResponse>("/keywords/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  update: async (id: string, data: import("@/types/keyword").KeywordUpdate) => {
    return apiFetch<import("@/types/keyword").KeywordResponse>(
      `/keywords/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    )
  },

  delete: async (id: string) => {
    return apiFetch<void>(`/keywords/${id}`, {
      method: "DELETE",
    })
  },

  scrape: async (id: string) => {
    return apiFetch<import("@/types/keyword").ScrapingJobStartResponse>(
      `/keywords/${id}/scrape`,
      {
        method: "POST",
      }
    )
  },

  getScrapeJob: async (jobId: string) => {
    return apiFetch<import("@/types/keyword").ScrapingJobResponse>(
      `/keywords/scrape-jobs/${jobId}`
    )
  },

  news: async (id: string, limit = 20, offset = 0) => {
    return apiFetch<import("@/types/keyword").PaginatedNewsResponse>(
      `/keywords/${id}/news?limit=${limit}&offset=${offset}`
    )
  },

  analytics: async (id: string) => {
    return apiFetch<import("@/types/keyword").KeywordAnalyticsResponse>(
      `/keywords/${id}/analytics`
    )
  },

  summarize: async (id: string) => {
    return apiFetch<{ keyword_id: string; status: string; message: string }>(
      `/keywords/${id}/summarize`,
      {
        method: "POST",
      }
    )
  },
}

// Notifications API
export const notificationsApi = {
  list: async (
    params?: import("@/types/notification").NotificationListParams
  ) => {
    const searchParams = new URLSearchParams()
    if (params?.limit) searchParams.set("limit", String(params.limit))
    if (params?.offset) searchParams.set("offset", String(params.offset))
    if (params?.unread_only) searchParams.set("unread_only", "true")
    const query = searchParams.toString()
    return apiFetch<import("@/types/notification").NotificationListResponse>(
      `/notifications/${query ? `?${query}` : ""}`
    )
  },

  getUnreadCount: async () => {
    return apiFetch<import("@/types/notification").UnreadCountResponse>(
      "/notifications/unread-count"
    )
  },

  markAsRead: async (id: string) => {
    return apiFetch<import("@/types/notification").Notification>(
      `/notifications/${id}/read`,
      {
        method: "PATCH",
      }
    )
  },

  markAllAsRead: async () => {
    return apiFetch<import("@/types/notification").MarkAllReadResponse>(
      "/notifications/read-all",
      {
        method: "PATCH",
      }
    )
  },

  delete: async (id: string) => {
    return apiFetch<void>(`/notifications/${id}`, {
      method: "DELETE",
    })
  },
}
