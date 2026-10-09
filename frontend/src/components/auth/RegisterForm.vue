<script lang="ts" setup>
import { computed, ref } from 'vue'
import { differenceInYears } from 'date-fns'
import BaseButton from '@/components/common/BaseButton.vue'
import { useAuth } from '@/composables/useAuth'
import type { RegisterRequest } from '@/types/auth'

const emit = defineEmits<{
  (e: 'submitted', email: string): void
}>()

const { register, isLoading, error } = useAuth()

const role = ref<'candidate' | 'employer'>('candidate')
const fullName = ref('')
const email = ref('')
const birthDateDisplay = ref('')
const calculatedAge = ref<number | undefined>(undefined)
const password = ref('')
const showPassword = ref(false)
const consent152 = ref(false)
const validationError = ref<string | null>(null)

function formatBirthDate(val: string): string {
  const digits = val.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`
  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`
}

function handleDateInput(e: Event) {
  const target = e.target as HTMLInputElement
  const formatted = formatBirthDate(target.value)
  birthDateDisplay.value = formatted
  target.value = formatted
  validateAndCalculateAge(formatted)
}

function handleDateKeyDown(e: KeyboardEvent) {
  if (e.key === 'Backspace') {
    const target = e.target as HTMLInputElement
    const cursor = target.selectionStart || 0
    if (cursor === 3 || cursor === 6) {
      e.preventDefault()
      const val = birthDateDisplay.value
      const newVal = val.slice(0, cursor - 2) + val.slice(cursor)
      const formatted = formatBirthDate(newVal)
      birthDateDisplay.value = formatted
      target.value = formatted
      target.setSelectionRange(cursor - 2, cursor - 2)
      validateAndCalculateAge(formatted)
    }
  }
}

function validateAndCalculateAge(dateStr: string) {
  if (dateStr.length === 10) {
    const [dStr, mStr, yStr] = dateStr.split('.')
    const d = Number(dStr)
    const m = Number(mStr)
    const y = Number(yStr)
    const currentYear = new Date().getFullYear()

    if (d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 1920 && y <= currentYear) {
      const parsed = new Date(y, m - 1, d)
      if (parsed.getFullYear() === y && parsed.getMonth() === m - 1 && parsed.getDate() === d) {
        const computed = differenceInYears(new Date(), parsed)
        if (computed >= 14 && computed <= 100) {
          calculatedAge.value = computed
          return
        }
      }
    }
  }
  calculatedAge.value = undefined
}

const isFormValid = computed(() => {
  return (
    fullName.value.trim().length >= 3 &&
    email.value.trim().includes('@') &&
    birthDateDisplay.value.length === 10 &&
    typeof calculatedAge.value === 'number' &&
    password.value.length >= 6 &&
    consent152.value
  )
})

