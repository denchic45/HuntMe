import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import type { UserRole } from '@/types/landing'

export const useLandingRoleStore = defineStore('landingRole', () => {
  const currentRole = useStorage<UserRole>('huntme_selected_role', 'candidate')

  const isCandidate = computed(() => currentRole.value === 'candidate')
  const isEmployer = computed(() => currentRole.value === 'employer')

  const setRole = (newRole: UserRole) => {
    currentRole.value = newRole
  }

  const toggleRole = () => {
    currentRole.value = currentRole.value === 'candidate' ? 'employer' : 'candidate'
  }

  return {
    currentRole,
    isCandidate,
    isEmployer,
    setRole,
    toggleRole,
  }
})
