<script lang="ts" setup>
import BaseBadge from '@/components/common/BaseBadge.vue'
import type { RoadmapStep } from '@/types/landing'

interface Props {
  step: RoadmapStep
  isLeft?: boolean
  isLast?: boolean
}

withDefaults(defineProps<Props>(), {
  isLeft: false,
  isLast: false,
})
</script>

<template>
  <div class="relative flex items-start group">
    <!-- Десктопная сетка: колонка контента + центральный узел таймлайна + противоположная колонка -->
    <div class="hidden md:grid md:grid-cols-12 w-full items-center gap-8">
      <!-- Левая сторона (если isLeft = true) -->
      <div :class="{ 'opacity-0 pointer-events-none': !isLeft }" class="col-span-5 text-right">
        <div
          v-if="isLeft"
          class="p-7 rounded-2xl bg-white dark:bg-fsp-dark border border-gray-200 dark:border-fsp-dark-border shadow-sm group-hover:shadow-xl group-hover:border-fsp-blue/50 transition-all duration-300 text-left space-y-3.5"
        >
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs sm:text-sm font-mono font-bold text-fsp-blue tracking-wider">{{
              step.subtitle
            }}</span>
            <BaseBadge
              :icon="step.icon"
              :label="step.badgeText"
              :variant="step.badgeVariant || 'primary'"
              size="sm"
            />
          </div>
          <h3
            class="text-xl font-bold font-sans text-gray-900 dark:text-white group-hover:text-fsp-blue transition-colors"
          >
            {{ step.title }}
          </h3>
          <p
            class="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-sans"
          >
            {{ step.description }}
          </p>
          <div
            v-if="step.tags && step.tags.length"
            class="flex flex-wrap gap-2 pt-3 border-t border-gray-100 dark:border-fsp-dark-border"
          >
            <span
              v-for="tag in step.tags"
              :key="tag"
              class="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-fsp-dark-surface text-xs font-mono font-medium text-gray-800 dark:text-gray-200 border border-gray-200/60 dark:border-fsp-dark-border/60"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

      <!-- Центральный узел таймлайна -->
      <div class="col-span-2 flex flex-col items-center justify-center relative">
        <div
          class="w-12 h-12 rounded-full bg-white dark:bg-fsp-dark border-2 border-gray-300 dark:border-fsp-dark-border group-hover:border-fsp-blue group-hover:bg-fsp-blue group-hover:text-white flex items-center justify-center font-mono font-bold text-sm text-gray-700 dark:text-gray-300 shadow-md group-hover:shadow-[0_0_20px_rgba(64,47,255,0.6)] transition-all duration-300 z-10 select-none"
        >
          {{ step.number }}
        </div>
      </div>

      <!-- Правая сторона (если isLeft = false) -->
      <div :class="{ 'opacity-0 pointer-events-none': isLeft }" class="col-span-5 text-left">
        <div
          v-if="!isLeft"
          class="p-7 rounded-2xl bg-white dark:bg-fsp-dark border border-gray-200 dark:border-fsp-dark-border shadow-sm group-hover:shadow-xl group-hover:border-fsp-blue/50 transition-all duration-300 text-left space-y-3.5"
        >
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs sm:text-sm font-mono font-bold text-fsp-blue tracking-wider">{{
              step.subtitle
            }}</span>
            <BaseBadge
              :icon="step.icon"
              :label="step.badgeText"
              :variant="step.badgeVariant || 'primary'"
              size="sm"
            />
          </div>
          <h3
            class="text-xl font-bold font-sans text-gray-900 dark:text-white group-hover:text-fsp-blue transition-colors"
          >
            {{ step.title }}
          </h3>
          <p
            class="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-sans"
          >
            {{ step.description }}
          </p>
          <div
            v-if="step.tags && step.tags.length"
            class="flex flex-wrap gap-2 pt-3 border-t border-gray-100 dark:border-fsp-dark-border"
          >
            <span
              v-for="tag in step.tags"
              :key="tag"
              class="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-fsp-dark-surface text-xs font-mono font-medium text-gray-800 dark:text-gray-200 border border-gray-200/60 dark:border-fsp-dark-border/60"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Мобильная версия (линия слева, карточка справа) -->
    <div class="md:hidden flex items-start gap-4 w-full">
      <div class="flex flex-col items-center">
        <div
          class="w-9 h-9 rounded-full bg-white dark:bg-fsp-dark border-2 border-fsp-blue text-fsp-blue flex items-center justify-center font-mono font-bold text-xs shadow-md z-10"
        >
          {{ step.number }}
        </div>
      </div>
      <div
        class="flex-1 p-5 rounded-2xl bg-white dark:bg-fsp-dark border border-gray-200 dark:border-fsp-dark-border shadow-sm space-y-3 mb-6"
      >
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs font-mono font-bold text-fsp-blue">{{ step.subtitle }}</span>
          <BaseBadge
            :icon="step.icon"
            :label="step.badgeText"
            :variant="step.badgeVariant || 'primary'"
            size="sm"
          />
        </div>
        <h3 class="text-lg font-bold font-sans text-gray-900 dark:text-white">
          {{ step.title }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
          {{ step.description }}
        </p>
        <div
          v-if="step.tags && step.tags.length"
          class="flex flex-wrap gap-1.5 pt-2.5 border-t border-gray-100 dark:border-fsp-dark-border"
        >
          <span
            v-for="tag in step.tags"
            :key="tag"
            class="px-2 py-1 rounded-md bg-gray-100 dark:bg-fsp-dark-surface text-xs font-mono font-medium text-gray-800 dark:text-gray-200 border border-gray-200/60 dark:border-fsp-dark-border/60"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
