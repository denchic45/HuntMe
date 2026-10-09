import { computed, ref } from 'vue'
import { grades, mockCategoriesData, specializations } from '@/api/mocks/categories'
import type { CategoryPreview } from '@/types/landing'

export type GradeType = 'Junior' | 'Middle' | 'Senior' | 'Lead'

export function useCategoryBank(initialSpec = 'Backend', initialGrade: GradeType = 'Senior') {
  const selectedSpec = ref(initialSpec)
  const selectedGrade = ref<GradeType>(initialGrade)

  const activePreview = computed<CategoryPreview>(() => {
    const specData = mockCategoriesData[selectedSpec.value]
    if (specData && specData[selectedGrade.value]) {
      return specData[selectedGrade.value]!
    }
    return mockCategoriesData['Backend']!['Senior']!
  })

  function selectCategory(spec: string, grade: GradeType) {
    selectedSpec.value = spec
    selectedGrade.value = grade
  }

  function setSpecialization(spec: string) {
    selectedSpec.value = spec
  }

  function setGrade(grade: GradeType) {
    selectedGrade.value = grade
  }

  return {
    specializations,
    grades,
    selectedSpec,
    selectedGrade,
    activePreview,
    selectCategory,
    setSpecialization,
    setGrade,
  }
}
