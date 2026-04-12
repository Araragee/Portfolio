<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Project } from '@/types/caseStudy'

const props = defineProps<{
  project: Project
}>()

const router = useRouter()

function navigate() {
  router.push(`/case-study/${props.project.slug}`)
}
</script>

<template>
  <div
    class="project-row group relative w-full border-t border-outline overflow-hidden transition-all duration-700 cursor-pointer"
    role="link"
    :tabindex="0"
    :aria-label="`View case study: ${project.title}`"
    :id="`project-row-${project.slug}`"
    @click="navigate"
    @keydown.enter="navigate"
    @keydown.space.prevent="navigate"
  >
    <!-- Background image — grayscale hover reveal -->
    <img
      class="project-bg absolute inset-0 w-full h-full object-cover opacity-0 grayscale transition-all duration-1000 pointer-events-none z-0"
      :src="project.backgroundImage"
      :alt="project.title"
      loading="lazy"
    />

    <!-- Foreground content -->
    <div
      class="relative z-10 px-6 md:px-[120px] py-20 md:py-32 flex flex-col md:flex-row justify-between items-start md:items-center group-hover:bg-surface-bright/40 transition-colors duration-700"
    >
      <!-- Left: index + giant title -->
      <div class="flex items-start gap-12 w-full md:w-auto">
        <span class="font-mono text-[11px] mt-6 opacity-30">{{ project.index }}</span>
        <h3
          class="font-headline font-bold tracking-[-0.03em] uppercase leading-none"
          style="font-size: clamp(2.5rem, 8vw, 90px);"
        >
          {{ project.title }}
        </h3>
      </div>

      <!-- Right: category + description -->
      <div class="flex flex-col items-start md:items-end w-full md:w-auto mt-8 md:mt-0">
        <span class="font-mono text-[11px] tracking-[0.3em] uppercase text-secondary mb-4 opacity-50">
          {{ project.categoryLabel }}
        </span>
        <p class="font-body text-xl md:text-2xl md:text-right max-w-sm leading-tight text-on-surface/70">
          {{ project.description }}
        </p>
      </div>
    </div>
  </div>
</template>
