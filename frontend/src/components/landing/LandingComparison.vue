<script lang="ts" setup>
import { computed } from 'vue'
import { useLandingRoleStore } from '@/stores/landingRole'
import type { ComparisonItem } from '@/types/landing'

const roleStore = useLandingRoleStore()

const items = computed<ComparisonItem[]>(() => {
  return roleStore.isCandidate
    ? [
        {
          id: '1',
          feature: 'Инициатива контакта',
          traditional: 'Слепые отклики в пустоту, 90% без ответа',
          huntMe: 'Работодатель сам находит вас и делает предложение',
        },
        {
          id: '2',
          feature: 'Зарплатные условия',
          traditional: '«По результатам собеседования» или скрыта',
          huntMe: 'Обязательная вилка ЗП в рублях в каждом оффере',
        },
        {
          id: '3',
          feature: 'Оценка квалификации',
          traditional: 'Субъективный HR-скрининг по резюме',
          huntMe: 'Объективный тест на грейд + рейтинг ФСП',
        },
        {
          id: '4',
          feature: 'Приватность контактов',
          traditional: 'Резюме и телефон открыты всем',
          huntMe: '100% анонимность до вашего согласия на оффер',
        },
      ]
    : [
        {
          id: '1',
          feature: 'Поток кандидатов',
          traditional: 'Сотни нерелевантных откликов на вакансию',
          huntMe: 'Готовый банк подтвержденных специалистов по категориям',
        },
        {
          id: '2',
          feature: 'Проверка технических навыков',
          traditional: 'Тимлиды тратят часы на первичный лайвкодинг',
          huntMe: 'Грейд и навыки уже подтверждены платформой и ФСП',
        },
        {
          id: '3',
          feature: 'Точность подбора',
          traditional: 'Поиск по ключевым словам в резюме',
          huntMe: 'Explainable AI Match с объяснением соответствия',
        },
        {
          id: '4',
          feature: 'Отклик на предложения',
          traditional: 'Низкая конверсия из-за шаблонных писем',
          huntMe: 'Высокий Response Rate благодаря прозрачным условиям',
        },
      ]
})
</script>

<template>
  <section class="py-20 bg-white dark:bg-fsp-dark text-gray-900 dark:text-white transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-12 space-y-4">
        <h2 class="text-3xl sm:text-4xl font-extrabold font-sans tracking-tight">
          Классический найм vs HuntMe
        </h2>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-sans">
          Сравните подход традиционных досок объявлений и обратную модель HuntMe
        </p>
      </div>

      <div
        class="overflow-hidden rounded-2xl border border-gray-200 dark:border-fsp-dark-border bg-white dark:bg-fsp-dark-surface shadow-xl"
      >
        <div
          class="grid grid-cols-1 md:grid-cols-12 border-b border-gray-200 dark:border-fsp-dark-border bg-gray-50 dark:bg-fsp-dark text-xs font-mono font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
        >
          <div class="md:col-span-3 p-4 hidden md:block">Параметр</div>
          <div class="md:col-span-4 p-4 text-red-500 dark:text-red-400 flex items-center gap-1.5">
            <i class="pi pi-times-circle"></i>
            <span>Традиционные площадки</span>
          </div>
          <div
            class="md:col-span-5 p-4 text-fsp-blue dark:text-blue-300 bg-fsp-blue/5 dark:bg-fsp-blue/10 flex items-center gap-1.5"
          >
            <i class="pi pi-check-circle"></i>
            <span>Платформа HuntMe</span>
          </div>
        </div>

        <div
          v-for="item in items"
          :key="item.id"
          class="grid grid-cols-1 md:grid-cols-12 border-b last:border-b-0 border-gray-100 dark:border-fsp-dark-border text-xs sm:text-sm font-sans"
        >
          <div
            class="md:col-span-3 p-4 font-semibold text-gray-900 dark:text-gray-100 bg-gray-50/50 dark:bg-transparent"
          >
            {{ item.feature }}
          </div>
          <div class="md:col-span-4 p-4 text-gray-600 dark:text-gray-400 flex items-start gap-2">
            <span class="text-red-500 font-bold">✕</span>
            <span>{{ item.traditional }}</span>
          </div>
          <div
            class="md:col-span-5 p-4 font-medium text-gray-900 dark:text-white bg-fsp-blue/5 dark:bg-fsp-blue/10 flex items-start gap-2"
          >
            <span class="text-fsp-blue font-bold">✓</span>
            <span>{{ item.huntMe }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
