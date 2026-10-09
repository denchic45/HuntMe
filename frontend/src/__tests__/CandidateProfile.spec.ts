import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { useCandidateProfileStore } from '@/stores/candidateProfile'
import ProfilePersonalSection from '@/components/candidate/profile/ProfilePersonalSection.vue'
import ProfileExpectationsSection from '@/components/candidate/profile/ProfileExpectationsSection.vue'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe('CandidateProfileStore & Composable', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with mock data and calculates completion percentage', () => {
    const store = useCandidateProfileStore()
    expect(store.profile.fullName).toBeDefined()
    expect(store.completionPercentage).toBeGreaterThanOrEqual(50)
    expect(store.isVerifiedFsp).toBe(true)
  })

  it('adds, updates, and removes education items correctly', () => {
    const store = useCandidateProfileStore()
    const initialCount = store.profile.education.length

    store.addEducation({
      level: 'bachelor',
      institution: 'МГУ им. М.В. Ломоносова',
      faculty: 'ВМК',
      specialization: 'Фундаментальная информатика',
      graduationYear: 2024,
    })

    expect(store.profile.education.length).toBe(initialCount + 1)
    const added = store.profile.education[store.profile.education.length - 1]
    expect(added?.institution).toBe('МГУ им. М.В. Ломоносова')

    // Test updateEducation
    store.updateEducation(added!.id, {
      specialization: 'Прикладная математика и ИИ',
      graduationYear: 2025,
    })

    const updated = store.profile.education.find((e) => e.id === added!.id)
    expect(updated?.specialization).toBe('Прикладная математика и ИИ')
    expect(updated?.graduationYear).toBe(2025)

    store.removeEducation(added!.id)
    expect(store.profile.education.length).toBe(initialCount)
  })

  it('adds and removes language items correctly', () => {
    const store = useCandidateProfileStore()
    const initialCount = store.profile.languages.length

    store.addLanguage({
      language: 'Немецкий',
      level: 'B1',
    })

    expect(store.profile.languages.length).toBe(initialCount + 1)
    const added = store.profile.languages[store.profile.languages.length - 1]
    expect(added?.language).toBe('Немецкий')

    store.removeLanguage(added!.id)
    expect(store.profile.languages.length).toBe(initialCount)
  })

  it('updates expectations and salary in rubles', () => {
    const store = useCandidateProfileStore()
    store.updateExpectations(400000, ['remote'], true)

    expect(store.profile.desiredSalary).toBe(400000)
    expect(store.profile.workFormat).toEqual(['remote'])
    expect(store.profile.relocationReady).toBe(true)
  })

  it('toggles search status', () => {
    const store = useCandidateProfileStore()
    const initialStatus = store.profile.isSearchActive
    store.toggleSearchStatus()
    expect(store.profile.isSearchActive).toBe(!initialStatus)
  })

  it('ProfilePersonalSection renders contact plates and has no full name input', () => {
    const wrapper = mount(ProfilePersonalSection, {
      global: {
        stubs: {
          BaseButton: { template: '<button><slot /></button>' },
          BaseModal: { template: '<div><slot /><slot name="footer" /></div>' },
        },
      },
    })

    // Should NOT have full name label or input
    expect(wrapper.text()).not.toContain('ФИО *')
    // Should have City
    expect(wrapper.text()).toContain('Город проживания')
    // Should have contact plates
    expect(wrapper.text()).toContain('Телефон')
    expect(wrapper.text()).toContain('Почта')
    expect(wrapper.text()).toContain('Telegram')
    expect(wrapper.text()).toContain('Git профиль')
  })

  it('ProfileExpectationsSection save button enables only when changes are made', async () => {
    const { default: BaseButton } = await import('@/components/common/BaseButton.vue')
    const wrapper = mount(ProfileExpectationsSection)

    const saveBtn = wrapper.findComponent(BaseButton)
    expect(saveBtn.props('disabled')).toBe(true)

    // Change salary input
    const salaryInput = wrapper.find('input[type="number"]')
    await salaryInput.setValue(450000)

    expect(saveBtn.props('disabled')).toBe(false)
  })

  it('OverviewView displays candidate banner with silhouette avatar, age, and city without old slogan', async () => {
    const { default: OverviewView } = await import('@/views/candidate/OverviewView.vue')

    const wrapper = mount(OverviewView, {
      global: {
        mocks: {
          $router: { push: () => {} },
        },
        stubs: {
          BaseButton: { template: '<button><slot /></button>' },
          BaseBadge: { template: '<span><slot /></span>' },
        },
      },
    })

    expect(wrapper.text()).toContain('Алексей Сергеевич Голубев')
    expect(wrapper.text()).toContain('24 года')
    expect(wrapper.text()).toContain('Москва')
    expect(wrapper.text()).not.toContain(
      'Ваш профиль ранжируется в базе компаний по объективно подтвержденному грейду',
    )
    expect(wrapper.find('.rounded-\\[25\\%\\]').exists()).toBe(true)
  })
})
