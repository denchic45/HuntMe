<script lang="ts" setup>
import { onMounted, onUnmounted, watch } from 'vue'

interface Props {
  isOpen: boolean
  title: string
  subtitle?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: '',
  maxWidth: 'md',
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

watch(
  () => props.isOpen,
  (open) => {
    if (typeof document !== 'undefined') {
      if (open) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  },
)

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeyDown)
    document.body.style.overflow = ''
  }
})

function maxWidthClass() {
  switch (props.maxWidth) {
    case 'sm':
      return 'max-w-sm'
    case 'lg':
      return 'max-w-2xl'
    case 'xl':
      return 'max-w-4xl'
    case 'md':
    default:
      return 'max-w-md'
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        aria-modal="true"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        role="dialog"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          @click="emit('close')"
        ></div>

        <!-- Modal Dialog Box -->
        <div
          :class="maxWidthClass()"
          class="relative w-full bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl shadow-xl z-10 overflow-hidden transform transition-all my-8"
        >
          <!-- Header -->
          <div
            class="flex items-start justify-between p-5 sm:p-6 border-b border-gray-100 dark:border-fsp-dark-border"
          >
            <div class="space-y-1 pr-4">
              <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                {{ title }}
              </h3>
              <p
                v-if="subtitle"
                class="text-xs text-gray-500 dark:text-gray-400 font-sans leading-relaxed"
              >
                {{ subtitle }}
              </p>
            </div>
            <button
              aria-label="Закрыть"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-fsp-dark-card transition-colors cursor-pointer shrink-0"
              type="button"
              @click="emit('close')"
            >
              <i class="pi pi-times text-sm"></i>
            </button>
          </div>

          <!-- Body -->
          <div class="p-5 sm:p-6">
            <slot />
          </div>

          <!-- Footer (optional) -->
          <div
            v-if="$slots.footer"
            class="px-5 py-4 sm:px-6 bg-gray-50/70 dark:bg-fsp-dark/50 border-t border-gray-100 dark:border-fsp-dark-border flex items-center justify-end gap-2.5"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
