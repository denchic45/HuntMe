<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useLandingRoleStore } from '@/stores/landingRole'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'

const roleStore = useLandingRoleStore()

const email = ref('')
const isAgreed = ref(true)
const isSubmitted = ref(false)

const content = computed(() => {
  return roleStore.isCandidate
    ? {
        badge: 'Быстрый старт соискателя',
        title: 'Получайте офферы прямо в личный кабинет',
        subtitle:
          'Пройдите верификацию грейда, привяжите FSP ID и откройте доступ к предложениям от ведущих технологических компаний.',
        placeholder: 'Введите рабочий email...',
        buttonText: 'Подтвердить грейд',
        mockRole: 'Senior Python / AI Engineer',
        mockSalary: '340 000 – 420 000 ₽',
        mockText: 'Подтвержденный грейд Senior • Топ-5% в рейтинге ФСП',
      }
    : {
        badge: 'Для нанимающих команд',
        title: 'Найдите идеального разработчика за 48 часов',
        subtitle:
          'Получите доступ к закрытому банку проверенных инженеров с подтвержденными результатами тестирования и соревнований.',
        placeholder: 'Корпоративный email компании...',
        buttonText: 'Получить доступ к банку',
        mockRole: 'Match AI: Подбор под вакансию',
        mockSalary: '96% релевантность стека',
        mockText: 'Готовый пул из 14 кандидатов в категории Senior Go',
      }
})

const handleSubmit = () => {
  if (email.value.trim()) {
    isSubmitted.value = true
  }
}
</script>

<template>
  <section class="py-20 bg-gray-50/70 dark:bg-fsp-dark/50 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="rounded-3xl bg-gradient-to-br from-[#1B1C21] via-fsp-dark-surface to-[#121316] text-white border border-gray-700/60 p-8 sm:p-12 lg:p-16 shadow-2xl overflow-hidden relative"
      >
        <!-- Фоновое свечение -->
        <div
          class="absolute -right-20 -bottom-20 w-96 h-96 bg-fsp-blue/20 blur-[120px] rounded-full pointer-events-none"
        ></div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <!-- Левая колонка: Мокап карточки в стиле Turing -->
          <div class="lg:col-span-5 order-2 lg:order-1">
            <div
              class="rounded-2xl bg-fsp-dark/90 border border-gray-700/80 p-6 shadow-xl space-y-4 backdrop-blur-md"
            >
              <div class="flex items-center justify-between">
                <BaseBadge icon="pi pi-star-fill" label="ФСП Верификация" variant="danger" />
                <span class="text-xs text-green-400 font-mono">● Активен</span>
              </div>

              <div>
                <div class="text-base font-bold font-sans">{{ content.mockRole }}</div>
                <div class="text-sm font-mono font-bold text-fsp-blue mt-1">
                  {{ content.mockSalary }}
                </div>
              </div>

              <p class="text-xs text-gray-300 font-sans leading-relaxed">
                {{ content.mockText }}
              </p>

              <div
                class="pt-3 border-t border-gray-800 flex items-center justify-between text-[11px] text-gray-400"
              >
                <span>Анонимный профиль</span>
                <span class="text-fsp-blue font-semibold">HuntMe Verified ✓</span>
              </div>
            </div>
          </div>

          <!-- Правая колонка: Форма и призыв к действию -->
          <div class="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <BaseBadge :label="content.badge" variant="glow" />

            <h2
              class="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-sans tracking-tight leading-tight"
            >
              {{ content.title }}
            </h2>

            <p class="text-sm sm:text-base text-gray-300 font-sans leading-relaxed max-w-xl">
              {{ content.subtitle }}
            </p>

            <!-- Поле ввода Email -->
            <form class="space-y-3 max-w-md" @submit.prevent="handleSubmit">
              <div class="flex flex-col sm:flex-row gap-2">
                <input
                  v-model="email"
                  :placeholder="content.placeholder"
                  class="flex-1 px-4 py-3 rounded-xl bg-gray-900/90 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-fsp-blue focus:ring-2 focus:ring-fsp-blue/30 font-sans"
                  required
                  type="email"
                />
                <BaseButton size="md" type="submit" variant="primary">
                  {{ content.buttonText }}
                </BaseButton>
              </div>

              <!-- Чекбокс согласия 152-ФЗ -->
              <label
                class="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none"
              >
                <input
                  v-model="isAgreed"
                  class="rounded border-gray-700 text-fsp-blue focus:ring-fsp-blue"
                  required
                  type="checkbox"
                />
                <span>Согласен на обработку персональных данных (152-ФЗ)</span>
              </label>

              <div
                v-if="isSubmitted"
                class="p-3 rounded-lg bg-green-500/20 border border-green-500/40 text-green-300 text-xs font-mono"
              >
                ✓ Ссылка для входа отправлена на {{ email }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
