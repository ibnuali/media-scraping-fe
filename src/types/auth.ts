// Auth types
export interface Token {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface UserResponse {
  id: string  // UUID
  username: string
  first_name?: string
  last_name?: string
  email?: string
  created_at: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
  first_name?: string
  last_name?: string
  email?: string
}