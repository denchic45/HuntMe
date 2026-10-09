<script lang="ts" setup>
import { useFaq } from '@/composables/useFaq'
import BaseBadge from '@/components/common/BaseBadge.vue'

const { faqList, activeFaqId, toggleFaq } = useFaq('1')
</script>

<template>
  <section class="py-20 bg-white dark:bg-fsp-dark text-gray-900 dark:text-white transition-colors">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12 space-y-3">
        <BaseBadge icon="pi pi-question-circle" label="FAQ" size="md" variant="primary" />
        <h2 class="text-3xl sm:text-4xl font-extrabold font-sans tracking-tight">
          Часто задаваемые вопросы
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400 font-sans">
          Все, что нужно знать о работе обратной механики и верификации
        </p>
      </div>

      <div class="space-y-4">
        <div
          v-for="item in faqList"
          :key="item.id"
          :class="[
            activeFaqId === item.id
              ? 'border-fsp-blue/50 dark:border-fsp-blue/60 bg-white dark:bg-fsp-dark-surface shadow-md'
              : 'border-gray-200 dark:border-fsp-dark-border bg-gray-50/50 dark:bg-fsp-dark-surface/60 hover:border-gray-300 dark:hover:border-gray-600',
          ]"
          class="rounded-2xl border transition-all duration-300 overflow-hidden"
        >
          <!-- Кнопка вопроса -->
          <button
            :aria-controls="`faq-answer-${item.id}`"
            :aria-expanded="activeFaqId === item.id"
            class="w-full p-5 sm:p-6 text-left font-bold font-sans text-sm sm:text-base flex items-center justify-between gap-4 cursor-pointer select-none transition-colors"
            type="button"
            @click="toggleFaq(item.id)"
          >
            <span
              :class="
                activeFaqId === item.id
                  ? 'text-fsp-blue dark:text-blue-300'
                  : 'text-gray-900 dark:text-white'
              "
              class="transition-colors duration-200"
            >
              {{ item.question }}
            </span>
            <div
              :class="
                activeFaqId === item.id
                  ? 'bg-fsp-blue/15 text-fsp-blue'
                  : 'bg-gray-200/60 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400'
              "
              class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 select-none"
            >
              <svg
                :class="{ 'rotate-180': activeFaqId === item.id }"
                class="w-4 h-4 transition-transform duration-300 transform"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                viewBox="0 0 24 24"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </button>

          <!-- Анимированная плашка с ответом и появлением текста -->
          <div
            :id="`faq-answer-${item.id}`"
            :class="
              activeFaqId === item.id
                ? 'grid-rows-[1fr] opacity-100'
                : 'grid-rows-[0fr] opacity-0 pointer-events-none'
            "
            class="grid transition-all duration-300 ease-in-out"
          >
            <div class="overflow-hidden">
              <div
                :class="
                  activeFaqId === item.id ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
                "
                class="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-sans leading-relaxed border-t border-gray-100 dark:border-fsp-dark-border/60 pt-4 transition-all duration-300 transform"
              >
                {{ item.answer }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
