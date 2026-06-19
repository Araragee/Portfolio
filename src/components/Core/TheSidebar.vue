<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useJourneyStore } from '@/stores/journey'
import { journeyChapters } from '@/data/journeyData'

const route = useRoute()
const store = useJourneyStore()

const isJourney = computed(() => route.name === 'Journey')

const activeIndexStr = computed(
  () => journeyChapters[store.activeChapterIndex]?.index || '000',
)
const maxIndex = Math.max(...journeyChapters.map((c) => parseInt(c.index, 10)))
const totalStr = `00${maxIndex}`
const scrollPercent = computed(() => Math.round(store.scrollProgress * 100))
</script>

<template>
  <div
    v-if="isJourney"
    class="fixed right-1.5 md:right-6 top-1/2 z-50 flex -translate-y-1/2 flex-col items-center opacity-100"
  >
    <!-- We wrap the main sidebar content to layout them correctly -->
    <div class="flex flex-col items-center justify-center gap-8">

      <!-- 0. Mobile route icons — the navbar is hidden on the journey, so phones
           reach the other sections from here, above the progress rail. -->
      <nav class="md:hidden flex flex-col items-center gap-2 pointer-events-auto" aria-label="Sections">
        <router-link
          to="/"
          aria-label="Case studies"
          class="grid h-8 w-8 place-items-center border border-primary bg-surface text-primary transition-colors active:bg-primary active:text-surface"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4" aria-hidden="true">
            <rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" />
            <rect x="4" y="14" width="6" height="6" /><rect x="14" y="14" width="6" height="6" />
          </svg>
        </router-link>
        <router-link
          to="/personal"
          aria-label="Personal"
          class="grid h-8 w-8 place-items-center border border-primary bg-surface text-primary transition-colors active:bg-primary active:text-surface"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true">
            <circle cx="12" cy="8" r="3.5" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
          </svg>
        </router-link>
      </nav>

      <!-- 1. Progress Rail -->
      <div class="flex flex-col items-center gap-3 opacity-50 md:opacity-100 transition-opacity pointer-events-none">
        <span class="hidden md:block font-mono text-xs tabular-nums tracking-widest text-primary">
          {{ scrollPercent }}%
        </span>
        <div class="flex flex-col items-center gap-2">
          <span
            v-for="(chapter, i) in journeyChapters"
            :key="chapter.id"
            class="h-1.5 w-1.5 border border-primary transition-colors duration-200"
            :class="i === store.activeChapterIndex ? 'bg-primary' : 'bg-transparent'"
          />
        </div>
        <span class="hidden md:block font-mono text-xs tracking-widest text-secondary">
          {{ activeIndexStr }}—{{ totalStr }}
        </span>
      </div>

      <!-- 2. Other Navigation Links -->
      <nav class="hidden md:flex flex-col items-center gap-6 mt-4 pointer-events-auto">
        <router-link
          to="/"
          class="font-headline text-label uppercase tracking-widest text-secondary hover:text-primary transition-colors [writing-mode:vertical-rl] rotate-180"
        >
          Case Studies
        </router-link>
        <router-link
          to="/personal"
          class="font-headline text-label uppercase tracking-widest text-secondary hover:text-primary transition-colors [writing-mode:vertical-rl] rotate-180"
        >
          Personal
        </router-link>
      </nav>

    </div>
  </div>
</template>

<style scoped>
</style>
