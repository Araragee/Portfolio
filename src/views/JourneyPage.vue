<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ChapterSection from '@/components/Journey/ChapterSection.vue'
import JourneyLoader from '@/components/Journey/JourneyLoader.vue'
import SEOHead from '@/components/SEOHead.vue'
import { useLenis } from '@/composables/useLenis'
import { useWebGLSupport } from '@/composables/useWebGLSupport'
import { journeyChapters } from '@/data/journeyData'
import { useJourneyStore } from '@/stores/journey'

// Lazy: three + @tresjs/core live in an async chunk and never block first paint
const JourneyCanvas = defineAsyncComponent(
  () => import('@/components/Journey/JourneyCanvas.vue'),
)

const store = useJourneyStore()
const { webglSupported } = useWebGLSupport()
const { onScroll, lenis } = useLenis()
const route = useRoute()

const containerRef = ref<HTMLElement | null>(null)

// Scroll math cached — no getBoundingClientRect per tick
// (docs/TWEAKS/C-performance.md item 5)
let containerTop = 0
let scrollableHeight = 0

function measure(): void {
  const el = containerRef.value
  if (!el) return
  containerTop = el.offsetTop
  scrollableHeight = el.offsetHeight - window.innerHeight
}

function updateProgress(): void {
  if (scrollableHeight <= 0) return
  store.setScrollProgress((window.scrollY - containerTop) / scrollableHeight)
}

function onWindowResize(): void {
  measure()
  updateProgress()
}

onScroll(updateProgress)

// Snap-to-station removed for now (was useJourneySnap) — free scroll only.

// Numbered chapters only — "AUX" entries (e.g. how-i-work) sit outside the
// 000-005 sequence and get their own rail icon instead of a tick/number.
const numberedChapters = journeyChapters
  .map((chapter, idx) => ({ chapter, idx }))
  .filter(({ chapter }) => /^\d+$/.test(chapter.index))
const activeIndexStr = computed(() => {
  for (let i = store.activeChapterIndex; i >= 0; i--) {
    if (/^\d+$/.test(journeyChapters[i].index)) return journeyChapters[i].index
  }
  return '000'
})
const maxIndex = Math.max(...numberedChapters.map(({ chapter }) => parseInt(chapter.index, 10)))
const totalStr = `00${maxIndex}`
const scrollPercent = computed(() => Math.round(store.scrollProgress * 100))

const howIWorkChapterId = 'how-i-work'
const isHowIWorkActive = computed(
  () => journeyChapters[store.activeChapterIndex]?.id === howIWorkChapterId,
)

function goToHowIWork(): void {
  lenis.value?.scrollTo(`#${howIWorkChapterId}`, { offset: 0 })
}

function startJourney(): void {
  lenis.value?.start()
  measure()
  if (route.hash) {
    lenis.value?.scrollTo(route.hash, { offset: 0, immediate: true })
  }
  updateProgress()
}

onMounted(() => {
  // Prevent browser from restoring scroll position
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }
  window.scrollTo(0, 0)
  measure()
  window.addEventListener('resize', onWindowResize, { passive: true })

  document.fonts.ready.then(() => store.markFontsLoaded())

  // No WebGL: the canvas milestones can never fire — resolve them so the
  // loader only gates on fonts (docs/TWEAKS/B-loading-splash.md)
  if (!webglSupported.value) {
    store.markAssetsLoaded()
    store.markFirstFrame()
  }

  // Scroll stays locked behind the splash until everything is ready
  if (!store.journeyReady) {
    lenis.value?.stop()
  } else {
    startJourney()
  }
})

watch(
  () => store.journeyReady,
  (ready) => {
    if (ready) startJourney()
  },
)

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize)
})
</script>

<template>
  <main ref="containerRef" class="relative bg-surface" id="main-content" tabindex="-1">
    <SEOHead title="Davxloper" />
    <JourneyLoader />
    <JourneyCanvas v-if="webglSupported" />
    <!-- No WebGL: static dithered background -->
    <div
      v-else
      class="bg-dither-noise pointer-events-none fixed inset-0 z-0 opacity-[0.045]"
      aria-hidden="true"
    />

    <!-- Sidebar: progress rail + site nav (journey has no top header — D1) -->
    <div
      class="fixed right-1.5 md:right-6 top-1/2 z-50 flex -translate-y-1/2 flex-col items-center gap-3 opacity-50 md:opacity-100"
    >
      <!-- Progress rail: live %, chapter ticks (docs/TWEAKS/D-pacing.md) -->
      <!-- Mobile: ticks only, hugging the edge — labels overlap chapter text -->
      <div
        class="pointer-events-none flex flex-col items-center gap-3"
        aria-hidden="true"
      >
        <span class="hidden md:block font-mono text-xs tabular-nums tracking-widest text-primary">
          {{ scrollPercent }}%
        </span>
        <div class="flex flex-col items-center gap-2">
          <span
            v-for="{ chapter, idx } in numberedChapters"
            :key="chapter.id"
            class="h-1.5 w-1.5 border border-primary transition-colors duration-200"
            :class="idx === store.activeChapterIndex ? 'bg-primary' : 'bg-transparent'"
          />
        </div>
        <span class="hidden md:block font-mono text-xs tracking-widest text-secondary">
          {{ activeIndexStr }}—{{ totalStr }}
        </span>
      </div>

      <!-- Site nav, folded into the sidebar (no top header on the journey page) -->
      <nav class="pointer-events-auto mt-3 flex flex-col items-center" aria-label="Site navigation">
        <router-link
          to="/personal"
          class="hidden md:block font-mono text-[10px] uppercase tracking-widest text-secondary transition-colors hover:text-primary [writing-mode:vertical-rl]"
        >
          Personal
        </router-link>

        <!-- How I work → the journey's rubber-duck particle chapter -->
        <button
          type="button"
          class="mt-8 flex h-24 w-4 items-center justify-center transition-colors hover:text-primary"
          :class="isHowIWorkActive ? 'text-primary' : 'text-secondary'"
          aria-label="How I work"
          @click="goToHowIWork"
        >
          <svg viewBox="0 0 32 32" class="h-4 w-4" fill="currentColor" aria-hidden="true">
            <circle cx="14" cy="20" r="10" />
            <circle cx="20" cy="10" r="7" />
            <path d="M26 9 L31 10 L26 13 Z" />
          </svg>
        </button>
      </nav>
    </div>

    <div class="relative z-10">
      <ChapterSection
        v-for="chapter in journeyChapters"
        :key="chapter.id"
        :chapter="chapter"
      />
    </div>
  </main>
</template>
