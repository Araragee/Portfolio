<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'
import HeroSection from '@/components/Home/HeroSection.vue'
import ProjectsArchive from '@/components/Home/ProjectsArchive.vue'
import BentoSection from '@/components/Home/BentoSection.vue'
import CTASection from '@/components/Home/CTASection.vue'

useSeoMeta({
  title: 'Dave Gonzales — Vue.js & TypeScript Developer',
  description: 'Portfolio of Dave Gonzales, a Vue.js and TypeScript developer in the Philippines. Front-end work on the CBMS Portal at the Philippine Statistics Authority.',
  ogTitle: 'Dave Gonzales — Vue.js & TypeScript Developer',
  ogDescription: 'Portfolio of Dave Gonzales, a Vue.js and TypeScript developer in the Philippines. Front-end work on the CBMS Portal at the Philippine Statistics Authority.',
})
</script>

<template>
  <main class="pt-28 md:pt-40" id="main-content">
    <HeroSection />
    <ProjectsArchive />
    <BentoSection />
    <CTASection />
  </main>
</template>
