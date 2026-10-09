<script lang="ts" setup>
import { ref } from 'vue'
import { useCandidateProfile } from '@/composables/useCandidateProfile'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import type { EducationItem, EducationLevel } from '@/types/candidate'

const { profile, addEducation, updateEducation, removeEducation } = useCandidateProfile()

// Состояние формы добавления
const isAdding = ref(false)
const institution = ref('')
const faculty = ref('')
const specialization = ref('')
const graduationYear = ref<number>(new Date().getFullYear())
const level = ref<EducationLevel>('bachelor')

// Состояние модального окна редактирования
const isEditingModalOpen = ref(false)
const editingId = ref<string | null>(null)
const editInstitution = ref('')
const editFaculty = ref('')
const editSpecialization = ref('')
const editGraduationYear = ref<number>(new Date().getFullYear())
const editLevel = ref<EducationLevel>('bachelor')

const levelLabels: Record<EducationLevel, string> = {
  secondary: 'Среднее специальное',
  incomplete_higher: 'Неоконченное высшее',
  bachelor: 'Высшее (Бакалавриат)',
  master: 'Высшее (Магистратура)',
  specialist: 'Высшее (Специалитет)',
  phd: 'Ученая степень (Кандидат / Доктор наук)',
}

function handleAdd() {
  if (!institution.value.trim() || !specialization.value.trim()) return

  addEducation({
    institution: institution.value.trim(),
    faculty: faculty.value.trim() || undefined,
    specialization: specialization.value.trim(),
    graduationYear: graduationYear.value || new Date().getFullYear(),
    level: level.value,
  })

  // Сброс формы добавления
  institution.value = ''
  faculty.value = ''
  specialization.value = ''
  graduationYear.value = new Date().getFullYear()
  level.value = 'bachelor'
  isAdding.value = false
}

function openEditModal(item: EducationItem) {
  editingId.value = item.id
  editInstitution.value = item.institution
  editFaculty.value = item.faculty || ''
  editSpecialization.value = item.specialization
  editGraduationYear.value = item.graduationYear
  editLevel.value = item.level
  isEditingModalOpen.value = true
}

function handleSaveEdit() {
  if (!editingId.value) return
  if (!editInstitution.value.trim() || !editSpecialization.value.trim()) return

  updateEducation(editingId.value, {
    institution: editInstitution.value.trim(),
    faculty: editFaculty.value.trim() || undefined,
    specialization: editSpecialization.value.trim(),
    graduationYear: editGraduationYear.value || new Date().getFullYear(),
    level: editLevel.value,
  })

  isEditingModalOpen.value = false
  editingId.value = null
}
</script>

