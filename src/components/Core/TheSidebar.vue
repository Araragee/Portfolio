<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useJourneyStore } from '@/stores/journey'
import { journeyChapters } from '@/data/journeyData'
import { journeyDeckProjects } from '@/data/projectsData'
import { lenis } from '@/composables/useLenis'

const route = useRoute()
const store = useJourneyStore()

const isJourney = computed(() => route.name === 'Journey')
const isCaseStudy = computed(() => route.name === 'CaseStudy')

// ─── Journey rail
const activeIndexStr = computed(
  () => journeyChapters[store.activeChapterIndex]?.index || '000',
)
const maxIndex = Math.max(...journeyChapters.map((c) => parseInt(c.index, 10)))
const totalStr = `00${maxIndex}`
const scrollPercent = computed(() => Math.round(store.scrollProgress * 100))

function jumpToChapter(index: number) {
  const chapter = journeyChapters[index]
  if (!chapter) return
  const el = document.getElementById(chapter.id)
  if (el) lenis.value?.scrollTo(el, { offset: 0 })
}

// ─── Page scroll (non-journey routes)
const pageScrollPct = ref(0)

function updatePageScroll() {
  const el = document.documentElement
  const max = el.scrollHeight - el.clientHeight
  pageScrollPct.value = max > 0 ? Math.round((window.scrollY / max) * 100) : 0
}

onMounted(() => window.addEventListener('scroll', updatePageScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', updatePageScroll))

// ─── Case study project icon
const caseStudyProject = computed(() => {
  if (!isCaseStudy.value) return null
  const slug = route.params.slug as string
  return journeyDeckProjects.find((p) => p.slug === slug) ?? null
})

// ─── Nav
const navLinks = [
  { to: '/', label: 'Journey' },
  { to: '/personal', label: 'Personal' },
  { to: '/manifesto', label: 'How I Work' },
]
</script>

<template>
  <div
    class="fixed right-1.5 md:right-6 top-1/2 z-50 flex -translate-y-1/2 flex-col items-center opacity-100 pointer-events-none"
  >
    <div class="flex flex-col items-center justify-center gap-6 pointer-events-auto">

      <!-- ── Journey: chapter-dot rail ── -->
      <div
        v-if="isJourney"
        class="flex flex-col items-center gap-3 opacity-50 md:opacity-100 transition-opacity"
      >
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

      <!-- ── Other pages: scroll progress bar + optional project icon ── -->
      <div
        v-else
        class="flex flex-col items-center gap-2 opacity-50 md:opacity-100 transition-opacity"
      >
        <!-- Project icon (case study only, if in deck) -->
        <img
          v-if="caseStudyProject"
          :src="caseStudyProject.icon"
          :alt="caseStudyProject.title"
          class="w-5 h-5 object-contain grayscale opacity-80 mb-1"
        />

        <span class="hidden md:block font-mono text-xs tabular-nums tracking-widest text-primary">
          {{ pageScrollPct }}%
        </span>

        <!-- Thin vertical bar -->
        <div class="relative w-px h-24 bg-primary/20">
          <div
            class="absolute top-0 left-0 w-full bg-primary transition-[height] duration-100"
            :style="{ height: `${pageScrollPct}%` }"
          />
        </div>
      </div>

      <!-- ── Site Nav ── -->
      <nav class="flex flex-col items-center gap-4 pointer-events-auto">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="font-headline text-label uppercase tracking-widest transition-colors [writing-mode:vertical-rl] rotate-180"
          :class="route.path === link.to ? 'text-primary' : 'text-secondary hover:text-primary'"
        >
          {{ link.label }}
        </router-link>
      </nav>

    </div>
  </div>
</template>
