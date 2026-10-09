<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
const { isDark, toggleDark } = useTheme()

function exitTesting() {
  if (confirm('Вы уверены, что хотите прервать тестирование? Текущий прогресс не сохранится.')) {
    router.push('/candidate/testing')
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-gray-900 text-white flex flex-col selection:bg-fsp-blue selection:text-white"
  >
    <!-- Минималистичная верхняя панель фокусного режима -->
    <header
      class="h-16 px-4 sm:px-8 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-50"
    >
      <div class="flex items-center gap-3 select-none">
        <div class="flex items-center gap-2">
          <img alt="ФСП" class="h-7 w-auto" src="/brand/logo_01.svg" />
          <span class="font-extrabold text-lg tracking-tight font-mono text-white">
            Hunt<span class="text-fsp-blue">Me</span>
          </span>
        </div>
        <div class="hidden sm:flex items-center gap-2 pl-3 border-l border-gray-800">
          <span
            class="text-xs font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 font-bold flex items-center gap-1.5"
          >
            <i class="pi pi-shield"></i>
            Фокусный режим тестирования
          </span>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <!-- Переключатель темы -->
        <button
          aria-label="Toggle theme"
          class="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800 cursor-pointer"
          type="button"
          @click="toggleDark()"
        >
          <i
            :class="isDark ? 'pi pi-sun text-yellow-400' : 'pi pi-moon text-fsp-blue'"
            class="text-xs"
          ></i>
        </button>

        <!-- Кнопка прерывания теста -->
        <BaseButton
          class="text-xs"
          icon="pi pi-times"
          size="sm"
          variant="outline"
          @click="exitTesting"
        >
          Завершить досрочно
        </BaseButton>
      </div>
    </header>

    <!-- Основная контентная область фокусного режима -->
    <main class="flex-1 flex flex-col">
      <router-view />
    </main>
  </div>
</template>
