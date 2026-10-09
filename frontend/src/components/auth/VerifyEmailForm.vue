<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useAuth } from '@/composables/useAuth'

interface Props {
  email: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'verified'): void
  (e: 'change-email'): void
}>()

const { verifyEmail, resendCode, isLoading, error } = useAuth()

const code = ref('')
const countdown = ref(60)
const canResend = ref(false)
const resendSuccess = ref(false)
const localError = ref<string | null>(null)
let timerId: ReturnType<typeof setInterval> | null = null

function startTimer() {
  countdown.value = 60
  canResend.value = false
  if (timerId) clearInterval(timerId)
  timerId = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      canResend.value = true
      if (timerId) clearInterval(timerId)
    }
  }, 1000)
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  if (timerId) clearInterval(timerId)
})

async function handleConfirm() {
  localError.value = null
  if (!code.value.trim()) {
    localError.value = 'Пожалуйста, введите код подтверждения'
    return
  }

  try {
    await verifyEmail({
      email: props.email,
      code: code.value.trim(),
    })
    emit('verified')
  } catch (err) {
    localError.value = err instanceof Error ? err.message : 'Неверный код подтверждения'
  }
}

async function handleResend() {
  if (!canResend.value) return
  localError.value = null
  resendSuccess.value = false

  try {
    await resendCode({ email: props.email })
    resendSuccess.value = true
    startTimer()
    setTimeout(() => {
      resendSuccess.value = false
    }, 4000)
  } catch (err) {
    localError.value = err instanceof Error ? err.message : 'Не удалось отправить код'
  }
}
</script>

<template>
  <div class="space-y-5">
    <!-- Почтовая плашка с адресом -->
    <div
      class="p-4 rounded-xl bg-fsp-blue/5 dark:bg-fsp-blue/10 border border-fsp-blue/20 text-center space-y-1.5"
    >
      <div
        class="w-10 h-10 rounded-full bg-fsp-blue/10 text-fsp-blue flex items-center justify-center mx-auto"
      >
        <i class="pi pi-envelope text-lg"></i>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400">Код подтверждения отправлен на почту</p>
      <div class="flex items-center justify-center gap-2">
        <span class="font-mono font-semibold text-sm text-gray-900 dark:text-white">
          {{ email }}
        </span>
        <button
          class="text-xs text-fsp-blue hover:underline cursor-pointer font-mono"
          type="button"
          @click="emit('change-email')"
        >
          Изменить
        </button>
      </div>
    </div>

    <!-- Поле ввода кода -->
    <div>
      <label class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        Код подтверждения
      </label>
      <input
        v-model="code"
        autofocus
        class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-gray-50/50 dark:bg-fsp-dark text-gray-900 dark:text-white text-center text-lg tracking-widest font-mono focus:outline-none focus:border-fsp-blue focus:ring-1 focus:ring-fsp-blue transition-colors"
        placeholder="123456"
        type="text"
        @keyup.enter="handleConfirm"
      />
      <p class="mt-1.5 text-[11px] text-gray-400 text-center">
        Демо-режим: подходит любой ввод (нажмите Enter или кнопку ниже)
      </p>
    </div>

    <!-- Сообщение об успешной повторной отправке -->
    <div
      v-if="resendSuccess"
      class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs text-center flex items-center justify-center gap-2"
    >
      <i class="pi pi-check-circle"></i>
      <span>Код отправлен повторно</span>
    </div>

    <!-- Сообщение об ошибке -->
    <div
      v-if="localError || error"
      class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2"
    >
      <i class="pi pi-exclamation-circle shrink-0"></i>
      <span>{{ localError || error }}</span>
    </div>

    <!-- Кнопка подтверждения -->
    <BaseButton
      :disabled="!code.trim() || isLoading"
      :loading="isLoading"
      block
      size="lg"
      variant="primary"
      @click="handleConfirm"
    >
      Подтвердить и войти
    </BaseButton>

    <!-- Повторная отправка кода -->
    <div class="text-center pt-1">
      <button
        v-if="canResend"
        class="text-xs text-fsp-blue hover:underline cursor-pointer font-medium"
        type="button"
        @click="handleResend"
      >
        Отправить код повторно
      </button>
      <span v-else class="text-xs text-gray-400 font-mono">
        Отправить повторно через {{ countdown }}с
      </span>
    </div>
  </div>
</template>
