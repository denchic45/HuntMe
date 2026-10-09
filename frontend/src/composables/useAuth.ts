import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type {
  LoginRequest,
  RegisterRequest,
  ResendCodeRequest,
  VerifyEmailRequest,
} from '@/types/auth'

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()

  const {
    user,
    tokens,
    pendingEmail,
    isLoading,
    error,
    isAuthenticated,
    role,
    isCandidate,
    isEmployer,
  } = storeToRefs(authStore)

  async function handleLogin(payload: LoginRequest, redirectUrl?: string) {
    const response = await authStore.login(payload)
    if (redirectUrl) {
      router.push(redirectUrl)
    } else if (response.user.role === 'candidate') {
      router.push('/candidate/overview')
    } else if (response.user.role === 'employer') {
      router.push('/employer/dashboard')
    }
    return response
  }

  async function handleRegister(payload: RegisterRequest) {
    const response = await authStore.register(payload)
    return response
  }

  async function handleVerifyEmail(payload: VerifyEmailRequest, redirectUrl?: string) {
    const response = await authStore.verifyEmail(payload)
    if (redirectUrl) {
      router.push(redirectUrl)
    } else if (response.user.role === 'candidate') {
      router.push('/candidate/overview')
    } else if (response.user.role === 'employer') {
      router.push('/employer/dashboard')
    }
    return response
  }

  async function handleResendCode(payload: ResendCodeRequest) {
    return await authStore.resendCode(payload)
  }

  function handleDemoLogin(targetRole: 'candidate' | 'employer') {
    authStore.demoLogin(targetRole)
    if (targetRole === 'candidate') {
      router.push('/candidate/overview')
    } else {
      router.push('/employer/dashboard')
    }
  }

  async function handleLogout() {
    await authStore.logout()
    router.push('/')
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
    login: handleLogin,
    register: handleRegister,
    verifyEmail: handleVerifyEmail,
    resendCode: handleResendCode,
    setPendingEmail: authStore.setPendingEmail,
    demoLogin: handleDemoLogin,
    logout: handleLogout,
    fetchMe: authStore.fetchMe,
  }
}
