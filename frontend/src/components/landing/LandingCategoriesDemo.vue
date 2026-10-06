<script lang="ts" setup>
import { computed, ref } from 'vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import type { CategoryPreview } from '@/types/landing'

const specializations = [
  'Backend',
  'Frontend',
  'DevOps & SRE',
  'AI & Machine Learning',
  'Mobile (iOS/Android)',
]
const grades: Array<'Junior' | 'Middle' | 'Senior' | 'Lead'> = [
  'Junior',
  'Middle',
  'Senior',
  'Lead',
]

const selectedSpec = ref('Backend')
const selectedGrade = ref<'Junior' | 'Middle' | 'Senior' | 'Lead'>('Senior')

const categoriesData: Record<string, Record<string, CategoryPreview>> = {
  Backend: {
    Senior: {
      id: 'be-sr',
      title: 'Senior Backend Engineer',
      grade: 'Senior',
      avgSalary: '320 000 – 420 000 ₽',
      skills: ['Go', 'PostgreSQL', 'Kafka', 'Kubernetes', 'Redis', 'gRPC'],
      verifiedCandidatesCount: 142,
      sampleTask: 'Проектирование шардирования БД и отказоустойчивой очереди сообщений',
      mockCandidate: {
        name: 'Михаил К. (ID: FSP-1094)',
        fspRank: 'Победитель Всероссийского Хакатона ФСП',
        experience: '6 лет промышленной разработки',
        matchScore: 98,
        status: 'Доступен для предложений',
      },
    },
    Middle: {
      id: 'be-mid',
      title: 'Middle Backend Engineer',
      grade: 'Middle',
      avgSalary: '200 000 – 280 000 ₽',
      skills: ['Python / Django / FastAPI', 'PostgreSQL', 'Docker', 'Celery'],
      verifiedCandidatesCount: 289,
      sampleTask: 'Оптимизация N+1 запросов к ORM и кэширование эндпоинтов',
      mockCandidate: {
        name: 'Артем Д. (ID: FSP-3240)',
        fspRank: 'Финалист Кубка России по спортпрограммированию',
        experience: '3 года опыта',
        matchScore: 94,
        status: 'Рассматривает предложения',
      },
    },
    Junior: {
      id: 'be-jun',
      title: 'Junior Backend Developer',
      grade: 'Junior',
      avgSalary: '100 000 – 150 000 ₽',
      skills: ['Java / Spring Boot', 'SQL', 'Git', 'REST API'],
      verifiedCandidatesCount: 410,
      sampleTask: 'Реализация алгоритма поиска путей и обработка исключений',
      mockCandidate: {
        name: 'Иван П. (ID: FSP-7712)',
        fspRank: '1 разряд по спортивному программированию',
        experience: '1 год опыта + хакатоны',
        matchScore: 91,
        status: 'В активном поиске',
      },
    },
    Lead: {
      id: 'be-lead',
      title: 'Lead / Principal Architect',
      grade: 'Lead',
      avgSalary: '450 000 – 600 000 ₽',
      skills: ['System Design', 'Go', 'Rust', 'HighLoad', 'Cloud Native'],
      verifiedCandidatesCount: 54,
      sampleTask: 'Архитектура распределенного биллинга 100k+ RPS',
      mockCandidate: {
        name: 'Сергей В. (ID: FSP-0023)',
        fspRank: 'Гроссмейстер спортивного программирования',
        experience: '9+ лет опыта',
        matchScore: 99,
        status: 'Открыт к предложениям',
      },
    },
  },
  Frontend: {
    Senior: {
      id: 'fe-sr',
      title: 'Senior Frontend Engineer',
      grade: 'Senior',
      avgSalary: '300 000 – 390 000 ₽',
      skills: ['Vue 3 / React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Performance'],
      verifiedCandidatesCount: 165,
      sampleTask: 'Оптимизация рендеринга больших списков (Virtual Scroll) и FCP < 0.8s',
      mockCandidate: {
        name: 'Анна С. (ID: FSP-5501)',
        fspRank: 'Призер Чемпионата Москвы по спортпрограммированию',
        experience: '5.5 лет опыта',
        matchScore: 96,
        status: 'Доступна для предложений',
      },
    },
  },
}

const defaultCategory: CategoryPreview = {
  id: 'be-sr',
  title: 'Senior Backend Engineer',
  grade: 'Senior',
  avgSalary: '320 000 – 420 000 ₽',
  skills: ['Go', 'PostgreSQL', 'Kafka', 'Kubernetes', 'Redis', 'gRPC'],
  verifiedCandidatesCount: 142,
  sampleTask: 'Проектирование шардирования БД и отказоустойчивой очереди сообщений',
  mockCandidate: {
    name: 'Михаил К. (ID: FSP-1094)',
    fspRank: 'Победитель Всероссийского Хакатона ФСП',
    experience: '6 лет промышленной разработки',
    matchScore: 98,
    status: 'Доступен для предложений',
  },
}

const activePreview = computed<CategoryPreview>(() => {
  const specData = categoriesData[selectedSpec.value]
  if (specData && specData[selectedGrade.value]) {
    return specData[selectedGrade.value]!
  }
  return defaultCategory
})
</script>

