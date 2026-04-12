<script setup lang="ts">
import ProjectRow from './ProjectRow.vue'
import { projects } from '@/data/projectsData'
</script>

<template>
  <section class="mb-40" aria-labelledby="projects-archive-heading">
    <!-- Header -->
    <div class="px-6 md:px-[120px] mb-12 flex justify-between items-end">
      <h2
        id="projects-archive-heading"
        class="font-mono text-[11px] tracking-[0.3em] uppercase text-secondary"
      >
        PROJECTS ARCHIVE
      </h2>
      <span class="font-mono text-[11px] tracking-[0.3em] uppercase text-secondary opacity-50">
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
