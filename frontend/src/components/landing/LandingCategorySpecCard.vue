<script lang="ts" setup>
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import type { CategoryPreview } from '@/types/landing'

interface Props {
  category: CategoryPreview
}

defineProps<Props>()

const router = useRouter()

function startTest() {
  router.push('/register')
}
</script>

<template>
  <div class="flex flex-col justify-between h-full p-6 sm:p-8 lg:p-10 space-y-8">
    <!-- Верхняя часть: Название категории, бейдж и вилка зарплат -->
    <div class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <span
            class="text-sm font-mono font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            Стандарт категории
          </span>
          <BaseBadge :label="category.grade" size="sm" variant="primary" />
        </div>
        <BaseBadge
          :label="`${category.verifiedCandidatesCount} подтвержденных`"
          size="sm"
          variant="glow"
        />
      </div>

      <div>
        <h3
          class="text-2xl sm:text-3xl font-extrabold font-sans text-gray-900 dark:text-white tracking-tight"
        >
          {{ category.title }}
        </h3>
        <div class="text-lg sm:text-xl font-bold font-mono text-fsp-blue dark:text-blue-400 mt-2">
          Рыночная вилка: {{ category.avgSalary }}
        </div>
      </div>

      <!-- Ключевой стек технологий -->
      <div class="space-y-3">
        <div class="text-sm font-mono font-medium text-gray-600 dark:text-gray-300">
          Подтверждаемый стек компетенций:
        </div>
        <div class="flex flex-wrap gap-2.5">
          <span
            v-for="skill in category.skills"
            :key="skill"
            class="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-fsp-dark text-sm font-mono font-medium text-gray-800 dark:text-gray-200 border border-gray-200/70 dark:border-fsp-dark-border"
          >
            {{ skill }}
          </span>
        </div>
      </div>

      <!-- Проверочное задание без вложенных серых рамок -->
      <div class="space-y-2 pt-2 border-t border-gray-100 dark:border-fsp-dark-border/60">
        <div class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <i class="pi pi-check-circle text-fsp-blue text-base"></i>
          <span>Пример проверочного задания на грейд:</span>
        </div>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-sans leading-relaxed">
          {{ category.sampleTask }}
        </p>
      </div>
    </div>

    <!-- Нижняя часть: Действие -->
    <div
      class="pt-6 border-t border-gray-200 dark:border-fsp-dark-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      <span class="text-sm text-gray-500 dark:text-gray-400 font-sans">
        Грейд подтверждается автоматическим тестом
      </span>
      <BaseButton
        icon="pi pi-arrow-right"
        icon-pos="right"
        size="md"
        variant="tonal"
        @click="startTest"
      >
        Пройти тест категории
      </BaseButton>
    </div>
  </div>
</template>
