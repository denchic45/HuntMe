<script lang="ts" setup>
import { ref } from 'vue'
import { useCandidateProfile } from '@/composables/useCandidateProfile'

const { profile, updateSkills, updateSoftSkills } = useCandidateProfile()

const newHardSkill = ref('')
const newSoftSkill = ref('')

function addHardSkill() {
  const val = newHardSkill.value.trim()
  if (val && !profile.value.skills.includes(val)) {
    updateSkills([...profile.value.skills, val])
    newHardSkill.value = ''
  }
}

function removeHardSkill(skill: string) {
  updateSkills(profile.value.skills.filter((s) => s !== skill))
}

function addSoftSkill() {
  const val = newSoftSkill.value.trim()
  if (val && !profile.value.softSkills.includes(val)) {
    updateSoftSkills([...profile.value.softSkills, val])
    newSoftSkill.value = ''
  }
}

function removeSoftSkill(skill: string) {
  updateSoftSkills(profile.value.softSkills.filter((s) => s !== skill))
}
</script>

<template>
  <div
    class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 shadow-xs space-y-6"
  >
    <div class="pb-4 border-b border-gray-100 dark:border-fsp-dark-border">
      <h3 class="text-lg font-bold text-gray-900 dark:text-white">
        Компетенции и навыки (Hard & Soft Skills)
      </h3>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        Укажите стек для точного алгоритмического подбора и Explainable AI Match
      </p>
    </div>

    <!-- Hard Skills -->
    <div class="space-y-3">
      <label
        class="block text-xs font-mono font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
      >
        Hard Skills (Технологический стек)
      </label>

      <div class="flex gap-2">
        <input
          v-model="newHardSkill"
          class="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-gray-50 dark:bg-fsp-dark text-xs focus:outline-none font-mono"
          placeholder="Добавить навык (например: Go, PostgreSQL, Kafka, Rust)..."
          type="text"
          @keyup.enter="addHardSkill"
        />
        <button
          class="px-4 py-2 rounded-xl bg-fsp-blue text-white text-xs font-mono font-medium hover:bg-fsp-blue-hover cursor-pointer"
          type="button"
          @click="addHardSkill"
        >
          Добавить
        </button>
      </div>

      <div class="flex flex-wrap gap-2 pt-1">
        <span
          v-for="skill in profile.skills"
          :key="skill"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-fsp-blue/10 dark:bg-fsp-blue/20 text-fsp-blue dark:text-blue-300 text-xs font-mono font-semibold"
        >
          {{ skill }}
          <button
            aria-label="Удалить навык"
            class="hover:text-red-500 cursor-pointer"
            type="button"
            @click="removeHardSkill(skill)"
          >
            <i class="pi pi-times text-[10px]"></i>
          </button>
        </span>
      </div>
    </div>

    <!-- Soft Skills -->
    <div class="space-y-3 pt-4 border-t border-gray-100 dark:border-fsp-dark-border">
      <label
        class="block text-xs font-mono font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
      >
        Soft Skills (Гибкие навыки)
      </label>

      <div class="flex gap-2">
        <input
          v-model="newSoftSkill"
          class="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-gray-50 dark:bg-fsp-dark text-xs focus:outline-none"
          placeholder="Добавить гибкий навык (Code Review, Менторинг, Agile)..."
          type="text"
          @keyup.enter="addSoftSkill"
        />
        <button
          class="px-4 py-2 rounded-xl bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900 text-xs font-medium hover:opacity-90 cursor-pointer"
          type="button"
          @click="addSoftSkill"
        >
          Добавить
        </button>
      </div>

      <div class="flex flex-wrap gap-2 pt-1">
        <span
          v-for="skill in profile.softSkills"
          :key="skill"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 dark:bg-fsp-dark text-gray-700 dark:text-gray-300 text-xs font-medium border border-gray-200 dark:border-fsp-dark-border"
        >
          {{ skill }}
          <button
            aria-label="Удалить навык"
            class="hover:text-red-500 cursor-pointer"
            type="button"
            @click="removeSoftSkill(skill)"
          >
            <i class="pi pi-times text-[10px]"></i>
          </button>
        </span>
      </div>
    </div>
  </div>
</template>
