<script setup lang="ts">
import ProjectRow from './ProjectRow.vue'
import { projects } from '@/data/projectsData'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

const { elementRef } = useScrollAnimation({ threshold: 0.05 })
</script>

<template>
  <section ref="elementRef" class="mb-20 md:mb-40" aria-labelledby="projects-archive-heading">
    <!-- Header -->
    <div class="section-padding mb-10 md:mb-12 flex justify-between items-end">
      <h2
        id="projects-archive-heading"
        class="font-mono text-label uppercase text-secondary"
      >
        PROJECTS ARCHIVE
      </h2>
      <span class="font-mono text-label uppercase text-secondary opacity-50">
        001 — 00{{ projects.length }}
      </span>
    </div>

    <!-- Project rows -->
    <ProjectRow
      v-for="project in projects"
      :key="project.slug"
      :project="project"
    />
  </section>
</template>
