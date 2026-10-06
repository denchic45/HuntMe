<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glow'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  iconPos?: 'left' | 'right'
  disabled?: boolean
  loading?: boolean
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  icon: '',
  iconPos: 'left',
  disabled: false,
  loading: false,
  block: false,
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-fsp-blue hover:bg-fsp-blue-hover text-white shadow-md hover:shadow-lg shadow-fsp-blue/20'
    case 'secondary':
      return 'bg-fsp-dark-surface hover:bg-fsp-dark-card text-white border border-fsp-dark-border'
    case 'outline':
      return 'border border-gray-300 dark:border-fsp-dark-border text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-fsp-dark-surface'
    case 'glow':
      return 'bg-white text-fsp-dark hover:bg-gray-100 shadow-[0_0_20px_rgba(255,255,255,0.4)] font-bold'
    case 'ghost':
    default:
      return 'text-gray-600 dark:text-gray-300 hover:text-fsp-blue dark:hover:text-white hover:bg-transparent'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3.5 py-1.5 text-xs rounded-lg gap-1.5'
    case 'lg':
      return 'px-7 py-3.5 text-base rounded-xl gap-2.5 font-semibold'
    case 'md':
    default:
      return 'px-5 py-2.5 text-sm rounded-xl gap-2 font-medium'
  }
})

const handleClick = (e: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', e)
  }
}
</script>

<template>
  <button
    :class="[variantClasses, sizeClasses, { 'w-full': block }]"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]"
    type="button"
    @click="handleClick"
  >
    <i v-if="loading" class="pi pi-spinner pi-spin"></i>
    <template v-else>
      <i v-if="icon && iconPos === 'left'" :class="icon"></i>
      <slot />
      <i v-if="icon && iconPos === 'right'" :class="icon"></i>
    </template>
  </button>
</template>
