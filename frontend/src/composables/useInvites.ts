import { computed, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { mockCandidateInvites } from '@/api/mocks/candidateProfile'
import type { CandidateInvite, InviteStatus } from '@/types/candidate'

export function useInvites() {
  const invites = useStorage<CandidateInvite[]>('huntme_candidate_invites', mockCandidateInvites)

  const activeFilter = ref<'all' | InviteStatus>('all')

  const filteredInvites = computed(() => {
    if (activeFilter.value === 'all') return invites.value
    return invites.value.filter((inv) => inv.status === activeFilter.value)
  })

  const newInvitesCount = computed(
    () => invites.value.filter((i) => i.status === 'received' || i.status === 'viewed').length,
  )

  const acceptedCount = computed(() => invites.value.filter((i) => i.status === 'accepted').length)

  const declinedCount = computed(() => invites.value.filter((i) => i.status === 'declined').length)

  function acceptInvite(id: string) {
    const invite = invites.value.find((i) => i.id === id)
    if (invite) {
      invite.status = 'accepted'
      invite.contactsRevealed = true
    }
  }

  function declineInvite(id: string) {
    const invite = invites.value.find((i) => i.id === id)
    if (invite) {
      invite.status = 'declined'
    }
  }

  function markAsViewed(id: string) {
    const invite = invites.value.find((i) => i.id === id)
    if (invite && invite.status === 'received') {
      invite.status = 'viewed'
    }
  }

  function getInviteById(id: string): CandidateInvite | undefined {
    return invites.value.find((i) => i.id === id)
  }

  return {
    invites,
    activeFilter,
    filteredInvites,
    newInvitesCount,
    acceptedCount,
    declinedCount,
    acceptInvite,
    declineInvite,
    markAsViewed,
    getInviteById,
  }
}
