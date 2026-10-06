<script lang="ts" setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-slate-50 dark:bg-fsp-dark text-fsp-dark dark:text-fsp-light transition-colors duration-200 selection:bg-fsp-blue selection:text-white"
  >
    <AppHeader />
    <main class="flex-1 w-full">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped></style>
