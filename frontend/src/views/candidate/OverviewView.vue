<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useCandidateProfile } from '@/composables/useCandidateProfile'
import { useInvites } from '@/composables/useInvites'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'

const router = useRouter()
const { profile, isVerifiedFsp } = useCandidateProfile()
const { newInvitesCount } = useInvites()

function formatAge(age: number): string {
  const mod10 = age % 10
  const mod100 = age % 100
  if (mod100 >= 11 && mod100 <= 19) return 'лет'
  if (mod10 === 1) return 'год'
  if (mod10 >= 2 && mod10 <= 4) return 'года'
  return 'лет'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Верхний баннер профиля соискателя -->
    <div
      class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-5 sm:p-6 shadow-sm flex items-center gap-4 sm:gap-5"
    >
      <!-- Квадратная аватарка со скруглением 25% со стандартным изображением силуэта -->
      <div
        class="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-[25%] bg-gray-100 dark:bg-fsp-dark border border-gray-200/80 dark:border-fsp-dark-border flex items-center justify-center overflow-hidden text-gray-400 dark:text-gray-500 shadow-xs"
      >
        <img
          v-if="profile.avatarUrl"
          :alt="profile.fullName"
          :src="profile.avatarUrl"
          class="w-full h-full object-cover"
        />
        <svg
          v-else
          aria-hidden="true"
          class="w-7 h-7 sm:w-8 sm:h-8"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
          />
        </svg>
      </div>

      <!-- ФИО, возраст и город -->
      <div class="space-y-1 min-w-0">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
          {{ profile.fullName }}
        </h2>
        <div
          class="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-sans"
        >
          <span v-if="profile.age">{{ profile.age }} {{ formatAge(profile.age) }}</span>
          <span v-if="profile.age && profile.city" class="text-gray-300 dark:text-gray-600">•</span>
          <span v-if="profile.city" class="inline-flex items-center gap-1">
            <i class="pi pi-map-marker text-[11px] text-gray-400"></i>
            {{ profile.city }}
          </span>
        </div>
      </div>
    </div>

    <!-- 3 Главные карточки дашборда -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- 1. Верифицированная категория -->
      <div
        class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-5 shadow-xs flex flex-col justify-between"
      >
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono text-gray-400 uppercase tracking-wider">Категория</span>
            <BaseBadge
              v-if="isVerifiedFsp"
              icon="pi pi-trophy"
              label="ФСП"
              size="sm"
              variant="danger"
            />
          </div>
          <div>
            <div class="text-lg font-bold text-gray-900 dark:text-white">
              {{ profile.verifiedGrade || profile.claimedGrade }} {{ profile.specialization }}
            </div>
            <p
              class="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-mono"
            >
              <i class="pi pi-check-circle"></i>
              Квалификация подтверждена
            </p>
          </div>
        </div>
        <div class="pt-4 mt-4 border-t border-gray-100 dark:border-fsp-dark-border">
          <button
            class="text-xs font-mono text-fsp-blue hover:underline cursor-pointer flex items-center justify-between w-full"
            type="button"
            @click="router.push('/candidate/testing')"
          >
            <span>Центр тестирования</span>
            <i class="pi pi-arrow-right text-[10px]"></i>
          </button>
        </div>
      </div>

      <!-- 2. Входящие предложения -->
      <div
        class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-5 shadow-xs flex flex-col justify-between"
      >
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono text-gray-400 uppercase tracking-wider">Офферы</span>
            <span
              v-if="newInvitesCount > 0"
              class="px-2 py-0.5 rounded-full bg-fsp-red/10 text-fsp-red text-xs font-mono font-bold"
            >
              +{{ newInvitesCount }} новых
            </span>
          </div>
          <div>
            <div class="text-2xl font-bold font-mono text-fsp-blue">
              {{ newInvitesCount }} предложений
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-sans">
              С обязательной вилкой зарплаты в рублях
            </p>
          </div>
        </div>
        <div class="pt-4 mt-4 border-t border-gray-100 dark:border-fsp-dark-border">
          <button
            class="text-xs font-mono text-fsp-blue hover:underline cursor-pointer flex items-center justify-between w-full"
            type="button"
            @click="router.push('/candidate/invites')"
          >
            <span>Смотреть офферы</span>
            <i class="pi pi-arrow-right text-[10px]"></i>
          </button>
        </div>
      </div>

      <!-- 3. Микро-задачи и активность -->
      <div
        class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-5 shadow-xs flex flex-col justify-between"
      >
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono text-gray-400 uppercase tracking-wider">Активность</span>
            <span class="text-xs font-mono font-bold text-amber-500">
              {{ profile.activityScore }} очков
            </span>
          </div>
          <div>
            <div class="text-lg font-bold text-gray-900 dark:text-white">
              {{ profile.completedTasksCount }} задач решено
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 font-sans">
              Свежий сигнал для работодателей
            </p>
          </div>
        </div>
        <div class="pt-4 mt-4 border-t border-gray-100 dark:border-fsp-dark-border">
          <button
            class="text-xs font-mono text-fsp-blue hover:underline cursor-pointer flex items-center justify-between w-full"
            type="button"
            @click="router.push('/candidate/challenges')"
          >
            <span>Решить микро-кейс</span>
            <i class="pi pi-arrow-right text-[10px]"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Блок ФСП Достижений -->
    <div
      class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 shadow-xs space-y-4"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div
            class="w-8 h-8 rounded-lg bg-fsp-red/10 text-fsp-red flex items-center justify-center"
          >
            <i class="pi pi-trophy text-sm"></i>
          </div>
          <div>
            <h3 class="text-base font-bold text-gray-900 dark:text-white">Верификация ФСП</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">Спортивные достижения Федерации</p>
          </div>
        </div>

        <BaseButton size="sm" variant="outline" @click="router.push('/candidate/fsp')">
          Управление
        </BaseButton>
      </div>

      <div v-if="profile.fspAchievements.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          v-for="ach in profile.fspAchievements.slice(0, 4)"
          :key="ach.id"
          class="p-3.5 rounded-xl bg-gray-50 dark:bg-fsp-dark border border-gray-200/60 dark:border-fsp-dark-border flex items-center justify-between text-xs"
        >
          <div class="font-medium text-gray-800 dark:text-gray-200 truncate mr-2">
            {{ ach.title }}
          </div>
          <span class="text-fsp-red font-mono font-bold shrink-0">{{ ach.rank }}</span>
        </div>
      </div>
      <div v-else class="text-xs text-gray-400 font-mono py-2">
        Достижения не привязаны. Привяжите ваш ФСП ID для верификации.
      </div>
    </div>
  </div>
</template>
