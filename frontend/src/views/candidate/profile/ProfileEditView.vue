<script lang="ts" setup>
import ProfilePersonalSection from '@/components/candidate/profile/ProfilePersonalSection.vue'
import ProfileEducationSection from '@/components/candidate/profile/ProfileEducationSection.vue'
import ProfileLanguagesSection from '@/components/candidate/profile/ProfileLanguagesSection.vue'
import ProfileExperienceSection from '@/components/candidate/profile/ProfileExperienceSection.vue'
import ProfileSkillsSection from '@/components/candidate/profile/ProfileSkillsSection.vue'
import ProfileExpectationsSection from '@/components/candidate/profile/ProfileExpectationsSection.vue'
</script>

<template>
  <div class="space-y-6">
    <!-- 1. Личные и контактные данные -->
    <ProfilePersonalSection />

    <!-- 2. Образование -->
    <ProfileEducationSection />

    <!-- 3. Языки -->
    <ProfileLanguagesSection />

    <!-- 4. Опыт работы -->
    <ProfileExperienceSection />

    <!-- 5. Стек и навыки (Hard/Soft) -->
    <ProfileSkillsSection />

    <!-- 6. Зарплатные ожидания и форматы -->
    <ProfileExpectationsSection />
  </div>
</template>
