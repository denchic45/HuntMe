<script lang="ts" setup>
import { computed } from 'vue'
import { useLandingRoleStore } from '@/stores/landingRole'
import type { StatMetric } from '@/types/landing'

const roleStore = useLandingRoleStore()

const metrics = computed<StatMetric[]>(() => {
  return roleStore.isCandidate
    ? [
        { value: '15 000+', label: 'Верифицированных соискателей', subtext: 'в едином банке' },
        { value: '100%', label: 'Прозрачность зарплат', subtext: 'вилка ЗП обязательна' },
        { value: '48 часов', label: 'До первого оффера', subtext: 'средняя скорость' },
        { value: '152-ФЗ', label: '100% приватность', subtext: 'контакты защищены' },
      ]
    : [
        { value: '70%', label: 'Экономия времени тимлидов', subtext: 'на первичном отсеве' },
        { value: '94%', label: 'Точность подтверждения грейда', subtext: 'по результатам тестов' },
        { value: '3.5x', label: 'Выше Response Rate', subtext: 'по сравнению со спамом' },
        { value: 'FSP ID', label: 'Спортивный скоринг', subtext: 'рейтинг алгоритмистов' },
      ]
})

const partners = [
  { name: 'ФСП России', role: 'Федерация спортивного программирования' },
  { name: 'ЛЦТ', role: 'Лидеры цифровой трансформации' },
  { name: 'Бизнес Москвы', role: 'Правительство Москвы' },
  { name: 'Яндекс', role: 'Технологический партнер' },
  { name: 'Сбер', role: 'ИТ-Инфраструктура' },
  { name: 'Т-Банк', role: 'Финтех-экосистема' },
]
</script>

<template>
  <section
    class="border-y border-gray-200/80 dark:border-fsp-dark-border bg-gray-50/50 dark:bg-fsp-dark/40 py-12"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Метрики в моноширинном стиле -->
      <div
        class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-b border-gray-200 dark:border-fsp-dark-border pb-10"
      >
        <div v-for="metric in metrics" :key="metric.label" class="space-y-1">
          <div
            class="text-3xl sm:text-4xl font-extrabold font-mono text-gray-900 dark:text-white tracking-tight"
          >
            {{ metric.value }}
          </div>
          <div class="text-xs sm:text-sm font-semibold text-fsp-blue dark:text-blue-400 font-sans">
            {{ metric.label }}
          </div>
          <div class="text-[11px] text-gray-500 dark:text-gray-400 font-sans">
            {{ metric.subtext }}
          </div>
        </div>
      </div>

      <!-- Логотипы партнеров и организаторов -->
      <div class="pt-8">
        <div
          class="text-center text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 font-mono mb-6"
        >
          При поддержке и партнерстве ключевых ИТ-институтов
        </div>
        <div
          class="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-80 dark:opacity-90"
        >
          <div
            v-for="partner in partners"
            :key="partner.name"
            class="flex items-center gap-2 group transition-all"
          >
            <div
              class="w-2.5 h-2.5 rounded-full bg-fsp-blue/60 group-hover:bg-fsp-red transition-colors"
            ></div>
            <div class="flex flex-col">
              <span
                class="text-sm md:text-base font-bold font-mono text-gray-800 dark:text-gray-200 group-hover:text-fsp-blue transition-colors"
              >
                {{ partner.name }}
              </span>
              <span class="text-[10px] text-gray-500 dark:text-gray-400 hidden sm:block">
                {{ partner.role }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
