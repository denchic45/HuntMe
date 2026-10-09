<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCandidateProfile } from '@/composables/useCandidateProfile'
import { useInvites } from '@/composables/useInvites'

interface Props {
  isOpen?: boolean
}

withDefaults(defineProps<Props>(), {
  isOpen: false,
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const route = useRoute()
const { profile, completionPercentage, isVerifiedFsp } = useCandidateProfile()
const { newInvitesCount } = useInvites()

interface NavItem {
  name: string
  to: string
  icon: string
  badge?: string | number
  badgeVariant?: 'primary' | 'danger' | 'glow' | 'neutral'
  isActiveMatch: (path: string) => boolean
}

const navItems = computed<NavItem[]>(() => [
  {
    name: 'Главная сводка',
    to: '/candidate/overview',
    icon: 'pi pi-home',
    isActiveMatch: (path) => path === '/candidate/overview' || path === '/candidate',
  },
  {
    name: 'Мой профиль',
    to: '/candidate/profile/edit',
    icon: 'pi pi-user',
    badge: `${completionPercentage.value}%`,
    badgeVariant: completionPercentage.value >= 80 ? 'primary' : 'neutral',
    isActiveMatch: (path) => path.startsWith('/candidate/profile'),
  },
  {
    name: 'Квалификация',
    to: '/candidate/testing',
    icon: 'pi pi-verified',
    badge: profile.value.verifiedGrade || 'Тест',
    badgeVariant: 'primary',
    isActiveMatch: (path) => path.startsWith('/candidate/testing'),
  },
  {
    name: 'Достижения ФСП',
    to: '/candidate/fsp',
    icon: 'pi pi-trophy',
    badge: isVerifiedFsp.value ? 'ФСП' : undefined,
    badgeVariant: 'danger',
    isActiveMatch: (path) => path.startsWith('/candidate/fsp'),
  },
  {
    name: 'Приглашения',
    to: '/candidate/invites',
    icon: 'pi pi-envelope',
    badge: newInvitesCount.value > 0 ? newInvitesCount.value : undefined,
    badgeVariant: 'danger',
    isActiveMatch: (path) => path.startsWith('/candidate/invites'),
  },
  {
    name: 'Вакансии',
    to: '/candidate/vacancies',
    icon: 'pi pi-briefcase',
    isActiveMatch: (path) => path.startsWith('/candidate/vacancies'),
  },
  {
    name: 'Микро-задания',
    to: '/candidate/challenges',
    icon: 'pi pi-code',
    badge: 'NEW',
    badgeVariant: 'glow',
    isActiveMatch: (path) => path.startsWith('/candidate/challenges'),
  },
  {
    name: 'Настройки',
    to: '/candidate/settings',
    icon: 'pi pi-cog',
    isActiveMatch: (path) => path.startsWith('/candidate/settings'),
  },
])
</script>

<template>
  <div class="shrink-0 lg:sticky lg:top-20 lg:self-start lg:z-20">
    <!-- Мобильный оверлей затемнения -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
      @click="emit('close')"
    ></div>

    <!-- Фиксированная при скролле плавающая боковая панель -->
    <aside
      :class="[
        'w-64 bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl shadow-xs flex flex-col justify-between p-3 select-none',
        // Десктоп: высота с отступами сверху и снизу, внутренний скролл пунктов
        'lg:h-[calc(100vh-6.5rem)] lg:flex',
        // Мобильные: плавающий выдвижной drawer
        isOpen
          ? 'fixed top-20 left-4 bottom-4 w-72 max-w-[calc(100vw-2rem)] shadow-2xl z-50 flex'
          : 'hidden lg:flex',
      ]"
    >
      <!-- Мобильный верхний заголовок без логотипа -->
      <div
        class="lg:hidden flex items-center justify-between px-2 pt-1 pb-2 border-b border-gray-100 dark:border-fsp-dark-border mb-1"
      >
        <span
          class="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
        >
          Навигация
        </span>
        <button
          aria-label="Закрыть меню"
          class="p-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-fsp-dark cursor-pointer transition-colors"
          type="button"
          @click="emit('close')"
        >
          <i class="pi pi-times text-xs"></i>
        </button>
      </div>

      <!-- Навигационное меню со внутренним скроллом -->
      <nav class="flex-1 overflow-y-auto space-y-1 pr-0.5">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :class="[
            'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group select-none',
            item.isActiveMatch(route.path)
              ? 'bg-fsp-blue text-white shadow-xs font-semibold'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-fsp-dark',
          ]"
          :to="item.to"
          @click="emit('close')"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <i :class="[item.icon, 'text-sm shrink-0']"></i>
            <span class="truncate">{{ item.name }}</span>
          </div>

          <!-- Бейджи статуса -->
          <span
            v-if="item.badge !== undefined"
            :class="[
              'px-2 py-0.5 rounded-full text-[11px] font-mono font-bold shrink-0',
              item.isActiveMatch(route.path)
                ? 'bg-white/20 text-white'
                : item.badgeVariant === 'danger'
                  ? 'bg-fsp-red/10 text-fsp-red dark:bg-fsp-red/20'
                  : item.badgeVariant === 'glow'
                    ? 'bg-amber-500/10 text-amber-500'
                    : 'bg-gray-100 dark:bg-fsp-dark text-gray-600 dark:text-gray-300',
            ]"
          >
            {{ item.badge }}
          </span>
        </RouterLink>
      </nav>

      <!-- Нижний блок статуса поиска -->
      <div class="pt-2 mt-2 border-t border-gray-100 dark:border-fsp-dark-border">
        <div
          class="flex items-center justify-between px-2.5 py-2 rounded-xl bg-gray-50/70 dark:bg-fsp-dark/50 text-xs"
        >
          <div class="flex items-center gap-2 min-w-0">
            <span
              :class="profile.isSearchActive ? 'bg-emerald-500' : 'bg-gray-400'"
              class="w-2 h-2 rounded-full animate-pulse shrink-0"
            ></span>
            <span
              class="text-[11px] font-mono font-medium text-gray-700 dark:text-gray-300 truncate"
            >
              {{ profile.isSearchActive ? 'Виден компаниям' : 'Поиск скрыт' }}
            </span>
          </div>
          <span class="text-[10px] font-mono text-fsp-blue font-bold shrink-0">152-ФЗ</span>
        </div>
      </div>
    </aside>
  </div>
</template>
