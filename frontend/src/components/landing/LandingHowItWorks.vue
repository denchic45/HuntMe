<script lang="ts" setup>
import { computed } from 'vue'
import { useLandingRoleStore } from '@/stores/landingRole'
import BaseBadge from '@/components/common/BaseBadge.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import LandingRoadmapStep from '@/components/landing/LandingRoadmapStep.vue'
import type { RoadmapStep } from '@/types/landing'

const roleStore = useLandingRoleStore()

const candidateSteps: RoadmapStep[] = [
  {
    number: '01',
    subtitle: 'ШАГ 01 • ПРОФИЛЬ',
    title: 'Регистрация и первичный опрос',
    description:
      'Укажите специализацию (Backend, Frontend, DevOps, AI), отрасль и заявленный грейд. При наличии привяжите FSP ID для автоматической синхронизации спортивных побед.',
    badgeText: 'Входной опрос',
    badgeVariant: 'primary',
    icon: 'pi pi-user-edit',
    tags: ['Специализация', 'Заявленный грейд', 'FSP ID / Keycloak'],
  },
  {
    number: '02',
    subtitle: 'ШАГ 02 • ПРОВЕРКА',
    title: 'Адаптивное тестирование на грейд',
    description:
      'Пройдите уникальный набор алгоритмических и прикладных задач. Задания генерируются индивидуально с защитой от утечек; грейд не понижается принудительно.',
    badgeText: 'Практический тест',
    badgeVariant: 'glow',
    icon: 'pi pi-code',
    tags: ['Защита от списывания', 'Без понижения', 'Алгоритмы и код'],
  },
  {
    number: '03',
    subtitle: 'ШАГ 03 • СТАТУС',
    title: 'Присвоение категории и ранжирование',
    description:
      'Платформа присваивает объективную категорию (например, «Middle+ Backend Go»). Достижения в олимпиадах и хакатонах ФСП дают бейдж и поднимают профиль в топ выдачи.',
    badgeText: 'Верификация ФСП',
    badgeVariant: 'danger',
    icon: 'pi pi-star-fill',
    tags: ['Категория квалификации', 'Рейтинг ФСП', 'Бейдж чемпиона'],
  },
  {
    number: '04',
    subtitle: 'ШАГ 04 • ОФФЕРЫ',
    title: 'Входящие персональные предложения',
    description:
      'Работодатели сами находят вас в категории и направляют адресные приглашения. Каждое предложение строго обязательно содержит прозрачную вилку ЗП в рублях.',
    badgeText: 'Открытая зарплата',
    badgeVariant: 'primary',
    icon: 'pi pi-wallet',
    tags: ['Обязательная вилка ЗП', 'Компании пишут первыми', 'Без спама'],
  },
  {
    number: '05',
    subtitle: 'ШАГ 05 • НАЙМ',
    title: 'Принятие оффера и раскрытие контактов',
    description:
      'Профиль остается на 100% анонимным до вашего решения. Прямые контакты передаются работодателю только после того, как вы лично приняли предложение.',
    badgeText: '100% Приватность',
    badgeVariant: 'glow',
    icon: 'pi pi-lock',
    tags: ['152-ФЗ', 'Защита контактов', 'Прямой оффер'],
  },
]

const employerPlaceholderSteps = [
  { step: '01', title: 'Описание потребности', desc: 'Стек, задачи и требуемый грейд' },
  { step: '02', title: 'Explainable AI Match', desc: 'Умная выборка с обоснованием' },
  { step: '03', title: 'Оффер с открытой ЗП', desc: 'Адресное предложение кандидату' },
  { step: '04', title: 'Прямой контакт', desc: 'Получение контактов после согласия' },
]

const headerData = computed(() => {
  return roleStore.isCandidate
    ? {
        badge: 'Пошаговый трек соискателя',
        title: 'Как работает подбор для разработчиков',
        subtitle:
          'От первичного тестирования до получения оффера с прозрачной зарплатой — простой и объективный путь.',
      }
    : {
        badge: 'Для нанимающих команд',
        title: 'Как работает подбор для работодателей',
        subtitle: 'Технологичный процесс поиска и выхода на контакт с проверенными специалистами.',
      }
})
</script>

