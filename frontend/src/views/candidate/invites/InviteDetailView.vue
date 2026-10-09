<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInvites } from '@/composables/useInvites'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'

const route = useRoute()
const router = useRouter()
const { getInviteById, acceptInvite, declineInvite } = useInvites()

const inviteId = computed(() => route.params.id as string)
const invite = computed(() => getInviteById(inviteId.value))

const formatSalary = (val: number) => {
  return new Intl.NumberFormat('ru-RU').format(val)
}

function handleAccept() {
  if (invite.value) {
    acceptInvite(invite.value.id)
  }
}

function handleDecline() {
  if (invite.value) {
    declineInvite(invite.value.id)
  }
}

function goBack() {
  router.push('/candidate/invites')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Кнопка возврата к списку -->
    <div>
      <BaseButton icon="pi pi-arrow-left" size="sm" variant="ghost" @click="goBack">
        Все предложения
      </BaseButton>
    </div>

    <!-- Если оффер не найден -->
    <div
      v-if="!invite"
      class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-12 text-center space-y-3"
    >
      <i class="pi pi-exclamation-circle text-2xl text-amber-500"></i>
      <h3 class="text-base font-bold text-gray-900 dark:text-white">Предложение не найдено</h3>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        Возможно, оно было отозвано работодателем или удалено.
      </p>
      <BaseButton size="sm" variant="outline" @click="goBack"> Вернуться в список </BaseButton>
    </div>

    <!-- Детали предложения -->
    <div v-else class="space-y-6">
      <!-- Верхний баннер оффера -->
      <div
        class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 sm:p-8 shadow-xs space-y-6"
      >
        <div
          class="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-gray-100 dark:border-fsp-dark-border"
        >
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-fsp-blue font-mono">
                {{ invite.companyName }}
              </span>
              <span>•</span>
              <span class="text-xs font-mono text-gray-500 dark:text-gray-400">
                {{ invite.industry }}
              </span>
              <BaseBadge
                v-if="invite.status === 'accepted'"
                label="Принято"
                size="sm"
                variant="primary"
              />
              <BaseBadge
                v-else-if="invite.status === 'declined'"
                label="Отклонено"
                size="sm"
                variant="neutral"
              />
              <BaseBadge v-else label="Новый оффер" size="sm" variant="danger" />
            </div>

            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {{ invite.position }}
            </h2>

            <div class="text-xs font-mono text-gray-400">Получено {{ invite.sentAt }}</div>
          </div>

          <!-- Вилка ЗП в рублях -->
          <div
            class="bg-gray-50 dark:bg-fsp-dark p-4 rounded-xl border border-gray-200/60 dark:border-fsp-dark-border sm:text-right shrink-0"
          >
            <div class="text-xs font-mono text-gray-400">Официальная вилка ЗП</div>
            <div class="text-2xl font-bold font-mono text-fsp-blue">
              {{ formatSalary(invite.salaryFrom) }} — {{ formatSalary(invite.salaryTo) }} ₽
            </div>
            <div class="text-[11px] font-mono text-gray-400 mt-0.5">в месяц • нетто / на руки</div>
          </div>
        </div>

        <!-- Описание вакансии и проекта -->
        <div class="space-y-3">
          <h4 class="text-xs font-mono uppercase text-gray-400 font-bold">О проекте и задачах</h4>
          <p
            class="text-sm text-gray-700 dark:text-gray-200 leading-relaxed font-sans whitespace-pre-line"
          >
            {{ invite.description }}
          </p>
        </div>

        <!-- Требуемый технологический стек -->
        <div class="space-y-3">
          <h4 class="text-xs font-mono uppercase text-gray-400 font-bold">
            Технологический стек проекта
          </h4>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tech in invite.requiredStack"
              :key="tech"
              class="px-3 py-1.5 rounded-lg text-xs font-mono bg-fsp-blue/10 text-fsp-blue font-medium border border-fsp-blue/20"
            >
              {{ tech }}
            </span>
          </div>
        </div>

        <!-- Панель действий: Принять / Отклонить -->
        <div
          v-if="invite.status !== 'accepted' && invite.status !== 'declined'"
          class="flex flex-wrap items-center gap-3 pt-6 border-t border-gray-100 dark:border-fsp-dark-border"
        >
          <BaseButton icon="pi pi-check" size="md" variant="primary" @click="handleAccept">
            Принять предложение
          </BaseButton>

          <BaseButton icon="pi pi-times" size="md" variant="outline" @click="handleDecline">
            Отклонить предложение
          </BaseButton>
        </div>
      </div>

      <!-- Контактная карточка рекрутера (152-ФЗ контур) -->
      <div
        class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 sm:p-8 shadow-xs space-y-4"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl bg-fsp-blue/10 text-fsp-blue flex items-center justify-center"
          >
            <i class="pi pi-user text-base"></i>
          </div>
          <div>
            <h3 class="text-base font-bold text-gray-900 dark:text-white">
              Контакты рекрутера и команды
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Двухконтурная модель защиты данных (152-ФЗ)
            </p>
          </div>
        </div>

        <!-- Если оффер принят: контакты раскрыты -->
        <div
          v-if="invite.contactsRevealed && invite.recruiterContacts"
          class="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5 space-y-3"
        >
          <div
            class="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold"
          >
            <i class="pi pi-lock-open"></i>
            <span>Контакты взаимно раскрыты</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div>
              <span class="text-[11px] font-mono text-gray-400 block">Рекрутер</span>
              <span class="text-sm font-bold text-gray-900 dark:text-white">{{
                invite.recruiterContacts.name
              }}</span>
              <span class="text-xs text-gray-500 block">{{ invite.recruiterContacts.role }}</span>
            </div>

            <div>
              <span class="text-[11px] font-mono text-gray-400 block">Email</span>
              <a
                :href="`mailto:${invite.recruiterContacts.email}`"
                class="text-sm font-mono text-fsp-blue hover:underline"
              >
                {{ invite.recruiterContacts.email }}
              </a>
            </div>

            <div v-if="invite.recruiterContacts.telegram">
              <span class="text-[11px] font-mono text-gray-400 block">Telegram</span>
              <span class="text-sm font-mono text-gray-900 dark:text-white">{{
                invite.recruiterContacts.telegram
              }}</span>
            </div>

            <div v-if="invite.recruiterContacts.phone">
              <span class="text-[11px] font-mono text-gray-400 block">Телефон</span>
              <span class="text-sm font-mono text-gray-900 dark:text-white">{{
                invite.recruiterContacts.phone
              }}</span>
            </div>
          </div>
        </div>

        <!-- Если контакты еще скрыты -->
        <div
          v-else
          class="bg-gray-50 dark:bg-fsp-dark border border-gray-200/60 dark:border-fsp-dark-border rounded-xl p-5 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300"
        >
          <div class="flex items-center gap-3">
            <i class="pi pi-lock text-base text-gray-400"></i>
            <span>
              Контакты рекрутера и ваши личные данные скрыты. Чтобы связаться напрямую и перейти к
              собеседованию, нажмите <strong>«Принять предложение»</strong> выше.
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
