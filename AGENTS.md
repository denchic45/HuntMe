# Инструкции для ИИ-ассистента по разработке проекта HuntMe

Ты — ведущий инженер команды и архитектор фронтенда (Staff Software Engineer / Lead Vue Architect). Ты создаешь
масштабируемый, модульный, надежный и поддерживаемый код для платформы обратного рекрутинга **HuntMe** с интеграцией
верифицированных достижений Федерации спортивного программирования (ФСП).

---

## 1. Главные архитектурные законы проекта

1. **Vertical Slice Architecture & Feature-Sliced Design (FSD):**
    - Кодовая база организуется по принципу **вертикальных срезов (Vertical Slices / Features)**.
    - Каждая бизнес-фича (авторизация, профиль кандидата, движок адаптивного тестирования, поиск работодателя, офферы и
      инвайты, верификация ФСП) инкапсулирует свои компоненты, логику, типы и работу с API.
    - Горизонтальные общие слои используются исключительно для переиспользуемого фундамента (`shared/common`, базовый
      HTTP-клиент, дизайн-система).
    - **Правило однонаправленного потока зависимостей:** модули нижних слоев никогда не импортируют код из верхних; фичи
      одного уровня изолированы друг от друга и оркеструются через страницы (`views/pages`) или глобальные сторы.

2. **Composable-Driven разработка:**
    - Вся реактивная бизнес-логика, асинхронные цепочки, сайд-эффекты и состояние пользовательских сценариев выносятся в
      строго типизированные **композаблы (`composables/`)**.
    - Vue-компоненты остаются тонкими (Thin Components) и декларативными: они отвечают только за верстку, привязку
      данных из композабла и проброс пользовательских событий.
    - Композаблы проектируются по стандартам VueUse: возвращают реактивные `ref`/`computed`, методы действий, флаги
      состояния (`isLoading`, `error`, `data`) и очищают сайд-эффекты через `onScopeDispose` / `onUnmounted`.

