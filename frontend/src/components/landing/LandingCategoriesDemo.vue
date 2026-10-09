<script lang="ts" setup>
import { useCategoryBank } from '@/composables/useCategoryBank'
import BaseBadge from '@/components/common/BaseBadge.vue'
import LandingCategorySpecCard from '@/components/landing/LandingCategorySpecCard.vue'
import LandingCategoryCandidateCard from '@/components/landing/LandingCategoryCandidateCard.vue'

const { specializations, grades, selectedSpec, selectedGrade, activePreview } = useCategoryBank()
</script>

<template>
  <section
    class="py-20 bg-gray-50/70 dark:bg-fsp-dark-surface/30 border-t border-gray-200 dark:border-fsp-dark-border transition-colors"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Заголовок раздела -->
      <div class="max-w-3xl mb-8 space-y-3">
        <BaseBadge icon="pi pi-search" label="Интерактивная витрина" size="md" variant="primary" />
        <h2
          class="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-sans text-gray-900 dark:text-white tracking-tight"
        >
          Банк верифицированных категорий
        </h2>
        <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-sans">
          Исследуйте распределение квалификаций, навыки и уровень зарплат по направлениям
        </p>
      </div>

      <!-- Табы выбора направления и грейда -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <!-- Специализации: Табы-пилюли -->
        <div class="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <button
            v-for="spec in specializations"
            :key="spec"
            :class="[
              selectedSpec === spec
                ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-fsp-dark shadow-sm'
                : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-200/60 dark:bg-fsp-dark hover:bg-gray-200 dark:hover:bg-fsp-dark-card',
            ]"
            class="px-4 sm:px-5 py-2 rounded-full text-sm sm:text-base font-sans font-medium border transition-all cursor-pointer select-none"
            type="button"
            @click="selectedSpec = spec"
          >
            {{ spec }}
          </button>
        </div>

        <!-- Грейды: Переключатель -->
        <div
          class="flex items-center gap-1 p-1 bg-gray-200/80 dark:bg-fsp-dark rounded-full font-mono text-sm border border-gray-200 dark:border-fsp-dark-border self-start md:self-auto"
        >
          <button
            v-for="grade in grades"
            :key="grade"
            :class="[
              selectedGrade === grade
                ? 'bg-white dark:bg-fsp-dark-surface text-fsp-blue font-bold shadow-xs'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white',
            ]"
            class="px-3.5 py-1.5 rounded-full transition-all cursor-pointer font-bold"
            type="button"
            @click="selectedGrade = grade"
          >
            {{ grade }}
          </button>
        </div>
      </div>

      <!-- Единая витрина категории без лишней вложенности блоков -->
      <div
        class="rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-fsp-dark-border bg-white dark:bg-fsp-dark-surface shadow-xl shadow-gray-200/50 dark:shadow-black/40 overflow-hidden"
      >
        <div
          class="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-fsp-dark-border items-stretch"
        >
          <!-- Левая колонка: Стандарт категории -->
          <LandingCategorySpecCard :category="activePreview" />

          <!-- Правая колонка: Верифицированный соискатель -->
          <LandingCategoryCandidateCard :category="activePreview" />
        </div>
      </div>
    </div>
  </section>
</template>
