<script lang="ts" setup>
import { ref } from 'vue'
import { useCandidateProfile } from '@/composables/useCandidateProfile'
import BaseButton from '@/components/common/BaseButton.vue'
import type { LanguageLevel } from '@/types/candidate'

const { profile, addLanguage, removeLanguage } = useCandidateProfile()

const isAdding = ref(false)
const languageName = ref('')
const selectedLevel = ref<LanguageLevel>('B2')

const levelOptions: Array<{ level: LanguageLevel; label: string }> = [
  { level: 'A1', label: 'A1 — Начальный (Beginner)' },
  { level: 'A2', label: 'A2 — Элементарный (Elementary)' },
  { level: 'B1', label: 'B1 — Средний (Intermediate)' },
  { level: 'B2', label: 'B2 — Выше среднего (Upper-Intermediate)' },
  { level: 'C1', label: 'C1 — Продвинутый (Advanced)' },
  { level: 'C2', label: 'C2 — В совершенстве (Proficiency)' },
  { level: 'native', label: 'Native — Родной язык' },
  { level: 'technical', label: 'Technical — Чтение тех. документации' },
]

function handleAdd() {
  if (!languageName.value.trim()) return

  addLanguage({
    language: languageName.value.trim(),
    level: selectedLevel.value,
  })

  languageName.value = ''
  selectedLevel.value = 'B2'
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
          Владение иностранными языками
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Укажите языки для работы в международных командах и чтения документации
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

    <!-- Чипы языков -->
    <div v-if="profile.languages.length > 0" class="flex flex-wrap gap-3">
      <div
        v-for="item in profile.languages"
        :key="item.id"
        class="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-fsp-dark border border-gray-200/80 dark:border-fsp-dark-border text-sm"
      >
        <span class="font-bold text-gray-900 dark:text-white">{{ item.language }}</span>
        <span
          class="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-fsp-blue/10 text-fsp-blue"
        >
          {{ item.level }}
        </span>
        <button
          aria-label="Удалить язык"
          class="text-gray-400 hover:text-red-500 cursor-pointer ml-1"
          type="button"
          @click="removeLanguage(item.id)"
        >
          <i class="pi pi-times text-xs"></i>
        </button>
      </div>
    </div>
    <div v-else class="text-center py-4 text-xs text-gray-400 font-mono">
      Языки пока не добавлены
    </div>

    <!-- Форма добавления языка -->
    <div
      v-if="isAdding"
      class="p-4 rounded-xl border border-fsp-blue/30 bg-fsp-blue/5 dark:bg-fsp-blue/10 space-y-3"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-1">
            Язык *
          </label>
          <input
            v-model="languageName"
            class="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-white dark:bg-fsp-dark text-xs focus:outline-none"
            placeholder="Английский, Китайский, Немецкий..."
            type="text"
          />
        </div>

        <div>
          <label class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-1">
            Уровень владения *
          </label>
          <select
            v-model="selectedLevel"
            class="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-white dark:bg-fsp-dark text-xs focus:outline-none"
          >
            <option v-for="opt in levelOptions" :key="opt.level" :value="opt.level">
              {{ opt.label }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 pt-1">
        <BaseButton size="sm" variant="ghost" @click="isAdding = false"> Отмена </BaseButton>
        <BaseButton :disabled="!languageName.trim()" size="sm" variant="primary" @click="handleAdd">
          Добавить
        </BaseButton>
      </div>
    </div>
  </div>
</template>