async function handleSubmit() {
  validationError.value = null

  if (!consent152.value) {
    validationError.value = 'Необходимо согласие на обработку персональных данных'
    return
  }

  if (!isFormValid.value) {
    validationError.value = 'Пожалуйста, заполните все обязательные поля корректно'
    return
  }

  const [d, m, y] = birthDateDisplay.value.split('.')
  const isoDate = `${y}-${m}-${d}`

  const payload: RegisterRequest = {
    email: email.value.trim(),
    fullName: fullName.value.trim(),
    birthDate: isoDate,
    age: calculatedAge.value,
    password: password.value,
    role: role.value,
    privacyAgreement152: consent152.value,
  }

  try {
    await register(payload)
    emit('submitted', payload.email)
  } catch (err) {
    validationError.value = err instanceof Error ? err.message : 'Ошибка при регистрации'
  }
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <!-- Выбор роли -->
    <div class="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-fsp-dark rounded-xl">
      <button
        :class="
          role === 'candidate'
            ? 'bg-white dark:bg-fsp-dark-surface text-fsp-blue shadow-sm font-semibold'
            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
        "
        class="py-2 text-xs font-mono rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
        type="button"
        @click="role = 'candidate'"
      >
        <i class="pi pi-user"></i>
        <span>Кандидат</span>
      </button>
      <button
        :class="
          role === 'employer'
            ? 'bg-white dark:bg-fsp-dark-surface text-fsp-blue shadow-sm font-semibold'
            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
        "
        class="py-2 text-xs font-mono rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
        type="button"
        @click="role = 'employer'"
      >
        <i class="pi pi-briefcase"></i>
        <span>Работодатель</span>
      </button>
    </div>

    <!-- ФИО -->
    <div>
      <label class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-1">
        ФИО *
      </label>
      <input
        v-model="fullName"
        class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-gray-50/50 dark:bg-fsp-dark text-gray-900 dark:text-white text-sm focus:outline-none focus:border-fsp-blue focus:ring-1 focus:ring-fsp-blue transition-colors"
        placeholder="Иванов Алексей Сергеевич"
        required
        type="text"
      />
    </div>

    <!-- Email -->
    <div>
      <label class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-1">
        Электронная почта *
      </label>
      <input
        v-model="email"
        class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-gray-50/50 dark:bg-fsp-dark text-gray-900 dark:text-white text-sm focus:outline-none focus:border-fsp-blue focus:ring-1 focus:ring-fsp-blue transition-colors"
        placeholder="alexey@huntme.dev"
        required
        type="email"
      />
    </div>

    <!-- Дата рождения (с автоформатированием ДД.ММ.ГГГГ, без календаря) -->
    <div>
      <label class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-1">
        Дата рождения *
      </label>
      <input
        :value="birthDateDisplay"
        class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-gray-50/50 dark:bg-fsp-dark text-gray-900 dark:text-white text-sm focus:outline-none focus:border-fsp-blue focus:ring-1 focus:ring-fsp-blue transition-colors font-mono tracking-wider"
        inputmode="numeric"
        maxlength="10"
        placeholder="ДД.ММ.ГГГГ"
        required
        type="text"
        @input="handleDateInput"
        @keydown="handleDateKeyDown"
      />
      <p
        v-if="birthDateDisplay.length === 10 && typeof calculatedAge !== 'number'"
        class="mt-1 text-[11px] text-red-500 font-mono"
      >
        Укажите корректную дату рождения (возраст от 14 лет)
      </p>
    </div>

    <!-- Пароль -->
    <div>
      <label class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-1">
        Пароль *
      </label>
      <div class="relative">
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-gray-50/50 dark:bg-fsp-dark text-gray-900 dark:text-white text-sm focus:outline-none focus:border-fsp-blue focus:ring-1 focus:ring-fsp-blue transition-colors pr-10"
          placeholder="Минимум 6 символов"
          required
        />
        <button
          aria-label="Toggle password visibility"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
          type="button"
          @click="showPassword = !showPassword"
        >
          <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-sm"></i>
        </button>
      </div>
    </div>

    <!-- Согласие 152-ФЗ -->
    <div class="pt-1">
      <label class="flex items-start gap-2.5 cursor-pointer select-none">
        <input
          v-model="consent152"
          class="mt-1 h-4 w-4 rounded border-gray-300 dark:border-fsp-dark-border text-fsp-blue focus:ring-fsp-blue accent-fsp-blue cursor-pointer shrink-0"
          type="checkbox"
        />
        <span class="text-xs text-gray-600 dark:text-gray-400 leading-snug">
          Я согласен на
          <span class="text-fsp-blue underline decoration-dotted underline-offset-2">
            обработку персональных данных
          </span>
          в соответствии с Федеральным законом № 152-ФЗ
        </span>
      </label>
    </div>

    <!-- Сообщение об ошибке -->
    <div
      v-if="validationError || error"
      class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2"
    >
      <i class="pi pi-exclamation-circle shrink-0"></i>
      <span>{{ validationError || error }}</span>
    </div>

    <!-- Кнопка Продолжить -->
    <div class="pt-2">
      <BaseButton
        :disabled="!isFormValid || isLoading"
        :loading="isLoading"
        block
        size="lg"
        variant="primary"
        @click="handleSubmit"
      >
        Продолжить
      </BaseButton>
    </div>

    <!-- Ссылка на логин -->
    <div class="text-center pt-2">
      <span class="text-xs text-gray-500 dark:text-gray-400">Уже есть учетная запись?</span>
      <RouterLink
        class="ml-1 text-xs font-mono font-medium text-fsp-blue hover:underline"
        to="/login"
      >
        Войти
      </RouterLink>
    </div>
  </form>
</template>
