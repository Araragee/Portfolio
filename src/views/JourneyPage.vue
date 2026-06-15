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

const activeIndexStr = computed(
  () => journeyChapters[store.activeChapterIndex]?.index || '000',
)
const maxIndex = Math.max(...journeyChapters.map((c) => parseInt(c.index, 10)))
const totalStr = `00${maxIndex}`
const scrollPercent = computed(() => Math.round(store.scrollProgress * 100))

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
    <SEOHead title="Journey — Dave Gonzales" />
    <JourneyLoader />
    <JourneyCanvas v-if="webglSupported" />
    <!-- No WebGL: static dithered background -->
    <div
      v-else
      class="bg-dither-noise pointer-events-none fixed inset-0 z-0 opacity-[0.045]"
      aria-hidden="true"
    />

    <!-- Progress rail: live %, chapter ticks (docs/TWEAKS/D-pacing.md) -->
    <!-- Mobile: ticks only, hugging the edge — labels overlap chapter text -->
    <div
      class="pointer-events-none fixed right-1.5 md:right-6 top-1/2 z-50 flex -translate-y-1/2 flex-col items-center gap-3 opacity-50 md:opacity-100"
      aria-hidden="true"
    >
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

    <div class="relative z-10">
      <ChapterSection
        v-for="chapter in journeyChapters"
        :key="chapter.id"
        :chapter="chapter"
      />
    </div>
  </main>
</template>
