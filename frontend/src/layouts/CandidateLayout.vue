<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import DashboardHeader from '@/components/layout/DashboardHeader.vue'
import CandidateSidebar from '@/components/layout/CandidateSidebar.vue'

const isSidebarOpen = ref(false)
const route = useRoute()
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-fsp-dark text-gray-900 dark:text-gray-100 flex flex-col selection:bg-fsp-blue selection:text-white"
  >
    <!-- Верхняя шапка с кнопкой сайдбара для мобилок -->
    <DashboardHeader show-sidebar-toggle @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

    <!-- Центрированный контейнер с плавающим сайдбаром и основным контентом -->
    <div class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex gap-6 items-start">
      <!-- Плавающее боковое меню -->
      <CandidateSidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

      <!-- Основная контентная область -->
      <main class="flex-1 min-w-0">
        <!-- Блок хлебных крошек и заголовка страницы -->
        <div v-if="route.meta?.title" class="mb-6">
          <div class="flex items-center gap-2 text-xs font-mono text-gray-400 mb-1">
            <RouterLink class="hover:text-fsp-blue transition-colors" to="/candidate/overview">
              Кабинет
            </RouterLink>
            <span>/</span>
            <span class="text-gray-700 dark:text-gray-300 font-semibold">
              {{ route.meta.title }}
            </span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {{ route.meta.title }}
          </h1>
        </div>

        <!-- Дочерний контент страницы -->
        <router-view />
      </main>
    </div>
  </div>
</template>
