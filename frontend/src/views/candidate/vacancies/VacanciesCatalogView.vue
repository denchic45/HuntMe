<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()

interface Vacancy {
  id: string
  company: string
  role: string
  salaryFrom: number
  salaryTo: number
  city: string
  workFormat: string
  stack: string[]
  description: string
  applied?: boolean
}

const vacancies = ref<Vacancy[]>([
  {
    id: 'vac_1',
    company: 'Яндекс Инфраструктура',
    role: 'Senior Go Engineer (Yandex Cloud)',
    salaryFrom: 380000,
    salaryTo: 480000,
    city: 'Москва / Удаленно',
    workFormat: 'Гибрид или Удаленка',
    stack: ['Go', 'Kubernetes', 'Linux', 'Distributed Systems'],
    description:
      'Разработка распределенной платформы виртуализации и блочного хранилища данных с гарантией доступности 99.999%.',
  },
  {
    id: 'vac_2',
    company: 'Ozon FinTech',
    role: 'HighLoad Backend Developer (Go / Postgres)',
    salaryFrom: 340000,
    salaryTo: 420000,
    city: 'Москва',
    workFormat: 'Удаленка',
    stack: ['Go', 'PostgreSQL', 'Kafka', 'Redis'],
    description:
      'Проектирование сервиса обработки транзакций Ozon Card с пиковой нагрузкой свыше 120 000 RPS в распродажи.',
  },
  {
    id: 'vac_3',
    company: 'СберТех',
    role: 'Platform Core Architect',
    salaryFrom: 420000,
    salaryTo: 550000,
    city: 'Москва / Санкт-Петербург',
    workFormat: 'Офис / Гибрид',
    stack: ['Go', 'Java', 'ClickHouse', 'Kafka', 'eBPF'],
    description:
      'Архитектурное сопровождение платформенных middleware-компонентов и мониторинга ядра банковских транзакций.',
  },
])

const appliedIds = ref<string[]>([])

const formatSalary = (val: number) => {
  return new Intl.NumberFormat('ru-RU').format(val)
}

function handleApply(id: string) {
  if (!appliedIds.value.includes(id)) {
    appliedIds.value.push(id)
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Шапка раздела вакансий с табами на Мои отклики -->
    <div
      class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div class="space-y-1">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Каталог открытых вакансий</h2>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Вакансии от проверенных технологических работодателей с обязательной вилкой зарплаты в
          рублях
        </p>
      </div>

      <div class="flex items-center gap-3">
        <BaseButton
          icon="pi pi-list"
          size="sm"
          variant="outline"
          @click="router.push('/candidate/vacancies/applications')"
        >
          Мои отклики ({{ appliedIds.length }})
        </BaseButton>
      </div>
    </div>

    <!-- Список вакансий -->
    <div class="space-y-4">
      <div
        v-for="vac in vacancies"
        :key="vac.id"
        class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 shadow-xs space-y-4 hover:border-fsp-blue/40 transition-colors"
      >
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono font-bold text-fsp-blue">{{ vac.company }}</span>
              <span>•</span>
              <span class="text-xs font-mono text-gray-400">{{ vac.city }}</span>
              <span>•</span>
              <span class="text-xs font-mono text-gray-400">{{ vac.workFormat }}</span>
            </div>

            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ vac.role }}
            </h3>
          </div>

          <div class="sm:text-right shrink-0">
            <div class="text-xs font-mono text-gray-400">Вилка заработной платы</div>
            <div class="text-xl font-bold font-mono text-fsp-blue">
              {{ formatSalary(vac.salaryFrom) }} — {{ formatSalary(vac.salaryTo) }} ₽
            </div>
            <div class="text-[11px] font-mono text-gray-400">нетто / на руки</div>
          </div>
        </div>

        <p class="text-xs text-gray-600 dark:text-gray-300 font-sans leading-relaxed">
          {{ vac.description }}
        </p>

        <div
          class="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-fsp-dark-border"
        >
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="t in vac.stack"
              :key="t"
              class="px-2.5 py-1 rounded-lg text-xs font-mono bg-gray-100 dark:bg-fsp-dark text-gray-700 dark:text-gray-300"
            >
              {{ t }}
            </span>
          </div>

          <div>
            <BaseButton
              v-if="!appliedIds.includes(vac.id)"
              icon="pi pi-send"
              size="sm"
              variant="primary"
              @click="handleApply(vac.id)"
            >
              Откликнуться
            </BaseButton>
            <span
              v-else
              class="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5"
            >
              <i class="pi pi-check"></i> Отклик отправлен
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
