<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import { useAuth } from '@/composables/useAuth'
import BaseButton from '@/components/common/BaseButton.vue'
import LandingRoleToggle from '@/components/landing/LandingRoleToggle.vue'

const router = useRouter()
const { isDark, toggleDark } = useTheme()
const { isAuthenticated, role } = useAuth()

function handleCabinetClick() {
  if (isAuthenticated.value) {
    if (role.value === 'employer') {
      router.push('/employer/dashboard')
    } else {
      router.push('/candidate/overview')
    }
  } else {
    router.push('/login')
  }
}
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-gray-200/80 dark:border-fsp-dark-border bg-white/90 dark:bg-fsp-dark/90 backdrop-blur-md px-3 sm:px-6 lg:px-8 py-3 transition-colors"
  >
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
      <!-- Логотип бренда -->
      <RouterLink class="flex items-center gap-2 select-none group shrink-0" to="/">
        <img
          alt="ФСП"
          class="h-8 w-auto transition-transform group-hover:scale-105"
          src="/brand/logo_01.svg"
        />
        <div class="flex flex-col">
          <span
            class="font-extrabold text-lg sm:text-xl tracking-tight font-mono text-gray-900 dark:text-white"
          >
            Hunt<span class="text-fsp-blue">Me</span>
          </span>
          <span
            class="text-[9px] sm:text-[10px] text-gray-400 font-mono tracking-wider -mt-1 hidden xs:block"
          >
            ФСП РЕКРУТИНГ
          </span>
        </div>
      </RouterLink>

      <!-- Ролевой переключатель лендинга -->
      <div class="flex items-center">
        <LandingRoleToggle size="sm" />
      </div>

      <!-- Действия справа -->
      <div class="flex items-center gap-2 sm:gap-3 shrink-0">
        <!-- Переключатель темы -->
        <button
          aria-label="Toggle Dark Mode"
          class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border transition-colors cursor-pointer"
          type="button"
          @click="toggleDark()"
        >
          <i
            :class="isDark ? 'pi pi-sun text-yellow-400' : 'pi pi-moon text-fsp-blue'"
            class="text-xs sm:text-sm"
          ></i>
        </button>

        <!-- Кнопка Личный кабинет -->
        <BaseButton size="sm" variant="glow" @click="handleCabinetClick">
          Личный кабинет
        </BaseButton>
      </div>
    </div>
  </header>
</template>
