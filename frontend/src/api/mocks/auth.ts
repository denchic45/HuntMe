import type { AuthResponse, AuthTokens, User } from '@/types/auth'

export const mockCandidateUser: User = {
  id: 'usr_cand_8849',
  email: 'alexey.go@huntme.dev',
  role: 'candidate',
  emailVerified: true,
}

export const mockEmployerUser: User = {
  id: 'usr_emp_2041',
  email: 'hr.lead@fintech-core.ru',
  role: 'employer',
  emailVerified: true,
}

export const mockTokens: AuthTokens = {
  accessToken: 'mock_jwt_access_token_huntme_2026',
  refreshToken: 'mock_jwt_refresh_token_huntme_2026',
}

export const mockCandidateAuthResponse: AuthResponse = {
  user: mockCandidateUser,
  tokens: mockTokens,
}

export const mockEmployerAuthResponse: AuthResponse = {
  user: mockEmployerUser,
  tokens: mockTokens,
}
