<script setup lang="ts">
import { computed } from 'vue'
import { journeyDeckProjects } from '@/data/projectsData'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { useJourneyStore } from '@/stores/journey'

const store = useJourneyStore()
const { prefersReducedMotion } = useReducedMotion()

const cardPos = computed(() => store.projectDeckProgress)

/** One card pushes up and fades as the next pulls in from below — one motion. */
function cardStyle(k: number): Record<string, string> {
  if (prefersReducedMotion.value) return {}
  const d = k - cardPos.value
  const ad = Math.abs(d)
  return {
    transform: `translateY(${d * 120}%) scale(${1 - Math.min(ad, 1) * 0.06})`,
    opacity: String(Math.max(0, 1 - ad * 1.25)),
    pointerEvents: ad < 0.5 ? 'auto' : 'none',
    zIndex: String(100 - Math.round(ad * 10)),
  }
}
</script>

<template>
  <div class="relative" :class="prefersReducedMotion ? 'space-y-6' : 'h-44 md:h-52'">
    <RouterLink
      v-for="(project, k) in journeyDeckProjects"
      :key="project.slug"
      :to="`/case-study/${project.slug}`"
      class="group block border-l border-outline-variant/30 pl-4 transition-colors hover:border-primary active:opacity-60"
      :class="prefersReducedMotion ? '' : 'absolute inset-x-0 top-0 will-change-transform'"
      :style="cardStyle(k)"
    >
      <span class="font-mono text-xs uppercase tracking-widest text-outline-variant">
        {{ project.index }} / {{ project.categoryLabel }}
      </span>
      <h3 class="mt-2 font-headline text-2xl md:text-3xl font-medium tracking-tight text-primary">
        {{ project.title }}
      </h3>
      <p class="mt-1 font-mono text-xs uppercase tracking-widest text-secondary">
        {{ project.role }}
      </p>
      <p class="mt-1 md:mt-2 font-body text-xs md:text-sm text-outline-variant">
        {{ project.stack }}
      </p>
    </RouterLink>
  </div>
</template>
