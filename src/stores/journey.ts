import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fieldOffsetFor, journeyChapters } from '@/data/journeyData'
import type { MorphStateId } from '@/types/journey'

/**
 * Scroll-derived journey state, shared between the DOM chapters and the
 * WebGL canvas. The single writer is JourneyPage (via Lenis scroll events);
 * everything else reads.
 *
 * Morph timing: each chapter HOLDS its formation for the first 60% of its
 * runway, then transitions to the next chapter's formation over the last 40%.
 * Scrubbed by scroll — no clocked duration, so the 300ms rule doesn't apply.
 */

/** Fraction of a chapter's runway spent holding before the morph begins. Now in journeyData. */

export const useJourneyStore = defineStore('journey', () => {
  /** 0–1 across the entire journey container. */
  const scrollProgress = ref(0)

  // Chapter runway weights (a 300vh chapter owns more of the progress range)
  const weights = journeyChapters.map((c) => c.heightVh)
  const totalWeight = weights.reduce((sum, w) => sum + w, 0)
  const starts: number[] = []
  let acc = 0
  for (const w of weights) {
    starts.push(acc / totalWeight)
    acc += w
  }

  const activeChapterIndex = computed(() => {
    const p = scrollProgress.value
    for (let i = starts.length - 1; i >= 0; i--) {
      if (p >= starts[i]) return i
    }
    return 0
  })

  /** 0–1 within the active chapter's runway. */
  const chapterProgress = computed(() => {
    const i = activeChapterIndex.value
    const start = starts[i]
    const end = i + 1 < starts.length ? starts[i + 1] : 1
    const span = end - start
    if (span <= 0) return 0
    return Math.min(1, Math.max(0, (scrollProgress.value - start) / span))
  })

  const morphFrom = computed<MorphStateId>(
    () => journeyChapters[activeChapterIndex.value].morphState,
  )

  const morphTo = computed<MorphStateId>(() => {
    const next = Math.min(activeChapterIndex.value + 1, journeyChapters.length - 1)
    return journeyChapters[next].morphState
  })

  /** 0 while holding, ramps 0→1 across the morph window. Drives uProgress. */
  const morphT = computed(() => {
    const cp = chapterProgress.value
    const currentChapter = journeyChapters[activeChapterIndex.value]
    const morphStart = currentChapter?.morphStart ?? 0.1
    const morphEnd = currentChapter?.morphEnd ?? 0.5
    
    if (cp <= morphStart) return 0
    if (cp >= morphEnd) return 1
    return (cp - morphStart) / (morphEnd - morphStart)
  })

  const cameraZ = computed(() => {
    // Continuous dolly: lerp from the PREVIOUS chapter's Z (where the camera
    // actually is at the boundary) to this chapter's Z over the first half of
    // the runway. Lerping from a fixed base would snap at every boundary.
    const i = activeChapterIndex.value
    const fromZ = i > 0 ? journeyChapters[i - 1].cameraZ : journeyChapters[0].cameraZ
    const targetZ = journeyChapters[i].cameraZ
    const t = Math.min(1, chapterProgress.value * 2)
    return fromZ + (targetZ - fromZ) * t
  })

  /** Field offset of the active chapter (uOffsetFrom). */
  const fieldOffsetFrom = computed<[number, number]>(() =>
    fieldOffsetFor(journeyChapters[activeChapterIndex.value]),
  )

  /** Field offset of the next chapter (uOffsetTo) — morph slides toward it. */
  const fieldOffsetTo = computed<[number, number]>(() => {
    const next = Math.min(activeChapterIndex.value + 1, journeyChapters.length - 1)
    return fieldOffsetFor(journeyChapters[next])
  })

  // --- Loader readiness (docs/TWEAKS/B-loading-splash.md) ---
  const assetsLoaded = ref(false)        // vendor-three chunk arrived
  const firstFrameRendered = ref(false)  // ParticleField drew a frame
  const fontsLoaded = ref(false)         // document.fonts.ready

  const loaderProgress = computed(() => {
    const done = [assetsLoaded.value, firstFrameRendered.value, fontsLoaded.value]
      .filter(Boolean).length
    return done === 3 ? 100 : Math.round((done / 3) * 100)
  })

  const journeyReady = computed(
    () => assetsLoaded.value && firstFrameRendered.value && fontsLoaded.value,
  )

  function markAssetsLoaded(): void {
    assetsLoaded.value = true
  }
  function markFirstFrame(): void {
    firstFrameRendered.value = true
  }
  function markFontsLoaded(): void {
    fontsLoaded.value = true
  }

  function setScrollProgress(value: number): void {
    scrollProgress.value = Math.min(1, Math.max(0, value))
  }

  return {
    scrollProgress,
    activeChapterIndex,
    chapterProgress,
    morphFrom,
    morphTo,
    morphT,
    cameraZ,
    fieldOffsetFrom,
    fieldOffsetTo,
    loaderProgress,
    journeyReady,
    markAssetsLoaded,
    markFirstFrame,
    markFontsLoaded,
    setScrollProgress,
  }
})
