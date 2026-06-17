<script setup lang="ts">
import { defineAsyncComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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

    <div class="relative z-10">
      <ChapterSection
        v-for="chapter in journeyChapters"
        :key="chapter.id"
        :chapter="chapter"
      />
    </div>
  </main>
</template>
