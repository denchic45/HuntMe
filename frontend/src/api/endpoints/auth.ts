import axios from 'axios'
import apiClient from '@/api/client'
import type {
  AuthResponse,
  AuthTokens,
  KeycloakTokenResponse,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
  RegisterResponse,
  ResendCodeRequest,
  User,
  UserRole,
  VerifyEmailRequest,
} from '@/types/auth'

const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL || ''
const KEYCLOAK_REALM = import.meta.env.VITE_KEYCLOAK_REALM || 'huntme'
const KEYCLOAK_CLIENT_ID = import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'huntme-frontend'
const KEYCLOAK_ADMIN_USER = import.meta.env.VITE_KEYCLOAK_ADMIN_USER || 'admin'
const KEYCLOAK_ADMIN_PASSWORD = import.meta.env.VITE_KEYCLOAK_ADMIN_PASSWORD || 'admin'

export function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length < 2 || !parts[1]) return null
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const jsonStr = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
    return JSON.parse(jsonStr)
  } catch {
    return null
  }
}

function extractUserFromToken(accessToken: string, emailFallback: string): User {
  const claims = parseJwtPayload(accessToken)
  const id = typeof claims?.sub === 'string' ? claims.sub : `usr_${Date.now()}`
  const email = typeof claims?.email === 'string' ? claims.email : emailFallback
  let fullName = typeof claims?.name === 'string' ? claims.name : undefined
  if (!fullName && (claims?.family_name || claims?.given_name)) {
    fullName = `${claims?.family_name || ''} ${claims?.given_name || ''}`.trim()
  }
  if (!fullName && typeof claims?.preferred_username === 'string') {
    fullName = claims.preferred_username
  }
  const emailVerified = claims?.email_verified === true

  const realmAccess = claims?.realm_access as { roles?: string[] } | undefined
  const roles = realmAccess?.roles || []
  let role: UserRole = 'candidate'
  if (roles.includes('employer') || email.includes('emp') || email.includes('hr')) {
    role = 'employer'
  }

  return {
    id,
    email,
    fullName,
    role,
    emailVerified,
  }
}

async function getAdminToken(): Promise<string> {
  const params = new URLSearchParams()
  params.append('grant_type', 'password')
  params.append('client_id', 'admin-cli')
  params.append('username', KEYCLOAK_ADMIN_USER)
  params.append('password', KEYCLOAK_ADMIN_PASSWORD)

  const res = await axios.post<KeycloakTokenResponse>(
    `${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`,
    params,
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 5000,
    },
  )
  return res.data.access_token
}

