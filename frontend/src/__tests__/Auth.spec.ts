import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import VerifyEmailForm from '@/components/auth/VerifyEmailForm.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import { useAuthStore } from '@/stores/auth'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  RouterLink: {
    template: '<a><slot /></a>',
  },
}))

describe('Auth Components', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('RegisterForm', () => {
    it('renders registration fields without age input and without date calendar', () => {
      const wrapper = mount(RegisterForm, {
        global: {
          stubs: {
            RouterLink: { template: '<a><slot /></a>' },
          },
        },
      })

      expect(wrapper.text()).toContain('ФИО')
      expect(wrapper.text()).toContain('Электронная почта')
      expect(wrapper.text()).toContain('Дата рождения')
      expect(wrapper.text()).not.toContain('Возраст (лет)')
      expect(wrapper.find('input[type="number"]').exists()).toBe(false)
      expect(wrapper.find('input[type="date"]').exists()).toBe(false)
      expect(wrapper.find('input[placeholder="ДД.ММ.ГГГГ"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('152-ФЗ')
      expect(wrapper.text()).toContain('Продолжить')
    })

    it('auto-formats birth date on the fly as user types', async () => {
      const wrapper = mount(RegisterForm, {
        global: {
          stubs: {
            RouterLink: { template: '<a><slot /></a>' },
          },
        },
      })

      const dateInput = wrapper.find('input[placeholder="ДД.ММ.ГГГГ"]')
      await dateInput.setValue('15012000')
      await dateInput.trigger('input')

      expect((dateInput.element as HTMLInputElement).value).toBe('15.01.2000')
    })

    it('prevents submission when 152-FZ consent is unchecked', async () => {
      const wrapper = mount(RegisterForm, {
        global: {
          stubs: {
            RouterLink: { template: '<a><slot /></a>' },
          },
        },
      })

      await wrapper.find('form').trigger('submit.prevent')
      expect(wrapper.emitted('submitted')).toBeFalsy()
    })
  })

  describe('VerifyEmailForm', () => {
    it('displays the user email and demo explanation', () => {
      const testEmail = 'coder@huntme.dev'
      const wrapper = mount(VerifyEmailForm, {
        props: {
          email: testEmail,
        },
      })

      expect(wrapper.text()).toContain(testEmail)
      expect(wrapper.text()).toContain('Код подтверждения')
      expect(wrapper.text()).toContain('подходит любой ввод')
    })

    it('allows any input code and triggers verification', async () => {
      const authStore = useAuthStore()
      authStore.verifyEmail = vi.fn().mockResolvedValue({
        user: { id: '1', email: 'coder@huntme.dev', role: 'candidate', emailVerified: true },
        tokens: { accessToken: 'acc', refreshToken: 'ref' },
      })

      const wrapper = mount(VerifyEmailForm, {
        props: {
          email: 'coder@huntme.dev',
        },
      })

      const codeInput = wrapper.find('input[type="text"]')
      await codeInput.setValue('любой-код-123')

      const submitButton = wrapper.findComponent({ name: 'BaseButton' })
      if (submitButton.exists()) {
        await submitButton.trigger('click')
      } else {
        await codeInput.trigger('keyup.enter')
      }

      expect(authStore.verifyEmail).toHaveBeenCalledWith({
        email: 'coder@huntme.dev',
        code: 'любой-код-123',
      })
    })
  })

  describe('LoginForm', () => {
    it('renders login form and quick demo buttons', () => {
      const wrapper = mount(LoginForm, {
        global: {
          stubs: {
            RouterLink: { template: '<a><slot /></a>' },
          },
        },
      })

      expect(wrapper.text()).toContain('Электронная почта')
      expect(wrapper.text()).toContain('Пароль')
      expect(wrapper.text()).toContain('Кандидат ФСП')
      expect(wrapper.text()).toContain('Работодатель')
    })
  })

  describe('Token Persistence & JWT Parsing', () => {
    it('updates isAuthenticated when tokens and user are stored and clears on logout', async () => {
      const authStore = useAuthStore()
      expect(authStore.isAuthenticated).toBe(false)

      authStore.demoLogin('candidate')
      expect(authStore.isAuthenticated).toBe(true)
      expect(authStore.role).toBe('candidate')
      expect(authStore.tokens?.accessToken).toBeDefined()

      await authStore.logout()
      expect(authStore.isAuthenticated).toBe(false)
      expect(authStore.tokens).toBeNull()
      expect(authStore.user).toBeNull()
    })

    it('parseJwtPayload correctly extracts claims from standard JWT tokens', async () => {
      const { parseJwtPayload } = await import('@/api/endpoints/auth')
      // Sample test token header.payload.signature where payload is {"sub":"user-42","email":"dev@huntme.pro","role":"candidate"}
      const payloadObj = { sub: 'user-42', email: 'dev@huntme.pro', role: 'candidate' }
      const encodedPayload = btoa(JSON.stringify(payloadObj))
      const sampleJwt = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.${encodedPayload}.signature`

      const parsed = parseJwtPayload(sampleJwt)
      expect(parsed).toEqual(payloadObj)
    })

    it('persists auth state across page reload / store re-instantiation', async () => {
      const { nextTick } = await import('vue')
      const authStore = useAuthStore()
      authStore.demoLogin('candidate')
      expect(authStore.isAuthenticated).toBe(true)
      await nextTick()

      // Simulate page reload by creating a new Pinia instance
      const newPinia = createPinia()
      setActivePinia(newPinia)
      const reloadedStore = useAuthStore()

      expect(reloadedStore.isAuthenticated).toBe(true)
      expect(reloadedStore.user?.email).toBe('alexey.go@huntme.dev')
      expect(reloadedStore.role).toBe('candidate')
      expect(reloadedStore.tokens?.accessToken).toBeTruthy()
    })
  })
})