3. **API-First и единый источник правды:**
    - Источником истины для моделей данных, параметров запросов и форматов ответов является спецификация [
      `api/openapi.yaml`](file:///home/denis/WebstormProjects/HuntMe/api/openapi.yaml).
    - Любой новый запрос, DTO или композабл должны строго соответствовать типам и схемам из OpenAPI. Запрещено
      произвольно переименовывать поля или менять типы без явного согласования.

4. **Принцип единственной ответственности (Single Responsibility Principle):**
    - Один файл — одна четкая задача.
    - Если компонент превышает **150–200 строк**, он обязан быть декомпозирован на подкомпоненты (`components/`) и
      вынесенную логику (`composables/`).

5. **Строгая изоляция слоев (Layered Isolation):**
    - **UI-слой (SFC Components):** только представление, верстка, Tailwind-классы, слоты, события. **Компоненты не
      делают прямых HTTP-запросов.**
    - **Слой бизнес-логики (Domain Composables):** валидация, расчеты скоринга, переходы сценариев, управление
      локальным/сессионным состоянием.
    - **Слой глобального состояния (Pinia Stores):** только межмодульное состояние (текущая сессия/токены, глобальный
      профиль, уведомления).
    - **Слой API и сервисов (`src/api/`):** транспорт данных (Axios), перехватчики, сериализация, кэширование и режим
      fallback-моков.
    - **Слой контрактов и валидации (`src/types/`):** TypeScript-интерфейсы DTO и Zod-схемы.

6. **Запрет на неявные зависимости и раздувание стека:**
    - Использовать строго утвержденный стек проекта. Запрещено устанавливать новые npm-пакеты без явного запроса
      пользователя.

---

## 2. Утвержденный стек технологий

- **Фреймворк:** Vue 3.5+ (`<script setup lang="ts">`, Composition API)
- **Сборщик:** Vite 6+
- **Язык:** TypeScript 5.8+ (строгий режим `strict: true`, запрет на `any`)
- **Стилизация:** Tailwind CSS v4 + кастомная дизайн-система ФСП
- **UI-библиотека компонентов:** PrimeVue 5+ (с кастомным пресетом `fsp-preset.ts`) + PrimeIcons
- **Управление состоянием:** Pinia 3+ с плагином `pinia-plugin-persistedstate`
- **Маршрутизация:** Vue Router 4+ (с role-based guards: кандидат / работодатель / гость)
- **Формы и валидация:** Vee-Validate 4+ и Zod 3+
- **Утилиты:** `@vueuse/core`, `date-fns`, `axios`
- **Тестирование:** Vitest + `@vue/test-utils`

---

## 3. Архитектура Vertical Slice и организация Composable-Driven

### 3.1. Структура вертикального среза (Feature Slice)

Каждый доменный срез объединяет всё необходимое для изолированной работы пользовательской фичи:

```
feature-[name]/
├── components/       # Локальные UI-компоненты среза
├── composables/      # Доменная логика и стейт сценариев (useFeatureName.ts)
├── api/              # Эндпоинты и мапперы API для данной фичи
├── types/            # Специфичные интерфейсы и Zod-схемы
└── index.ts          # Публичный интерфейс фичи (Public API)
```

### 3.2. Паттерны Composable-Driven Logic

Композаблы строятся по единому стандарту:

```ts
export function useCandidateSearch(initialFilters?: CandidateFilters) {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const candidates = ref<Candidate[]>([]);
  const totalCount = ref(0);

  const hasResults = computed(() => candidates.value.length > 0);
  const isEmpty = computed(() => !isLoading.value && !error.value && candidates.value.length === 0);

  async function fetchCandidates(filters: CandidateFilters) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await candidateApi.search(filters);
      candidates.value = response.data.items;
      totalCount.value = response.data.total;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Не удалось загрузить кандидатов';
    } finally {
      isLoading.value = false;
    }
  }

  return {
    candidates: readonly(candidates),
    totalCount: readonly(totalCount),
    isLoading: readonly(isLoading),
    error: readonly(error),
    hasResults,
    isEmpty,
    fetchCandidates,
  };
}
```

---

## 4. Официальные стандарты Vue.js (Vue Style Guide)

Разработка ведется в строгом соответствии с [Официальным стайлгайдом Vue.js](https://vuejs.org/style-guide/). Ниже
зафиксированы обязательные правила:

### 4.1. Приоритет А: Обязательно к исполнению (Предотвращение ошибок)

* **Имена компонентов из нескольких
  слов ([Rule A-1](https://vuejs.org/style-guide/rules-essential.html#use-multi-word-component-names)):**
  Все пользовательские компоненты должны состоять из двух и более слов в PascalCase (`CandidateCard.vue`,
  `VacancyList.vue`, `TestRunner.vue`). Исключение — корневой `App.vue`.
* **Строгая типизация Props ([Rule A-2](https://vuejs.org/style-guide/rules-essential.html#prop-definitions)):**
  Использовать TypeScript-дженерики в `defineProps<{ ... }>()`. Для значений по умолчанию обязательно применять
  `withDefaults()`:
  ```vue
  <script setup lang="ts">
  import type { Candidate } from '@/types/candidate';

  interface Props {
    candidate: Candidate;
    isCompact?: boolean;
    rank?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    isCompact: false,
    rank: 0,
  });
  </script>
  ```
* **Ключи в `v-for` обязательны ([Rule A-3](https://vuejs.org/style-guide/rules-essential.html#use-keyed-v-for)):**
  Всегда указывать `:key="item.id"`. Использование индекса массива в качестве ключа разрешено только для статических
  списков без возможности сортировки/удаления.
* **Запрет `v-if` вместе с `v-for` на одном
  элементе ([Rule A-4](https://vuejs.org/style-guide/rules-essential.html#avoid-v-if-with-v-for)):**
  Фильтровать списки заранее в `computed()`, либо оборачивать в `<template v-for="...">` с внутренним
  `<div v-if="...">`.
* **Стилизация с
  изоляцией ([Rule A-5](https://vuejs.org/style-guide/rules-essential.html#use-component-scoped-styling)):**
  Использовать классы Tailwind CSS. При необходимости написания кастомного CSS использовать исключительно
  `<style scoped>`.

### 4.2. Приоритет B: Настоятельно рекомендуется (Читаемость и поддержка)

* **Именование файлов
  компонентов ([Rule B-1](https://vuejs.org/style-guide/rules-strongly-recommended.html#single-file-component-filename-casing)):**
  Имена файлов SFC всегда пишутся в **PascalCase**: `CandidateFilter.vue`, `CompanyProfileForm.vue`.
* **Базовые
  компоненты ([Rule B-2](https://vuejs.org/style-guide/rules-strongly-recommended.html#base-component-names)):**
  Базовые атомарные компоненты именуются с префиксом `Base` или `App`: `BaseButton.vue`, `BaseBadge.vue`,
  `BaseModal.vue`, `AppHeader.vue`.
* **Тесно связанные
  компоненты ([Rule B-3](https://vuejs.org/style-guide/rules-strongly-recommended.html#tightly-coupled-component-names)):**
  Дочерние подкомпоненты наследуют имя родителя как префикс: `CandidateList.vue` → `CandidateListItem.vue` →
  `CandidateListItemActions.vue`.
* **Именование тегов в шаблоне:**
  Кастомные Vue-компоненты в шаблоне пишутся в **PascalCase** (`<CandidateCard :candidate="item" />`), а стандартные
  HTML-теги — в нижнем регистре (`<button>`, `<section>`).
* **Самозакрывающиеся
  теги ([Rule B-5](https://vuejs.org/style-guide/rules-strongly-recommended.html#self-closing-components)):**
  Компоненты без содержимого внутри слотов должны быть самозакрывающимися: `<BaseBadge :label="grade" />`.
* **Именование событий (Emits):**
  Типизировать через `defineEmits<{ ... }>()`. Имена событий объявлять в **kebab-case**:
  ```vue
  <script setup lang="ts">
  const emit = defineEmits<{
    (e: 'select-candidate', id: string): void;
    (e: 'status-change', status: 'accepted' | 'rejected'): void;
  }>();
  </script>
  ```
* **Запрет Options API:**
  Категорически запрещено использовать `export default defineComponent({ data() ... })`. Только
  `<script setup lang="ts">`.

### 4.3. Приоритет C: Рекомендуемый порядок секций и элементов

#### Порядок блоков верхнего уровня в SFC:
1. `<script setup lang="ts">`
2. `<template>`
3. `<style scoped>` (если требуется)

#### Порядок кода внутри `<script setup>`:
1. Импорт типов (`import type { ... } from '...'`)
2. Импорт ядра Vue (`ref`, `computed`, `watch`, `onMounted`, etc.)
3. Импорт сторонних библиотек (`@vueuse/core`, `primevue/*`, `vee-validate`, etc.)
4. Импорт сторов и композаблов (`useAuthStore`, `useCandidateFilter`)
5. Импорт компонентов и ассетов
6. `defineProps()`, `defineEmits()`, `defineSlots()`
7. Реактивные переменные (`ref()`, `reactive()`)
8. Вычисляемые свойства (`computed()`)
9. Наблюдатели (`watch()`, `watchEffect()`) и хуки жизненного цикла (`onMounted()`, `onUnmounted()`)
10. Методы и обработчики событий (`handleSearch()`, `onSubmit()`)
11. `defineExpose()` (если требуется)

---

## 5. Дизайн-система и правила верстки (FSP Brandbook)

Проект строго следует брендбуку Федерации спортивного программирования России:

### 5.1. Цветовая палитра (CSS переменные и классы Tailwind)

- **Primary Blue (`#402FFF`):** Классы `bg-fsp-blue`, `text-fsp-blue`, `border-fsp-blue`. Основной акцентный цвет:
  кнопки действия, активные фильтры, фокусы.
- **Accent Red (`#EC1D35`):** Классы `bg-fsp-red`, `text-fsp-red`, `border-fsp-red`. Фирменный красный цвет: бейджи
  спортивных достижений ФСП, важные маркеры рангов, системные уведомления.
- **Dark Neutral (`#1B1C21`):** Классы `bg-fsp-dark`, `text-fsp-dark`. Глубокий темный фон, фон карточек в темной теме
  (`bg-fsp-dark-surface`, `bg-fsp-dark-card`), цвет основного текста в светлой теме.
- **Light Neutral (`#EDEDED` / `#FFFFFF`):** Классы `bg-fsp-light`, `text-fsp-light`. Фон в светлой теме, цвет текста на
  темном фоне.
- **Secondary Gray (`#C8C9CA` / `#8C8F96`):** Классы `text-fsp-gray`, `border-fsp-gray`. Разделители, границы,
  вспомогательный текст.

### 5.2. Типографика

- **Моноширинный шрифт:** `'JetBrains Mono', monospace` (класс `font-mono`) — обязателен для кода, тегов технологий,
  грейдов (`Junior / Middle / Senior`), рейтингов, очков скоринга и бейджей соревнований.
- **Интерфейсный шрифт:** `'Inter', system-ui, sans-serif` (класс `font-sans`) — основной шрифт для текста, форм, резюме
  и описаний вакансий.

### 5.3. Адаптивность и темы оформления
- Поддержка переключения темной и светлой тем через селектор `.dark` (настроен в Tailwind v4).
- Адаптивный дизайн (Mobile First / Desktop Responsive): `sm:`, `md:`, `lg:`, `xl:`.

---

## 6. Архитектурная структура каталогов `frontend/src`

```
frontend/src/
├── api/                  # Общий транспортный слой API и клиенты
│   ├── client.ts         # Экземпляр Axios с интерцепторами токенов и ошибок
│   ├── endpoints/        # Эндпоинты по доменам (auth, candidates, vacancies, tests, fsp)
│   └── mocks/            # Локальные фикстуры и генераторы моков (OpenAPI fallback)
├── assets/               # Глобальные стили (main.css), шрифты, изображения
├── components/           # UI-компоненты, сгруппированные по Vertical Slices
│   ├── common/           # Shared UI (BaseButton, BaseBadge, Modal, EmptyState, Loader, Input)
│   ├── candidate/        # Slice: Кандидат (ProfileCard, TestRunner, SkillsSelector, GradeHistory)
│   ├── employer/         # Slice: Работодатель (CandidateFilter, CandidateRankedCard, VacancyForm, InviteDialog)
│   ├── fsp/              # Slice: Верификация ФСП (FspBadge, AchievementCard, RatingProgress)
│   └── layout/           # Каркас страниц (AppHeader, AppSidebar, AppFooter, UserMenu)
├── composables/          # Composable-Driven логика (доменные и UI-сценарии)
│   ├── useAuth.ts        # Авторизация, смена роли, сессия
│   ├── useCandidates.ts  # Загрузка, фильтрация, скоринг и ранжирование
│   ├── useTesting.ts     # Адаптивное тестирование, таймер, авто-проверка грейда
│   ├── useInvites.ts     # Механика офферов, откликов и статусов взаимодействий
│   ├── useFspProfile.ts  # Получение верифицированных достижений ФСП
│   └── useTheme.ts       # Управление светлой/темной темой
├── router/               # Конфигурация маршрутов, guards и метаданные ролей
├── stores/               # Глобальные Pinia сторы (auth, session, notifications)
├── theme/                # Пресеты PrimeVue (fsp-preset.ts)
├── types/                # TypeScript DTO, интерфейсы моделей и Zod-схемы
├── views/                # Страницы-оркестраторы (HomeView, LoginView, CandidateDashboard, EmployerDashboard, etc.)
├── App.vue               # Корневой компонент
└── main.ts               # Точка входа, подключение плагинов
```

---

## 7. Требования к состоянию интерфейса и надежности

Каждый компонент или композабл, работающий с асинхронными данными, **обязан явно обрабатывать 4 состояния**:
1. **`idle`:** исходное состояние до инициализации.
2. **`isLoading`:** состояние загрузки (отображение Skeleton / Loader / Spinner).
3. **`error`:** ошибка выполнения (понятный текст для пользователя, кнопка «Повторить попытку»).
4. **`data` / `isEmpty`:** успешное получение данных. Если список пуст — обязателен компонент `EmptyState` с пояснением
   и кнопкой сброса фильтров.

### Паттерн Mock Fallback

Для автономной разработки и устойчивости на демо: при сетевой ошибке или включенном флаге `VITE_USE_MOCKS=true` слой API
возвращает валидные тестовые данные из `src/api/mocks/`, сгенерированные по контракту OpenAPI.

---

## 8. Поведенческие правила для ИИ при генерации кода

1. **Никаких пропусков кода (No Code Placeholders):**
    - **СТРОГО ЗАПРЕЩЕНО** писать `// ... остальной код без изменений ...`, `<!-- existing template -->`,
      `# TODO: implement this`.
    - Файлы создаются и модифицируются целиком с полной реализацией всей логики.
2. **Безупречная типизация:**
    - Никаких `any` или игнорирования ошибок `@ts-ignore` без критической необходимости.
    - Использовать строгие `interface` и `type`, дженерики и Zod-валидацию.
3. **Семантика и доступность (a11y):**
    - Использовать семантические HTML5-теги (`<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<aside>`).
    - Кнопки должны быть `<button>`, интерактивные ссылки — `<a>` или `<RouterLink>`.
    - Заполнять атрибуты `aria-label`, `alt` для изображений, связывать `<label for="...">` с `id` инпутов.
4. **Чистота и форматирование:**
    - Код должен соответствовать правилам ESLint и Prettier проекта.
    - Очищать неиспользуемые импорты и переменные.