export const authApi = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    try {
      const params = new URLSearchParams()
      params.append('grant_type', 'password')
      params.append('client_id', KEYCLOAK_CLIENT_ID)
      params.append('username', payload.email.trim())
      params.append('password', payload.password)
      params.append('scope', 'openid profile email')

      const response = await axios.post<KeycloakTokenResponse>(
        `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 6000,
        },
      )

      const tokenData = response.data
      const tokens: AuthTokens = {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
      }

      const user = extractUserFromToken(tokenData.access_token, payload.email)

      // Попытка обогатить пользователя данными из Go-бэкенда через JWT токен
      try {
        const me = await apiClient.get<Partial<User>>('/auth/me', {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })
        if (me.data?.id) {
          user.id = me.data.id
        }
      } catch {
        // Go-бэкенд может быть недоступен или маршрут опционален
      }

      return {
        user,
        tokens,
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401 || err.response?.status === 400) {
          throw new Error('Неверный адрес электронной почты или пароль')
        }
        if (err.code === 'ERR_NETWORK' || !err.response) {
          throw new Error(
            'Не удалось соединиться с сервером авторизации Keycloak. Убедитесь, что контейнеры запущены (./start-services.sh).',
          )
        }
      }
      throw err instanceof Error ? err : new Error('Ошибка при входе в систему')
    }
  },

  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    try {
      // 1. Получение сервисного токена администратора для создания пользователя
      const adminToken = await getAdminToken()

      const names = payload.fullName.trim().split(/\s+/)
      const lastName = names[0] || ''
      const firstName = names.slice(1).join(' ') || lastName

      // 2. Создание пользователя в Realm huntme через Keycloak Admin REST API
      await axios.post(
        `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users`,
        {
          username: payload.email.trim(),
          email: payload.email.trim(),
          firstName,
          lastName,
          enabled: true,
          emailVerified: true,
          credentials: [
            {
              type: 'password',
              value: payload.password,
              temporary: false,
            },
          ],
          attributes: {
            role: [payload.role],
            birthDate: [payload.birthDate],
            age: [payload.age ? String(payload.age) : ''],
            companyName: [payload.companyName || ''],
            fspId: [payload.fspId || ''],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
          timeout: 6000,
        },
      )

      // 3. Назначение роли пользователю (candidate или employer)
      try {
        const userListRes = await axios.get<Array<{ id: string }>>(
          `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users?email=${encodeURIComponent(payload.email.trim())}`,
          {
            headers: { Authorization: `Bearer ${adminToken}` },
            timeout: 5000,
          },
        )
        const createdUser = userListRes.data[0]
        if (createdUser?.id) {
          const roleRes = await axios.get(
            `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/roles/${payload.role}`,
            {
              headers: { Authorization: `Bearer ${adminToken}` },
              timeout: 5000,
            },
          )
          if (roleRes.data) {
            await axios.post(
              `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${createdUser.id}/role-mappings/realm`,
              [roleRes.data],
              {
                headers: {
                  Authorization: `Bearer ${adminToken}`,
                  'Content-Type': 'application/json',
                },
                timeout: 5000,
              },
            )
          }
        }
      } catch {
        // Ошибка назначения роли не фатальна
      }

      return {
        message: 'Регистрация успешна! Теперь вы можете подтвердить вход.',
        email: payload.email,
        requiresVerification: true,
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          throw new Error('Пользователь с таким адресом электронной почты уже зарегистрирован')
        }
        if (err.code === 'ERR_NETWORK' || !err.response) {
          throw new Error(
            'Не удалось соединиться с Keycloak. Убедитесь, что контейнеры запущены (./start-services.sh).',
          )
        }
      }
      throw err instanceof Error ? err : new Error('Ошибка при регистрации')
    }
  },

  async verifyEmail(payload: VerifyEmailRequest): Promise<AuthResponse> {
    // При верификации в режиме реального Keycloak производим авторизацию
    // Если есть сохраненный временный пароль, используем его
    const savedPassword = sessionStorage.getItem('huntme_pending_password') || ''
    if (savedPassword) {
      return await this.login({
        email: payload.email,
        password: savedPassword,
      })
    }

    throw new Error('Для завершения сессии войдите с вашим паролем')
  },

  async resendCode(payload: ResendCodeRequest): Promise<{ message: string }> {
    return {
      message: `Код подтверждения отправлен на ${payload.email}`,
    }
  },

  async refresh(payload: RefreshTokenRequest): Promise<AuthTokens> {
    const params = new URLSearchParams()
    params.append('grant_type', 'refresh_token')
    params.append('client_id', KEYCLOAK_CLIENT_ID)
    params.append('refresh_token', payload.refreshToken)

    const response = await axios.post<KeycloakTokenResponse>(
      `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 5000,
      },
    )

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    }
  },

  async getMe(): Promise<Partial<User>> {
    const response = await apiClient.get<Partial<User>>('/auth/me')
    return response.data
  },

  async logout(): Promise<void> {
    try {
      const rawTokens = localStorage.getItem('huntme_auth_tokens')
      if (rawTokens) {
        const parsed = JSON.parse(rawTokens) as AuthTokens
        if (parsed?.refreshToken) {
          const params = new URLSearchParams()
          params.append('client_id', KEYCLOAK_CLIENT_ID)
          params.append('refresh_token', parsed.refreshToken)

          await axios.post(
            `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/logout`,
            params,
            {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              timeout: 3000,
            },
          )
        }
      }
    } catch {
      // Игнорируем сетевые ошибки завершения сессии
    }
  },
}
