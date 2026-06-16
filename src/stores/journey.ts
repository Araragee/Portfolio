import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ENTRANCE_VH, fieldOffsetFor, journeyChapters, TRANSITION_VH } from '@/data/journeyData'
import type { JourneyChapter, MorphStateId } from '@/types/journey'

/** Smoothstep — gentle ease in/out of holds, even though it's scroll-scrubbed. */
function smoothstep(t: number): number {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

/** Entrance window of a chapter as a fraction of its runway. */
function entranceFrac(heightVh: number): number {
  return Math.min(0.9, ENTRANCE_VH / heightVh)
}

/**
 * Scroll-derived journey state, shared between the DOM chapters and the
 * WebGL canvas. The single writer is JourneyPage (via Lenis scroll events);
 * everything else reads.
 *
 * Morph timing: each section HOLDS its formation (the "lock") for most of its
 * runway, then runs a full transition to the next across a fixed TRANSITION_VH
 * window of scroll. Scrubbed by scroll — no clocked duration, so the 300ms rule
 * doesn't apply. See morphBandFor() for where the window sits.
 */

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
   * Snap "stations" in 0–1 progress: where a formation is held and its card is
   * centered (after the entrance morph, before the card unpins). One per chapter,
   * plus each inner stage of a multi-stage chapter whose hold still falls inside
   * the pinned region. useJourneySnap glides here on scroll-settle; the morph
   * scrubs along the way.
   */
  const snapAnchors = computed<number[]>(() => {
    const out: number[] = []
    journeyChapters.forEach((chapter, i) => {
      const S = stagesFor(chapter).length
      const start = starts[i]
      const end = i + 1 < starts.length ? starts[i + 1] : 1
      const span = end - start
      const E = entranceFrac(chapter.heightVh)
      const pinnedFrac = Math.max(0, (chapter.heightVh - 100) / chapter.heightVh)
      for (let j = 0; j < S; j++) {
        // cp where stage j is held: just after it arrives. Stage 0 sits between
        // the entrance end and where the card unpins; inner stages at the start
        // of their sub-segment hold.
        const subStart = S === 1 ? E : E + (j / S) * (1 - E)
        if (subStart >= pinnedFrac) continue // only shows while unpinning — no centered rest
        const restCp =
          S === 1 ? (E + pinnedFrac) / 2 : Math.min(pinnedFrac - 0.001, subStart + 0.25 * ((1 - E) / S))
        out.push(start + restCp * span)
      }
    })
    return out
  })

  /**
   * The single source of morph state. Each chapter's runway has two phases:
   *
   *  ENTRANCE (cp ≤ E): morph the PREVIOUS chapter's held formation into this
   *  chapter's first formation, synced to the card fading in. The field offset
   *  slides here too. This is why a transition reads as "the new shape forms as
   *  the new text appears" — the morph belongs to the next section's entrance,
   *  not the previous section's exit.
   *
   *  BODY (cp > E): hold the formation. Multi-stage chapters (psa-map) morph
   *  between their inner stages here, each holding then morphing over a fixed
   *  TRANSITION_VH band. No field-offset slide within a chapter.
   */
  const morphInfo = computed(() => {
    const i = activeChapterIndex.value
    const chapter = journeyChapters[i]
    const list = stagesFor(chapter)
    const S = list.length
    const cp = chapterProgress.value
    const E = entranceFrac(chapter.heightVh)
    const prev = i > 0 ? journeyChapters[i - 1] : chapter
    const prevList = stagesFor(prev)
    const prevLast = prevList[prevList.length - 1]

    if (cp <= E) {
      return {
        from: prevLast,
        to: list[0],
        t: E > 0 ? smoothstep(cp / E) : 1,
        stageIndex: 0,
        offsetFrom: fieldOffsetFor(prev),
        offsetTo: fieldOffsetFor(chapter),
      }
    }

    const off = fieldOffsetFor(chapter)
    const bodyProg = (cp - E) / (1 - E)
    const j = Math.min(S - 1, Math.floor(bodyProg * S))
    if (j >= S - 1) {
      // Final (or only) stage holds to the end — its morph to the next chapter
      // belongs to that chapter's entrance.
      return { from: list[S - 1], to: list[S - 1], t: 0, stageIndex: S - 1, offsetFrom: off, offsetTo: off }
    }
    const sp = Math.min(1, Math.max(0, bodyProg * S - j))
    const subVh = (chapter.heightVh * (1 - E)) / S
    const band = Math.min(1, TRANSITION_VH / subVh)
    const start = Math.max(0, 1 - band)
    return {
      from: list[j],
      to: list[j + 1],
      t: sp <= start ? 0 : smoothstep((sp - start) / band),
      stageIndex: j,
      offsetFrom: off,
      offsetTo: off,
    }
  })

  const activeStageIndex = computed(() => morphInfo.value.stageIndex)
  const morphFrom = computed<MorphStateId>(() => morphInfo.value.from)
  const morphTo = computed<MorphStateId>(() => morphInfo.value.to)
  const morphT = computed(() => morphInfo.value.t)
  const fieldOffsetFrom = computed<[number, number]>(() => morphInfo.value.offsetFrom)
  const fieldOffsetTo = computed<[number, number]>(() => morphInfo.value.offsetTo)

  const cameraZ = computed(() => {
    // Dolly from the PREVIOUS chapter's Z to this chapter's over the entrance,
    // arriving with the morph and card. Lerping from where the camera actually
    // is at the boundary keeps it continuous (no snap).
    const i = activeChapterIndex.value
    const chapter = journeyChapters[i]
    const fromZ = i > 0 ? journeyChapters[i - 1].cameraZ : journeyChapters[0].cameraZ
    const E = entranceFrac(chapter.heightVh)
    const t = E > 0 ? Math.min(1, chapterProgress.value / E) : 1
    return fromZ + (chapter.cameraZ - fromZ) * t
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

  const getChapterProgress = (index: number): number => {
    const start = starts[index]
    const end = index + 1 < starts.length ? starts[index + 1] : 1
    const span = end - start
    if (span <= 0) return 0
    return Math.min(1, Math.max(0, (scrollProgress.value - start) / span))
  }

  function setScrollProgress(value: number): void {
    scrollProgress.value = Math.min(1, Math.max(0, value))
  }

  return {
    scrollProgress,
    activeChapterIndex,
    activeStageIndex,
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
    getChapterProgress,
    snapAnchors,
  }
})
