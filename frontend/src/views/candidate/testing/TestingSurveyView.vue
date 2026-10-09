<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import type { CandidateGrade } from '@/types/candidate'

const router = useRouter()

const specializations = [
  'Backend',
  'Frontend',
  'Fullstack',
  'DevOps / SRE',
  'Mobile iOS/Android',
  'Data Engineering',
  'ML / AI',
  'QA Automation',
]

const grades: CandidateGrade[] = ['Junior', 'Middle', 'Senior', 'Lead']

const selectedSpec = ref('Backend')
const selectedGrade = ref<CandidateGrade>('Senior')
const selectedLanguage = ref('Go (Golang)')

function startTestingSession() {
  const sessionId = `sess_${Date.now()}`
  router.push(`/candidate/testing/session/${sessionId}`)
}

function goBack() {
  router.push('/candidate/testing')
}
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div>
      <BaseButton icon="pi pi-arrow-left" size="sm" variant="ghost" @click="goBack">
        К хабу квалификации
      </BaseButton>
    </div>

    <div
      class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 sm:p-8 shadow-xs space-y-6"
    >
      <div class="space-y-1 pb-4 border-b border-gray-100 dark:border-fsp-dark-border">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Параметры тестирования квалификации
        </h2>
        <p class="text-xs text-gray-500 dark:text-gray-400 font-sans">
          Выберите направление и целевой грейд для автоматической сборки пула вопросов
        </p>
      </div>

      <!-- 1. Выбор специализации -->
      <div class="space-y-3">
        <label class="block text-xs font-mono font-bold uppercase text-gray-500 dark:text-gray-400">
          1. Основная специализация
        </label>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            v-for="spec in specializations"
            :key="spec"
            :class="[
              'p-3 rounded-xl border text-xs font-mono font-semibold transition-all text-left cursor-pointer',
              selectedSpec === spec
                ? 'border-fsp-blue bg-fsp-blue/10 text-fsp-blue'
                : 'border-gray-200 dark:border-fsp-dark-border bg-gray-50 dark:bg-fsp-dark text-gray-700 dark:text-gray-300 hover:border-gray-300',
            ]"
            type="button"
            @click="selectedSpec = spec"
          >
            {{ spec }}
          </button>
        </div>
      </div>

      <!-- 2. Заявляемый грейд -->
      <div class="space-y-3">
        <label class="block text-xs font-mono font-bold uppercase text-gray-500 dark:text-gray-400">
          2. Заявляемый целевой грейд
        </label>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            v-for="g in grades"
            :key="g"
            :class="[
              'p-3 rounded-xl border text-xs font-mono font-bold transition-all text-center cursor-pointer',
              selectedGrade === g
                ? 'border-fsp-blue bg-fsp-blue text-white shadow-xs'
                : 'border-gray-200 dark:border-fsp-dark-border bg-gray-50 dark:bg-fsp-dark text-gray-700 dark:text-gray-300 hover:border-gray-300',
            ]"
            type="button"
            @click="selectedGrade = g"
          >
            {{ g }}
          </button>
        </div>
      </div>

      <!-- 3. Основной язык -->
      <div class="space-y-2">
        <label class="block text-xs font-mono font-bold uppercase text-gray-500 dark:text-gray-400">
          3. Основной язык реализации
        </label>
        <select
          v-model="selectedLanguage"
          class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-gray-50 dark:bg-fsp-dark text-sm focus:outline-none focus:border-fsp-blue font-mono"
        >
          <option>Go (Golang)</option>
          <option>TypeScript / Node.js</option>
          <option>Python</option>
          <option>Java</option>
          <option>C++</option>
          <option>Rust</option>
          <option>Kotlin</option>
        </select>
      </div>

      <!-- Памятка о тесте -->
      <div
        class="p-4 rounded-xl bg-blue-50/60 dark:bg-fsp-blue/10 border border-blue-200/80 dark:border-fsp-blue/20 text-xs text-blue-900 dark:text-blue-300 space-y-1"
      >
        <div class="font-bold flex items-center gap-1.5 font-mono">
          <i class="pi pi-shield"></i>
          Условия прохождения тестирования:
        </div>
        <ul
          class="list-disc list-inside space-y-0.5 text-blue-800 dark:text-blue-200/90 pl-1 font-sans"
        >
          <li>5 практических вопросов и код-кейсов;</li>
          <li>Лимит времени: 25 минут (таймер обратного отсчета);</li>
          <li>Тест проходит в полноэкранном сфокусированном режиме (FocusLayout);</li>
          <li>При подтверждении грейда ваш профиль сразу получает подтвержденный статус.</li>
        </ul>
      </div>

      <!-- Кнопка запуска -->
      <div class="pt-2">
        <BaseButton
          class="w-full justify-center"
          icon="pi pi-arrow-right"
          size="lg"
          variant="primary"
          @click="startTestingSession"
        >
          Начать тестирование в фокусном режиме
        </BaseButton>
      </div>
    </div>
  </div>
</template>
