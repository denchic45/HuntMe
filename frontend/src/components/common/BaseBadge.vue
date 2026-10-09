<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  label: string
  variant?: 'primary' | 'danger' | 'neutral' | 'outline' | 'glow'
  size?: 'sm' | 'md'
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'sm',
  icon: '',
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-fsp-blue/15 text-fsp-blue border-fsp-blue/30 dark:bg-fsp-blue/25 dark:text-blue-300 dark:border-fsp-blue/50'
    case 'danger':
      return 'bg-fsp-red/15 text-fsp-red border-fsp-red/30 dark:bg-fsp-red/25 dark:text-red-300 dark:border-fsp-red/50'
    case 'glow':
      return 'bg-gradient-to-r from-fsp-blue/15 via-purple-500/15 to-fsp-red/15 text-fsp-blue dark:text-blue-200 border-fsp-blue/30 dark:border-fsp-blue/50 font-semibold shadow-[0_0_15px_rgba(64,47,255,0.2)]'
    case 'outline':
      return 'bg-transparent text-gray-700 border-gray-300 dark:text-gray-300 dark:border-fsp-dark-border'
    case 'neutral':
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-fsp-dark-surface dark:text-gray-200 dark:border-fsp-dark-border'
  }
})

const sizeClasses = computed(() => {
  return props.size === 'md'
    ? 'px-3.5 py-1.5 text-xs sm:text-sm font-semibold'
    : 'px-3 py-1 text-xs font-medium'
})
</script>

<template>
  <span
    :class="[variantClasses, sizeClasses]"
    class="inline-flex items-center gap-1.5 rounded-full border font-mono tracking-wide transition-all"
  >
    <i v-if="icon" :class="icon" class="text-xs"></i>
    <span>{{ label }}</span>
  </span>
</template>
