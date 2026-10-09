<script lang="ts" setup>
import LandingHeader from '@/components/landing/LandingHeader.vue'
import LandingHero from '@/components/landing/LandingHero.vue'
import LandingPartners from '@/components/landing/LandingPartners.vue'
import LandingHowItWorks from '@/components/landing/LandingHowItWorks.vue'
import LandingForefront from '@/components/landing/LandingForefront.vue'
import LandingWhyUs from '@/components/landing/LandingWhyUs.vue'
import LandingComparison from '@/components/landing/LandingComparison.vue'
import LandingCategoriesDemo from '@/components/landing/LandingCategoriesDemo.vue'
import LandingTestimonials from '@/components/landing/LandingTestimonials.vue'
import LandingCta from '@/components/landing/LandingCta.vue'
import LandingFaq from '@/components/landing/LandingFaq.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

<template>
  <div class="space-y-0 flex flex-col min-h-screen">
    <LandingHeader />
    <main class="flex-1">
      <LandingHero />
      <LandingPartners />
      <LandingHowItWorks />
      <LandingForefront />
      <LandingWhyUs />
      <LandingComparison />
      <LandingCategoriesDemo />
      <LandingTestimonials />
      <LandingCta />
      <LandingFaq />
    </main>
    <AppFooter />
  </div>
</template>
