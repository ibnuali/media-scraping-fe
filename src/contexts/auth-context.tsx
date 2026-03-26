import { createContext, useContext, type ReactNode } from "react"
import {
  useUser,
  useLogin,
  useRegister,
  useLogout,
  useUpdateProfile,
  useChangePassword,
} from "@/features/auth"
import { getAccessToken } from "@/lib/api"
import type {
  UserResponse,
  UserProfileUpdate,
  PasswordChange,
} from "@/types/auth"

interface AuthContextType {
  user: UserResponse | null | undefined
  isLoading: boolean
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  register: (data: {
    username: string
    password: string
    first_name?: string
    last_name?: string
    email?: string
  }) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: UserProfileUpdate) => Promise<void>
  changePassword: (data: PasswordChange) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useUser()
  const loginMutation = useLogin()
  const registerMutation = useRegister()
  const logoutMutation = useLogout()
  const updateProfileMutation = useUpdateProfile()
  const changePasswordMutation = useChangePassword()

  const login = async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password })
  }

  const register = async (data: {
    username: string
    password: string
    first_name?: string
    last_name?: string
    email?: string
  }) => {
    await registerMutation.mutateAsync(data)
  }

  const logout = async () => {
    await logoutMutation.mutateAsync()
  }

  const updateProfile = async (data: UserProfileUpdate) => {
    await updateProfileMutation.mutateAsync(data)
  }

  const changePassword = async (data: PasswordChange) => {
    await changePasswordMutation.mutateAsync(data)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isLoading && !!getAccessToken(),
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
