<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCandidateProfile } from '@/composables/useCandidateProfile'
import BaseBadge from '@/components/common/BaseBadge.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
const { profile, isVerifiedFsp } = useCandidateProfile()

// Маскированное имя для анонимного режима (152-ФЗ)
const maskedName = computed(() => {
  const parts = profile.value.fullName.trim().split(' ')
  if (parts.length >= 2 && parts[1] && parts[1].length > 0) {
    return `${parts[0]} ${parts[1][0]}.`
  }
  return parts[0] || 'Соискатель'
})

const formatSalary = (val: number) => {
  return new Intl.NumberFormat('ru-RU').format(val)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Информационная плашка анонимности -->
    <div
      class="bg-blue-50/70 dark:bg-fsp-blue/10 border border-blue-200/80 dark:border-fsp-blue/20 rounded-2xl p-4 flex items-center justify-between text-xs text-blue-900 dark:text-blue-300"
    >
      <div class="flex items-center gap-2.5">
        <i class="pi pi-shield text-base text-fsp-blue"></i>
        <span>
          <strong>Режим анонимного превью:</strong> Так вашу карточку видят рекрутеры до того, как
          вы примете оффер. Ваши прямые контакты надежно скрыты (152-ФЗ).
        </span>
      </div>
      <BaseButton
        icon="pi pi-pencil"
        size="sm"
        variant="outline"
        @click="router.push('/candidate/profile/edit')"
      >
        Редактировать
      </BaseButton>
    </div>

    <!-- Основная анонимная карточка кандидата -->
    <div
      class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
    >
      <!-- Шапка карточки -->
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-fsp-dark-border"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-16 h-16 rounded-2xl bg-fsp-blue/10 text-fsp-blue flex items-center justify-center font-mono font-bold text-xl border border-fsp-blue/20"
          >
            {{ maskedName.charAt(0) }}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {{ maskedName }}
              </h2>
              <BaseBadge
                v-if="isVerifiedFsp"
                icon="pi pi-trophy"
                label="ФСП"
                size="sm"
                variant="danger"
              />
            </div>
            <div
              class="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1 flex flex-wrap items-center gap-2"
            >
              <span>{{ profile.city }}</span>
              <template v-if="profile.timezone">
                <span>•</span>
                <span>{{ profile.timezone }}</span>
              </template>
              <span>•</span>
              <span class="text-emerald-600 dark:text-emerald-400 font-semibold">
                {{ profile.experienceYears }} года коммерческого опыта
              </span>
            </div>
          </div>
        </div>

        <div class="sm:text-right">
          <div class="text-xs font-mono text-gray-400">Ожидания по ЗП</div>
          <div class="text-xl font-bold font-mono text-fsp-blue">
            от {{ formatSalary(profile.desiredSalary) }} ₽
          </div>
          <div class="text-[11px] font-mono text-gray-400 mt-0.5">на руки / нетто</div>
        </div>
      </div>

      <!-- Категория и верификация грейда -->
      <div
        class="bg-gray-50 dark:bg-fsp-dark p-4 rounded-xl border border-gray-200/60 dark:border-fsp-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <span class="text-[11px] font-mono uppercase text-gray-400 block mb-0.5">
            Подтвержденная квалификация
          </span>
          <span class="text-base font-bold text-gray-900 dark:text-white">
            {{ profile.verifiedGrade || profile.claimedGrade }} {{ profile.specialization }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <span
            class="text-xs font-mono px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20"
          >
            Тест пройден
          </span>
          <span
            v-if="profile.fspId"
            class="text-xs font-mono px-2.5 py-1 rounded-lg bg-fsp-red/10 text-fsp-red font-bold border border-fsp-red/20"
          >
            {{ profile.fspId }}
          </span>
        </div>
      </div>

      <!-- Hard Skills -->
      <div>
        <h4 class="text-xs font-mono uppercase text-gray-400 font-bold mb-3">
          Ключевой стек технологий
        </h4>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="s in profile.skills"
            :key="s"
            class="px-3 py-1.5 rounded-lg bg-fsp-blue/10 text-fsp-blue text-xs font-mono font-medium border border-fsp-blue/20"
          >
            {{ s }}
          </span>
        </div>
      </div>

      <!-- Опыт работы (анонимизированный) -->
      <div class="space-y-4">
        <h4 class="text-xs font-mono uppercase text-gray-400 font-bold">Коммерческий опыт</h4>
        <div class="space-y-3">
          <div
            v-for="exp in profile.workHistory"
            :key="exp.id"
            class="p-4 rounded-xl bg-gray-50/60 dark:bg-fsp-dark/50 border border-gray-200/60 dark:border-fsp-dark-border space-y-2"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm text-gray-900 dark:text-white">
                {{ exp.role }}
              </span>
              <span class="text-xs font-mono text-gray-400">
                {{ exp.startDate }} — {{ exp.isCurrent ? 'По н.в.' : exp.endDate }}
              </span>
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
              {{ exp.description }}
            </p>
            <div class="flex flex-wrap gap-1.5 pt-1">
              <span
                v-for="tech in exp.technologies"
                :key="tech"
                class="px-2 py-0.5 rounded text-[11px] font-mono bg-gray-200/60 dark:bg-fsp-dark-surface text-gray-700 dark:text-gray-300"
              >
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Образование и языки -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <!-- Образование -->
        <div>
          <h4 class="text-xs font-mono uppercase text-gray-400 font-bold mb-3">Образование</h4>
          <div class="space-y-2">
            <div
              v-for="edu in profile.education"
              :key="edu.id"
              class="p-3 rounded-xl bg-gray-50/60 dark:bg-fsp-dark/50 border border-gray-200/60 dark:border-fsp-dark-border text-xs space-y-1"
            >
              <div class="font-bold text-gray-900 dark:text-white">{{ edu.institution }}</div>
              <div class="text-gray-500 dark:text-gray-400">
                {{ edu.specialization }} ({{ edu.graduationYear }})
              </div>
            </div>
          </div>
        </div>

        <!-- Языки -->
        <div>
          <h4 class="text-xs font-mono uppercase text-gray-400 font-bold mb-3">
            Иностранные языки
          </h4>
          <div class="space-y-2">
            <div
              v-for="l in profile.languages"
              :key="l.id"
              class="p-3 rounded-xl bg-gray-50/60 dark:bg-fsp-dark/50 border border-gray-200/60 dark:border-fsp-dark-border flex items-center justify-between text-xs"
            >
              <span class="font-semibold text-gray-800 dark:text-gray-200">{{ l.language }}</span>
              <span class="font-mono text-fsp-blue font-bold uppercase">{{ l.level }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
