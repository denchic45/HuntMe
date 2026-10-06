<script lang="ts" setup>
import { useLandingRoleStore } from '@/stores/landingRole'

const roleStore = useLandingRoleStore()
</script>

<template>
  <footer
    class="border-t border-gray-200 dark:border-fsp-dark-border bg-gray-900 text-gray-400 text-xs font-sans transition-colors pt-16 pb-12"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div class="grid grid-cols-2 md:grid-cols-5 gap-8">
        <!-- Колонка с брендом -->
        <div class="col-span-2 space-y-4">
          <div class="flex items-center gap-2.5">
            <img alt="ФСП" class="h-8 w-auto" src="/brand/logo_01.svg" />
            <span class="font-bold text-xl text-white font-mono"
              >Hunt<span class="text-fsp-blue">Me</span></span
            >
          </div>
          <p class="text-gray-400 text-xs leading-relaxed max-w-sm">
            Цифровая платформа обратного рекрутинга с верифицированным профилем достижений Федерации
            спортивного программирования России (ФСП).
          </p>
          <div class="pt-2 text-[11px] text-gray-500 font-mono">
            При поддержке Проекта Мэра Москвы и ЛЦТ
          </div>
        </div>

        <!-- Навигация 1: Соискателям -->
        <div class="space-y-3">
          <div class="text-white font-bold font-mono uppercase tracking-wider text-xs">
            Соискателям
          </div>
          <ul class="space-y-2">
            <li>
              <a
                class="hover:text-white transition-colors"
                href="#"
                @click.prevent="roleStore.setRole('candidate')"
                >Пройти тестирование</a
              >
            </li>
            <li>
              <a
                class="hover:text-white transition-colors"
                href="#"
                @click.prevent="roleStore.setRole('candidate')"
                >Привязать FSP ID</a
              >
            </li>
            <li><a class="hover:text-white transition-colors" href="#">Банк категорий</a></li>
            <li><a class="hover:text-white transition-colors" href="#">Правила анонимности</a></li>
          </ul>
        </div>

        <!-- Навигация 2: Работодателям -->
        <div class="space-y-3">
          <div class="text-white font-bold font-mono uppercase tracking-wider text-xs">
            Работодателям
          </div>
          <ul class="space-y-2">
            <li>
              <a
                class="hover:text-white transition-colors"
                href="#"
                @click.prevent="roleStore.setRole('employer')"
                >Поиск кандидатов</a
              >
            </li>
            <li>
              <a
                class="hover:text-white transition-colors"
                href="#"
                @click.prevent="roleStore.setRole('employer')"
                >Explainable AI Match</a
              >
            </li>
            <li><a class="hover:text-white transition-colors" href="#">Правила офферов</a></li>
            <li><a class="hover:text-white transition-colors" href="#">Для корпораций</a></li>
          </ul>
        </div>

        <!-- Навигация 3: Документы и ФСП -->
        <div class="space-y-3">
          <div class="text-white font-bold font-mono uppercase tracking-wider text-xs">
            Правовая база
          </div>
          <ul class="space-y-2">
            <li><a class="hover:text-white transition-colors" href="#">Согласие 152-ФЗ</a></li>
            <li>
              <a class="hover:text-white transition-colors" href="#">Политика конфиденциальности</a>
            </li>
            <li><a class="hover:text-white transition-colors" href="#">Регламент ФСП</a></li>
            <li>
              <a
                class="hover:text-white transition-colors font-mono"
                href="/api/openapi.yaml"
                target="_blank"
                >OpenAPI Specification</a
              >
            </li>
          </ul>
        </div>
      </div>

      <!-- Нижняя полоса -->
      <div
        class="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-[11px] font-mono"
      >
        <div>
          © 2026 HuntMe & Федерация спортивного программирования России. Все права защищены.
        </div>
        <div class="flex items-center gap-4">
          <span>Москва, Россия</span>
          <span>•</span>
          <span>Версия 1.0.0</span>
        </div>
      </div>
    </div>
  </footer>
</template>
