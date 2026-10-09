import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LandingHeader from '@/components/landing/LandingHeader.vue'
import DashboardHeader from '@/components/layout/DashboardHeader.vue'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  RouterLink: {
    template: '<a><slot /></a>',
  },
}))

describe('Headers Architecture', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('LandingHeader includes LandingRoleToggle and single "Личный кабинет" button', () => {
    const wrapper = mount(LandingHeader, {
      global: {
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
          LandingRoleToggle: { template: '<div class="role-toggle">Toggle</div>' },
        },
      },
    })

    expect(wrapper.find('.role-toggle').exists()).toBe(true)
    expect(wrapper.text()).toContain('Личный кабинет')
    expect(wrapper.text()).not.toContain('Войти')
    expect(wrapper.text()).not.toContain('Начать')
    expect(wrapper.text()).not.toContain('Выйти')
  })

  it('DashboardHeader does NOT include LandingRoleToggle and shows cabinet navigation', () => {
    const wrapper = mount(DashboardHeader, {
      global: {
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
          BaseBadge: { template: '<span><slot /></span>' },
        },
      },
    })

    expect(wrapper.text()).not.toContain('Для соискателей')
    expect(wrapper.text()).not.toContain('Для работодателей')
    expect(wrapper.text()).not.toContain('На главную')
    expect(wrapper.text()).toContain('Выйти')
  })
})
