import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import type { AuthTokens } from '@/types/auth'

export const isMockMode = false

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const rawTokens = localStorage.getItem('huntme_auth_tokens')
      if (rawTokens) {
        const parsed = JSON.parse(rawTokens) as AuthTokens
        if (parsed?.accessToken) {
          config.headers.Authorization = `Bearer ${parsed.accessToken}`
        }
      }
    } catch {
      // Ignored
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const rawTokens = localStorage.getItem('huntme_auth_tokens')
        if (rawTokens) {
          const parsed = JSON.parse(rawTokens) as AuthTokens
          const refreshToken = parsed?.refreshToken

          if (refreshToken) {
            const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL || ''
            const keycloakRealm = import.meta.env.VITE_KEYCLOAK_REALM || 'huntme'
            const keycloakClientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'huntme-frontend'

            const params = new URLSearchParams()
            params.append('grant_type', 'refresh_token')
            params.append('client_id', keycloakClientId)
            params.append('refresh_token', refreshToken)

            const refreshResponse = await axios.post<{
              access_token: string
              refresh_token?: string
            }>(`${keycloakUrl}/realms/${keycloakRealm}/protocol/openid-connect/token`, params, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              timeout: 5000,
            })

            const newTokens: AuthTokens = {
              accessToken: refreshResponse.data.access_token,
              refreshToken: refreshResponse.data.refresh_token || refreshToken,
            }
            parsed.accessToken = newTokens.accessToken
            parsed.refreshToken = newTokens.refreshToken
            localStorage.setItem('huntme_auth_tokens', JSON.stringify(parsed))

            apiClient.defaults.headers.common.Authorization = `Bearer ${newTokens.accessToken}`
            originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`

            processQueue(null)
            return apiClient(originalRequest)
          }
        }
      } catch (refreshErr) {
        processQueue(refreshErr as Error)
        localStorage.removeItem('huntme_auth_tokens')
        localStorage.removeItem('huntme_auth_user')
        window.dispatchEvent(new Event('auth:unauthorized'))
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient
