<script lang="ts" setup>
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useAuth } from '@/composables/useAuth'
import { useCandidateProfile } from '@/composables/useCandidateProfile'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'

interface Props {
  showSidebarToggle?: boolean
}

withDefaults(defineProps<Props>(), {
  showSidebarToggle: false,
})

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void
}>()

const { isDark, toggleDark } = useTheme()
const { user, isCandidate, logout } = useAuth()
const { profile, isVerifiedFsp } = useCandidateProfile()

const categoryChipLabel = computed(() => {
  if (!isCandidate.value) return ''
  const spec = profile.value.specialization || 'IT'
  const grade = profile.value.verifiedGrade || profile.value.claimedGrade || 'Middle'
  return `${spec} • ${grade}`
})
</script>

<template>
  <header
    class="sticky top-0 z-30 border-b border-gray-200/80 dark:border-fsp-dark-border bg-white/95 dark:bg-fsp-dark/95 backdrop-blur-md px-3 sm:px-6 py-2.5 transition-colors"
  >
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
      <!-- Левая часть: кнопка меню (моб.) + логотип + чип верификации -->
      <div class="flex items-center gap-2 sm:gap-3 select-none shrink-0">
        <!-- Кнопка сайдбара на планшетах и смартфонах -->
        <button
          v-if="showSidebarToggle"
          aria-label="Открыть боковое меню"
          class="lg:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-fsp-dark-surface cursor-pointer"
          type="button"
          @click="emit('toggle-sidebar')"
        >
          <i class="pi pi-bars text-base"></i>
        </button>

        <RouterLink class="flex items-center gap-2 group" to="/candidate/overview">
          <img
            alt="ФСП"
            class="h-7 sm:h-8 w-auto transition-transform group-hover:scale-105"
            src="/brand/logo_01.svg"
          />
          <div class="flex flex-col">
            <span
              class="font-extrabold text-base sm:text-lg tracking-tight font-mono text-gray-900 dark:text-white"
            >
              Hunt<span class="text-fsp-blue">Me</span>
            </span>
            <span class="text-[9px] text-gray-400 font-mono tracking-wider -mt-1 hidden xs:block">
              ФСП РЕКРУТИНГ
            </span>
          </div>
        </RouterLink>

        <!-- Чип верифицированной категории кандидата -->
        <div
          v-if="isCandidate && categoryChipLabel"
          class="hidden sm:flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-fsp-dark-border"
        >
          <span
            class="text-xs font-mono font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-fsp-dark-surface px-2.5 py-1 rounded-lg border border-gray-200/60 dark:border-fsp-dark-border"
          >
            {{ categoryChipLabel }}
          </span>
          <BaseBadge
            v-if="isVerifiedFsp"
            icon="pi pi-trophy"
            label="ФСП"
            size="sm"
            variant="danger"
          />
        </div>
      </div>

      <!-- Действия справа -->
      <div class="flex items-center gap-2 sm:gap-3 shrink-0">
        <!-- Информация о текущем пользователе -->
        <div
          v-if="user"
          class="hidden md:flex items-center gap-2 text-xs font-mono text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg bg-gray-100/70 dark:bg-fsp-dark-surface border border-gray-200/80 dark:border-fsp-dark-border"
        >
          <span
            :class="user.emailVerified ? 'bg-emerald-500' : 'bg-amber-500'"
            class="w-2 h-2 rounded-full"
          ></span>
          <span class="truncate max-w-[160px]">{{ user.email }}</span>
        </div>

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

        <!-- Кнопка выхода -->
        <BaseButton icon="pi pi-sign-out" size="sm" variant="outline" @click="logout()">
          Выйти
        </BaseButton>
      </div>
    </div>
  </header>
</template>
