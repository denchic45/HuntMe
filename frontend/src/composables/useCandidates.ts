import { computed, ref } from 'vue'
import type { CandidateSearchFilters, CandidateSearchItem } from '@/types/employer'

export function useCandidates(initialFilters?: CandidateSearchFilters) {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const candidates = ref<CandidateSearchItem[]>([])
  const totalCount = ref(0)
  const filters = ref<CandidateSearchFilters>(initialFilters || {})

  const hasResults = computed(() => candidates.value.length > 0)
  const isEmpty = computed(() => !isLoading.value && !error.value && candidates.value.length === 0)

  async function fetchCandidates(newFilters?: CandidateSearchFilters) {
    if (newFilters) {
      filters.value = { ...filters.value, ...newFilters }
    }
    isLoading.value = true
    error.value = null
    try {
      // Mock data resolution for candidates
      await new Promise((r) => setTimeout(r, 300))
      candidates.value = [
        {
          id: 'cand_1094',
          publicId: 'FSP-1094',
          specialization: 'Backend',
          verifiedGrade: 'Senior',
          category: 'Senior Backend Engineer (Go / HighLoad)',
          experienceYears: 6,
          skills: ['Go', 'PostgreSQL', 'Kafka', 'Kubernetes', 'Redis', 'gRPC'],
          hasFspVerified: true,
          fspRank: 'Победитель Всероссийского Хакатона ФСП 2025',
          testScore: 98,
          matchExplanation: 'Полное соответствие стеку Go + Kafka и подтвержденный грейд Senior',
        },
        {
          id: 'cand_5501',
          publicId: 'FSP-5501',
          specialization: 'Frontend',
          verifiedGrade: 'Senior',
          category: 'Senior Frontend Engineer (Vue 3 / TypeScript)',
          experienceYears: 5.5,
          skills: ['Vue 3', 'TypeScript', 'Vite', 'Tailwind CSS', 'Web Performance'],
          hasFspVerified: true,
          fspRank: 'Призер Чемпионата Москвы по спортпрограммированию',
          testScore: 96,
          matchExplanation:
            'Глубокие знания Vue 3 Composition API и оптимизации производительности',
        },
        {
          id: 'cand_2041',
          publicId: 'FSP-2041',
          specialization: 'DevOps & SRE',
          verifiedGrade: 'Senior',
          category: 'Senior DevOps / SRE Architect',
          experienceYears: 6,
          skills: ['Kubernetes', 'Terraform', 'GitLab CI', 'Prometheus', 'Helm'],
          hasFspVerified: true,
          fspRank: 'Победитель олимпиады по системному администрированию',
          testScore: 97,
          matchExplanation: 'Экспертиза в multi-cluster Kubernetes и автоматизации CI/CD',
        },
      ]
      totalCount.value = candidates.value.length
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Не удалось загрузить кандидатов'
    } finally {
      isLoading.value = false
    }
  }

  return {
    candidates,
    totalCount,
    isLoading,
    error,
    filters,
    hasResults,
    isEmpty,
    fetchCandidates,
  }
}
