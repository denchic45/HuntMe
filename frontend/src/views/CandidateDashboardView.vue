<script lang="ts" setup>
import { useAuth } from '@/composables/useAuth'
import DashboardHeader from '@/components/layout/DashboardHeader.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'

const { user, logout } = useAuth()
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-fsp-dark text-gray-900 dark:text-gray-100 flex flex-col"
  >
    <DashboardHeader />

    <main class="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
      <!-- Приветственная карточка кандидата -->
      <div
        class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 sm:p-8 shadow-sm"
      >
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-fsp-dark-border"
        >
          <div>
            <div class="flex items-center gap-2 mb-1">
              <BaseBadge label="Кандидат ФСП" variant="primary" />
              <BaseBadge
                :label="user?.emailVerified ? 'Email подтвержден' : 'Требуется подтверждение'"
                :variant="user?.emailVerified ? 'primary' : 'neutral'"
              />
            </div>
            <h1 class="text-2xl font-bold tracking-tight">Личный кабинет кандидата</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ user?.fullName || 'Спортивный программист' }} ({{ user?.email }})
            </p>
          </div>

          <BaseButton size="sm" variant="outline" @click="logout()"> Выйти из аккаунта </BaseButton>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div
            class="p-4 rounded-xl bg-gray-50 dark:bg-fsp-dark border border-gray-200 dark:border-fsp-dark-border"
          >
            <span class="text-xs font-mono text-gray-400 uppercase">Возраст</span>
            <p class="text-lg font-mono font-bold mt-1 text-fsp-blue">
              {{ user?.age ? `${user.age} лет` : 'Не указан' }}
            </p>
          </div>

          <div
            class="p-4 rounded-xl bg-gray-50 dark:bg-fsp-dark border border-gray-200 dark:border-fsp-dark-border"
          >
            <span class="text-xs font-mono text-gray-400 uppercase">Дата рождения</span>
            <p class="text-lg font-mono font-bold mt-1 text-gray-900 dark:text-white">
              {{ user?.birthDate || 'Не указана' }}
            </p>
          </div>

          <div
            class="p-4 rounded-xl bg-gray-50 dark:bg-fsp-dark border border-gray-200 dark:border-fsp-dark-border"
          >
            <span class="text-xs font-mono text-gray-400 uppercase">Верификация ФСП</span>
            <p class="text-lg font-mono font-bold mt-1 text-emerald-500 flex items-center gap-1.5">
              <i class="pi pi-check-circle text-sm"></i>
              Активна
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
