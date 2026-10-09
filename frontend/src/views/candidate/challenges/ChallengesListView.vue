<script lang="ts" setup>
import { ref } from 'vue'
import { mockMicroChallenges } from '@/api/mocks/candidateProfile'
import { useCandidateProfile } from '@/composables/useCandidateProfile'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import type { MicroChallenge } from '@/types/candidate'

const { profile } = useCandidateProfile()

const challenges = ref<MicroChallenge[]>(JSON.parse(JSON.stringify(mockMicroChallenges)))
const activeSolvingId = ref<string | null>(null)
const solvedIds = ref<string[]>(challenges.value.filter((c) => c.isCompleted).map((c) => c.id))

function handleSolve(id: string) {
  activeSolvingId.value = id
}

function handleComplete(id: string) {
  if (!solvedIds.value.includes(id)) {
    solvedIds.value.push(id)
    profile.value.completedTasksCount++
    profile.value.activityScore += 20
  }
  activeSolvingId.value = null
}
</script>

<template>
  <div class="space-y-6">
    <!-- Верхний баннер: Сигнал свежести активности профиля -->
    <div
      class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
    >
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <span class="text-xs font-mono uppercase text-amber-500 font-bold tracking-wider">
            Freshness Signal • Активность
          </span>
          <BaseBadge label="Поднимает в выдаче" size="sm" variant="neutral" />
        </div>

        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Практические микро-задания
        </h2>

        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-xl font-sans">
          Решение 15-минутных инженерных кейсов от компаний-партнеров подтверждает, что вы в
          активной форме и находитесь в реальном поиске предложений.
        </p>
      </div>

      <div
        class="flex items-center gap-4 bg-gray-50 dark:bg-fsp-dark p-4 rounded-xl border border-gray-200/60 dark:border-fsp-dark-border shrink-0"
      >
        <div>
          <div class="text-[11px] font-mono text-gray-400">Решено задач</div>
          <div class="text-xl font-bold font-mono text-fsp-blue">
            {{ profile.completedTasksCount }}
          </div>
        </div>
        <div class="h-8 w-px bg-gray-200 dark:border-fsp-dark-border"></div>
        <div>
          <div class="text-[11px] font-mono text-gray-400">Очки активности</div>
          <div class="text-xl font-bold font-mono text-amber-500">
            {{ profile.activityScore }}
          </div>
        </div>
      </div>
    </div>

    <!-- Список заданий -->
    <div class="space-y-4">
      <div
        v-for="ch in challenges"
        :key="ch.id"
        class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 shadow-xs space-y-4"
      >
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono text-gray-400">{{ ch.specialization }}</span>
              <span>•</span>
              <span class="text-xs font-mono text-gray-400">{{ ch.timeMinutes }} минут</span>
              <span>•</span>
              <span
                :class="[
                  'px-2 py-0.5 rounded text-[11px] font-mono font-bold',
                  ch.difficulty === 'easy'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : ch.difficulty === 'medium'
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'bg-fsp-red/10 text-fsp-red',
                ]"
              >
                {{ ch.difficulty }}
              </span>
            </div>

            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ ch.title }}
            </h3>
          </div>

          <div class="text-right shrink-0">
            <span class="text-xs font-mono font-bold text-amber-500">
              +{{ ch.rewardScore }} баллов активности
            </span>
          </div>
        </div>

        <p class="text-xs text-gray-600 dark:text-gray-300 font-sans leading-relaxed">
          {{ ch.description }}
        </p>

        <!-- Кодовый блок -->
        <div
          v-if="ch.codeSnippet"
          class="p-3 rounded-xl bg-gray-900 font-mono text-xs text-emerald-400 overflow-x-auto"
        >
          <pre><code>{{ ch.codeSnippet }}</code></pre>
        </div>

        <!-- Режим решения -->
        <div
          v-if="activeSolvingId === ch.id"
          class="p-4 rounded-xl bg-gray-50 dark:bg-fsp-dark border border-gray-200/60 dark:border-fsp-dark-border space-y-3"
        >
          <label class="block text-xs font-mono text-gray-400"> Ваше решение или пояснение: </label>
          <textarea
            class="w-full h-24 p-3 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-white dark:bg-fsp-dark-surface text-xs font-mono focus:outline-none focus:border-fsp-blue"
            placeholder="Введите решение задачи..."
          ></textarea>
          <div class="flex items-center gap-2">
            <BaseButton
              icon="pi pi-check"
              size="sm"
              variant="primary"
              @click="handleComplete(ch.id)"
            >
              Отправить на авто-проверку
            </BaseButton>
            <BaseButton size="sm" variant="ghost" @click="activeSolvingId = null">
              Отмена
            </BaseButton>
          </div>
        </div>

        <!-- Кнопка начать / решено -->
        <div
          v-else
          class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-fsp-dark-border"
        >
          <span
            v-if="solvedIds.includes(ch.id)"
            class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5"
          >
            <i class="pi pi-check-circle"></i> Задание решено
          </span>
          <span v-else class="text-xs font-mono text-gray-400"> Не решено </span>

          <BaseButton
            v-if="!solvedIds.includes(ch.id)"
            icon="pi pi-code"
            size="sm"
            variant="outline"
            @click="handleSolve(ch.id)"
          >
            Решить кейс
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
