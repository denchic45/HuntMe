<script lang="ts" setup>
import { computed } from 'vue'
import { useLandingRoleStore } from '@/stores/landingRole'
import BaseBadge from '@/components/common/BaseBadge.vue'
import type { ForefrontItem } from '@/types/landing'

const roleStore = useLandingRoleStore()

const sectionInfo = computed(() => {
  return roleStore.isCandidate
    ? {
        badge: 'Спортивное программирование',
        title: 'Твой спортивный опыт — реальное карьерное преимущество',
        subtitle:
          'Участники и призеры соревнований ФСП автоматически поднимаются в топ выдачи ведущим работодателям страны.',
      }
    : {
        badge: 'Знак качества ФСП',
        title: 'Нанимайте разработчиков с проверенным олимпиадным мышлением',
        subtitle:
          'Победители хакатонов и верифицированные олимпиадники справляются со сложнейшими архитектурными задачами быстрее рынка.',
      }
})

const cards: ForefrontItem[] = [
  {
    id: '1',
    name: 'Дмитрий Соколов',
    roleTitle: 'Senior Distributed Systems Engineer',
    badge: '1 место • Чемпионат ФСП 2025',
    quote:
      '«Верификация ФСП избавила от бесконечных лайвкодингов: работодатели сразу видят подтвержденный уровень и предлагают релевантные задачи с сильной вилкой ЗП.»',
    image: '/brand/face1.png',
  },
  {
    id: '2',
    name: 'Елена Васильева',
    roleTitle: 'Lead AI / ML Engineer',
    badge: 'Победитель Хакатона ЛЦТ',
    quote:
      '«HuntMe полностью перевернул механику поиска: вместо сотен холодных откликов в пустоту я получила три целевых оффера за первую неделю.»',
    image: '/brand/photo.jpeg',
  },
  {
    id: '3',
    name: 'Константин Морозов',
    roleTitle: 'Staff Backend Developer (Go / Rust)',
    badge: 'Мастер спорта по спортпрограммированию',
    quote:
      '«Платформа оценивает не красивые формулировки в резюме, а реальные алгоритмические способности и умение писать надежный промышленный код.»',
    image: '/brand/example.png',
  },
]
</script>

<template>
  <section class="py-20 bg-white dark:bg-fsp-dark text-gray-900 dark:text-white transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto space-y-4 mb-14">
        <BaseBadge :label="sectionInfo.badge" icon="pi pi-star-fill" size="md" variant="danger" />
        <h2 class="text-3xl sm:text-4xl font-extrabold font-sans tracking-tight leading-tight">
          {{ sectionInfo.title }}
        </h2>
        <p class="text-gray-600 dark:text-gray-300 text-sm sm:text-base font-sans">
          {{ sectionInfo.subtitle }}
        </p>
      </div>

      <!-- 3 карточки в стиле Turing / FSP -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="card in cards"
          :key="card.id"
          class="group relative rounded-2xl overflow-hidden bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border p-6 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:border-fsp-blue/50 transition-all duration-300 min-h-[380px]"
        >
          <!-- Фоновый градиент карточки -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-fsp-dark via-fsp-dark-surface/90 to-transparent z-10 pointer-events-none"
          ></div>

          <!-- Бейдж достижения -->
          <div class="relative z-20 mb-4">
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fsp-red/20 text-fsp-red border border-fsp-red/40 text-xs font-mono font-semibold"
            >
              <i class="pi pi-trophy text-[10px]"></i>
              {{ card.badge }}
            </span>
          </div>

          <!-- Цитата и информация об эксперте -->
          <div class="relative z-20 space-y-4 mt-auto">
            <p class="text-xs sm:text-sm text-gray-200 italic font-sans leading-relaxed">
              {{ card.quote }}
            </p>

            <div class="border-t border-gray-700/60 pt-4 flex items-center justify-between">
              <div>
                <div
                  class="font-bold text-sm font-sans text-white group-hover:text-fsp-blue transition-colors"
                >
                  {{ card.name }}
                </div>
                <div class="text-[11px] text-gray-400 font-mono">
                  {{ card.roleTitle }}
                </div>
              </div>
              <div
                class="w-8 h-8 rounded-full bg-fsp-blue/20 border border-fsp-blue/40 flex items-center justify-center text-fsp-blue text-xs font-mono font-bold"
              >
                ✓
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
