<script lang="ts" setup>
import { ref } from 'vue'
import AuthCard from '@/components/auth/AuthCard.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import VerifyEmailForm from '@/components/auth/VerifyEmailForm.vue'
import { useAuth } from '@/composables/useAuth'

const { pendingEmail, setPendingEmail } = useAuth()

const currentStep = ref<'form' | 'verify'>(pendingEmail.value ? 'verify' : 'form')
const registeredEmail = ref(pendingEmail.value || '')

function handleFormSubmitted(email: string) {
  registeredEmail.value = email
  setPendingEmail(email)
  currentStep.value = 'verify'
}

function handleChangeEmail() {
  currentStep.value = 'form'
}
</script>

<template>
  <AuthCard
    :subtitle="
      currentStep === 'form'
        ? 'Создайте профиль и подтвердите спортивный грейд'
        : 'Шаг 2 из 2: верификация электронного адреса'
    "
    :title="currentStep === 'form' ? 'Регистрация в HuntMe' : 'Подтверждение почты'"
  >
    <RegisterForm v-if="currentStep === 'form'" @submitted="handleFormSubmitted" />
    <VerifyEmailForm v-else :email="registeredEmail" @change-email="handleChangeEmail" />
  </AuthCard>
</template>
