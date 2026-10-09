export type UserRole = 'candidate' | 'employer' | 'admin'

export interface User {
  id: string
  email: string
  fullName?: string
  birthDate?: string
  age?: number
  role: UserRole
  emailVerified: boolean
  fspId?: string
  companyName?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

export interface RegisterRequest {
  email: string
  fullName: string
  age?: number
  birthDate: string
  password: string
  role: 'candidate' | 'employer'
  companyName?: string
  fspId?: string
  privacyAgreement152: boolean
}

export interface RegisterResponse {
  message: string
  email: string
  requiresVerification: boolean
}

export interface VerifyEmailRequest {
  email: string
  code: string
}

export interface ResendCodeRequest {
  email: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface KeycloakTokenResponse {
  access_token: string
  expires_in: number
  refresh_expires_in?: number
  refresh_token: string
  token_type: string
  id_token?: string
  scope?: string
}
