<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Project } from '@/types/caseStudy'

const props = defineProps<{
  nextProject: Project
}>()

const router = useRouter()

function navigate() {
  router.push(`/case-study/${props.nextProject.slug}`)
}
</script>

<template>
  <footer class="border-t border-outline">
    <a
      :href="`/case-study/${nextProject.slug}`"
      class="group block w-full flex flex-col items-center justify-center bg-surface text-on-surface transition-colors duration-700 cursor-pointer relative overflow-hidden no-underline"
      style="min-height: 60vh;"
      :id="`next-project-link-${nextProject.slug}`"
      :aria-label="`Next project: ${nextProject.title}`"
      @click.prevent="navigate"
    >
      <!-- Hover overlay — invert to black -->
      <div class="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0"></div>

      <span
        class="font-mono text-[11px] uppercase tracking-[0.3em] mb-12 text-secondary group-hover:text-surface/60 opacity-50 group-hover:opacity-100 transition-all duration-500 relative z-10 transform group-hover:-translate-y-2"
      >
        Next Project
      </span>

      <div class="relative z-10 px-6 text-center">
        <h2
          class="font-headline font-semibold tracking-tighter leading-none group-hover:text-surface transition-colors duration-700"
          style="font-size: clamp(3rem, 12vw, 180px);"
        >
          {{ nextProject.title }}
        </h2>
      </div>

      <div
        class="absolute bottom-16 flex flex-col items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0 z-10"
        aria-hidden="true"
      >
        <svg
          class="w-8 h-8 text-surface animate-bounce"
          fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
        <span class="font-mono text-[11px] uppercase tracking-[0.2em] text-surface">Enter Project</span>
      </div>
    </a>
  </footer>
</template>
