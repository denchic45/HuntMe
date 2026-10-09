<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useCandidateProfile } from '@/composables/useCandidateProfile'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseModal from '@/components/common/BaseModal.vue'

type ContactType = 'phone' | 'email' | 'telegram' | 'github'

const { profile, updatePersonal, updateContacts } = useCandidateProfile()

const city = ref(profile.value.city)
const isCitySaved = ref(false)

// Состояние модального окна редактирования контактов
const isModalOpen = ref(false)
const activeContactType = ref<ContactType>('phone')
const modalInputValue = ref('')
const modalError = ref<string | null>(null)
const isSavedFeedback = ref(false)

const contactConfig = computed(() => {
  switch (activeContactType.value) {
    case 'phone':
      return {
        title: 'Редактирование номера телефона',
        subtitle: 'Номер телефона будет виден работодателям только после взаимного отклика',
        label: 'Номер телефона',
        placeholder: '+7 (999) 000-00-00',
        inputType: 'tel',
        icon: 'pi pi-phone',
        hint: 'Формат: +7 (999) 000-00-00 или международный формат',
      }
    case 'email':
      return {
        title: 'Редактирование адреса почты',
        subtitle: 'Email используется для получения официальных офферов и уведомлений',
        label: 'Электронная почта',
        placeholder: 'developer@huntme.dev',
        inputType: 'email',
        icon: 'pi pi-envelope',
        hint: 'Укажите действующий адрес электронной почты',
      }
    case 'telegram':
      return {
        title: 'Редактирование Telegram',
        subtitle: 'Имя пользователя Telegram для оперативной связи с рекрутерами',
        label: 'Имя пользователя или ссылка',
        placeholder: '@username',
        inputType: 'text',
        icon: 'pi pi-send',
        hint: 'Например, @my_telegram или t.me/my_telegram',
      }
    case 'github':
    default:
      return {
        title: 'Редактирование ссылки на Git',
        subtitle: 'Ссылка на репозитории с вашим кодом (GitHub, GitLab, GitVerse)',
        label: 'Ссылка на Git-профиль',
        placeholder: 'https://github.com/username',
        inputType: 'url',
        icon: 'pi pi-github',
        hint: 'Полная ссылка на ваш публичный профиль разработчика',
      }
  }
})

function handleSaveCity() {
  updatePersonal({
    city: city.value.trim(),
  })
  isCitySaved.value = true
  setTimeout(() => {
    isCitySaved.value = false
  }, 2500)
}

function openEditContactModal(type: ContactType) {
  activeContactType.value = type
  modalError.value = null

  switch (type) {
    case 'phone':
      modalInputValue.value = profile.value.contacts.phone || ''
      break
    case 'email':
      modalInputValue.value = profile.value.contacts.email || ''
      break
    case 'telegram':
      modalInputValue.value = profile.value.contacts.telegram || ''
      break
    case 'github':
      modalInputValue.value = profile.value.contacts.github || ''
      break
  }

  isModalOpen.value = true
}

function handleSaveContact() {
  modalError.value = null
  const value = modalInputValue.value.trim()

  if (activeContactType.value === 'email') {
    if (!value || !value.includes('@') || !value.includes('.')) {
      modalError.value = 'Пожалуйста, введите корректный адрес электронной почты'
      return
    }
  }

  if (activeContactType.value === 'phone' && value) {
    const digits = value.replace(/\D/g, '')
    if (digits.length < 10) {
      modalError.value = 'Номер телефона должен содержать минимум 10 цифр'
      return
    }
  }

  let finalValue = value
  if (activeContactType.value === 'telegram' && value) {
    if (!value.startsWith('@') && !value.includes('/')) {
      finalValue = `@${value}`
    }
  }

  if (activeContactType.value === 'github' && value) {
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      finalValue = `https://${value}`
    }
  }

  // Обновляем данные контакта в профиле
  switch (activeContactType.value) {
    case 'phone':
      updateContacts({ phone: finalValue })
      break
    case 'email':
      updateContacts({ email: finalValue })
      break
    case 'telegram':
      updateContacts({ telegram: finalValue })
      break
    case 'github':
      updateContacts({ github: finalValue })
      break
  }

  isModalOpen.value = false
  isSavedFeedback.value = true
  setTimeout(() => {
    isSavedFeedback.value = false
  }, 2500)
}
</script>

