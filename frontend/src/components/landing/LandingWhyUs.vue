<script lang="ts" setup>
import { computed } from 'vue'
import { useLandingRoleStore } from '@/stores/landingRole'
import type { WhyUsCard } from '@/types/landing'

const roleStore = useLandingRoleStore()

const title = computed(() => {
  return roleStore.isCandidate
    ? 'Почему инженеры выбирают HuntMe'
    : 'Почему компании нанимают через HuntMe'
})

const cards = computed<WhyUsCard[]>(() => {
  return roleStore.isCandidate
    ? [
        {
          id: '1',
          icon: 'pi pi-wallet',
          title: 'Обязательная вилка ЗП в рублях',
          description:
            'Никаких «по результатам собеседования». Работодатель обязан указать реальный диапазон компенсации в каждом предложении до начала общения.',
          highlight: 'Смотреть статистику зарплат →',
        },
        {
          id: '2',
          icon: 'pi pi-shield',
          title: '100% Приватность и 152-ФЗ',
          description:
            'Ваш текущий работодатель не узнает о поиске. Личные контакты и ФИО скрыты и передаются компании только после вашего прямого согласия на оффер.',
          highlight: 'Узнать о защите данных →',
        },
        {
          id: '3',
          icon: 'pi pi-chart-line',
          title: 'Объективный грейд и рост',
          description:
            'Категория подтверждается реальным тестированием и достижениями ФСП, а не субъективным взглядом HR. Возможность повысить грейд раз в 3 месяца.',
          highlight: 'Пройти тест на грейд →',
        },
      ]
    : [
        {
          id: '1',
          icon: 'pi pi-clock',
          title: 'Экономия до 70% времени тимлидов',
          description:
            'Забудьте о ручной фильтрации сотен нерелевантных резюме. Кандидаты уже объективно протестированы и распределены по подтвержденным категориям.',
          highlight: 'Рассчитать экономию найма →',
        },
        {
          id: '2',
          icon: 'pi pi-sparkles',
          title: 'Explainable AI Подбор',
          description:
            'Опишите задачу команды — система подберет идеальных специалистов и объяснит совпадение по стеку, опыту и алгоритмическим навыкам.',
          highlight: 'Попробовать AI-подбор →',
        },
        {
          id: '3',
          icon: 'pi pi-send',
          title: 'Высокий Response Rate',
          description:
            'Соискатели охотнее отвечают на персонализированные предложения с понятными задачами и прозрачной вилкой заработной платы.',
          highlight: 'Смотреть банк кандидатов →',
        },
      ]
})
</script>

<template>
  <section
    class="py-20 bg-gray-50/70 dark:bg-fsp-dark-surface/50 border-y border-gray-200 dark:border-fsp-dark-border transition-colors"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <h2
          class="text-3xl sm:text-4xl font-extrabold font-sans text-gray-900 dark:text-white tracking-tight"
        >
          {{ title }}
        </h2>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-sans">
          Технологичный подход к найму, устраняющий издержки классических агрегаторов
        </p>
      </div>

      <!-- Сетка преимуществ в стиле Turing -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="card in cards"
          :key="card.id"
          class="rounded-2xl bg-white dark:bg-fsp-dark border border-gray-200 dark:border-fsp-dark-border p-8 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-fsp-blue/40 transition-all duration-300 group"
        >
          <div class="space-y-4">
            <div
              class="w-12 h-12 rounded-xl bg-fsp-blue/10 dark:bg-fsp-blue/20 text-fsp-blue flex items-center justify-center text-xl group-hover:scale-110 transition-transform"
            >
              <i :class="card.icon"></i>
            </div>
            <h3 class="text-lg font-bold font-sans text-gray-900 dark:text-white">
              {{ card.title }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
              {{ card.description }}
            </p>
          </div>

          <div class="pt-6 mt-6 border-t border-gray-100 dark:border-fsp-dark-border">
            <span
              class="text-xs font-semibold font-mono text-fsp-blue hover:text-fsp-blue-hover cursor-pointer inline-flex items-center gap-1 group-hover:gap-2 transition-all"
            >
              {{ card.highlight }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
