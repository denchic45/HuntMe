<script lang="ts" setup>
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import type { CategoryPreview } from '@/types/landing'

interface Props {
  category: CategoryPreview
}

defineProps<Props>()

const router = useRouter()

function sendOffer() {
  router.push('/register')
}
</script>

<template>
  <div class="flex flex-col justify-between h-full p-6 sm:p-8 lg:p-10 space-y-8">
    <!-- Верхняя часть: Кандидат и Match Score -->
    <div class="space-y-6">
      <div
        class="flex items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-fsp-dark-border/60"
      >
        <div class="flex items-center gap-3.5">
          <div
            class="w-12 h-12 rounded-xl bg-gradient-to-br from-fsp-blue to-purple-600 flex items-center justify-center font-bold text-lg font-mono text-white shrink-0 shadow-sm"
          >
            {{ category.grade[0] }}
          </div>
          <div>
            <div class="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">
              {{ category.mockCandidate.name }}
            </div>
            <div class="text-sm sm:text-base text-gray-500 dark:text-gray-400">
              {{ category.mockCandidate.experience }}
            </div>
          </div>
        </div>

        <div class="text-right font-mono shrink-0">
          <div class="text-xs sm:text-sm text-gray-400 uppercase tracking-wider">Match Score</div>
          <div class="text-2xl sm:text-3xl font-extrabold text-emerald-500">
            {{ category.mockCandidate.matchScore }}%
          </div>
        </div>
      </div>

      <!-- Спортивное достижение ФСП без вложенных серых/красных рамок -->
      <div class="space-y-3">
        <div
          class="flex items-center gap-2.5 text-fsp-red dark:text-red-400 text-sm sm:text-base font-semibold"
        >
          <i class="pi pi-trophy text-lg shrink-0"></i>
          <span>{{ category.mockCandidate.fspRank }}</span>
        </div>

        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
          Специалист подтвердил спортивные результаты и успешно сдал сертификационный тест платформы
          на категорию
          <strong class="text-gray-900 dark:text-white">{{ category.title }}</strong
          >.
        </p>
      </div>

      <!-- Статус соискателя -->
      <div
        class="flex items-center gap-2.5 text-sm font-mono text-gray-600 dark:text-gray-300 pt-2 border-t border-gray-100 dark:border-fsp-dark-border/60"
      >
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
        <span class="text-gray-400">Статус в системе:</span>
        <span class="font-semibold text-gray-900 dark:text-white">{{
          category.mockCandidate.status
        }}</span>
      </div>
    </div>

    <!-- Нижняя часть: Безопасность и оффер -->
    <div
      class="pt-6 border-t border-gray-200 dark:border-fsp-dark-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      <span class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 font-sans">
        <i class="pi pi-lock text-fsp-blue text-sm"></i>
        Контакты защищены до взаимного согласия
      </span>
      <BaseButton icon="pi pi-send" icon-pos="right" size="md" variant="tonal" @click="sendOffer">
        Направить предложение
      </BaseButton>
    </div>
  </div>
</template>