<template>
  <div
    class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 shadow-xs space-y-6"
  >
    <!-- Заголовок раздела -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-fsp-dark-border"
    >
      <div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Личные и контактные данные</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Прямые контакты защищены и раскрываются работодателям только при подтверждении взаимного
          интереса (152-ФЗ)
        </p>
      </div>
      <div
        v-if="isSavedFeedback || isCitySaved"
        class="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 self-start sm:self-auto"
      >
        <i class="pi pi-check-circle"></i>
        <span>Изменения сохранены</span>
      </div>
    </div>

    <!-- Основные данные: Город проживания (без ФИО) -->
    <div class="max-w-md">
      <label class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        Город проживания *
      </label>
      <div class="flex items-center gap-2">
        <div class="relative flex-1">
          <i
            class="pi pi-map-marker absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
          ></i>
          <input
            v-model="city"
            class="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-gray-50 dark:bg-fsp-dark text-sm focus:outline-none focus:border-fsp-blue text-gray-900 dark:text-white transition-colors"
            placeholder="Москва, Санкт-Петербург, Новосибирск..."
            type="text"
            @keyup.enter="handleSaveCity"
          />
        </div>
        <BaseButton
          :disabled="city.trim() === profile.city"
          size="sm"
          variant="primary"
          @click="handleSaveCity"
        >
          Сохранить
        </BaseButton>
      </div>
    </div>

    <!-- Контактные данные в виде интерактивных плашек -->
    <div class="space-y-3 pt-2">
      <div class="flex items-center justify-between">
        <h4
          class="text-xs font-mono font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
        >
          Контакты
        </h4>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <!-- 1. Плашка телефона -->
        <button
          aria-label="Редактировать номер телефона"
          class="group p-4 rounded-xl border border-gray-200/90 dark:border-fsp-dark-border bg-gray-50/50 dark:bg-fsp-dark hover:border-fsp-blue/60 dark:hover:border-fsp-blue/60 hover:bg-white dark:hover:bg-fsp-dark-surface transition-all text-left flex items-start gap-3.5 cursor-pointer shadow-2xs hover:shadow-sm"
          type="button"
          @click="openEditContactModal('phone')"
        >
          <div
            class="w-10 h-10 rounded-xl bg-blue-500/10 text-fsp-blue dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
          >
            <i class="pi pi-phone text-base"></i>
          </div>
          <div class="min-w-0 flex-1">
            <span class="block text-[11px] font-mono text-gray-400 dark:text-gray-500">
              Телефон
            </span>
            <p
              :class="
                profile.contacts.phone
                  ? 'text-gray-900 dark:text-white font-medium font-mono'
                  : 'text-gray-400 dark:text-gray-500 italic'
              "
              class="text-xs sm:text-sm truncate mt-0.5"
            >
              {{ profile.contacts.phone || 'Не указан' }}
            </p>
          </div>
          <i
            class="pi pi-pencil text-xs text-gray-300 dark:text-gray-600 group-hover:text-fsp-blue transition-colors mt-1"
          ></i>
        </button>

        <!-- 2. Плашка Email -->
        <button
          aria-label="Редактировать электронную почту"
          class="group p-4 rounded-xl border border-gray-200/90 dark:border-fsp-dark-border bg-gray-50/50 dark:bg-fsp-dark hover:border-fsp-blue/60 dark:hover:border-fsp-blue/60 hover:bg-white dark:hover:bg-fsp-dark-surface transition-all text-left flex items-start gap-3.5 cursor-pointer shadow-2xs hover:shadow-sm"
          type="button"
          @click="openEditContactModal('email')"
        >
          <div
            class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
          >
            <i class="pi pi-envelope text-base"></i>
          </div>
          <div class="min-w-0 flex-1">
            <span class="block text-[11px] font-mono text-gray-400 dark:text-gray-500">
              Почта
            </span>
            <p
              :class="
                profile.contacts.email
                  ? 'text-gray-900 dark:text-white font-medium'
                  : 'text-gray-400 dark:text-gray-500 italic'
              "
              class="text-xs sm:text-sm truncate mt-0.5"
            >
              {{ profile.contacts.email || 'Не указан' }}
            </p>
          </div>
          <i
            class="pi pi-pencil text-xs text-gray-300 dark:text-gray-600 group-hover:text-fsp-blue transition-colors mt-1"
          ></i>
        </button>

        <!-- 3. Плашка Telegram -->
        <button
          aria-label="Редактировать Telegram"
          class="group p-4 rounded-xl border border-gray-200/90 dark:border-fsp-dark-border bg-gray-50/50 dark:bg-fsp-dark hover:border-fsp-blue/60 dark:hover:border-fsp-blue/60 hover:bg-white dark:hover:bg-fsp-dark-surface transition-all text-left flex items-start gap-3.5 cursor-pointer shadow-2xs hover:shadow-sm"
          type="button"
          @click="openEditContactModal('telegram')"
        >
          <div
            class="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 dark:text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
          >
            <i class="pi pi-send text-base"></i>
          </div>
          <div class="min-w-0 flex-1">
            <span class="block text-[11px] font-mono text-gray-400 dark:text-gray-500">
              Telegram
            </span>
            <p
              :class="
                profile.contacts.telegram
                  ? 'text-gray-900 dark:text-white font-medium font-mono'
                  : 'text-gray-400 dark:text-gray-500 italic'
              "
              class="text-xs sm:text-sm truncate mt-0.5"
            >
              {{ profile.contacts.telegram || 'Не указан' }}
            </p>
          </div>
          <i
            class="pi pi-pencil text-xs text-gray-300 dark:text-gray-600 group-hover:text-fsp-blue transition-colors mt-1"
          ></i>
        </button>

        <!-- 4. Плашка GitHub / GitLab -->
        <button
          aria-label="Редактировать ссылку на Git"
          class="group p-4 rounded-xl border border-gray-200/90 dark:border-fsp-dark-border bg-gray-50/50 dark:bg-fsp-dark hover:border-fsp-blue/60 dark:hover:border-fsp-blue/60 hover:bg-white dark:hover:bg-fsp-dark-surface transition-all text-left flex items-start gap-3.5 cursor-pointer shadow-2xs hover:shadow-sm"
          type="button"
          @click="openEditContactModal('github')"
        >
          <div
            class="w-10 h-10 rounded-xl bg-gray-500/10 text-gray-700 dark:text-gray-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
          >
            <i class="pi pi-github text-base"></i>
          </div>
          <div class="min-w-0 flex-1">
            <span class="block text-[11px] font-mono text-gray-400 dark:text-gray-500">
              Git профиль
            </span>
            <p
              :class="
                profile.contacts.github
                  ? 'text-gray-900 dark:text-white font-medium font-mono'
                  : 'text-gray-400 dark:text-gray-500 italic'
              "
              class="text-xs sm:text-sm truncate mt-0.5"
            >
              {{
                profile.contacts.github
                  ? profile.contacts.github.replace(/^https?:\/\//, '')
                  : 'Не указан'
              }}
            </p>
          </div>
          <i
            class="pi pi-pencil text-xs text-gray-300 dark:text-gray-600 group-hover:text-fsp-blue transition-colors mt-1"
          ></i>
        </button>
      </div>
    </div>

    <!-- Модальное окно редактирования выбранного контакта -->
    <BaseModal
      :is-open="isModalOpen"
      :subtitle="contactConfig.subtitle"
      :title="contactConfig.title"
      max-width="md"
      @close="isModalOpen = false"
    >
      <form class="space-y-4" @submit.prevent="handleSaveContact">
        <div>
          <label
            class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            {{ contactConfig.label }} *
          </label>
          <div class="relative">
            <i
              :class="contactConfig.icon"
              class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
            ></i>
            <input
              v-model="modalInputValue"
              :placeholder="contactConfig.placeholder"
              :type="contactConfig.inputType"
              autofocus
              class="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-gray-50 dark:bg-fsp-dark text-sm focus:outline-none focus:border-fsp-blue text-gray-900 dark:text-white font-mono transition-colors"
            />
          </div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 font-sans mt-1.5">
            {{ contactConfig.hint }}
          </p>
        </div>

        <div
          v-if="modalError"
          class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2"
        >
          <i class="pi pi-exclamation-circle shrink-0"></i>
          <span>{{ modalError }}</span>
        </div>
      </form>

      <template #footer>
        <BaseButton size="sm" variant="ghost" @click="isModalOpen = false"> Отмена </BaseButton>
        <BaseButton icon="pi pi-check" size="sm" variant="primary" @click="handleSaveContact">
          Сохранить
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>
