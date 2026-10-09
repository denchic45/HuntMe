<script lang="ts" setup>
import { ref } from 'vue'
import { useCandidateProfile } from '@/composables/useCandidateProfile'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'

const { profile, isSearchActive, toggleSearchStatus, resetToMock } = useCandidateProfile()

const resetNotice = ref(false)

function handleReset() {
  if (confirm('Сбросить данные профиля к исходным демонстрационным значениям?')) {
    resetToMock()
    resetNotice.value = true
    setTimeout(() => {
      resetNotice.value = false
    }, 3000)
  }
}
</script>

<template>
  <div class="max-w-4xl space-y-6">
    <!-- 1. Настройки приватности и 152-ФЗ -->
    <div
      class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 sm:p-8 shadow-xs space-y-6"
    >
      <div class="space-y-1 pb-4 border-b border-gray-100 dark:border-fsp-dark-border">
        <div class="flex items-center gap-2">
          <i class="pi pi-shield text-fsp-blue text-lg"></i>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            Приватность и персональные данные (152-ФЗ)
          </h3>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Управление режимом видимости профиля и двухконтурной моделью защиты данных
        </p>
      </div>

      <!-- Переключатель видимости в поиске -->
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 dark:bg-fsp-dark border border-gray-200/60 dark:border-fsp-dark-border"
      >
        <div class="space-y-0.5">
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-gray-900 dark:text-white">
              Видимость профиля для работодателей
            </span>
            <BaseBadge
              :label="isSearchActive ? 'Активен' : 'Скрыт'"
              :variant="isSearchActive ? 'primary' : 'neutral'"
              size="sm"
            />
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 font-sans">
            {{
              isSearchActive
                ? 'Ваш анонимный профиль ранжируется в базе соискателей. Компании могут отправлять вам офферы.'
                : 'Профиль временно исключен из выдачи поиска работодателей.'
            }}
          </p>
        </div>

        <BaseButton
          :icon="isSearchActive ? 'pi pi-eye-slash' : 'pi pi-eye'"
          size="sm"
          variant="outline"
          @click="toggleSearchStatus"
        >
          {{ isSearchActive ? 'Приостановить поиск' : 'Возобновить поиск' }}
        </BaseButton>
      </div>

      <!-- Статус согласия 152-ФЗ -->
      <div class="space-y-2 text-xs">
        <div
          class="flex items-center justify-between p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 font-mono"
        >
          <div class="flex items-center gap-2">
            <i class="pi pi-check-circle"></i>
            <span>Согласие на обработку персональных данных принято</span>
          </div>
          <span class="font-bold">Версия 2.4 (2026)</span>
        </div>
        <p class="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
          Все прямые контакты (email, телефон, Telegram) надежно зашифрованы и раскрываются
          рекрутерам только после явного нажатия кнопки «Принять предложение».
        </p>
      </div>
    </div>

    <!-- 2. Безопасность и сессии -->
    <div
      class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 sm:p-8 shadow-xs space-y-6"
    >
      <div class="space-y-1 pb-4 border-b border-gray-100 dark:border-fsp-dark-border">
        <div class="flex items-center gap-2">
          <i class="pi pi-lock text-fsp-blue text-lg"></i>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            Безопасность и авторизация
          </h3>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Управление паролем и активными сессиями
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-mono text-gray-400 mb-1">Email учетной записи</label>
          <input
            :value="profile.contacts.email"
            class="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-gray-100 dark:bg-fsp-dark text-sm font-mono text-gray-500 cursor-not-allowed"
            disabled
            type="email"
          />
        </div>

        <div>
          <label class="block text-xs font-mono text-gray-400 mb-1">Смена пароля</label>
          <BaseButton class="w-full justify-center" size="md" variant="outline">
            Запросить сброс пароля
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- 3. Демо-управление -->
    <div
      class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 shadow-xs flex items-center justify-between"
    >
      <div>
        <h4 class="text-sm font-bold text-gray-900 dark:text-white">
          Сброс к демонстрационным данным
        </h4>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Сбросить все сохраненные изменения в браузере к исходному профилю ФСП
        </p>
      </div>

      <BaseButton icon="pi pi-refresh" size="sm" variant="outline" @click="handleReset">
        Сбросить моки
      </BaseButton>
    </div>

    <div
      v-if="resetNotice"
      class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono text-center"
    >
      ✓ Профиль соискателя успешно сброшен к исходным мокам!
    </div>
  </div>
</template>
