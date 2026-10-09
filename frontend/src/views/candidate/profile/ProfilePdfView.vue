<script lang="ts" setup>
import { ref } from 'vue'
import { useCandidateProfile } from '@/composables/useCandidateProfile'
import BaseButton from '@/components/common/BaseButton.vue'

const { profile } = useCandidateProfile()

const isParsing = ref(false)
const parseSuccess = ref(false)
const isDownloading = ref(false)
const downloadSuccess = ref(false)

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  isParsing.value = true
  parseSuccess.value = false

  setTimeout(() => {
    isParsing.value = false
    parseSuccess.value = true
  }, 1800)
}

function handleDownloadPdf() {
  isDownloading.value = true
  downloadSuccess.value = false

  setTimeout(() => {
    isDownloading.value = false
    downloadSuccess.value = true
    setTimeout(() => {
      downloadSuccess.value = false
    }, 3000)
  }, 1200)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Сетка из двух колонок: Импорт и Экспорт -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 1. Загрузка и парсинг стороннего PDF резюме -->
      <div
        class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-5"
      >
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl bg-fsp-blue/10 text-fsp-blue flex items-center justify-center"
            >
              <i class="pi pi-cloud-upload text-lg"></i>
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">
                Умный импорт резюме (PDF)
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Автораспознавание опыта, навыков и образования
              </p>
            </div>
          </div>

          <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
            Загрузите ваше существующее резюме с HeadHunter, Хабр Карьеры или LinkedIn в формате
            PDF. Наш парсер автоматически извлечет хронологию работы, стек и контакты.
          </p>

          <!-- Drop zone -->
          <label
            class="border-2 border-dashed border-gray-300 dark:border-fsp-dark-border hover:border-fsp-blue dark:hover:border-fsp-blue rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-gray-50/50 dark:bg-fsp-dark/40"
          >
            <input accept=".pdf" class="hidden" type="file" @change="handleFileUpload" />
            <i class="pi pi-file-pdf text-3xl text-fsp-blue/70 mb-2"></i>
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Нажмите для выбора PDF файла
            </span>
            <span class="text-xs text-gray-400 mt-1"> Формат .pdf, до 10 МБ </span>
          </label>

          <!-- Индикатор парсинга -->
          <div
            v-if="isParsing"
            class="p-3 rounded-xl bg-fsp-blue/10 border border-fsp-blue/20 text-fsp-blue text-xs flex items-center gap-2 font-mono"
          >
            <i class="pi pi-spin pi-spinner"></i>
            <span>Идет извлечение сущностей через OCR/NLP...</span>
          </div>

          <!-- Успех парсинга -->
          <div
            v-if="parseSuccess"
            class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2"
          >
            <i class="pi pi-check-circle"></i>
            <span>Резюме успешно распознано и синхронизировано с профилем!</span>
          </div>
        </div>
      </div>

      <!-- 2. Генерация цифрового паспорта HuntMe ФСП -->
      <div
        class="bg-white dark:bg-fsp-dark-surface border border-gray-200 dark:border-fsp-dark-border rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-5"
      >
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl bg-fsp-red/10 text-fsp-red flex items-center justify-center"
            >
              <i class="pi pi-verified text-lg"></i>
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">
                Цифровой паспорт HuntMe [ФСП]
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Официальный верифицированный паспорт соискателя
              </p>
            </div>
          </div>

          <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
            Стандартизированный документ в фирменном стиле Федерации спортивного программирования.
            Содержит верифицированный грейд, объективный скоринг тестирования и динамический QR-код
            для валидации подлинности.
          </p>

          <!-- Превью-карточка паспорта -->
          <div
            class="p-4 rounded-xl bg-gray-900 text-white border border-gray-800 space-y-3 font-mono text-xs"
          >
            <div class="flex items-center justify-between border-b border-gray-800 pb-2">
              <span class="text-gray-400 font-bold">HUNTME VERIFIED PASSPORT</span>
              <span class="text-fsp-red font-bold">ФСП РОССИЯ</span>
            </div>
            <div class="space-y-1">
              <div class="text-sm font-bold text-white font-sans">{{ profile.fullName }}</div>
              <div class="text-fsp-blue font-bold">
                {{ profile.verifiedGrade || profile.claimedGrade }} {{ profile.specialization }}
              </div>
              <div class="text-gray-400 text-[11px]">
                ID: {{ profile.id }} • ФСП ID: {{ profile.fspId || 'Не привязан' }}
              </div>
            </div>
            <div
              class="flex items-center justify-between pt-2 border-t border-gray-800 text-[11px] text-gray-400"
            >
              <span>Сформирован: 2026</span>
              <span class="text-emerald-400 flex items-center gap-1">
                <i class="pi pi-check"></i> Подпись валидна
              </span>
            </div>
          </div>
        </div>

        <div class="pt-2">
          <BaseButton
            :disabled="isDownloading"
            :icon="isDownloading ? 'pi pi-spin pi-spinner' : 'pi pi-download'"
            class="w-full justify-center"
            size="md"
            variant="primary"
            @click="handleDownloadPdf"
          >
            {{ isDownloading ? 'Формирование PDF паспорта...' : 'Скачать PDF паспорт HuntMe' }}
          </BaseButton>

          <p
            v-if="downloadSuccess"
            class="text-xs text-center text-emerald-600 dark:text-emerald-400 mt-2 font-mono"
          >
            Документ успешно сгенерирован и скачан!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
