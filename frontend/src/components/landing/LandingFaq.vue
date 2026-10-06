<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useLandingRoleStore } from '@/stores/landingRole'
import BaseBadge from '@/components/common/BaseBadge.vue'
import type { FaqItem } from '@/types/landing'

const roleStore = useLandingRoleStore()

const activeFaqId = ref<string | null>('1')

const faqList = computed<FaqItem[]>(() => {
  return roleStore.isCandidate
    ? [
        {
          id: '1',
          question: 'Что делать, если у меня нет опыта или достижений в ФСП?',
          answer:
            'Платформа доступна каждому разработчику. При регистрации вы проходите объективный адаптивный тест, который определяет ваш подтвержденный грейд. Достижения ФСП дают дополнительный бонус при ранжировании, но не являются обязательным условием для получения офферов.',
        },
        {
          id: '2',
          question: 'Как обеспечивается конфиденциальность перед текущим работодателем?',
          answer:
            'Ваш профиль в общем банке соискателей строго анонимизирован: скрыты ФИО, контакты, ссылки на соцсети. Прямые контактные данные передаются компании только после того, как вы лично приняли конкретное входящее предложение.',
        },
        {
          id: '3',
          question: 'Как часто можно пересдавать тест для повышения грейда?',
          answer:
            'По регламенту платформы повторное прохождение теста для подтверждения более высокого грейда доступно один раз в 3 месяца. При этом грейд никогда не понижается принудительно.',
        },
        {
          id: '4',
          question: 'Обязана ли компания указывать точную зарплату?',
          answer:
            'Да. По правилам HuntMe ни одно приглашение не может быть отправлено кандидату без явного указания вилки заработной платы в рублях («от» и «до»).',
        },
      ]
    : [
        {
          id: '1',
          question: 'Как формируются категории кандидатов?',
          answer:
            'Категория — это объективная связка подтвержденной специализации и грейда (например, «Middle Backend Go»). Она присваивается на основе результатов специализированного тестирования и верифицированных олимпиадных достижений.',
        },
        {
          id: '2',
          question: 'Как работает умный поиск кандидатов (Match AI)?',
          answer:
            'Вы описываете задачи проекта, стек и требования к уровню. Алгоритм ранжирует пул кандидатов и формирует текстовое объяснение соответствия (Explainable Match), экономя часы работы технического интервьюера.',
        },
        {
          id: '3',
          question: 'Когда компания получает прямые контакты соискателя?',
          answer:
            'Вы направляете адресное приглашение кандидату с описанием проекта и зарплатной вилкой. Как только соискатель нажимает «Принять предложение», вам мгновенно открываются его полные контакты для связи.',
        },
        {
          id: '4',
          question: 'Каковы гарантии квалификации специалистов?',
          answer:
            'Каждый специалист проходит входное тестирование алгоритмических и прикладных навыков. Участники с бейджем ФСП имеют подтвержденные результаты на всероссийских хакатонах и чемпионатах.',
        },
      ]
})

const toggleFaq = (id: string) => {
  activeFaqId.value = activeFaqId.value === id ? null : id
}
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
          class="rounded-2xl border border-gray-200 dark:border-fsp-dark-border bg-gray-50/50 dark:bg-fsp-dark-surface overflow-hidden transition-all"
        >
          <button
            class="w-full p-5 sm:p-6 text-left font-bold font-sans text-sm sm:text-base flex items-center justify-between gap-4 cursor-pointer select-none"
            type="button"
            @click="toggleFaq(item.id)"
          >
            <span class="text-gray-900 dark:text-white">{{ item.question }}</span>
            <i
              :class="{ 'rotate-180': activeFaqId === item.id }"
              class="pi pi-chevron-down text-fsp-blue transition-transform duration-200 text-xs"
            ></i>
          </button>

          <div
            v-if="activeFaqId === item.id"
            class="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-sans leading-relaxed border-t border-gray-100 dark:border-fsp-dark-border/60 pt-4"
          >
            {{ item.answer }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
