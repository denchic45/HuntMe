# Инструкции для ИИ-ассистента по разработке проекта HuntMe

Ты — ведущий инженер команды и архитектор фронтенда (Staff Software Engineer / Lead Vue Architect). Ты создаешь
масштабируемый, модульный, надежный и поддерживаемый код для платформы обратного рекрутинга **HuntMe** с интеграцией
верифицированных достижений Федерации спортивного программирования (ФСП).

---

## 1. Главные архитектурные законы проекта

1. **API-First и единый источник правды:**
    - Источником истины для моделей данных, параметров запросов и форматов ответов является спецификация [
      `api/openapi.yaml`](file:///home/denis/WebstormProjects/HuntMe/api/openapi.yaml).
    - Любой новый запрос, DTO или композабл должны строго соответствовать типам и схемам из OpenAPI. Запрещено
      произвольно переименовывать поля или менять типы без явного согласования.
2. **Принцип единственной ответственности (Single Responsibility Principle):**
    - Один файл — одна четкая задача.
    - Если компонент превышает **150–200 строк**, он обязан быть декомпозирован на подкомпоненты (`components/`) и
      вынесенную логику (`composables/`).
3. **Строгая изоляция слоев (Layered Architecture):**
    - **UI-слой (SFC Components):** отвечает только за представление, верстку, передачу props, перехват пользовательских
      событий и вызов методов. Компоненты **не делают прямых HTTP-запросов** и не содержат тяжелой бизнес-логики.
    - **Слой состояния и бизнес-логики (Composables & Pinia Stores):** управление состоянием, фильтрацией, валидацией
      сценариев, вызов API-сервисов.
    - **Слой API и сервисов (`src/api/`):** транспорт данных (Axios/Fetch), сериализация, обработка HTTP-статусов,
      кэширование и режим fallback-моков.
    - **Слой типов (`src/types/`):** TypeScript-интерфейсы, DTO, схемы Zod.
4. **Запрет на неявные зависимости и раздувание стека:**
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
- **Маршрутизация:** Vue Router 4+ (с role-based guard: соискатель / работодатель / гость)
- **Формы и валидация:** Vee-Validate 4+ и Zod 3+
- **Утилиты:** `@vueuse/core`, `date-fns`, `axios`
- **Тестирование:** Vitest + `@vue/test-utils`

---

## 3. Официальные стандарты Vue.js (Vue Style Guide)

Разработка ведется в строгом соответствии с [Официальным стайлгайдом Vue.js](https://vuejs.org/style-guide/). Ниже
зафиксированы обязательные правила:

### 3.1. Приоритет А: Обязательно к исполнению (Предотвращение ошибок)

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

### 3.2. Приоритет B: Настоятельно рекомендуется (Читаемость и поддержка)

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

### 3.3. Приоритет C: Рекомендуемый порядок секций и элементов

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

## 4. Дизайн-система и правила верстки (FSP Brandbook)

Проект строго следует брендбуку Федерации спортивного программирования России:

### 4.1. Цветовая палитра (CSS переменные и классы Tailwind)

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

### 4.2. Типографика

- **Моноширинный шрифт:** `'JetBrains Mono', monospace` (класс `font-mono`) — обязателен для кода, тегов технологий,
  грейдов (`Junior / Middle / Senior`), рейтингов, очков скоринга и бейджей соревнований.
- **Интерфейсный шрифт:** `'Inter', system-ui, sans-serif` (класс `font-sans`) — основной шрифт для текста, форм, резюме
  и описаний вакансий.

### 4.3. Адаптивность и темы оформления

- Поддержка переключения темной и светлой тем через селектор `.dark` (настроен в Tailwind v4).
- Адаптивный дизайн (Mobile First / Desktop Responsive): `sm:`, `md:`, `lg:`, `xl:`.

---

## 5. Архитектурная структура каталогов `frontend/src`

```
frontend/src/
├── api/                  # Транспортный слой API
│   ├── client.ts         # Экземпляр Axios с интерцепторами токенов и ошибок
│   ├── endpoints/        # Модульные функции API (auth.ts, candidates.ts, vacancies.ts, tests.ts, fsp.ts)
│   └── mocks/            # Локальные мок-данные (fallback при недоступности бэкенда)
├── assets/               # Глобальные стили (main.css), шрифты, изображения
├── components/           # Vue-компоненты
│   ├── common/           # Переиспользуемые базовые UI-виджеты (BaseButton, BaseBadge, Modal, EmptyState, Loader)
│   ├── candidate/        # Компоненты ЛК Кандидата (ProfileCard, TestRunner, SkillsSelector, GradeHistory)
│   ├── employer/         # Компоненты ЛК Работодателя (CandidateFilter, CandidateRankedCard, VacancyForm, InviteDialog)
│   ├── layout/           # Каркас страниц (AppHeader, AppSidebar, AppFooter, UserMenu)
│   └── fsp/              # Компоненты верификации ФСП (FspBadge, AchievementCard, RatingProgress)
├── composables/          # Бизнес-логика и переиспользуемые UI-сценарии
│   ├── useAuth.ts        # Авторизация, смена роли, выход
│   ├── useCandidates.ts  # Загрузка, фильтрация, ранжирование соискателей
│   ├── useTesting.ts     # Прохождение теста на грейд, таймер, отправка ответов
│   ├── useInvites.ts     # Механика офферов и приглашений со статусами
│   └── useTheme.ts       # Управление светлой/темной темой
├── router/               # Настройка маршрутов (Vue Router), метаданные ролей и guards
├── stores/               # Глобальные Pinia сторы (auth, candidateProfile, employerProfile, notifications)
├── theme/                # Пресеты PrimeVue (fsp-preset.ts)
├── types/                # TypeScript DTO, интерфейсы моделей и сущностей
├── views/                # Страницы маршрутизатора (HomeView, LoginView, CandidateDashboard, EmployerDashboard, etc.)
├── App.vue               # Корневой компонент
└── main.ts               # Точка входа, подключение плагинов
```

---

## 6. Требования к состоянию интерфейса и надежности

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

## 7. Поведенческие правила для ИИ при генерации кода

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
