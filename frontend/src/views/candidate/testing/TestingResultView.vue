<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useCandidateProfile } from '@/composables/useCandidateProfile'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'

const router = useRouter()
const { profile, isVerifiedFsp } = useCandidateProfile()

function goOverview() {
  router.push('/candidate/overview')
}

function goInvites() {
  router.push('/candidate/invites')
}
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <!-- Главная карточка успешного результата -->
    <div
      class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 sm:p-8 shadow-xs text-center space-y-6"
    >
      <div
        class="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-2xl border border-emerald-500/20"
      >
        <i class="pi pi-check-circle"></i>
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-center gap-2">
          <span
            class="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider"
          >
            Тестирование успешно завершено
          </span>
          <BaseBadge
            v-if="isVerifiedFsp"
            icon="pi pi-trophy"
            label="ФСП"
            size="sm"
            variant="danger"
          />
        </div>

        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Подтвержден грейд {{ profile.verifiedGrade || 'Senior' }}
        </h2>

        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto font-sans">
          Поздравляем! Ваш результат объективно подтверждает категорию
          <strong class="text-gray-800 dark:text-gray-200">{{ profile.category }}</strong
          >.
        </p>
      </div>

      <!-- Скоринг метрика -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div
          class="p-4 rounded-xl bg-gray-50 dark:bg-fsp-dark border border-gray-200/60 dark:border-fsp-dark-border"
        >
          <div class="text-[11px] font-mono text-gray-400">Итоговый балл</div>
          <div class="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">94%</div>
        </div>

        <div
          class="p-4 rounded-xl bg-gray-50 dark:bg-fsp-dark border border-gray-200/60 dark:border-fsp-dark-border"
        >
          <div class="text-[11px] font-mono text-gray-400">Время прохождения</div>
          <div class="text-2xl font-bold font-mono text-fsp-blue">18:42</div>
        </div>

        <div
          class="p-4 rounded-xl bg-gray-50 dark:bg-fsp-dark border border-gray-200/60 dark:border-fsp-dark-border"
        >
          <div class="text-[11px] font-mono text-gray-400">Задач решено</div>
          <div class="text-2xl font-bold font-mono text-gray-900 dark:text-white">5 / 5</div>
        </div>
      </div>

      <!-- Детализация по темам -->
      <div class="text-left space-y-3 pt-4 border-t border-gray-100 dark:border-fsp-dark-border">
        <h4 class="text-xs font-mono uppercase text-gray-400 font-bold">
          Детализация по блокам знаний
        </h4>
        <div class="space-y-2 text-xs font-mono">
          <div
            class="flex items-center justify-between p-3 rounded-xl bg-gray-50/60 dark:bg-fsp-dark/50"
          >
            <span>Конкурентность и каналы (Go)</span>
            <span class="text-emerald-600 dark:text-emerald-400 font-bold">100% (Отлично)</span>
          </div>
          <div
            class="flex items-center justify-between p-3 rounded-xl bg-gray-50/60 dark:bg-fsp-dark/50"
          >
            <span>Транзакции и изоляция (PostgreSQL)</span>
            <span class="text-emerald-600 dark:text-emerald-400 font-bold">100% (Отлично)</span>
          </div>
          <div
            class="flex items-center justify-between p-3 rounded-xl bg-gray-50/60 dark:bg-fsp-dark/50"
          >
            <span>HighLoad архитектура и шардирование</span>
            <span class="text-emerald-600 dark:text-emerald-400 font-bold">100% (Отлично)</span>
          </div>
          <div
            class="flex items-center justify-between p-3 rounded-xl bg-gray-50/60 dark:bg-fsp-dark/50"
          >
            <span>Skip List и структуры данных</span>
            <span class="text-emerald-600 dark:text-emerald-400 font-bold">100% (Отлично)</span>
          </div>
        </div>
      </div>

      <!-- Кнопки действий -->
      <div
        class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-gray-100 dark:border-fsp-dark-border"
      >
        <BaseButton icon="pi pi-home" size="md" variant="outline" @click="goOverview">
          На главную сводку
        </BaseButton>

        <BaseButton icon="pi pi-envelope" size="md" variant="primary" @click="goInvites">
          Смотреть входящие офферы
        </BaseButton>
      </div>
    </div>
  </div>
</template>
