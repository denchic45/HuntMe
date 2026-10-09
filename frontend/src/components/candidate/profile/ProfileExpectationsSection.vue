<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useCandidateProfile } from '@/composables/useCandidateProfile'
import BaseButton from '@/components/common/BaseButton.vue'
import type { WorkFormat } from '@/types/candidate'

const { profile, updateExpectations } = useCandidateProfile()

const desiredSalary = ref<number>(profile.value.desiredSalary)
const selectedFormats = ref<WorkFormat[]>([...profile.value.workFormat])
const relocationReady = ref(profile.value.relocationReady)
const isSaved = ref(false)

const hasChanges = computed(() => {
  const currentSalary = desiredSalary.value || 0
  const savedSalary = profile.value.desiredSalary || 0
  if (currentSalary !== savedSalary) return true

  if (relocationReady.value !== profile.value.relocationReady) return true

  const savedFormats = profile.value.workFormat || []
  if (selectedFormats.value.length !== savedFormats.length) return true
  const sameFormats = selectedFormats.value.every((f) => savedFormats.includes(f))
  if (!sameFormats) return true

  return false
})

function toggleFormat(format: WorkFormat) {
  if (selectedFormats.value.includes(format)) {
    if (selectedFormats.value.length > 1) {
      selectedFormats.value = selectedFormats.value.filter((f) => f !== format)
    }
  } else {
    selectedFormats.value.push(format)
  }
}

function handleSave() {
  if (!hasChanges.value) return

  updateExpectations(desiredSalary.value || 0, selectedFormats.value, relocationReady.value)
  isSaved.value = true
  setTimeout(() => {
    isSaved.value = false
  }, 2500)
}
</script>

<template>
  <div
    class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 shadow-xs space-y-6"
  >
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-fsp-dark-border"
    >
      <div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          Зарплатные и карьерные ожидания
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Уровень оплаты строго в рублях РФ и предпочтительный формат занятости
        </p>
      </div>

      <!-- Кнопка сохранить: светится и активна только при наличии изменений -->
      <BaseButton
        :class="[
          'transition-all duration-200',
          hasChanges
            ? 'shadow-lg shadow-fsp-blue/30 ring-2 ring-fsp-blue/40 font-semibold'
            : 'opacity-50 cursor-not-allowed',
        ]"
        :disabled="!hasChanges"
        :variant="hasChanges ? 'primary' : 'outline'"
        icon="pi pi-check"
        size="sm"
        @click="handleSave"
      >
        Сохранить
      </BaseButton>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Желаемая зарплата -->
      <div>
        <label class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-1">
          Желаемая заработная плата (в рублях РФ, на руки) *
        </label>
        <div class="relative">
          <input
            v-model.number="desiredSalary"
            class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-gray-50 dark:bg-fsp-dark text-sm focus:outline-none focus:border-fsp-blue font-mono font-bold text-gray-900 dark:text-white"
            placeholder="350000"
            step="10000"
            type="number"
          />
          <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-400">
            ₽ / мес
          </span>
        </div>
        <p class="text-[11px] text-gray-400 font-mono mt-1">
          Работодатели обязаны указывать вилку в приглашении не ниже рыночной
        </p>
      </div>

      <!-- Формат работы -->
      <div>
        <label class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-2">
          Формат работы *
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            :class="[
              'px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer',
              selectedFormats.includes('remote')
                ? 'bg-fsp-blue text-white border-fsp-blue font-bold shadow-xs'
                : 'bg-gray-50 dark:bg-fsp-dark text-gray-700 dark:text-gray-300 border-gray-200 dark:border-fsp-dark-border',
            ]"
            type="button"
            @click="toggleFormat('remote')"
          >
            <i class="pi pi-desktop mr-1.5"></i>
            Удаленная работа
          </button>

          <button
            :class="[
              'px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer',
              selectedFormats.includes('hybrid')
                ? 'bg-fsp-blue text-white border-fsp-blue font-bold shadow-xs'
                : 'bg-gray-50 dark:bg-fsp-dark text-gray-700 dark:text-gray-300 border-gray-200 dark:border-fsp-dark-border',
            ]"
            type="button"
            @click="toggleFormat('hybrid')"
          >
            <i class="pi pi-building mr-1.5"></i>
            Гибридный график
          </button>

          <button
            :class="[
              'px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer',
              selectedFormats.includes('office')
                ? 'bg-fsp-blue text-white border-fsp-blue font-bold shadow-xs'
                : 'bg-gray-50 dark:bg-fsp-dark text-gray-700 dark:text-gray-300 border-gray-200 dark:border-fsp-dark-border',
            ]"
            type="button"
            @click="toggleFormat('office')"
          >
            <i class="pi pi-map-marker mr-1.5"></i>
            Работа в офисе
          </button>
        </div>
      </div>
    </div>

    <!-- Релокация -->
    <div class="pt-2 border-t border-gray-100 dark:border-fsp-dark-border">
      <label
        class="flex items-center gap-2 text-xs font-mono text-gray-700 dark:text-gray-300 cursor-pointer select-none"
      >
        <input
          v-model="relocationReady"
          class="rounded text-fsp-blue focus:ring-fsp-blue cursor-pointer"
          type="checkbox"
        />
        <span>Готов к релокации в другие регионы РФ</span>
      </label>
    </div>

    <!-- Уведомление об успешном сохранении -->
    <div
      v-if="isSaved"
      class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2"
    >
      <i class="pi pi-check-circle"></i>
      <span>Карьерные ожидания успешно сохранены</span>
    </div>
  </div>
</template>
