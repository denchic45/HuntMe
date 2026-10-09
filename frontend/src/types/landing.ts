import type { UserRole } from './auth'

export type { UserRole }

export type LandingRole = 'candidate' | 'employer'

export interface StatMetric {
  value: string
  label: string
  subtext?: string
}

export interface PartnerLogo {
  id: string
  name: string
  subtitle?: string
  logo?: string
}

export interface WhyUsCard {
  id: string
  title: string
  description: string
  badge?: string
  icon: string
  highlight?: string
}

export interface ForefrontItem {
  id: string
  name: string
  roleTitle: string
  quote: string
  image: string
  badge: string
  fspAchievement?: string
}

export interface ComparisonItem {
  id: string
  feature: string
  traditional: string
  huntMe: string
}

export interface TestimonialItem {
  id: string
  name: string
  roleTitle: string
  company: string
  quote: string
  avatar: string
  fspRank?: string
  salaryOrMatch: string
}

export interface CategoryPreview {
  id: string
  title: string
  grade: 'Junior' | 'Middle' | 'Senior' | 'Lead'
  avgSalary: string
  skills: string[]
  verifiedCandidatesCount: number
  sampleTask: string
  mockCandidate: {
    name: string
    fspRank: string
    experience: string
    matchScore: number
    status: string
  }
}

export interface FaqItem {
  id: string
  question: string
  answer: string
  role?: UserRole | 'all'
}

export interface RoadmapStep {
  number: string
  title: string
  subtitle: string
  description: string
  badgeText: string
  badgeVariant?: 'primary' | 'danger' | 'glow' | 'neutral'
  icon: string
  highlight?: string
  tags?: string[]
}
