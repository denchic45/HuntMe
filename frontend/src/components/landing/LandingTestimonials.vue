<script lang="ts" setup>
import { computed } from 'vue'
import { useLandingRoleStore } from '@/stores/landingRole'
import BaseBadge from '@/components/common/BaseBadge.vue'
import type { TestimonialItem } from '@/types/landing'

const roleStore = useLandingRoleStore()

const items = computed<TestimonialItem[]>(() => {
  return roleStore.isCandidate
    ? [
        {
          id: '1',
          name: 'Роман Кравцов',
          roleTitle: 'Middle Backend (Go / Python)',
          company: 'Финтех-платформа',
          quote:
            '«Мне не пришлось писать десятки сопроводительных писем. Прошел тест, привязал свой FSP ID за хакатон, и через 3 дня тимлид написал мне с конкретной вилкой 260 000 ₽.»',
          avatar: '/brand/face1.png',
          fspRank: 'Победитель ЛЦТ',
          salaryOrMatch: 'Оффер: 260k ₽',
        },
        {
          id: '2',
          name: 'Анастасия Белова',
          roleTitle: 'Senior Frontend (Vue 3 / TS)',
          company: 'E-commerce холдинг',
          quote:
            '«Понравилась полная анонимность: мой текущий работодатель даже не знал, что я на платформе, пока я сама не выбрала оффер и не раскрыла контакты.»',
          avatar: '/brand/photo.jpeg',
          fspRank: 'Чемпионка Москвы по СП',
          salaryOrMatch: 'Оффер: 340k ₽',
        },
        {
          id: '3',
          name: 'Илья Мельников',
          roleTitle: 'DevOps & SRE Specialist',
          company: 'Инфраструктурный сервис',
          quote:
            '«Тестирование на грейд действительно глубокое, оценивает архитектурные решения. Это круто отсекает неадекватных эйчаров и выводит сразу на технического директора.»',
          avatar: '/brand/example.png',
          fspRank: '1 разряд ФСП',
          salaryOrMatch: 'Оффер: 310k ₽',
        },
      ]
    : [
        {
          id: '1',
          name: 'Александр Громов',
          roleTitle: 'Head of Engineering',
          company: 'AI Research Lab',
          quote:
            '«Мы сократили цикл закрытия Senior позиции с 45 до 9 дней. Кандидаты с бейджем ФСП с первого дня показывают высочайший уровень работы со сложными алгоритмами.»',
          avatar: '/brand/face1.png',
          salaryOrMatch: 'Закрыто 4 вакансии',
        },
        {
          id: '2',
          name: 'Мария Селезнева',
          roleTitle: 'Tech Lead / Hiring Manager',
          company: 'Крупный Банк',
          quote:
            '«Больше никакого спама на почту. Я открываю нужную категорию, вижу проверенный скор и отправляю оффер с нашей вилкой. Конверсия в ответ — более 80%.»',
          avatar: '/brand/photo.jpeg',
          salaryOrMatch: 'Response Rate: 84%',
        },
        {
          id: '3',
          name: 'Виктор Тарасов',
          roleTitle: 'CTO',
          company: 'Cloud Platform',
          quote:
            '«Explainable AI Match очень точно ранжирует соискателей. Обоснование совпадения экономит часы времени всей нашей команды разработки.»',
          avatar: '/brand/example.png',
          salaryOrMatch: 'Time-to-offer: 48h',
        },
      ]
})
</script>

<template>
  <section class="py-20 bg-white dark:bg-fsp-dark text-gray-900 dark:text-white transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <BaseBadge icon="pi pi-users" label="Сообщество" size="md" variant="primary" />
        <h2 class="text-3xl sm:text-4xl font-extrabold font-sans tracking-tight">
          {{ roleStore.isCandidate ? 'Истории инженеров HuntMe' : 'Отзывы технических лидеров' }}
        </h2>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-sans">
          Реальный опыт взаимодействия разработчиков и нанимающих команд
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="item in items"
          :key="item.id"
          class="rounded-2xl bg-gray-50 dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-yellow-500 flex gap-1 text-xs">
                <i v-for="n in 5" :key="n" class="pi pi-star-fill"></i>
              </span>
              <BaseBadge :label="item.salaryOrMatch" variant="glow" />
            </div>

            <p class="text-sm text-gray-700 dark:text-gray-300 italic font-sans leading-relaxed">
              {{ item.quote }}
            </p>
          </div>

          <div
            class="pt-6 mt-6 border-t border-gray-200 dark:border-fsp-dark-border flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-gradient-to-br from-fsp-blue to-purple-700 flex items-center justify-center text-white font-bold text-xs font-mono"
              >
                {{ item.name[0] }}
              </div>
              <div>
                <div class="font-bold text-sm text-gray-900 dark:text-white font-sans">
                  {{ item.name }}
                </div>
                <div class="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                  {{ item.roleTitle }}
                </div>
              </div>
            </div>
            <div v-if="item.fspRank" class="text-fsp-red text-xs" title="Достижение ФСП">
              <i class="pi pi-trophy"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
