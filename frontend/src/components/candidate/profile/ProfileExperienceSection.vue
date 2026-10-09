<script lang="ts" setup>
import { ref } from 'vue'
import { useCandidateProfile } from '@/composables/useCandidateProfile'
import BaseButton from '@/components/common/BaseButton.vue'

const { profile, addWorkHistory, removeWorkHistory } = useCandidateProfile()

const isAdding = ref(false)
const company = ref('')
const role = ref('')
const startDate = ref('')
const endDate = ref('')
const isCurrent = ref(false)
const description = ref('')
const techInput = ref('')

function handleAdd() {
  if (!company.value.trim() || !role.value.trim()) return

  const technologies = techInput.value
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  addWorkHistory({
    company: company.value.trim(),
    role: role.value.trim(),
    startDate: startDate.value,
    endDate: isCurrent.value ? undefined : endDate.value,
    isCurrent: isCurrent.value,
    description: description.value.trim(),
    technologies,
  })

  // Сброс
  company.value = ''
  role.value = ''
  startDate.value = ''
  endDate.value = ''
  isCurrent.value = false
  description.value = ''
  techInput.value = ''
  isAdding.value = false
}
</script>

<template>
  <div
    class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 shadow-xs space-y-6"
  >
    <div
      class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-fsp-dark-border"
    >
      <div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          Опыт работы и коммерческие проекты
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Укажите компании, роли, период и конкретные результаты в метриках (RPS, архитектура)
        </p>
      </div>

      <BaseButton
        v-if="!isAdding"
        icon="pi pi-plus"
        size="sm"
        variant="outline"
        @click="isAdding = true"
      >
        Добавить
      </BaseButton>
    </div>

    <!-- Список мест работы -->
    <div v-if="profile.workHistory.length > 0" class="space-y-4">
      <div
        v-for="item in profile.workHistory"
        :key="item.id"
        class="p-4 rounded-xl bg-gray-50 dark:bg-fsp-dark border border-gray-200/60 dark:border-fsp-dark-border space-y-2 relative"
      >
        <div class="flex items-start justify-between">
          <div>
            <span class="text-xs font-mono font-bold text-fsp-blue">
              {{ item.startDate }} — {{ item.isCurrent ? 'По настоящее время' : item.endDate }}
            </span>
            <h4 class="font-bold text-base text-gray-900 dark:text-white mt-0.5">
              {{ item.role }} <span class="text-gray-400 font-normal">в {{ item.company }}</span>
            </h4>
          </div>

          <button
            aria-label="Удалить"
            class="text-gray-400 hover:text-red-500 p-1.5 rounded-lg cursor-pointer"
            type="button"
            @click="removeWorkHistory(item.id)"
          >
            <i class="pi pi-trash text-sm"></i>
          </button>
        </div>

        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
          {{ item.description }}
        </p>

        <!-- Стек технологий на месте работы -->
        <div v-if="item.technologies.length > 0" class="flex flex-wrap gap-1.5 pt-1">
          <span
            v-for="tech in item.technologies"
            :key="tech"
            class="px-2 py-0.5 rounded-md bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border text-xs font-mono text-gray-700 dark:text-gray-300"
          >
            {{ tech }}
          </span>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-6 text-xs text-gray-400 font-mono">
      Места работы пока не указаны
    </div>

    <!-- Форма добавления опыта -->
    <div
      v-if="isAdding"
      class="p-5 rounded-xl border border-fsp-blue/30 bg-fsp-blue/5 dark:bg-fsp-blue/10 space-y-4"
    >
      <h4 class="text-sm font-bold text-gray-900 dark:text-white">Новое место работы</h4>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-1">
            Компания *
          </label>
          <input
            v-model="company"
            class="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-white dark:bg-fsp-dark text-xs focus:outline-none"
            placeholder="Яндекс, Сбер, Ozon..."
            type="text"
          />
        </div>

        <div>
          <label class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-1">
            Должность / Роль *
          </label>
          <input
            v-model="role"
            class="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-white dark:bg-fsp-dark text-xs focus:outline-none"
            placeholder="Senior Go Developer, Tech Lead..."
            type="text"
          />
        </div>

        <div>
          <label class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-1">
            Дата начала *
          </label>
          <input
            v-model="startDate"
            class="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-white dark:bg-fsp-dark text-xs focus:outline-none font-mono"
            placeholder="2023-09"
            type="text"
          />
        </div>

        <div>
          <label class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-1">
            Дата окончания
          </label>
          <input
            v-model="endDate"
            :disabled="isCurrent"
            class="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-white dark:bg-fsp-dark text-xs focus:outline-none font-mono disabled:opacity-50"
            placeholder="2025-01"
            type="text"
          />
          <label class="flex items-center gap-2 mt-1 text-xs cursor-pointer select-none">
            <input v-model="isCurrent" type="checkbox" />
            <span>Работаю по настоящее время</span>
          </label>
        </div>
      </div>

      <div>
        <label class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-1">
          Описание задач и достижения
        </label>
        <textarea
          v-model="description"
          class="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-white dark:bg-fsp-dark text-xs focus:outline-none"
          placeholder="Оптимизировал p99 latency, руководил командой из 5 инженеров..."
          rows="3"
        ></textarea>
      </div>

      <div>
        <label class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-1">
          Стек технологий (через запятую)
        </label>
        <input
          v-model="techInput"
          class="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-white dark:bg-fsp-dark text-xs focus:outline-none font-mono"
          placeholder="Go, PostgreSQL, Kafka, Redis, Docker"
          type="text"
        />
      </div>

      <div class="flex items-center justify-end gap-2 pt-1">
        <BaseButton size="sm" variant="ghost" @click="isAdding = false"> Отмена </BaseButton>
        <BaseButton
          :disabled="!company.trim() || !role.trim()"
          size="sm"
          variant="primary"
          @click="handleAdd"
        >
          Сохранить
        </BaseButton>
      </div>
    </div>
  </div>
</template>
