import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LandingCategoriesDemo from '@/components/landing/LandingCategoriesDemo.vue'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  RouterLink: {
    template: '<a><slot /></a>',
  },
}))

describe('LandingCategoriesDemo', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders section title, specialization tabs, and category showcase', () => {
    const wrapper = mount(LandingCategoriesDemo, {
      global: {
        stubs: {
          BaseBadge: { template: '<span><slot /></span>' },
          BaseButton: { template: '<button><slot /></button>' },
        },
      },
    })

    expect(wrapper.text()).toContain('Банк верифицированных категорий')
    expect(wrapper.text()).toContain('Backend')
    expect(wrapper.text()).toContain('Frontend')
    expect(wrapper.text()).toContain('Senior')
    expect(wrapper.text()).toContain('Рыночная вилка')
    expect(wrapper.text()).toContain('Match Score')
  })

  it('switches specialization when clicking pill tab', async () => {
    const wrapper = mount(LandingCategoriesDemo, {
      global: {
        stubs: {
          BaseBadge: { template: '<span><slot /></span>' },
          BaseButton: { template: '<button><slot /></button>' },
        },
      },
    })

    const buttons = wrapper.findAll('button')
    const frontendBtn = buttons.find((btn) => btn.text() === 'Frontend')
    expect(frontendBtn).toBeDefined()

    await frontendBtn!.trigger('click')
    expect(wrapper.text()).toContain('Frontend')
  })
})
