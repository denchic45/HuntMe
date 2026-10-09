<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useInvites } from '@/composables/useInvites'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
const {
  filteredInvites,
  activeFilter,
  newInvitesCount,
  acceptedCount,
  declinedCount,
  acceptInvite,
  declineInvite,
  markAsViewed,
} = useInvites()

const formatSalary = (val: number) => {
  return new Intl.NumberFormat('ru-RU').format(val)
}

function handleOpenInvite(id: string) {
  markAsViewed(id)
  router.push(`/candidate/invites/${id}`)
}

function handleAccept(id: string, e: Event) {
  e.stopPropagation()
  acceptInvite(id)
}

function handleDecline(id: string, e: Event) {
  e.stopPropagation()
  declineInvite(id)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Информационная плашка с правилами офферов -->
    <div
      class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div class="space-y-1">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>Входящие предложения от работодателей</span>
          <span
            v-if="newInvitesCount > 0"
            class="px-2 py-0.5 rounded-full bg-fsp-red/10 text-fsp-red text-xs font-mono font-bold"
          >
            {{ newInvitesCount }} новых
          </span>
        </h2>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Все предложения содержат обязательную открытую вилку заработной платы в рублях РФ (нетто).
        </p>
      </div>

      <div
        class="flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-fsp-dark px-3 py-1.5 rounded-xl border border-gray-200/60 dark:border-fsp-dark-border"
      >
        <i class="pi pi-lock text-fsp-blue"></i>
        <span>Контакты скрыты до принятия</span>
      </div>
    </div>

    <!-- Фильтр по статусам предложений -->
    <div
      class="flex items-center gap-2 border-b border-gray-200 dark:border-fsp-dark-border pb-3 overflow-x-auto"
    >
      <button
        :class="[
          'px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer shrink-0',
          activeFilter === 'all'
            ? 'bg-fsp-blue text-white shadow-xs font-bold'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-fsp-dark-surface',
        ]"
        type="button"
        @click="activeFilter = 'all'"
      >
        Все предложения
      </button>

      <button
        :class="[
          'px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 shrink-0',
          activeFilter === 'received'
            ? 'bg-fsp-blue text-white shadow-xs font-bold'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-fsp-dark-surface',
        ]"
        type="button"
        @click="activeFilter = 'received'"
      >
        <span>Новые</span>
        <span
          v-if="newInvitesCount > 0"
          :class="[
            'px-1.5 py-0.2 rounded-full text-[10px] font-bold',
            activeFilter === 'received' ? 'bg-white/20 text-white' : 'bg-fsp-red/10 text-fsp-red',
          ]"
        >
          {{ newInvitesCount }}
        </span>
      </button>

      <button
        :class="[
          'px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 shrink-0',
          activeFilter === 'accepted'
            ? 'bg-fsp-blue text-white shadow-xs font-bold'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-fsp-dark-surface',
        ]"
        type="button"
        @click="activeFilter = 'accepted'"
      >
        <span>Принятые</span>
        <span v-if="acceptedCount > 0" class="text-[10px] opacity-70">({{ acceptedCount }})</span>
      </button>

      <button
        :class="[
          'px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 shrink-0',
          activeFilter === 'declined'
            ? 'bg-fsp-blue text-white shadow-xs font-bold'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-fsp-dark-surface',
        ]"
        type="button"
        @click="activeFilter = 'declined'"
      >
        <span>Отклоненные</span>
        <span v-if="declinedCount > 0" class="text-[10px] opacity-70">({{ declinedCount }})</span>
      </button>
    </div>

    <!-- Список предложений -->
    <div v-if="filteredInvites.length > 0" class="space-y-4">
      <div
        v-for="inv in filteredInvites"
        :key="inv.id"
        class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 shadow-xs hover:border-fsp-blue/50 dark:hover:border-fsp-blue/50 transition-all cursor-pointer group space-y-4"
        @click="handleOpenInvite(inv.id)"
      >
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono text-gray-500 dark:text-gray-400">
                {{ inv.companyName }}
              </span>
              <span>•</span>
              <span class="text-xs font-mono text-gray-400">
                {{ inv.industry }}
              </span>
              <span
                v-if="inv.status === 'received'"
                class="px-2 py-0.5 rounded-full bg-fsp-red/10 text-fsp-red text-[11px] font-mono font-bold"
              >
                Новый оффер
              </span>
              <span
                v-else-if="inv.status === 'accepted'"
                class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono font-bold"
              >
                Принято
              </span>
              <span
                v-else-if="inv.status === 'declined'"
                class="px-2 py-0.5 rounded-full bg-gray-200 dark:bg-fsp-dark text-gray-500 text-[11px] font-mono"
              >
                Отклонено
              </span>
            </div>

            <h3
              class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-fsp-blue transition-colors"
            >
              {{ inv.position }}
            </h3>
          </div>

          <!-- Обязательная вилка ЗП в рублях -->
          <div class="sm:text-right shrink-0">
            <div class="text-xs font-mono text-gray-400">Зарплатная вилка</div>
            <div class="text-xl font-bold font-mono text-fsp-blue">
              {{ formatSalary(inv.salaryFrom) }} — {{ formatSalary(inv.salaryTo) }} ₽
            </div>
            <div class="text-[11px] font-mono text-gray-400">нетто / на руки</div>
          </div>
        </div>

        <p class="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed font-sans">
          {{ inv.description }}
        </p>

        <!-- Требуемый стек -->
        <div
          class="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-fsp-dark-border"
        >
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="tech in inv.requiredStack"
              :key="tech"
              class="px-2.5 py-1 rounded-lg text-xs font-mono bg-gray-100 dark:bg-fsp-dark text-gray-700 dark:text-gray-300"
            >
              {{ tech }}
            </span>
          </div>

          <!-- Кнопки действий -->
          <div class="flex items-center gap-2" @click.stop>
            <template v-if="inv.status !== 'accepted' && inv.status !== 'declined'">
              <BaseButton
                icon="pi pi-check"
                size="sm"
                variant="primary"
                @click="handleAccept(inv.id, $event)"
              >
                Принять
              </BaseButton>
              <BaseButton
                icon="pi pi-times"
                size="sm"
                variant="outline"
                @click="handleDecline(inv.id, $event)"
              >
                Отклонить
              </BaseButton>
            </template>
            <BaseButton
              icon="pi pi-arrow-right"
              size="sm"
              variant="ghost"
              @click="handleOpenInvite(inv.id)"
            >
              Подробнее
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Пустое состояние -->
    <div
      v-else
      class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-12 text-center space-y-3"
    >
      <div
        class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-fsp-dark text-gray-400 flex items-center justify-center mx-auto text-xl"
      >
        <i class="pi pi-inbox"></i>
      </div>
      <h3 class="text-base font-bold text-gray-900 dark:text-white">
        В этой категории нет предложений
      </h3>
      <p class="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
        Когда компании отправят вам персональные офферы, они отобразятся здесь с открытыми вилками
        зарплат.
      </p>
    </div>
  </div>
</template>
