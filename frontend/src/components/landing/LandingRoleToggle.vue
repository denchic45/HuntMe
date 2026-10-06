<script lang="ts" setup>
import { useLandingRoleStore } from '@/stores/landingRole'
import type { UserRole } from '@/types/landing'

interface Props {
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  size: 'md',
})

const roleStore = useLandingRoleStore()

const handleSelect = (role: UserRole) => {
  roleStore.setRole(role)
}
</script>

<template>
  <div
    class="inline-flex items-center p-1 rounded-full bg-gray-200/80 dark:bg-fsp-dark-surface/90 border border-gray-300/80 dark:border-fsp-dark-border backdrop-blur-md shadow-inner transition-all"
  >
    <button
      :class="[
        size === 'lg'
          ? 'px-6 py-2.5 text-sm'
          : size === 'sm'
            ? 'px-3.5 py-1 text-xs'
            : 'px-5 py-2 text-xs md:text-sm',
        roleStore.isCandidate
          ? 'bg-fsp-blue text-white shadow-[0_0_20px_rgba(64,47,255,0.45)] font-semibold scale-100'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
      ]"
      class="flex items-center gap-2 rounded-full font-medium transition-all duration-300 cursor-pointer select-none"
      type="button"
      @click="handleSelect('candidate')"
    >
      <i class="pi pi-user"></i>
      <span>Для соискателей</span>
    </button>

    <button
      :class="[
        size === 'lg'
          ? 'px-6 py-2.5 text-sm'
          : size === 'sm'
            ? 'px-3.5 py-1 text-xs'
            : 'px-5 py-2 text-xs md:text-sm',
        roleStore.isEmployer
          ? 'bg-fsp-blue text-white shadow-[0_0_20px_rgba(64,47,255,0.45)] font-semibold scale-100'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
      ]"
      class="flex items-center gap-2 rounded-full font-medium transition-all duration-300 cursor-pointer select-none"
      type="button"
      @click="handleSelect('employer')"
    >
      <i class="pi pi-building"></i>
      <span>Для компаний</span>
    </button>
  </div>
</template>