<template>
  <section
    id="how-it-works"
    class="py-20 bg-gray-50/70 dark:bg-fsp-dark/40 border-t border-gray-200 dark:border-fsp-dark-border transition-colors relative overflow-hidden"
  >
    <!-- Фоновые неоновые эффекты -->
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-fsp-blue/10 blur-[150px] rounded-full pointer-events-none -z-10"
    ></div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Заголовок секции -->
      <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <BaseBadge :label="headerData.badge" icon="pi pi-compass" size="md" variant="primary" />
        <h2
          class="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-sans text-gray-900 dark:text-white tracking-tight"
        >
          {{ headerData.title }}
        </h2>
        <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-sans">
          {{ headerData.subtitle }}
        </p>
      </div>

      <!-- ТРЕК СОИСКАТЕЛЯ: Минималистичный Roadmap / Timeline с линией -->
      <div v-if="roleStore.isCandidate" class="relative">
        <!-- Непрерывная вертикальная линия связи на десктопе с плавным появлением и затуханием по краям -->
        <div
          class="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-transparent via-fsp-blue via-50% to-transparent -z-0"
        ></div>
        <div
          class="hidden md:block absolute left-1/2 top-0 bottom-0 w-3 -translate-x-1/2 bg-gradient-to-b from-transparent via-fsp-blue/25 via-50% to-transparent blur-xs -z-0 pointer-events-none"
        ></div>

        <!-- Мобильная линия связи слева с плавным затуханием -->
        <div
          class="md:hidden absolute left-[18px] top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-transparent via-fsp-blue via-50% to-transparent -z-0"
        ></div>

        <!-- Список шагов таймлайна -->
        <div class="space-y-8 md:space-y-12 relative z-10">
          <LandingRoadmapStep
            v-for="(step, index) in candidateSteps"
            :key="step.number"
            :is-last="index === candidateSteps.length - 1"
            :is-left="index % 2 === 0"
            :step="step"
          />
        </div>
      </div>

      <!-- ТРЕК РАБОТОДАТЕЛЯ: Технологичная заглушка на будущее -->
      <div
        v-else
        class="rounded-3xl bg-white dark:bg-fsp-dark border border-gray-200 dark:border-fsp-dark-border p-8 md:p-12 shadow-xl space-y-8 text-center max-w-3xl mx-auto"
      >
        <div
          class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fsp-blue/15 text-fsp-blue text-xs sm:text-sm font-mono font-bold"
        >
          <i class="pi pi-cog pi-spin"></i>
          <span>Раздел для компаний в активной разработке</span>
        </div>

        <div class="space-y-3">
          <h3 class="text-2xl sm:text-3xl font-bold font-sans text-gray-900 dark:text-white">
            Механика найма для работодателей
          </h3>
          <p
            class="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-sans max-w-xl mx-auto"
          >
            Скоро здесь появится интерактивная демонстрация работы AI-подбора и сценария выхода на
            контакт. Вы можете ознакомиться с треком соискателя прямо сейчас:
          </p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left pt-2">
          <div
            v-for="p in employerPlaceholderSteps"
            :key="p.step"
            class="p-4 rounded-xl bg-gray-50 dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border space-y-2"
          >
            <div class="text-sm font-mono font-bold text-fsp-blue">{{ p.step }}</div>
            <div class="text-sm font-bold font-sans text-gray-900 dark:text-white">
              {{ p.title }}
            </div>
            <div class="text-xs text-gray-500 font-sans leading-snug">{{ p.desc }}</div>
          </div>
        </div>

        <div class="pt-4 flex justify-center">
          <BaseButton icon="pi pi-user" variant="outline" @click="roleStore.setRole('candidate')">
            Посмотреть путь соискателя
          </BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>