<template>
  <section
    class="py-20 bg-gray-50/70 dark:bg-fsp-dark-surface/40 border-t border-gray-200 dark:border-fsp-dark-border transition-colors"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <BaseBadge icon="pi pi-search" label="Интерактивная витрина" size="md" variant="primary" />
        <h2
          class="text-3xl sm:text-4xl font-extrabold font-sans text-gray-900 dark:text-white tracking-tight"
        >
          Банк верифицированных категорий
        </h2>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-sans">
          Исследуйте распределение квалификаций, навыки и уровень зарплат по направлениям
        </p>
      </div>

      <!-- Селекторы направления и грейда -->
      <div
        class="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white dark:bg-fsp-dark p-4 rounded-2xl border border-gray-200 dark:border-fsp-dark-border shadow-sm"
      >
        <!-- Специализации -->
        <div class="flex flex-wrap gap-2">
          <button
            v-for="spec in specializations"
            :key="spec"
            :class="
              selectedSpec === spec
                ? 'bg-fsp-blue text-white shadow-sm'
                : 'bg-gray-100 dark:bg-fsp-dark-surface text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-fsp-dark-card'
            "
            class="px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer"
            type="button"
            @click="selectedSpec = spec"
          >
            {{ spec }}
          </button>
        </div>

        <!-- Грейды -->
        <div
          class="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-fsp-dark-surface rounded-xl font-mono text-xs"
        >
          <button
            v-for="grade in grades"
            :key="grade"
            :class="
              selectedGrade === grade
                ? 'bg-white dark:bg-fsp-dark text-fsp-blue font-bold shadow-xs'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            "
            class="px-3 py-1 rounded-lg transition-all cursor-pointer"
            type="button"
            @click="selectedGrade = grade"
          >
            {{ grade }}
          </button>
        </div>
      </div>

      <!-- Превью категории и карточки кандидата -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <!-- Левая колонка: Детали категории -->
        <div
          class="lg:col-span-6 rounded-2xl bg-white dark:bg-fsp-dark border border-gray-200 dark:border-fsp-dark-border p-6 sm:p-8 flex flex-col justify-between shadow-sm"
        >
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono uppercase tracking-wider text-gray-400"
                >Категория</span
              >
              <BaseBadge
                :label="`${activePreview.verifiedCandidatesCount} специалистов`"
                variant="glow"
              />
            </div>

            <div>
              <h3 class="text-2xl font-bold font-sans text-gray-900 dark:text-white">
                {{ activePreview.title }}
              </h3>
              <div class="text-base font-bold font-mono text-fsp-blue mt-1">
                Рыночная вилка: {{ activePreview.avgSalary }}
              </div>
            </div>

            <div class="space-y-2">
              <div class="text-xs font-mono text-gray-500 dark:text-gray-400">
                Ключевой стек категории:
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="skill in activePreview.skills"
                  :key="skill"
                  class="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border text-xs font-mono text-gray-800 dark:text-gray-200"
                >
                  {{ skill }}
                </span>
              </div>
            </div>

            <div
              class="p-4 rounded-xl bg-gray-50 dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border space-y-1 text-xs"
            >
              <div class="font-semibold text-gray-800 dark:text-gray-200">
                Пример проверочного задания:
              </div>
              <p class="text-gray-600 dark:text-gray-400 font-sans">
                {{ activePreview.sampleTask }}
              </p>
            </div>
          </div>

          <div
            class="pt-6 mt-6 border-t border-gray-100 dark:border-fsp-dark-border flex items-center justify-between"
          >
            <span class="text-xs text-gray-500 font-sans">Требуется подтверждение тестом</span>
            <BaseButton icon="pi pi-arrow-right" icon-pos="right" size="sm">
              Пройти тест категории
            </BaseButton>
          </div>
        </div>

        <!-- Правая колонка: Интерактивная карточка соискателя из этой категории -->
        <div
          class="lg:col-span-6 rounded-2xl bg-gradient-to-br from-fsp-dark to-gray-900 text-white border border-gray-700/60 p-6 sm:p-8 flex flex-col justify-between shadow-xl"
        >
          <div class="space-y-5">
            <div class="flex items-center justify-between border-b border-gray-800 pb-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 rounded-xl bg-gradient-to-br from-fsp-blue to-purple-600 flex items-center justify-center font-bold text-lg font-mono"
                >
                  {{ activePreview.grade[0] }}
                </div>
                <div>
                  <div class="font-bold text-base">{{ activePreview.mockCandidate.name }}</div>
                  <div class="text-xs text-gray-400 font-sans">
                    {{ activePreview.mockCandidate.experience }}
                  </div>
                </div>
              </div>
              <div class="text-right font-mono">
                <div class="text-xs text-gray-400">Match Score</div>
                <div class="text-lg font-bold text-green-400">
                  {{ activePreview.mockCandidate.matchScore }}%
                </div>
              </div>
            </div>

            <div class="space-y-3 font-sans text-xs">
              <div
                class="flex items-center gap-2 text-fsp-red font-semibold bg-fsp-red/10 p-2.5 rounded-lg border border-fsp-red/20"
              >
                <i class="pi pi-trophy"></i>
                <span>{{ activePreview.mockCandidate.fspRank }}</span>
              </div>
              <div class="text-gray-300 leading-relaxed">
                Специалист успешно завершил сертификационный тест платформы и подтвердил категорию
                <strong>{{ activePreview.title }}</strong
                >.
              </div>
            </div>

            <div
              class="p-3 rounded-lg bg-gray-800/60 border border-gray-700/50 flex items-center justify-between text-xs font-mono"
            >
              <span class="text-gray-400">Статус кандидата:</span>
              <span class="text-blue-300 font-semibold">{{
                activePreview.mockCandidate.status
              }}</span>
            </div>
          </div>

          <div class="pt-6 mt-6 border-t border-gray-800 flex items-center justify-between">
            <span class="text-xs text-gray-400 flex items-center gap-1 font-sans">
              <i class="pi pi-lock text-fsp-blue"></i>
              Контакты защищены
            </span>
            <BaseButton icon="pi pi-send" size="sm" variant="glow">
              Направить предложение
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
