<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import anime from 'animejs'
import { useJourneyStore } from '@/stores/journey'
import { useReducedMotion } from '@/composables/useReducedMotion'

/**
 * Splash over the journey until the three chunk, fonts, and first canvas
 * frame are ready (docs/TWEAKS/B-loading-splash.md). Eagerly imported —
 * must paint before the vendor-three chunk arrives.
 */

const store = useJourneyStore()
const { prefersReducedMotion } = useReducedMotion()

// Revisits: store flags persist, so the journey may already be ready — skip
const hidden = ref(store.journeyReady)
const rootRef = ref<HTMLElement | null>(null)

// Native scroll lock while visible (Lenis is stopped separately by JourneyPage)
if (!hidden.value) {
  document.documentElement.classList.add('overflow-hidden')
}

function unlock(): void {
  document.documentElement.classList.remove('overflow-hidden')
}

watch(
  () => store.journeyReady,
  (ready) => {
    if (!ready) return
    if (prefersReducedMotion.value || !rootRef.value) {
      hidden.value = true
      unlock()
      return
    }
    // Exit: ease-in, under 300ms (12 principles — exits build momentum)
    anime({
      targets: rootRef.value,
      translateY: '-100%',
      easing: 'easeInCubic',
      duration: 280,
      complete: () => {
        hidden.value = true
        unlock()
      },
    })
  },
)

onBeforeUnmount(unlock)
</script>

<template>
  <div
    v-if="!hidden"
    ref="rootRef"
    class="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-surface"
    role="status"
    aria-label="Loading"
  >
    <span class="font-mono text-xs uppercase tracking-widest text-secondary">DG—25</span>
    <p class="font-headline text-2xl font-medium uppercase tracking-tight text-primary md:text-4xl">
      The long way around
    </p>
    <p class="font-mono text-sm tabular-nums text-on-surface">{{ store.loaderProgress }}%</p>
  </div>
</template>
