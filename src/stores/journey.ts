import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fieldOffsetFor, journeyChapters } from '@/data/journeyData'
import type { JourneyChapter, MorphStateId } from '@/types/journey'

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

  function stagesFor(chapter: JourneyChapter): MorphStateId[] {
    return [chapter.morphState, ...(chapter.extraStages ?? [])]
  }

  /**
   * Active in-chapter segment. Chapters without extraStages have a single
   * segment, so sp == chapterProgress and behavior is unchanged. The last
   * segment's morph target is the next chapter's formation.
   */
  const segment = computed(() => {
    const chapter = journeyChapters[activeChapterIndex.value]
    const list = stagesFor(chapter)
    const S = list.length
    const cp = chapterProgress.value
    const k = Math.min(S - 1, Math.floor(cp * S))
    const sp = Math.min(1, Math.max(0, cp * S - k))
    return { list, S, k, sp }
  })

  const morphFrom = computed<MorphStateId>(() => segment.value.list[segment.value.k])

  const morphTo = computed<MorphStateId>(() => {
    const { list, S, k } = segment.value
    if (k + 1 < S) return list[k + 1]
    const next = Math.min(activeChapterIndex.value + 1, journeyChapters.length - 1)
    return journeyChapters[next].morphState
  })

  /**
   * 0 while holding, ramps 0→1 across the morph window. Drives uProgress.
   * morphStart/morphEnd are fractions of the active SEGMENT (== the whole
   * runway for single-stage chapters).
   */
  const morphT = computed(() => {
    const { sp } = segment.value
    const currentChapter = journeyChapters[activeChapterIndex.value]
    const morphStart = currentChapter?.morphStart ?? 0.1
    const morphEnd = currentChapter?.morphEnd ?? 0.5

    if (sp <= morphStart) return 0
    if (sp >= morphEnd) return 1
    return (sp - morphStart) / (morphEnd - morphStart)
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

  /**
   * Field offset the morph slides toward (uOffsetTo). In-chapter stages keep
   * the chapter's own offset (no slide); the final segment slides to the
   * next chapter's offset as before.
   */
  const fieldOffsetTo = computed<[number, number]>(() => {
    const { S, k } = segment.value
    if (k + 1 < S) return fieldOffsetFor(journeyChapters[activeChapterIndex.value])
    const next = Math.min(activeChapterIndex.value + 1, journeyChapters.length - 1)
    return fieldOffsetFor(journeyChapters[next])
  })

  // --- Phase 7: adaptive degrade ladder ---
  // Tier 0 = full quality; each step sacrifices one layer to recover fps.
  // ParticleField drives progression; JourneyCanvas reads dpr.
  const degradeTier = ref(0)
  const ditherEnabled = computed(() => degradeTier.value < 1)

  function advanceDegradeLevel(): void {
    if (degradeTier.value < 3) degradeTier.value++
  }

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
    degradeTier,
    ditherEnabled,
    advanceDegradeLevel,
  }
})
