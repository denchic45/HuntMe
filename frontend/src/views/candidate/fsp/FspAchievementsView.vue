<script lang="ts" setup>
import { ref } from 'vue'
import { useCandidateProfile } from '@/composables/useCandidateProfile'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'

const { profile, isVerifiedFsp, bindFspId } = useCandidateProfile()

const inputFspId = ref(profile.value.fspId || '')
const isLinking = ref(false)
const linkSuccess = ref(false)

function handleLink() {
  if (!inputFspId.value.trim()) return
  isLinking.value = true
  setTimeout(() => {
    bindFspId(inputFspId.value.trim())
    isLinking.value = false
    linkSuccess.value = true
    setTimeout(() => {
      linkSuccess.value = false
    }, 3000)
  }, 1000)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Верхний баннер статуса привязки ФСП -->
    <div
      class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
    >
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <img alt="ФСП" class="h-6 w-auto" src="/brand/logo_01.svg" />
          <span class="text-xs font-mono font-bold text-fsp-red uppercase tracking-wider">
            Федерация спортивного программирования России
          </span>
          <BaseBadge
            v-if="isVerifiedFsp"
            icon="pi pi-check"
            label="ID Привязан"
            size="sm"
            variant="danger"
          />
        </div>

        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Верифицированные достижения ФСП
        </h2>

        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-xl font-sans">
          Интеграция с официальным реестром участников ФСП подтверждает победы в чемпионатах,
          хакатонах и спортивные разряды. Кандидаты с подтвержденными наградами поднимаются в
          приоритетную выдачу.
        </p>
      </div>

      <!-- Форма связки ФСП ID -->
      <div
        class="bg-gray-50 dark:bg-fsp-dark p-4 rounded-xl border border-gray-200/60 dark:border-fsp-dark-border space-y-3 shrink-0 sm:w-80"
      >
        <div>
          <label class="block text-[11px] font-mono text-gray-400 mb-1">
            Номер участника (ФСП ID)
          </label>
          <div class="flex items-center gap-2">
            <input
              v-model="inputFspId"
              class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-fsp-dark-border bg-white dark:bg-fsp-dark-surface text-xs font-mono uppercase focus:outline-none focus:border-fsp-red"
              placeholder="FSP-2026-XXXX"
              type="text"
            />
            <BaseButton
              :disabled="isLinking"
              :icon="isLinking ? 'pi pi-spin pi-spinner' : 'pi pi-link'"
              size="sm"
              variant="outline"
              @click="handleLink"
            >
              {{ isVerifiedFsp ? 'Обновить' : 'Привязать' }}
            </BaseButton>
          </div>
        </div>

        <p v-if="linkSuccess" class="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
          ✓ ФСП ID успешно валидирован и привязан!
        </p>
      </div>
    </div>

    <!-- Список достижений и разрядов -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-bold text-gray-900 dark:text-white">Реестр спортивных наград</h3>
        <span class="text-xs font-mono text-gray-400">
          Найдено {{ profile.fspAchievements.length }} записи
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="ach in profile.fspAchievements"
          :key="ach.id"
          class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 shadow-xs space-y-4 hover:border-fsp-red/50 transition-colors flex flex-col justify-between"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono text-gray-400">{{ ach.eventType }}</span>
              <span
                v-if="ach.sportsCategory"
                class="px-2 py-0.5 rounded-full bg-fsp-red/10 text-fsp-red text-[11px] font-mono font-bold"
              >
                {{ ach.sportsCategory }}
              </span>
            </div>

            <h4 class="text-base font-bold text-gray-900 dark:text-white leading-snug">
              {{ ach.title }}
            </h4>
          </div>

          <div class="pt-4 border-t border-gray-100 dark:border-fsp-dark-border space-y-2">
            <div class="flex items-center justify-between text-xs font-mono">
              <span class="text-gray-400">Результат:</span>
              <span class="font-bold text-fsp-red">{{ ach.rank }}</span>
            </div>
            <div class="flex items-center justify-between text-xs font-mono">
              <span class="text-gray-400">Дата:</span>
              <span class="text-gray-700 dark:text-gray-300">{{ ach.date }}</span>
            </div>
            <div v-if="ach.score" class="flex items-center justify-between text-xs font-mono">
              <span class="text-gray-400">Рейтинговый балл:</span>
              <span class="font-bold text-fsp-blue">+{{ ach.score }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