<template>
  <div
    class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 shadow-xs space-y-6"
  >
    <div
      class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-fsp-dark-border"
    >
      <div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Образование и квалификация</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Укажите высшее, среднее специальное образование или курсы
        </p>
      </div>

      <BaseButton
        v-if="!isAdding"
        icon="pi pi-plus"
        size="sm"
        variant="outline"
        @click="isAdding = true"
      >
        Добавить
      </BaseButton>
    </div>

    <!-- Список добавленных записей образования -->
    <div v-if="profile.education.length > 0" class="space-y-3">
      <div
        v-for="item in profile.education"
        :key="item.id"
        class="p-4 rounded-xl bg-gray-50 dark:bg-fsp-dark border border-gray-200/60 dark:border-fsp-dark-border flex items-start justify-between gap-4 transition-colors"
      >
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span
              class="text-xs font-mono font-bold text-fsp-blue bg-fsp-blue/10 dark:bg-fsp-blue/20 px-2.5 py-0.5 rounded-full"
            >
              {{ levelLabels[item.level] }}
            </span>
            <span class="text-xs font-mono text-gray-400">
              Выпуск: {{ item.graduationYear }} г.
            </span>
          </div>

          <h4 class="font-bold text-sm text-gray-900 dark:text-white">
            {{ item.institution }}
          </h4>
          <p class="text-xs text-gray-600 dark:text-gray-300">
            {{ item.specialization }} <span v-if="item.faculty">({{ item.faculty }})</span>
          </p>
        </div>

        <!-- Кнопки действий: Редактировать и Удалить -->
        <div class="flex items-center gap-1 shrink-0">
          <button
            aria-label="Редактировать образование"
            class="text-gray-400 hover:text-fsp-blue p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-fsp-dark-surface cursor-pointer transition-colors"
            title="Редактировать запись"
            type="button"
            @click="openEditModal(item)"
          >
            <i class="pi pi-pencil text-sm"></i>
          </button>
          <button
            aria-label="Удалить образование"
            class="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-fsp-dark-surface cursor-pointer transition-colors"
            title="Удалить запись"
            type="button"
            @click="removeEducation(item.id)"
          >
            <i class="pi pi-trash text-sm"></i>
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-6 text-xs text-gray-400 font-mono">
      Записи об образовании пока не добавлены
    </div>

    <!-- Форма добавления нового образования -->
    <div
      v-if="isAdding"
      class="p-5 rounded-xl border border-fsp-blue/30 bg-fsp-blue/5 dark:bg-fsp-blue/10 space-y-4"
    >
      <h4 class="text-sm font-bold text-gray-900 dark:text-white">Новое учебное заведение</h4>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-1">
            Уровень *
          </label>
          <select
            v-model="level"
            class="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-white dark:bg-fsp-dark text-xs focus:outline-none"
          >
            <option v-for="(lbl, key) in levelLabels" :key="key" :value="key">
              {{ lbl }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-1">
            Учебное заведение (ВУЗ / Колледж) *
          </label>
          <input
            v-model="institution"
            class="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-white dark:bg-fsp-dark text-xs focus:outline-none"
            placeholder="МФТИ, НИУ ВШЭ, МГУ..."
            type="text"
          />
        </div>

        <div>
          <label class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-1">
            Специальность / Направление *
          </label>
          <input
            v-model="specialization"
            class="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-white dark:bg-fsp-dark text-xs focus:outline-none"
            placeholder="Программная инженерия"
            type="text"
          />
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label
              class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Факультет
            </label>
            <input
              v-model="faculty"
              class="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-white dark:bg-fsp-dark text-xs focus:outline-none"
              placeholder="ФКН"
              type="text"
            />
          </div>
          <div>
            <label
              class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Год выпуска *
            </label>
            <input
              v-model.number="graduationYear"
              class="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-white dark:bg-fsp-dark text-xs focus:outline-none font-mono"
              type="number"
            />
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 pt-2">
        <BaseButton size="sm" variant="ghost" @click="isAdding = false"> Отмена </BaseButton>
        <BaseButton
          :disabled="!institution.trim() || !specialization.trim()"
          size="sm"
          variant="primary"
          @click="handleAdd"
        >
          Сохранить
        </BaseButton>
      </div>
    </div>

    <!-- Модальное окно редактирования выбранного образования -->
    <BaseModal
      :is-open="isEditingModalOpen"
      max-width="lg"
      subtitle="Измените данные об учебном заведении, специальности и годе выпуска"
      title="Редактирование образования"
      @close="isEditingModalOpen = false"
    >
      <form class="space-y-4" @submit.prevent="handleSaveEdit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Уровень *
            </label>
            <select
              v-model="editLevel"
              class="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-white dark:bg-fsp-dark text-xs focus:outline-none text-gray-900 dark:text-white"
            >
              <option v-for="(lbl, key) in levelLabels" :key="key" :value="key">
                {{ lbl }}
              </option>
            </select>
          </div>

          <div>
            <label
              class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Учебное заведение (ВУЗ / Колледж) *
            </label>
            <input
              v-model="editInstitution"
              class="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-gray-50 dark:bg-fsp-dark text-xs focus:outline-none focus:border-fsp-blue text-gray-900 dark:text-white"
              placeholder="МФТИ, НИУ ВШЭ, МГУ..."
              required
              type="text"
            />
          </div>

          <div>
            <label
              class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Специальность / Направление *
            </label>
            <input
              v-model="editSpecialization"
              class="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-gray-50 dark:bg-fsp-dark text-xs focus:outline-none focus:border-fsp-blue text-gray-900 dark:text-white"
              placeholder="Программная инженерия"
              required
              type="text"
            />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label
                class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Факультет
              </label>
              <input
                v-model="editFaculty"
                class="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-gray-50 dark:bg-fsp-dark text-xs focus:outline-none focus:border-fsp-blue text-gray-900 dark:text-white"
                placeholder="ФКН"
                type="text"
              />
            </div>
            <div>
              <label
                class="block text-xs font-mono font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Год выпуска *
              </label>
              <input
                v-model.number="editGraduationYear"
                class="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-fsp-dark-border bg-gray-50 dark:bg-fsp-dark text-xs focus:outline-none focus:border-fsp-blue text-gray-900 dark:text-white font-mono"
                required
                type="number"
              />
            </div>
          </div>
        </div>
      </form>

      <template #footer>
        <BaseButton size="sm" variant="ghost" @click="isEditingModalOpen = false">
          Отмена
        </BaseButton>
        <BaseButton
          :disabled="!editInstitution.trim() || !editSpecialization.trim()"
          icon="pi pi-check"
          size="sm"
          variant="primary"
          @click="handleSaveEdit"
        >
          Сохранить изменения
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>
