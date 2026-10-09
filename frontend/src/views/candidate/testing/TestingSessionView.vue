<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const sessionId = computed(() => (route.params.sessionId as string) || 'current')

// Вопросы тестовой сессии
const questions = [
  {
    id: 1,
    title: 'Конкурентность и каналы в Go',
    prompt: 'Какое поведение возникнет при чтении из закрытого небуферизованного канала в Go?',
    code: `ch := make(chan int)
close(ch)
val, ok := <-ch`,
    options: [
      'Паника (panic: send on closed channel)',
      'Чтение вернет zero-value (0) и ok == false',
      'Блокировка горутины навсегда (deadlock)',
      'Компилятор выдаст ошибку типов',
    ],
    correctIndex: 1,
  },
  {
    id: 2,
    title: 'Транзакции и изоляция в PostgreSQL',
    prompt:
      'Какой уровень изоляции транзакций гарантирует защиту от аномалии Serialization Anomaly (Write Skew)?',
    options: ['Read Committed', 'Repeatable Read', 'Serializable', 'Read Uncommitted'],
    correctIndex: 2,
  },
  {
    id: 3,
    title: 'Архитектура HighLoad и шардирование',
    prompt:
      'Какой метод шардирования наиболее эффективен для минимизации перемещения ключей при добавлении новых нод в кластер?',
    options: [
      'Consistent Hashing (консистентное хеширование)',
      'Modulo-based Range Partitioning (id % N)',
      'Случайная балансировка (Random routing)',
      'Round-Robin без сохранения состояния',
    ],
    correctIndex: 0,
  },
  {
    id: 4,
    title: 'Оптимизация сетевых задержек в микросервисах',
    prompt:
      'Какое преимущество дает протокол gRPC/HTTP/2 по сравнению со стандартным REST/HTTP 1.1 JSON в межсервисном взаимодействии?',
    options: [
      'Мультиплексирование потоков в одном TCP-соединении и бинарная Protobuf сериализация',
      'Автоматическое шифрование без использования TLS сертификатов',
      'Возможность работы без DNS серверов',
      'Гарантированная доставка сообщений без брокера',
    ],
    correctIndex: 0,
  },
  {
    id: 5,
    title: 'Алгоритмическая сложность и структуры данных',
    prompt:
      'Какова амортизированная временная сложность поиска и вставки в Skip List (список с пропусками)?',
    options: ['O(N)', 'O(log N)', 'O(1)', 'O(N log N)'],
    correctIndex: 1,
  },
]

const currentIndex = ref(0)
const selectedAnswers = ref<Record<number, number>>({
  0: 1,
  1: 2,
  2: 0,
})

const currentQuestion = computed(() => questions[currentIndex.value] ?? questions[0]!)

// Таймер обратного отсчета: 25 минут (1500 сек)
const remainingSeconds = ref(1500)
let timerInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timerInterval = setInterval(() => {
    if (remainingSeconds.value > 0) {
      remainingSeconds.value--
    } else {
      finishTest()
    }
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

const formattedTime = computed(() => {
  const m = Math.floor(remainingSeconds.value / 60)
  const s = remainingSeconds.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

function selectOption(index: number) {
  selectedAnswers.value[currentIndex.value] = index
}

function nextQuestion() {
  if (currentIndex.value < questions.length - 1) {
    currentIndex.value++
  }
}

function prevQuestion() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

function finishTest() {
  if (timerInterval) clearInterval(timerInterval)
  router.push(`/candidate/testing/result/${sessionId.value}`)
}
</script>

<template>
  <div
    class="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col justify-between space-y-6"
  >
    <!-- Верхняя статус-строка: прогресс и таймер -->
    <div class="flex items-center justify-between border-b border-gray-800 pb-4">
      <div class="flex items-center gap-2">
        <span class="text-xs font-mono text-gray-400">Вопрос</span>
        <span class="text-sm font-mono font-bold text-fsp-blue">
          {{ currentIndex + 1 }} / {{ questions.length }}
        </span>
      </div>

      <!-- Живой таймер -->
      <div
        class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-950 border border-gray-800"
      >
        <i class="pi pi-clock text-fsp-blue text-xs"></i>
        <span class="font-mono text-sm font-bold text-white tracking-widest">
          {{ formattedTime }}
        </span>
      </div>
    </div>

    <!-- Карточка текущего вопроса -->
    <div class="bg-gray-950/70 border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6 flex-1">
      <div class="space-y-1">
        <span class="text-[11px] font-mono uppercase text-gray-400 tracking-wider">
          {{ currentQuestion.title }}
        </span>
        <h3 class="text-base sm:text-lg font-bold text-white font-sans">
          {{ currentQuestion.prompt }}
        </h3>
      </div>

      <!-- Кодовый сниппет, если есть -->
      <div
        v-if="currentQuestion.code"
        class="p-4 rounded-xl bg-gray-900 border border-gray-800 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed"
      >
        <pre><code>{{ currentQuestion.code }}</code></pre>
      </div>

      <!-- Варианты ответов -->
      <div class="space-y-3 pt-2">
        <button
          v-for="(option, idx) in currentQuestion.options"
          :key="idx"
          :class="[
            'w-full p-4 rounded-xl border text-xs sm:text-sm font-mono text-left transition-all flex items-start gap-3 cursor-pointer',
            selectedAnswers[currentIndex] === idx
              ? 'border-fsp-blue bg-fsp-blue/20 text-white font-semibold'
              : 'border-gray-800 bg-gray-900/60 text-gray-300 hover:border-gray-700 hover:bg-gray-900',
          ]"
          type="button"
          @click="selectOption(idx)"
        >
          <span
            :class="[
              'w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold',
              selectedAnswers[currentIndex] === idx
                ? 'bg-fsp-blue text-white'
                : 'bg-gray-800 text-gray-400',
            ]"
          >
            {{ ['A', 'B', 'C', 'D'][idx] }}
          </span>
          <span class="leading-relaxed">{{ option }}</span>
        </button>
      </div>
    </div>

    <!-- Нижняя панель навигации по вопросам -->
    <div class="flex items-center justify-between pt-2">
      <BaseButton
        :disabled="currentIndex === 0"
        icon="pi pi-arrow-left"
        size="md"
        variant="outline"
        @click="prevQuestion"
      >
        Назад
      </BaseButton>

      <div class="flex items-center gap-1.5 hidden sm:flex">
        <button
          v-for="(_, qIdx) in questions"
          :key="qIdx"
          :class="[
            'w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer',
            currentIndex === qIdx
              ? 'bg-fsp-blue text-white'
              : selectedAnswers[qIdx] !== undefined
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700',
          ]"
          type="button"
          @click="currentIndex = qIdx"
        >
          {{ qIdx + 1 }}
        </button>
      </div>

      <div class="flex items-center gap-3">
        <BaseButton
          v-if="currentIndex < questions.length - 1"
          icon="pi pi-arrow-right"
          size="md"
          variant="primary"
          @click="nextQuestion"
        >
          Следующий
        </BaseButton>

        <BaseButton v-else icon="pi pi-check" size="md" variant="primary" @click="finishTest">
          Завершить и узнать результат
        </BaseButton>
      </div>
    </div>
  </div>
</template>
