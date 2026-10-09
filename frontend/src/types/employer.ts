import type { Grade } from './candidate'

export interface EmployerProfile {
  id: string
  companyName: string
  industry: string
  description: string
  website?: string
  contactEmail: string
  contactPhone?: string
  contactPerson: string
  logo?: string
}

export interface CandidateSearchItem {
  id: string
  publicId: string
  specialization: string
  verifiedGrade: Grade
  category: string
  experienceYears: number
  skills: string[]
  hasFspVerified: boolean
  fspRank?: string
  testScore: number
  matchExplanation?: string
}

export interface CandidateSearchFilters {
  specialization?: string
  grade?: Grade
  skills?: string
  hasFspVerified?: boolean
  salaryMax?: number
  page?: number
  limit?: number
}

export interface CandidateSearchListResponse {
  items: CandidateSearchItem[]
  total: number
  page: number
  limit: number
}

export type InvitationStatus = 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'

export interface Invitation {
  id: string
  candidateId: string
  employerId: string
  companyName: string
  positionTitle: string
  description: string
  salaryMin: number
  salaryMax: number
  status: InvitationStatus
  createdAt: string
  candidateContact?: {
    fullName: string
    email: string
    phone?: string
  }
}

export interface CreateInvitationRequest {
  candidateId: string
  positionTitle: string
  description: string
  salaryMin: number
  salaryMax: number
}
