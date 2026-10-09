<script lang="ts" setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { name: 'Конструктор резюме', to: '/candidate/profile/edit', icon: 'pi pi-pencil' },
  { name: 'Анонимное превью', to: '/candidate/profile/preview', icon: 'pi pi-eye' },
  { name: 'PDF-паспорт и импорт', to: '/candidate/profile/pdf', icon: 'pi pi-file-pdf' },
]
</script>

<template>
  <div class="space-y-6">
    <!-- Табы верхнего уровня профиля -->
    <div
      class="flex items-center gap-2 border-b border-gray-200 dark:border-fsp-dark-border pb-1 overflow-x-auto"
    >
      <RouterLink
        v-for="tab in tabs"
        :key="tab.to"
        :class="[
          'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all select-none shrink-0',
          route.path === tab.to
            ? 'bg-fsp-blue text-white shadow-xs font-semibold'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-fsp-dark-surface',
        ]"
        :to="tab.to"
      >
        <i :class="tab.icon"></i>
        <span>{{ tab.name }}</span>
      </RouterLink>
    </div>

    <!-- Вложенный маршрут (edit / preview / pdf) -->
    <router-view />
  </div>
</template>
