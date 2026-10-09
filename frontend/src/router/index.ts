import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import EmployerDashboardView from '@/views/EmployerDashboardView.vue'

// Каркасы лейаутов
import CandidateLayout from '@/layouts/CandidateLayout.vue'
import FocusLayout from '@/layouts/FocusLayout.vue'

// Страницы соискателя
import OverviewView from '@/views/candidate/OverviewView.vue'
import ProfileIndexView from '@/views/candidate/profile/ProfileIndexView.vue'
import ProfileEditView from '@/views/candidate/profile/ProfileEditView.vue'
import ProfilePreviewView from '@/views/candidate/profile/ProfilePreviewView.vue'
import ProfilePdfView from '@/views/candidate/profile/ProfilePdfView.vue'

import TestingHubView from '@/views/candidate/testing/TestingHubView.vue'
import TestingSurveyView from '@/views/candidate/testing/TestingSurveyView.vue'
import TestingSessionView from '@/views/candidate/testing/TestingSessionView.vue'
import TestingResultView from '@/views/candidate/testing/TestingResultView.vue'

import FspAchievementsView from '@/views/candidate/fsp/FspAchievementsView.vue'
import InvitesListView from '@/views/candidate/invites/InvitesListView.vue'
import InviteDetailView from '@/views/candidate/invites/InviteDetailView.vue'
import VacanciesCatalogView from '@/views/candidate/vacancies/VacanciesCatalogView.vue'
import MyApplicationsView from '@/views/candidate/vacancies/MyApplicationsView.vue'
import ChallengesListView from '@/views/candidate/challenges/ChallengesListView.vue'
import SettingsView from '@/views/candidate/settings/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/employer/dashboard',
      name: 'employer-dashboard',
      component: EmployerDashboardView,
    },

    // Фокусный режим тестирования (FocusLayout)
    {
      path: '/candidate/testing/session/:sessionId',
      name: 'candidate-testing-session',
      component: FocusLayout,
      children: [
        {
          path: '',
          component: TestingSessionView,
          meta: { title: 'Тестирование' },
        },
      ],
    },

    // Основной контур ЛК Соискателя (CandidateLayout)
    {
      path: '/candidate',
      component: CandidateLayout,
      children: [
        {
          path: '',
          redirect: '/candidate/overview',
        },
        {
          path: 'overview',
          name: 'candidate-overview',
          component: OverviewView,
          meta: { title: 'Сводка профиля' },
        },
        {
          path: 'dashboard',
          redirect: '/candidate/overview',
        },
        {
          path: 'profile',
          component: ProfileIndexView,
          children: [
            {
              path: '',
              redirect: '/candidate/profile/edit',
            },
            {
              path: 'edit',
              name: 'candidate-profile-edit',
              component: ProfileEditView,
              meta: { title: 'Редактирование профиля' },
            },
            {
              path: 'preview',
              name: 'candidate-profile-preview',
              component: ProfilePreviewView,
              meta: { title: 'Превью резюме' },
            },
            {
              path: 'pdf',
              name: 'candidate-profile-pdf',
              component: ProfilePdfView,
              meta: { title: 'Экспорт и парсинг PDF' },
            },
          ],
        },
        {
          path: 'testing',
          name: 'candidate-testing-hub',
          component: TestingHubView,
          meta: { title: 'Квалификация и тестирование' },
        },
        {
          path: 'testing/survey',
          name: 'candidate-testing-survey',
          component: TestingSurveyView,
          meta: { title: 'Выбор направления теста' },
        },
        {
          path: 'testing/result/:sessionId',
          name: 'candidate-testing-result',
          component: TestingResultView,
          meta: { title: 'Результаты теста' },
        },
        {
          path: 'fsp',
          name: 'candidate-fsp',
          component: FspAchievementsView,
          meta: { title: 'Достижения ФСП' },
        },
        {
          path: 'invites',
          name: 'candidate-invites',
          component: InvitesListView,
          meta: { title: 'Входящие предложения' },
        },
        {
          path: 'invites/:id',
          name: 'candidate-invite-detail',
          component: InviteDetailView,
          meta: { title: 'Детали предложения' },
        },
        {
          path: 'vacancies',
          name: 'candidate-vacancies',
          component: VacanciesCatalogView,
          meta: { title: 'Вакансии' },
        },
        {
          path: 'vacancies/applications',
          name: 'candidate-my-applications',
          component: MyApplicationsView,
          meta: { title: 'Мои отклики' },
        },
        {
          path: 'challenges',
          name: 'candidate-challenges',
          component: ChallengesListView,
          meta: { title: 'Микро-задания' },
        },
        {
          path: 'settings',
          name: 'candidate-settings',
          component: SettingsView,
          meta: { title: 'Настройки и приватность' },
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  try {
    const authStore = useAuthStore()
    const isCandidateRoute = to.path.startsWith('/candidate')
    const isEmployerRoute = to.path.startsWith('/employer')
    const isGuestAuthRoute = to.path === '/login' || to.path === '/register'

    if (isCandidateRoute || isEmployerRoute) {
      if (!authStore.isAuthenticated) {
        return { path: '/login', query: { redirect: to.fullPath } }
      }

      if (isCandidateRoute && authStore.role === 'employer') {
        return { path: '/employer/dashboard' }
      }

      if (isEmployerRoute && authStore.role === 'candidate') {
        return { path: '/candidate/overview' }
      }
    }

    if (isGuestAuthRoute && authStore.isAuthenticated) {
      return authStore.role === 'employer'
        ? { path: '/employer/dashboard' }
        : { path: '/candidate/overview' }
    }
  } catch {
    // Pinia not yet initialized (e.g. isolated unit test)
  }
})

router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = `${to.meta.title} | HuntMe`
  } else {
    document.title = 'HuntMe — Платформа обратного рекрутинга'
  }
})

export default router
