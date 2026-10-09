<script lang="ts" setup>
import { useTheme } from '@/composables/useTheme'

interface Props {
  title: string
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  subtitle: '',
})

const { isDark, toggleDark } = useTheme()
</script>

<template>
  <div
    class="min-h-screen flex flex-col justify-center items-center px-4 py-8 sm:py-12 bg-gray-50 dark:bg-fsp-dark text-gray-900 dark:text-gray-100 transition-colors relative overflow-hidden"
  >
    <!-- Фоновые декоративные свечения -->
    <div
      class="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-fsp-blue/15 dark:bg-fsp-blue/20 blur-[120px] rounded-full pointer-events-none"
    ></div>
    <div
      class="absolute -bottom-40 right-1/4 w-[400px] h-[300px] bg-fsp-red/10 dark:bg-fsp-red/15 blur-[120px] rounded-full pointer-events-none"
    ></div>

    <!-- Верхняя панель: ссылка домой и переключатель темы -->
    <div class="w-full max-w-md flex items-center justify-between mb-6 z-10">
      <RouterLink
        class="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-gray-500 hover:text-fsp-blue dark:text-gray-400 dark:hover:text-white transition-colors"
        to="/"
      >
        <i class="pi pi-arrow-left text-xs"></i>
        <span>На главную</span>
      </RouterLink>

      <button
        aria-label="Toggle Dark Mode"
        class="w-8 h-8 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border transition-colors cursor-pointer"
        type="button"
        @click="toggleDark()"
      >
        <i
          :class="isDark ? 'pi pi-sun text-yellow-400' : 'pi pi-moon text-fsp-blue'"
          class="text-xs"
        ></i>
      </button>
    </div>

    <!-- Основная карточка -->
    <div
      class="w-full max-w-md bg-white dark:bg-fsp-dark-surface border border-gray-200/90 dark:border-fsp-dark-border rounded-2xl shadow-xl shadow-fsp-dark/5 dark:shadow-black/40 p-6 sm:p-8 relative z-10 backdrop-blur-md"
    >
      <!-- Логотип и брендинг -->
      <div class="flex items-center justify-center gap-3 mb-6">
        <img
          alt="Федерация спортивного программирования"
          class="h-8 w-auto"
          src="/brand/logo_01.svg"
        />
        <div class="flex flex-col">
          <span
            class="font-extrabold text-xl tracking-tight font-mono text-gray-900 dark:text-white"
          >
            Hunt<span class="text-fsp-blue">Me</span>
          </span>
          <span class="text-[9px] text-gray-400 font-mono tracking-wider -mt-1">
            ФСП РЕКРУТИНГ
          </span>
        </div>
      </div>

      <!-- Заголовок и подзаголовок -->
      <div class="text-center mb-6">
        <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {{ title }}
        </h1>
        <p v-if="subtitle" class="mt-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {{ subtitle }}
        </p>
      </div>

      <!-- Слот контента формы -->
      <slot />
    </div>

    <!-- Копирайт внизу -->
    <div class="mt-8 text-center text-xs text-gray-400 font-mono z-10">
      Федерация спортивного программирования России &copy; {{ new Date().getFullYear() }}
    </div>
  </div>
</template>
