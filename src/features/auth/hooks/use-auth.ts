import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { authApi, setTokens, clearTokens, getAccessToken } from "@/lib/api"
import type {
  UserResponse,
  UserProfileUpdate,
  PasswordChange,
} from "@/types/auth"

interface RegisterData {
  username: string
  password: string
  first_name?: string
  last_name?: string
  email?: string
}

export function useUser() {
  return useQuery<UserResponse | null>({
    queryKey: ["user"],
    queryFn: async () => {
      const token = getAccessToken()
      if (!token) return null
      return authApi.me()
    },
    retry: false,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string
      password: string
    }) => authApi.login(username, password),
    onSuccess: async (tokens) => {
      setTokens(tokens)
      await queryClient.refetchQueries({ queryKey: ["user"] })
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: async (tokens) => {
      setTokens(tokens)
      await queryClient.refetchQueries({ queryKey: ["user"] })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearTokens()
      queryClient.setQueryData(["user"], null)
      queryClient.clear()
    },
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UserProfileUpdate) => authApi.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["user"], updatedUser)
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: PasswordChange) => authApi.changePassword(data),
  })
}
