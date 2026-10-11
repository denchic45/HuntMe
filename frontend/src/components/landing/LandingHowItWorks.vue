<script lang="ts" setup>
import { computed } from 'vue'
import { useLandingRoleStore } from '@/stores/landingRole'
import BaseBadge from '@/components/common/BaseBadge.vue'
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

const employerSteps: RoadmapStep[] = [
  {
    number: '01',
    subtitle: 'ШАГ 01 • ПОТРЕБНОСТЬ',
    title: 'Формирование профиля вакансии',
    description:
      'Задайте технологический стек, уровень задач, зарплатную вилку и требуемый подтвержденный грейд. Платформа помогает сформулировать объективные требования без размытых формулировок.',
    badgeText: 'Профиль роли',
    badgeVariant: 'primary',
    icon: 'pi pi-file-edit',
    tags: ['Стек технологий', 'Грейд Middle / Senior', 'Прозрачная вилка ЗП'],
  },
  {
    number: '02',
    subtitle: 'ШАГ 02 • АНАЛИТИКА ИИ',
    title: 'Explainable AI Match и скоринг',
    description:
      'Алгоритм ранжирует верифицированных кандидатов на основе результатов адаптивного тестирования и соревнований ФСП. Вы получаете прозрачное обоснование каждого совпадения.',
    badgeText: 'Explainable AI',
    badgeVariant: 'glow',
    icon: 'pi pi-bolt',
    tags: ['Умный скоринг', 'Обоснование матча', 'Верификация ФСП'],
  },
  {
    number: '03',
    subtitle: 'ШАГ 03 • ОФФЕР',
    title: 'Адресное предложение с открытой ЗП',
    description:
      'Направляйте персонализированные офферы подходящим специалистам. Платформа исключает спам: каждое предложение содержит реальные условия, проектные вызовы и фиксированную вилку вознаграждения.',
    badgeText: 'Адресный инвайт',
    badgeVariant: 'primary',
    icon: 'pi pi-send',
    tags: ['Высокая конверсия', 'Без холодного спама', 'Фиксированная вилка'],
  },
  {
    number: '04',
    subtitle: 'ШАГ 04 • КОНТАКТ',
    title: 'Снятие анонимности и прямой диалог',
    description:
      'Как только специалист подтверждает интерес к вашему офферу, открываются его прямые контакты для технического интервью и быстрого выхода на работу.',
    badgeText: 'Прямой найм',
    badgeVariant: 'danger',
    icon: 'pi pi-check-circle',
    tags: ['Прямой контакт', 'Защита 152-ФЗ', 'Быстрый оффер'],
  },
]

const currentSteps = computed(() => (roleStore.isCandidate ? candidateSteps : employerSteps))

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

      <!-- Дорожная карта (Roadmap) с вертикальной линией таймлайна -->
      <div class="relative">
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
            v-for="(step, index) in currentSteps"
            :key="step.number"
            :is-last="index === currentSteps.length - 1"
            :is-left="index % 2 === 0"
            :step="step"
          />
        </div>
      </div>
    </div>
  </section>
</template>
