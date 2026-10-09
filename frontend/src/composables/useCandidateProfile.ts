import { storeToRefs } from 'pinia'
import { useCandidateProfileStore } from '@/stores/candidateProfile'

export function useCandidateProfile() {
  const store = useCandidateProfileStore()
  const { profile, completionPercentage, isVerifiedFsp, isSearchActive } = storeToRefs(store)

  return {
    profile,
    completionPercentage,
    isVerifiedFsp,
    isSearchActive,
    updatePersonal: store.updatePersonal,
    updateContacts: store.updateContacts,
    addEducation: store.addEducation,
    updateEducation: store.updateEducation,
    removeEducation: store.removeEducation,
    addLanguage: store.addLanguage,
    removeLanguage: store.removeLanguage,
    addWorkHistory: store.addWorkHistory,
    removeWorkHistory: store.removeWorkHistory,
    updateSkills: store.updateSkills,
    updateSoftSkills: store.updateSoftSkills,
    updateExpectations: store.updateExpectations,
    bindFspId: store.bindFspId,
    toggleSearchStatus: store.toggleSearchStatus,
    resetToMock: store.resetToMock,
  }
}
