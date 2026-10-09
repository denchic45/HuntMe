<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'

const router = useRouter()

interface ApplicationItem {
  id: string
  company: string
  role: string
  appliedDate: string
  status: 'pending' | 'interview' | 'rejected'
  statusLabel: string
  statusVariant: 'primary' | 'danger' | 'neutral'
}

const applications = ref<ApplicationItem[]>([
  {
    id: 'app_1',
    company: 'Яндекс Инфраструктура',
    role: 'Senior Go Engineer (Yandex Cloud)',
    appliedDate: 'Вчера в 16:30',
    status: 'interview',
    statusLabel: 'Приглашение на технический скрининг',
    statusVariant: 'primary',
  },
  {
    id: 'app_2',
    company: 'Ozon FinTech',
    role: 'HighLoad Backend Developer (Go / Postgres)',
    appliedDate: '3 дня назад',
    status: 'pending',
    statusLabel: 'Резюме на рассмотрении тимлида',
    statusVariant: 'neutral',
  },
  {
    id: 'app_3',
    company: 'Авито Tech',
    role: 'Staff Distributed Systems Engineer',
    appliedDate: '10 дней назад',
    status: 'rejected',
    statusLabel: 'Позиция закрыта внутренним переводом',
    statusVariant: 'danger',
  },
])
</script>

<template>
  <div class="space-y-6">
    <div>
      <BaseButton
        icon="pi pi-arrow-left"
        size="sm"
        variant="ghost"
        @click="router.push('/candidate/vacancies')"
      >
        К каталогу вакансий
      </BaseButton>
    </div>

    <div
      class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 shadow-xs space-y-4"
    >
      <div class="space-y-1 pb-4 border-b border-gray-100 dark:border-fsp-dark-border">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Мои отправленные отклики</h2>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          История прямых откликов на открытые вакансии и статусы рассмотрения рекрутерами
        </p>
      </div>

      <div class="space-y-3">
        <div
          v-for="app in applications"
          :key="app.id"
          class="p-4 rounded-xl bg-gray-50 dark:bg-fsp-dark border border-gray-200/60 dark:border-fsp-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono font-bold text-fsp-blue">{{ app.company }}</span>
              <span>•</span>
              <span class="text-xs font-mono text-gray-400">{{ app.appliedDate }}</span>
            </div>
            <h4 class="text-sm font-bold text-gray-900 dark:text-white font-sans">
              {{ app.role }}
            </h4>
          </div>

          <div class="shrink-0">
            <BaseBadge :label="app.statusLabel" :variant="app.statusVariant" size="sm" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
