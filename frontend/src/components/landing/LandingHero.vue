<script lang="ts" setup>
import { computed } from 'vue'
import { useLandingRoleStore } from '@/stores/landingRole'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'

const roleStore = useLandingRoleStore()

const heroTags = [
  { label: 'Senior Go Developer', icon: 'pi pi-bolt', variant: 'glow' as const },
  { label: '🏆 Победитель Хакатона ФСП', icon: 'pi pi-verified', variant: 'danger' as const },
  { label: 'Vue 3 & TypeScript', icon: 'pi pi-code', variant: 'primary' as const },
  { label: '280 000 – 350 000 ₽', icon: 'pi pi-wallet', variant: 'neutral' as const },
  { label: 'AI & Data Science', icon: 'pi pi-chart-line', variant: 'outline' as const },
]

const heroTitle = computed(() => {
  return roleStore.isCandidate
    ? {
        line1: 'Твоя квалификация',
        highlight: 'получает офферы.',
        desc: 'Обратная механика найма: подтверди грейд тестированием и спортивными достижениями ФСП, получай прямые предложения с открытой зарплатой.',
      }
    : {
        line1: 'Нанимай элиту',
        highlight: 'ИТ-разработки.',
        desc: 'Доступ к банку подтвержденных специалистов. Никаких сотен резюме-спама: кандидаты категоризированы объективными тестами и результатами ФСП.',
      }
})
</script>

<template>
  <section class="relative pt-12 pb-16 md:py-24 overflow-hidden">
    <!-- Фоновые градиентные свечения в стиле Turing/FSP -->
    <div
      class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-fsp-blue/20 blur-[130px] rounded-full pointer-events-none -z-10"
    ></div>
    <div
      class="absolute top-1/3 right-10 w-[300px] h-[300px] bg-fsp-red/10 blur-[120px] rounded-full pointer-events-none -z-10"
    ></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <!-- Левая колонка: Заголовок и CTA -->
        <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fsp-blue/10 dark:bg-fsp-blue/20 border border-fsp-blue/30 text-fsp-blue dark:text-blue-300 text-xs font-mono"
          >
            <i class="pi pi-verified text-fsp-red"></i>
            <span>Официальная платформа верификации ФСП России</span>
          </div>

          <h1
            class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-sans text-gray-900 dark:text-white leading-[1.1]"
          >
            {{ heroTitle.line1 }} <br />
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-fsp-blue to-blue-400 dark:to-indigo-300"
            >
              {{ heroTitle.highlight }}
            </span>
          </h1>

          <p
            class="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans"
          >
            {{ heroTitle.desc }}
          </p>

          <!-- Интерактивные теги / скиллы -->
          <div class="flex flex-wrap gap-2 justify-center lg:justify-start pt-2">
            <BaseBadge
              v-for="tag in heroTags"
              :key="tag.label"
              :icon="tag.icon"
              :label="tag.label"
              :variant="tag.variant"
              size="md"
            />
          </div>

          <!-- Кнопки действий -->
          <div
            class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
          >
            <BaseButton v-if="roleStore.isCandidate" icon="pi pi-bolt" size="lg" variant="glow">
              Подтвердить свой грейд
            </BaseButton>

            <BaseButton v-else icon="pi pi-search" size="lg" variant="glow">
              Открыть банк кандидатов
            </BaseButton>

            <BaseButton icon="pi pi-arrow-right" icon-pos="right" size="lg" variant="outline">
              Как работает подбор
            </BaseButton>
          </div>
        </div>

        <!-- Правая колонка: Интерактивная карточка в Turing Glassmorphism стиле -->
        <div class="lg:col-span-5">
          <div
            class="relative mx-auto max-w-md rounded-2xl bg-gradient-to-b from-gray-900/90 to-fsp-dark/95 border border-gray-700/60 p-6 shadow-2xl backdrop-blur-xl text-white"
          >
            <!-- Плавающий статус верификации -->
            <div class="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-xl bg-gradient-to-br from-fsp-blue to-fsp-red flex items-center justify-center font-mono font-bold text-white text-sm shadow-md"
                >
                  Go
                </div>
                <div>
                  <div class="text-sm font-semibold font-sans">Алексей И. (ID: FSP-8849)</div>
                  <div class="text-xs text-gray-400 font-mono">Middle+ Backend Engineer</div>
                </div>
              </div>
              <BaseBadge icon="pi pi-star-fill" label="Верифицирован ФСП" variant="danger" />
            </div>

            <!-- Тестовый балл и достижения -->
            <div class="space-y-3 font-sans text-xs text-gray-300">
              <div
                class="flex justify-between items-center bg-gray-800/50 p-2.5 rounded-lg border border-gray-700/50"
              >
                <span>Результат тестирования на грейд:</span>
                <span class="font-mono text-fsp-blue font-bold text-sm">96 / 100</span>
              </div>
              <div
                class="flex justify-between items-center bg-gray-800/50 p-2.5 rounded-lg border border-gray-700/50"
              >
                <span>Достижения ФСП:</span>
                <span class="font-mono text-fsp-red font-semibold">1 место (Хакатон ЛЦТ 2025)</span>
              </div>
            </div>

            <!-- Входящее предложение от компании (Обязательная вилка ЗП) -->
            <div
              class="mt-5 p-4 rounded-xl bg-gradient-to-r from-fsp-blue/20 to-purple-900/20 border border-fsp-blue/40 space-y-2"
            >
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-300">Входящее предложение:</span>
                <span class="text-xs text-green-400 font-mono font-semibold">● Новый оффер</span>
              </div>
              <div class="text-base font-bold font-mono text-white tracking-wide">
                290 000 – 340 000 ₽
              </div>
              <p class="text-[11px] text-gray-300 leading-snug">
                «Приглашаем в команду платежной инфраструктуры. Проект на Go + Kafka.»
              </p>
            </div>

            <!-- Индикатор анонимности -->
            <div
              class="mt-4 flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-800 pt-3"
            >
              <span class="flex items-center gap-1.5">
                <i class="pi pi-lock text-fsp-blue"></i>
                Контакты скрыты до принятия
              </span>
              <span class="text-fsp-blue font-semibold hover:underline cursor-pointer">
                Подробнее →
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
