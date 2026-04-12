<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'
import HeroSection from '@/components/Home/HeroSection.vue'
import TechMarquee from '@/components/Home/TechMarquee.vue'
import ProjectsArchive from '@/components/Home/ProjectsArchive.vue'
import BentoSection from '@/components/Home/BentoSection.vue'
import CTASection from '@/components/Home/CTASection.vue'

useSeoMeta({
  title: 'ARCHITECT.VUE — Frontend Engineer',
  description: 'Senior Vue.js & TypeScript engineer specializing in scalable web architectures, design systems, and performance optimization.',
  ogTitle: 'ARCHITECT.VUE — Frontend Engineer',
  ogDescription: 'Senior Vue.js & TypeScript engineer specializing in scalable web architectures.',
})
</script>

<template>
  <main class="pt-40" id="main-content">
    <HeroSection />
    <TechMarquee />
    <ProjectsArchive />
    <BentoSection />
    <CTASection />
  </main>
</template>
