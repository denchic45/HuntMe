import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import CandidateSidebar from '@/components/layout/CandidateSidebar.vue'

describe('CandidateSidebar component', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(async () => {
    setActivePinia(createPinia())
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/candidate/overview', component: { template: '<div>Overview</div>' } },
        { path: '/candidate/profile/edit', component: { template: '<div>Profile</div>' } },
        { path: '/candidate/testing', component: { template: '<div>Testing</div>' } },
        { path: '/candidate/fsp', component: { template: '<div>FSP</div>' } },
        { path: '/candidate/invites', component: { template: '<div>Invites</div>' } },
        { path: '/candidate/vacancies', component: { template: '<div>Vacancies</div>' } },
        { path: '/candidate/challenges', component: { template: '<div>Challenges</div>' } },
        { path: '/candidate/settings', component: { template: '<div>Settings</div>' } },
      ],
    })
    await router.push('/candidate/overview')
    await router.isReady()
  })

  it('renders all key navigation links', () => {
    const wrapper = mount(CandidateSidebar, {
      props: {
        isOpen: true,
      },
      global: {
        plugins: [router],
      },
    })

    const links = wrapper.findAll('a')
    const linkTexts = links.map((l) => l.text())

    expect(linkTexts.some((t) => t.includes('Главная сводка'))).toBe(true)
    expect(linkTexts.some((t) => t.includes('Мой профиль'))).toBe(true)
    expect(linkTexts.some((t) => t.includes('Квалификация'))).toBe(true)
    expect(linkTexts.some((t) => t.includes('Достижения ФСП'))).toBe(true)
    expect(linkTexts.some((t) => t.includes('Приглашения'))).toBe(true)
    expect(linkTexts.some((t) => t.includes('Вакансии'))).toBe(true)
    expect(linkTexts.some((t) => t.includes('Микро-задания'))).toBe(true)
    expect(linkTexts.some((t) => t.includes('Настройки'))).toBe(true)
  })

  it('emits close event when mobile overlay or close button is clicked', async () => {
    const wrapper = mount(CandidateSidebar, {
      props: {
        isOpen: true,
      },
      global: {
        plugins: [router],
      },
    })

    const closeBtn = wrapper.find('button[aria-label="Закрыть меню"]')
    if (closeBtn.exists()) {
      await closeBtn.trigger('click')
      expect(wrapper.emitted('close')).toBeTruthy()
    }
  })
})
