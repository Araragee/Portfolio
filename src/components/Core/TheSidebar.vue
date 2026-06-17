<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useJourneyStore } from '@/stores/journey'
import { journeyChapters } from '@/data/journeyData'
import DuckParticle from '@/components/Manifest/DuckParticle.vue'

const route = useRoute()
const store = useJourneyStore()

const isJourney = computed(() => route.name === 'Journey')

const activeIndexStr = computed(
  () => journeyChapters[store.activeChapterIndex]?.index || '000',
)
const maxIndex = Math.max(...journeyChapters.map((c) => parseInt(c.index, 10)))
const totalStr = `00${maxIndex}`
const scrollPercent = computed(() => Math.round(store.scrollProgress * 100))

function jumpToChapter(index: number) {
  store.scrollToChapterIndex(index)
}
</script>

<template>
  <div
    v-if="isJourney"
    class="fixed right-1.5 md:right-6 top-1/2 z-50 flex -translate-y-1/2 flex-col items-center opacity-100"
  >
    <!-- We wrap the main sidebar content to layout them correctly -->
    <div class="flex flex-col items-center justify-center gap-8">

      <!-- 1. Progress Rail (Interactive) -->
      <div class="flex flex-col items-center gap-3 opacity-50 md:opacity-100 transition-opacity">
        <span class="hidden md:block font-mono text-xs tabular-nums tracking-widest text-primary">
          {{ scrollPercent }}%
        </span>
        <div class="flex flex-col items-center gap-2">
          <button
            v-for="(chapter, i) in journeyChapters"
            :key="chapter.id"
            @click="jumpToChapter(i)"
            class="h-1.5 w-1.5 border border-primary transition-all duration-200 hover:scale-150 cursor-pointer"
            :class="i === store.activeChapterIndex ? 'bg-primary' : 'bg-transparent hover:bg-primary/30'"
            :aria-label="`Jump to ${chapter.title}`"
          />
        </div>
        <span class="hidden md:block font-mono text-xs tracking-widest text-secondary">
          {{ activeIndexStr }}—{{ totalStr }}
        </span>
      </div>

      <!-- 2. Rubber Ducky Link (How I Work) -->
      <router-link
        to="/manifesto"
        class="mt-2 md:mt-8 pointer-events-auto hover:opacity-80 transition-opacity active:scale-95 group relative flex flex-col items-center justify-center"
        aria-label="How I work"
      >
        <div class="w-24 h-24">
          <DuckParticle />
        </div>
        <!-- Optional hover label for clarity -->
        <span class="absolute -left-20 top-1/2 -translate-y-1/2 font-mono text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity text-primary whitespace-nowrap bg-surface px-2 py-1 border border-outline-variant rounded">
          How I work
        </span>
      </router-link>

      <!-- 3. Other Navigation Links -->
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
