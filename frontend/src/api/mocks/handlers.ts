import { delay, http, HttpResponse } from 'msw'
import type {
  AuthResponse,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  User,
  VerifyEmailRequest,
} from '@/types/auth'
import {
  mockCandidateAuthResponse,
  mockCandidateUser,
  mockEmployerAuthResponse,
  mockTokens,
} from './auth'

// In-memory registered users store for active dev session
const dynamicUsers = new Map<string, User>()

export const handlers = [
  // 1. Login
  http.post('*/api/v1/auth/login', async ({ request }) => {
    await delay(350)
    const body = (await request.json()) as LoginRequest

    if (!body.email || !body.password) {
      return HttpResponse.json({ message: 'Необходимо указать email и пароль' }, { status: 400 })
    }

    // Check if user was registered during this session
    const existing = dynamicUsers.get(body.email.toLowerCase().trim())
    if (existing) {
      return HttpResponse.json<AuthResponse>({
        user: existing,
        tokens: mockTokens,
      })
    }

    // Fallback role-based login
    const isEmployer = body.email.includes('emp') || body.email.includes('hr')
    return HttpResponse.json<AuthResponse>(
      isEmployer ? mockEmployerAuthResponse : mockCandidateAuthResponse,
    )
  }),

  // 2. Register (Step 1)
  http.post('*/api/v1/auth/register', async ({ request }) => {
    await delay(400)
    const body = (await request.json()) as RegisterRequest

    if (!body.email || !body.fullName || !body.password) {
      return HttpResponse.json(
        { message: 'Заполните обязательные поля: Email, ФИО, пароль' },
        { status: 400 },
      )
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      email: body.email.trim(),
      fullName: body.fullName.trim(),
      birthDate: body.birthDate,
      age: body.age,
      role: body.role || 'candidate',
      emailVerified: false,
      fspId: body.fspId,
      companyName: body.companyName,
    }

    dynamicUsers.set(newUser.email.toLowerCase(), newUser)

    return HttpResponse.json(
      {
        message: 'Регистрация успешна. Подтвердите ваш email.',
        email: newUser.email,
        requiresVerification: true,
      },
      { status: 201 },
    )
  }),

  // 3. Verify Email (Step 2 - accepts any code as requested)
  http.post('*/api/v1/auth/verify-email', async ({ request }) => {
    await delay(300)
    const body = (await request.json()) as VerifyEmailRequest

    const email = body.email?.toLowerCase().trim() || 'user@huntme.dev'
    let user = dynamicUsers.get(email)

    if (!user) {
      user = {
        id: `usr_${Date.now()}`,
        email: body.email,
        fullName: 'Новый Пользователь',
        role: 'candidate',
        emailVerified: true,
      }
      dynamicUsers.set(email, user)
    } else {
      user.emailVerified = true
    }

    const response: AuthResponse = {
      user: { ...user, emailVerified: true },
      tokens: {
        accessToken: `jwt_access_${Date.now()}`,
        refreshToken: `jwt_refresh_${Date.now()}`,
      },
    }

    return HttpResponse.json<AuthResponse>(response, { status: 200 })
  }),

  // 4. Resend verification code
  http.post('*/api/v1/auth/resend-code', async () => {
    await delay(250)
    return HttpResponse.json({
      message: 'Новый проверочный код успешно отправлен на вашу почту.',
    })
  }),

  // 5. Refresh token
  http.post('*/api/v1/auth/refresh', async () => {
    await delay(150)
    const newTokens: AuthTokens = {
      accessToken: `jwt_access_refreshed_${Date.now()}`,
      refreshToken: `jwt_refresh_refreshed_${Date.now()}`,
    }
    return HttpResponse.json<AuthTokens>(newTokens)
  }),

  // 6. Get Current User (/auth/me)
  http.get('*/api/v1/auth/me', async ({ request }) => {
    await delay(150)
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return HttpResponse.json({ message: 'Не авторизован' }, { status: 401 })
    }

    return HttpResponse.json<User>(mockCandidateUser)
  }),

  // 7. Logout
  http.post('*/api/v1/auth/logout', async () => {
    await delay(100)
    return HttpResponse.json({ message: 'Сессия завершена' })
  }),
]
