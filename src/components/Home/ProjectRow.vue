<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import type { Project } from '@/types/caseStudy'

const props = defineProps<{
  project: Project
}>()

const router = useRouter()
const { elementRef } = useScrollAnimation({ threshold: 0.08, rootMargin: '50px' })

function navigate() {
  router.push(`/case-study/${props.project.slug}`)
}
</script>

<template>
  <a
    ref="elementRef"
    :href="`/case-study/${project.slug}`"
    class="project-row group relative w-full border-t border-outline overflow-hidden transition-all duration-700 cursor-pointer block no-underline text-on-surface"
    :aria-label="`View case study: ${project.title}`"
    :id="`project-row-${project.slug}`"
    @click.prevent="navigate"
  >
    <!-- Background image — grayscale hover reveal -->
    <img
      class="project-bg absolute inset-0 w-full h-full object-cover opacity-0 grayscale transition-all duration-1000 pointer-events-none z-0"
      :src="project.backgroundImage"
      :alt="project.title"
      width="1200"
      height="800"
      loading="lazy"
      decoding="async"
    />

    <!-- Foreground content -->
    <div
      class="relative z-10 section-padding py-12 md:py-20 lg:py-32 flex flex-col md:flex-row justify-between items-start md:items-center group-hover:bg-surface-bright/40 transition-colors duration-700"
    >
      <!-- Left: index + giant title + hover arrow -->
      <div class="flex items-start gap-6 md:gap-12 w-full md:w-auto">
        <span class="font-mono text-label mt-4 md:mt-6 opacity-30">{{ project.index }}</span>
        <div class="flex items-center gap-4">
          <h3
            class="project-title font-headline font-bold text-display uppercase leading-none transition-transform duration-500"
          >
            {{ project.title }}
          </h3>
          <!-- Hover arrow -->
          <svg
            class="project-arrow w-6 h-6 md:w-8 md:h-8 opacity-0 -translate-x-3 transition-all duration-500 text-on-surface/50 hidden md:block flex-shrink-0 mt-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
          </svg>
        </div>
      </div>

      <!-- Right: category + description -->
      <div class="flex flex-col items-start md:items-end w-full md:w-auto mt-6 md:mt-0">
        <span class="font-mono text-label uppercase text-secondary mb-3 opacity-50">
          {{ project.categoryLabel }}
        </span>
        <p class="font-body text-body-sm md:text-body md:text-right max-w-sm leading-tight text-on-surface/70">
          {{ project.description }}
        </p>
      </div>
    </div>
  </a>
</template>
