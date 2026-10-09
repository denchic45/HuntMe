<script lang="ts" setup>
import { ref } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useAuth } from '@/composables/useAuth'

const { login, isLoading, error } = useAuth()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const localError = ref<string | null>(null)

async function handleSubmit() {
  localError.value = null
  if (!email.value.trim() || !password.value) {
    localError.value = 'Заполните email и пароль'
    return
  }

  try {
    await login({
      email: email.value.trim(),
      password: password.value,
    })
  } catch (err) {
    localError.value = err instanceof Error ? err.message : 'Неверный email или пароль'
  }
}

function handleQuickDemo(role: 'candidate' | 'employer') {
  if (role === 'candidate') {
    email.value = 'candidate@huntme.dev'
    password.value = 'password123'
  } else {
    email.value = 'employer@huntme.dev'
    password.value = 'password123'
  }
  handleSubmit()
}
</script>

<template>
  <div class="space-y-5">
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <!-- Email -->
      <div>
        <label class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-1">
          Электронная почта
        </label>
        <input
          v-model="email"
          autocomplete="username"
          class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-gray-50/50 dark:bg-fsp-dark text-gray-900 dark:text-white text-sm focus:outline-none focus:border-fsp-blue focus:ring-1 focus:ring-fsp-blue transition-colors"
          placeholder="developer@huntme.dev"
          required
          type="email"
        />
      </div>

      <!-- Password -->
      <div>
        <div class="flex items-center justify-between mb-1">
          <label class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300">
            Пароль
          </label>
        </div>
        <div class="relative">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-gray-50/50 dark:bg-fsp-dark text-gray-900 dark:text-white text-sm focus:outline-none focus:border-fsp-blue focus:ring-1 focus:ring-fsp-blue transition-colors pr-10"
            placeholder="••••••••"
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

      <!-- Ошибка -->
      <div
        v-if="localError || error"
        class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2"
      >
        <i class="pi pi-exclamation-circle shrink-0"></i>
        <span>{{ localError || error }}</span>
      </div>

      <!-- Кнопка Входа -->
      <div class="pt-1">
        <BaseButton
          :disabled="!email.trim() || !password || isLoading"
          :loading="isLoading"
          block
          size="lg"
          variant="primary"
          @click="handleSubmit"
        >
          Войти в аккаунт
        </BaseButton>
      </div>
    </form>

    <!-- Разделитель -->
    <div class="relative flex items-center justify-center my-4">
      <div class="border-t border-gray-200 dark:border-fsp-dark-border w-full"></div>
      <span
        class="bg-white dark:bg-fsp-dark-surface px-3 text-[11px] font-mono text-gray-400 uppercase tracking-wider relative"
      >
        или быстрый демо-вход
      </span>
    </div>

    <!-- Кнопки демо-входа -->
    <div class="grid grid-cols-2 gap-2.5">
      <BaseButton
        class="text-xs"
        icon="pi pi-code"
        size="sm"
        variant="outline"
        @click="handleQuickDemo('candidate')"
      >
        Кандидат ФСП
      </BaseButton>
      <BaseButton
        class="text-xs"
        icon="pi pi-building"
        size="sm"
        variant="outline"
        @click="handleQuickDemo('employer')"
      >
        Работодатель
      </BaseButton>
    </div>

    <!-- Ссылка на регистрацию -->
    <div class="text-center pt-2">
      <span class="text-xs text-gray-500 dark:text-gray-400">Нет аккаунта на платформе?</span>
      <RouterLink
        class="ml-1 text-xs font-mono font-medium text-fsp-blue hover:underline"
        to="/register"
      >
        Зарегистрироваться
      </RouterLink>
    </div>
  </div>
</template>
