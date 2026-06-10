<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref, computed } from 'vue'
import ChapterSection from '@/components/Journey/ChapterSection.vue'
import SEOHead from '@/components/SEOHead.vue'
import { useLenis } from '@/composables/useLenis'
import { useWebGLSupport } from '@/composables/useWebGLSupport'
import { journeyChapters } from '@/data/journeyData'
import { useJourneyStore } from '@/stores/journey'
import { useRoute } from 'vue-router'

// Lazy: three + @tresjs/core live in an async chunk and never block first paint
const JourneyCanvas = defineAsyncComponent(
  () => import('@/components/Journey/JourneyCanvas.vue'),
)

const store = useJourneyStore()
const { webglSupported } = useWebGLSupport()
const { onScroll, lenis } = useLenis()
const route = useRoute()

const containerRef = ref<HTMLElement | null>(null)

function updateProgress(): void {
  const el = containerRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const scrollable = rect.height - window.innerHeight
  if (scrollable <= 0) return
  store.setScrollProgress(-rect.top / scrollable)
}

onScroll(updateProgress)

const activeIndexStr = computed(() => journeyChapters[store.activeChapterIndex]?.index || '000')
const maxIndex = Math.max(...journeyChapters.map(c => parseInt(c.index, 10)))
const totalStr = `00${maxIndex}`

onMounted(() => {
  // Prevent browser from restoring scroll position
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }

  if (route.hash) {
    setTimeout(() => {
      lenis.value?.scrollTo(route.hash, { offset: 0, immediate: true })
    }, 100)
  } else {
    // Force scroll to top on reload
    window.scrollTo(0, 0)
    setTimeout(() => {
      lenis.value?.scrollTo(0, { immediate: true })
      updateProgress()
    }, 50)
  }
})
</script>

<template>
  <main ref="containerRef" class="relative bg-surface">
    <SEOHead title="Journey — Dave Gonzales" />
    <JourneyCanvas v-if="webglSupported" />
    <!-- No WebGL: static dithered background with SVG noise -->
    <div
      v-else
      class="pointer-events-none fixed inset-0 z-0 bg-surface opacity-[0.045]"
      style="background-image: url(&quot;data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='noise'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23noise)'/></svg>&quot;)"
      aria-hidden="true"
    />

    <!-- Progress Rail -->
    <div class="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4 mix-blend-difference text-white pointer-events-none opacity-50 md:opacity-100">
      <div class="h-16 w-[1px] bg-white opacity-20"></div>
      <span class="font-mono text-xs tracking-widest [writing-mode:vertical-rl] md:[writing-mode:horizontal-tb]">{{ activeIndexStr }}—{{ totalStr }}</span>
      <div class="h-16 w-[1px] bg-white opacity-20"></div>
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
