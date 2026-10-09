export type Grade = 'Junior' | 'Middle' | 'Senior' | 'Lead'
export type CandidateGrade = Grade

export type TestingStatus = 'not_started' | 'survey_passed' | 'test_in_progress' | 'verified'

export type EducationLevel =
  'secondary' | 'incomplete_higher' | 'bachelor' | 'master' | 'specialist' | 'phd'

export interface EducationItem {
  id: string
  level: EducationLevel
  institution: string
  faculty?: string
  specialization: string
  graduationYear: number
}

export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'native' | 'technical'

export interface LanguageItem {
  id: string
  language: string
  level: LanguageLevel
}

export interface WorkExperienceItem {
  id: string
  company: string
  role: string
  startDate: string
  endDate?: string
  isCurrent: boolean
  description: string
  technologies: string[]
}

export type WorkFormat = 'remote' | 'hybrid' | 'office'

export interface FspAchievement {
  id: string
  title: string
  eventType: string
  rank: string
  date: string
  score?: number
  sportsCategory?: string // КМС, Мастер спорта, 1 разряд
}

export interface CandidateContacts {
  email: string
  phone?: string
  telegram?: string
  github?: string
  linkedin?: string
  portfolioUrl?: string
}

export interface CandidateFullProfile {
  // 1. Персональная информация
  id: string
  fullName: string
  avatarUrl?: string
  city: string
  timezone: string
  birthDate?: string
  age?: number
  contacts: CandidateContacts

  // 2. Образование и языки
  education: EducationItem[]
  languages: LanguageItem[]

  // 3. Профессиональный опыт и стек
  specialization: string
  additionalSpecializations?: string[]
  experienceYears: number
  workHistory: WorkExperienceItem[]
  skills: string[]
  softSkills: string[]
  desiredSalary: number // В рублях
  workFormat: WorkFormat[]
  relocationReady: boolean

  // 4. Категория и грейд
  claimedGrade: Grade
  verifiedGrade?: Grade
  category?: string
  testingStatus: TestingStatus
  lastTestDate?: string
  canRetakeTestAfter?: string

  // 5. Достижения ФСП
  fspId?: string | null
  fspAchievements: FspAchievement[]

  // 6. Активность
  activityScore: number
  lastActiveAt: string
  completedTasksCount: number

  // 7. Настройки
  isSearchActive: boolean
  privacyConsent152Accepted: boolean
}

export type InviteStatus = 'received' | 'viewed' | 'accepted' | 'declined'

export interface CandidateInvite {
  id: string
  companyName: string
  companyLogo?: string
  industry: string
  position: string
  salaryFrom: number
  salaryTo: number
  currency: 'RUB'
  description: string
  requiredStack: string[]
  status: InviteStatus
  sentAt: string
  contactsRevealed: boolean
  recruiterContacts?: {
    name: string
    role: string
    email: string
    telegram?: string
    phone?: string
  }
}

export interface MicroChallenge {
  id: string
  title: string
  specialization: string
  difficulty: 'easy' | 'medium' | 'hard'
  timeMinutes: number
  rewardScore: number
  isCompleted: boolean
  description: string
  codeSnippet?: string
}

export interface TestingSurveyRequest {
  specialization: string
  industry: string
  claimedGrade: Grade
  fspId?: string
}

export interface TestingQuestion {
  id: string
  questionText: string
  codeSnippet?: string
  options: string[]
  correctIndex?: number
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface TestingSession {
  sessionId: string
  specialization: string
  targetGrade: Grade
  timeLimitMinutes: number
  questions: TestingQuestion[]
  startedAt: string
}

export interface TestSubmitAnswer {
  questionId: string
  selectedOptionIndex: number
}

export interface TestSubmitRequest {
  sessionId: string
  answers: TestSubmitAnswer[]
}

export interface TestResultResponse {
  score: number
  maxScore: number
  verifiedGrade: Grade
  category: string
  feedback: string
  fspBonusApplied: boolean
}
