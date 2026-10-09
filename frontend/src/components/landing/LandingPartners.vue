<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useLandingRoleStore } from '@/stores/landingRole'
import type { StatMetric } from '@/types/landing'

const roleStore = useLandingRoleStore()
const activeIndex = ref(0)

const metrics = computed<StatMetric[]>(() => {
  return roleStore.isCandidate
    ? [
        {
          value: '15 мин',
          label: 'Тест на грейд',
          subtext: 'Адаптивная экспресс-оценка навыков вместо недель собеседований',
        },
        {
          value: '48 часов',
          label: 'До первого оффера',
          subtext: 'Средняя скорость получения прямых предложений с вилкой ЗП',
        },
        {
          value: '100%',
          label: 'Открытые зарплаты',
          subtext: 'Обязательное указание прозрачной зарплатной вилки в рублях',
        },
        {
          value: '15 000+',
          label: 'Банк талантов',
          subtext: 'Соискатели с объективным тестированием и рейтингом ФСП',
        },
      ]
    : [
        {
          value: '70%',
          label: 'Экономия времени',
          subtext: 'Исключение спам-резюме и первичного отсева тимлидами',
        },
        {
          value: '94%',
          label: 'Точность грейда',
          subtext: 'Объективное подтверждение адаптивными тестами и ФСП ID',
        },
        {
          value: '3.5x',
          label: 'Response Rate',
          subtext: 'Прямые офферы с открытой ЗП получают максимальный отклик',
        },
        {
          value: '152-ФЗ',
          label: '100% Приватность',
          subtext: 'Безопасность данных и прямой контакт только при согласии',
        },
      ]
})
</script>

<template>
  <section class="relative z-20 pb-12 md:pb-16 -mt-6 md:-mt-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Плавающая карточка с метриками в стиле референса -->
      <div
        class="rounded-3xl p-3 sm:p-4 bg-white/80 dark:bg-fsp-dark/90 border border-gray-200/80 dark:border-fsp-dark-border shadow-2xl backdrop-blur-xl transition-all"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div
            v-for="(metric, index) in metrics"
            :key="metric.label"
            :class="[
              index === activeIndex
                ? 'bg-fsp-blue text-white shadow-[0_8px_30px_rgba(64,47,255,0.35)] ring-1 ring-white/20'
                : 'hover:bg-gray-100/70 dark:hover:bg-fsp-dark-surface/60 text-gray-900 dark:text-white',
            ]"
            class="rounded-2xl p-6 sm:p-7 text-left transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4"
            @mouseenter="activeIndex = index"
          >
            <!-- Числовая метрика -->
            <div
              :class="index === activeIndex ? 'text-white' : 'text-gray-900 dark:text-white'"
              class="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight"
            >
              {{ metric.value }}
            </div>

            <!-- Текстовое описание -->
            <div>
              <div
                :class="index === activeIndex ? 'text-white' : 'text-gray-900 dark:text-white'"
                class="text-base sm:text-lg font-bold font-sans leading-snug"
              >
                {{ metric.label }}
              </div>
              <div
                :class="
                  index === activeIndex ? 'text-blue-100/90' : 'text-gray-600 dark:text-gray-300'
                "
                class="text-xs sm:text-sm font-sans leading-relaxed mt-1.5"
              >
                {{ metric.subtext }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
