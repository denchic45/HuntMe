<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useCandidateProfile } from '@/composables/useCandidateProfile'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'

const router = useRouter()
const { profile, isVerifiedFsp } = useCandidateProfile()

function startSurvey() {
  router.push('/candidate/testing/survey')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Верхняя карточка текущего подтвержденного статуса -->
    <div
      class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
    >
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <span class="text-xs font-mono text-gray-400 uppercase tracking-wider">
            Статус квалификации
          </span>
          <BaseBadge
            v-if="profile.testingStatus === 'verified'"
            icon="pi pi-check"
            label="Верифицирован"
            size="sm"
            variant="primary"
          />
          <BaseBadge
            v-if="isVerifiedFsp"
            icon="pi pi-trophy"
            label="ФСП"
            size="sm"
            variant="danger"
          />
        </div>

        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {{ profile.category || `${profile.claimedGrade} ${profile.specialization}` }}
        </h2>

        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-xl font-sans">
          Грейд объективно проверен на платформе HuntMe. Работодатели видят подтвержденный уровень и
          предлагают релевантную вилку.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
        <BaseButton icon="pi pi-play" size="md" variant="primary" @click="startSurvey">
          Пройти квалификацию
        </BaseButton>
      </div>
    </div>

    <!-- Сетка: Правило 3 месяцев и Аналитика компетенций -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Блок таймера пересдачи (Защита от частого спама тестов - 1 раз в 3 месяца) -->
      <div
        class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 shadow-xs space-y-4"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center"
          >
            <i class="pi pi-clock text-lg"></i>
          </div>
          <div>
            <h3 class="text-base font-bold text-gray-900 dark:text-white">Правило пересдачи</h3>
            <p class="text-xs text-gray-400 font-mono">1 раз в 3 месяца</p>
          </div>
        </div>

        <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
          Для предотвращения случайных результатов и накрутки повторное подтверждение или повышение
          грейда возможно не чаще одного раза в квартал.
        </p>

        <div
          class="p-4 rounded-xl bg-gray-50 dark:bg-fsp-dark border border-gray-200/60 dark:border-fsp-dark-border space-y-1"
        >
          <div class="text-[11px] font-mono text-gray-400">Последнее тестирование:</div>
          <div class="text-xs font-mono font-bold text-gray-800 dark:text-gray-200">
            {{ profile.lastTestDate || '15 февраля 2026' }}
          </div>
          <div
            class="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 pt-1 flex items-center gap-1"
          >
            <i class="pi pi-info-circle"></i>
            <span
              >Следующая попытка открыта: {{ profile.canRetakeTestAfter || '15 мая 2026' }}</span
            >
          </div>
        </div>
      </div>

      <!-- Карта подтвержденных компетенций (Радар навыков) -->
      <div
        class="lg:col-span-2 bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 shadow-xs space-y-5"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl bg-fsp-blue/10 text-fsp-blue flex items-center justify-center"
            >
              <i class="pi pi-chart-bar text-lg"></i>
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">Профиль компетенций</h3>
              <p class="text-xs text-gray-400">Результаты объективной автоматизированной оценки</p>
            </div>
          </div>
          <span
            class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg"
          >
            94% общий балл
          </span>
        </div>

        <!-- Метрики по блокам знаний -->
        <div class="space-y-3">
          <div>
            <div class="flex justify-between text-xs font-mono mb-1">
              <span class="text-gray-700 dark:text-gray-300"
                >Архитектура и HighLoad (распределенные системы)</span
              >
              <span class="font-bold text-fsp-blue">96%</span>
            </div>
            <div class="h-2 bg-gray-100 dark:bg-fsp-dark rounded-full overflow-hidden">
              <div class="h-full bg-fsp-blue rounded-full" style="width: 96%"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-xs font-mono mb-1">
              <span class="text-gray-700 dark:text-gray-300"
                >Базы данных (PostgreSQL, шардирование, транзакции)</span
              >
              <span class="font-bold text-fsp-blue">92%</span>
            </div>
            <div class="h-2 bg-gray-100 dark:bg-fsp-dark rounded-full overflow-hidden">
              <div class="h-full bg-fsp-blue rounded-full" style="width: 92%"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-xs font-mono mb-1">
              <span class="text-gray-700 dark:text-gray-300"
                >Алгоритмическая сложность и оптимизация</span
              >
              <span class="font-bold text-fsp-blue">98%</span>
            </div>
            <div class="h-2 bg-gray-100 dark:bg-fsp-dark rounded-full overflow-hidden">
              <div class="h-full bg-fsp-blue rounded-full" style="width: 98%"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-xs font-mono mb-1">
              <span class="text-gray-700 dark:text-gray-300"
                >Асинхронные очереди (Kafka, брокеры сообщений)</span
              >
              <span class="font-bold text-fsp-blue">90%</span>
            </div>
            <div class="h-2 bg-gray-100 dark:bg-fsp-dark rounded-full overflow-hidden">
              <div class="h-full bg-fsp-blue rounded-full" style="width: 90%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- История попыток сдачи -->
    <div
      class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 shadow-xs space-y-4"
    >
      <h3 class="text-base font-bold text-gray-900 dark:text-white">История тестирований</h3>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs font-mono">
          <thead>
            <tr class="border-b border-gray-100 dark:border-fsp-dark-border text-gray-400">
              <th class="py-2.5 pr-4">Дата</th>
              <th class="py-2.5 px-4">Специализация</th>
              <th class="py-2.5 px-4">Заявленный грейд</th>
              <th class="py-2.5 px-4">Итог теста</th>
              <th class="py-2.5 px-4">Подтвержденный грейд</th>
              <th class="py-2.5 pl-4 text-right">Результат</th>
            </tr>
          </thead>
          <tbody
            class="divide-y divide-gray-100 dark:divide-fsp-dark-border text-gray-700 dark:text-gray-300"
          >
            <tr>
              <td class="py-3 pr-4 font-bold">15.02.2026</td>
              <td class="py-3 px-4">Backend (Go)</td>
              <td class="py-3 px-4">Senior</td>
              <td class="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">94%</td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 rounded bg-fsp-blue/10 text-fsp-blue font-bold"
                  >Senior</span
                >
              </td>
              <td class="py-3 pl-4 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                Присвоен
              </td>
            </tr>
            <tr>
              <td class="py-3 pr-4 font-bold">10.11.2025</td>
              <td class="py-3 px-4">Backend (Go)</td>
              <td class="py-3 px-4">Middle</td>
              <td class="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">98%</td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 rounded bg-fsp-blue/10 text-fsp-blue font-bold"
                  >Middle</span
                >
              </td>
              <td class="py-3 pl-4 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                Присвоен
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
