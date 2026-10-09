import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { authApi } from '@/api/endpoints/auth'
import { mockCandidateAuthResponse, mockEmployerAuthResponse } from '@/api/mocks/auth'
import type {
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  ResendCodeRequest,
  User,
  UserRole,
  VerifyEmailRequest,
} from '@/types/auth'

const jsonSerializer = {
  read: (raw: string) => {
    try {
      if (!raw || raw === '[object Object]' || raw === 'undefined') return null
      return JSON.parse(raw)
    } catch {
      return null
    }
  },
  write: (value: unknown) => JSON.stringify(value),
}

export const useAuthStore = defineStore('auth', () => {
  const user = useStorage<User | null>('huntme_auth_user', null, undefined, {
    serializer: jsonSerializer,
    flush: 'sync',
  })
  const tokens = useStorage<AuthTokens | null>('huntme_auth_tokens', null, undefined, {
    serializer: jsonSerializer,
    flush: 'sync',
  })
  const pendingEmail = useStorage<string>('huntme_auth_pending_email', '', undefined, {
    flush: 'sync',
  })
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!tokens.value?.accessToken && !!user.value)
  const role = computed<UserRole | null>(() => user.value?.role || null)
  const isCandidate = computed(() => user.value?.role === 'candidate')
  const isEmployer = computed(() => user.value?.role === 'employer')

  async function login(payload: LoginRequest) {
    isLoading.value = true
    error.value = null
    try {
      const response = await authApi.login(payload)
      user.value = response.user
      tokens.value = response.tokens
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка при входе в систему'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function register(payload: RegisterRequest) {
    isLoading.value = true
    error.value = null
    try {
      const response = await authApi.register(payload)
      pendingEmail.value = payload.email
      sessionStorage.setItem('huntme_pending_password', payload.password)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка при регистрации'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function verifyEmail(payload: VerifyEmailRequest) {
    isLoading.value = true
    error.value = null
    try {
      const response = await authApi.verifyEmail(payload)
      user.value = response.user
      tokens.value = response.tokens
      pendingEmail.value = ''
      sessionStorage.removeItem('huntme_pending_password')
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка подтверждения email'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function resendCode(payload: ResendCodeRequest) {
    isLoading.value = true
    error.value = null
    try {
      const response = await authApi.resendCode(payload)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Не удалось отправить код повторно'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function setPendingEmail(email: string) {
    pendingEmail.value = email
  }

  function demoLogin(targetRole: 'candidate' | 'employer') {
    const demoData =
      targetRole === 'employer' ? mockEmployerAuthResponse : mockCandidateAuthResponse
    user.value = demoData.user
    tokens.value = demoData.tokens
    error.value = null
  }

  async function logout() {
    try {
      if (tokens.value?.accessToken) {
        await authApi.logout()
      }
    } finally {
      user.value = null
      tokens.value = null
      pendingEmail.value = ''
      error.value = null
      localStorage.removeItem('huntme_auth_tokens')
      localStorage.removeItem('huntme_auth_user')
      localStorage.removeItem('huntme_auth_pending_email')
      sessionStorage.removeItem('huntme_pending_password')
    }
  }

  async function fetchMe() {
    if (!tokens.value?.accessToken) return
    try {
      const me = await authApi.getMe()
      if (user.value) {
        user.value = { ...user.value, ...me }
      }
    } catch {
      // Handled by interceptor if token expired
    }
  }

  return {
    user,
    tokens,
    pendingEmail,
    isLoading,
    error,
    isAuthenticated,
    role,
    isCandidate,
    isEmployer,
    login,
    register,
    verifyEmail,
    resendCode,
    setPendingEmail,
    demoLogin,
    logout,
    fetchMe,
  }
})
