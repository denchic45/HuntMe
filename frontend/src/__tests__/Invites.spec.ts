import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useInvites } from '@/composables/useInvites'

describe('useInvites composable', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('loads mock invites with valid salary ranges in RUB', () => {
    const { invites } = useInvites()
    expect(invites.value.length).toBeGreaterThan(0)
    for (const invite of invites.value) {
      expect(invite.salaryFrom).toBeGreaterThan(0)
      expect(invite.salaryTo).toBeGreaterThanOrEqual(invite.salaryFrom)
      expect(invite.currency).toBe('RUB')
    }
  })

  it('filters invites by status and counts correctly', () => {
    const { invites, newInvitesCount, activeFilter, filteredInvites } = useInvites()
    expect(newInvitesCount.value).toBeGreaterThanOrEqual(0)

    activeFilter.value = 'received'
    expect(filteredInvites.value.every((i) => i.status === 'received')).toBe(true)

    activeFilter.value = 'all'
    expect(filteredInvites.value.length).toBe(invites.value.length)
  })

  it('accepts invite and reveals recruiter contacts', () => {
    const { invites, acceptInvite, getInviteById } = useInvites()
    const target = invites.value.find((i) => i.status === 'received')
    if (target) {
      acceptInvite(target.id)
      const updated = getInviteById(target.id)
      expect(updated?.status).toBe('accepted')
      expect(updated?.contactsRevealed).toBe(true)
    }
  })

  it('declines invite properly', () => {
    const { invites, declineInvite, getInviteById } = useInvites()
    const target = invites.value.find((i) => i.status === 'received')
    if (target) {
      declineInvite(target.id)
      const updated = getInviteById(target.id)
      expect(updated?.status).toBe('declined')
    }
  })
})
