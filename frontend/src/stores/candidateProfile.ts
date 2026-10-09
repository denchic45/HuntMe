import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { mockCandidateFullProfile } from '@/api/mocks/candidateProfile'
import type {
  CandidateFullProfile,
  EducationItem,
  LanguageItem,
  WorkExperienceItem,
  WorkFormat,
} from '@/types/candidate'

export const useCandidateProfileStore = defineStore('candidateProfile', () => {
  const profile = useStorage<CandidateFullProfile>(
    'huntme_candidate_full_profile',
    mockCandidateFullProfile,
  )

  const completionPercentage = computed(() => {
    let score = 0
    const p = profile.value
    if (p.fullName && p.city) score += 15
    if (p.contacts.email && p.contacts.phone) score += 15
    if (p.education && p.education.length > 0) score += 15
    if (p.languages && p.languages.length > 0) score += 10
    if (p.workHistory && p.workHistory.length > 0) score += 15
    if (p.skills && p.skills.length >= 3) score += 15
    if (p.desiredSalary > 0) score += 10
    if (p.fspId) score += 10
    return Math.min(score, 100)
  })

  const isVerifiedFsp = computed(() => !!profile.value.fspId)
  const isSearchActive = computed(() => profile.value.isSearchActive)

  function updatePersonal(payload: Partial<CandidateFullProfile>) {
    profile.value = { ...profile.value, ...payload }
  }

  function updateContacts(payload: Partial<CandidateFullProfile['contacts']>) {
    profile.value.contacts = { ...profile.value.contacts, ...payload }
  }

  function addEducation(item: Omit<EducationItem, 'id'>) {
    const newEdu: EducationItem = {
      ...item,
      id: `edu_${Date.now()}`,
    }
    profile.value.education.push(newEdu)
  }

  function removeEducation(id: string) {
    profile.value.education = profile.value.education.filter((e) => e.id !== id)
  }

  function updateEducation(id: string, payload: Partial<Omit<EducationItem, 'id'>>) {
    const index = profile.value.education.findIndex((e) => e.id === id)
    if (index !== -1 && profile.value.education[index]) {
      profile.value.education[index] = {
        ...profile.value.education[index],
        ...payload,
      }
    }
  }

  function addLanguage(item: Omit<LanguageItem, 'id'>) {
    const newLang: LanguageItem = {
      ...item,
      id: `lang_${Date.now()}`,
    }
    profile.value.languages.push(newLang)
  }

  function removeLanguage(id: string) {
    profile.value.languages = profile.value.languages.filter((l) => l.id !== id)
  }

  function addWorkHistory(item: Omit<WorkExperienceItem, 'id'>) {
    const newWork: WorkExperienceItem = {
      ...item,
      id: `work_${Date.now()}`,
    }
    profile.value.workHistory.unshift(newWork)
  }

  function removeWorkHistory(id: string) {
    profile.value.workHistory = profile.value.workHistory.filter((w) => w.id !== id)
  }

  function updateSkills(skills: string[]) {
    profile.value.skills = [...skills]
  }

  function updateSoftSkills(softSkills: string[]) {
    profile.value.softSkills = [...softSkills]
  }

  function updateExpectations(
    desiredSalary: number,
    workFormat: WorkFormat[],
    relocationReady: boolean,
  ) {
    profile.value.desiredSalary = desiredSalary
    profile.value.workFormat = [...workFormat]
    profile.value.relocationReady = relocationReady
  }

  function bindFspId(fspId: string) {
    profile.value.fspId = fspId
  }

  function toggleSearchStatus() {
    profile.value.isSearchActive = !profile.value.isSearchActive
  }

  function resetToMock() {
    profile.value = JSON.parse(JSON.stringify(mockCandidateFullProfile))
  }

  return {
    profile,
    completionPercentage,
    isVerifiedFsp,
    isSearchActive,
    updatePersonal,
    updateContacts,
    addEducation,
    updateEducation,
    removeEducation,
    addLanguage,
    removeLanguage,
    addWorkHistory,
    removeWorkHistory,
    updateSkills,
    updateSoftSkills,
    updateExpectations,
    bindFspId,
    toggleSearchStatus,
    resetToMock,
  }
})
