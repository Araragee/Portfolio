import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ENTRANCE_VH, fieldOffsetFor, journeyChapters, TRANSITION_VH } from '@/data/journeyData'
import { journeyDeckProjects } from '@/data/projectsData'
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
  // ─── Scroll State (single writer: JourneyPage)
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
      const start = starts[i]
      const end = i + 1 < starts.length ? starts[i + 1] : 1
      const span = end - start
      const E = entranceFrac(chapter.heightVh)
      const pinnedFrac = Math.max(0, (chapter.heightVh - 100) / chapter.heightVh)

      if (chapter.id === 'projects') {
        const deckChapter = chapter
        const N = journeyDeckProjects.length
        const sumPrior = journeyChapters.slice(0, i).reduce((acc, c) => acc + c.heightVh, 0)
        const totalVh = journeyChapters.reduce((acc, c) => acc + c.heightVh, 0)
        const scrollableVh = totalVh - 100

        const getGlobalProgressForVhSincePin = (vh: number) => {
          return (sumPrior + vh) / scrollableVh
        }

        // 1. Portrait hold (initial): vhSincePin midpoint = 10
        out.push(getGlobalProgressForVhSincePin(10))

        // 2. Project holds: for each project k from 0 to N - 1
        const totalActiveVh = deckChapter.heightVh - 100 - 20
        const holdVh = 22
        const finalScrollVh = 30
        const transitionsTotalVh = Math.max(0, totalActiveVh - finalScrollVh - N * holdVh)
        const transitionVh = transitionsTotalVh / N
        const cycleVh = transitionVh + holdVh

        for (let k = 0; k < N; k++) {
          const activeVh = k * cycleVh + transitionVh + holdVh / 2
          const vhSincePin = activeVh + 20
          out.push(getGlobalProgressForVhSincePin(vhSincePin))
        }
        return
      }

      const S = stagesFor(chapter).length
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
  // ─── Morph Derivation (two phases: entrance vs body)
  const projectDeckProgress = computed(() => {
    const deckIdx = journeyChapters.findIndex((c) => c.showProjects)
    if (deckIdx === -1) return -1
    const deckChapter = journeyChapters[deckIdx]
    const N = journeyDeckProjects.length // particle-hero stations in the deck

    const sumPrior = journeyChapters.slice(0, deckIdx).reduce((acc, c) => acc + c.heightVh, 0)
    const totalVh = journeyChapters.reduce((acc, c) => acc + c.heightVh, 0)
    const scrollableVh = totalVh - 100

    const pinScrollProgress = sumPrior / scrollableVh
    const chapterStartGlobal = sumPrior / totalVh
    const chapterSpanGlobal = deckChapter.heightVh / totalVh
    const pinChapterProgress = (pinScrollProgress - chapterStartGlobal) / chapterSpanGlobal

    const chapterProg = getChapterProgress(deckIdx)
    const vhSincePin = (chapterProg - pinChapterProgress) * deckChapter.heightVh

    if (vhSincePin <= 20) return -1

    const activeVh = vhSincePin - 20
    const totalActiveVh = deckChapter.heightVh - 100 - 20

    if (activeVh >= totalActiveVh) return N

    const holdVh = 22
    const finalScrollVh = 30
    const transitionsTotalVh = Math.max(0, totalActiveVh - finalScrollVh - N * holdVh)
    const transitionVh = transitionsTotalVh / N
    const cycleVh = transitionVh + holdVh

    const cycleIndex = Math.floor(activeVh / cycleVh)

    if (cycleIndex >= N) {
      const vhInCycle = activeVh - N * cycleVh
      const t = Math.min(1, vhInCycle / finalScrollVh)
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      return (N - 1) + ease
    }

    const vhInCycle = activeVh % cycleVh
    if (vhInCycle <= transitionVh) {
      const t = vhInCycle / transitionVh
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      return (cycleIndex - 1) + ease
    } else {
      return cycleIndex
    }
  })

  const morphInfo = computed(() => {
    const totalVh = journeyChapters.reduce((acc, c) => acc + c.heightVh, 0)
    const scrollableVh = totalVh - 100
    const scrollVh = scrollProgress.value * scrollableVh

    // Cumulative starts in Vh
    const heights = journeyChapters.map((c) => c.heightVh)
    const startsVh: number[] = []
    let accVh = 0
    for (const h of heights) {
      startsVh.push(accVh)
      accVh += h
    }

    const getLeadVhForTransitionTo = (idx: number) => {
      if (idx === journeyChapters.length - 1) {
        return ENTRANCE_VH + 28 + 20 // 76 vh
      }
      return ENTRANCE_VH + 28 // 56 vh
    }

    // Check if we are in a cross-chapter transition
    for (let idx = 1; idx < journeyChapters.length; idx++) {
      const transitionLead = getLeadVhForTransitionTo(idx)
      const boundaryStart = startsVh[idx] - transitionLead
      const boundaryEnd = boundaryStart + ENTRANCE_VH
      if (scrollVh >= boundaryStart && scrollVh < boundaryEnd) {
        const prev = journeyChapters[idx - 1]
        const curr = journeyChapters[idx]
        const prevList = stagesFor(prev)
        const currList = stagesFor(curr)
        const t = smoothstep((scrollVh - boundaryStart) / ENTRANCE_VH)
        return {
          from: prevList[prevList.length - 1],
          to: currList[0],
          t,
          stageIndex: prevList.length - 1,
          offsetFrom: fieldOffsetFor(prev),
          offsetTo: fieldOffsetFor(curr),
        }
      }
    }

    // Otherwise, we are in the body of some chapter
    let activeIdx = 0
    for (let idx = journeyChapters.length - 1; idx >= 0; idx--) {
      // The body of chapter idx starts after the previous transition ends
      const prevLead = idx > 0 ? getLeadVhForTransitionTo(idx) : 0
      const prevEnd = idx > 0 ? startsVh[idx] - prevLead + ENTRANCE_VH : 0
      if (scrollVh >= prevEnd) {
        activeIdx = idx
        break
      }
    }

    const chapter = journeyChapters[activeIdx]
    const list = stagesFor(chapter)
    const S = list.length
    const off = fieldOffsetFor(chapter)

    if (chapter.id === 'projects') {
      const deckProg = projectDeckProgress.value
      const N = journeyDeckProjects.length
      const pIdx = Math.max(0, Math.min(N + 1, deckProg + 1)) // 0 to N+1
      const fromI = Math.floor(pIdx)
      let toI = Math.ceil(pIdx)
      if (toI === fromI) toI = Math.min(N + 1, fromI + 1)
      
      const states: MorphStateId[] = [
        'portrait',
        'proj_0',
        'proj_1',
        'proj_2',
        'proj_3',
        'proj_4',
        'proj_5',
        'proj_5'
      ]
      const fromState = states[fromI] || 'portrait'
      const toState = states[toI] || 'portrait'
      const t = pIdx % 1
      
      return {
        from: fromState,
        to: toState,
        t,
        stageIndex: fromI,
        offsetFrom: off,
        offsetTo: off,
      }
    }

    // Normal multi-stage chapter body logic
    const prevLead = activeIdx > 0 ? getLeadVhForTransitionTo(activeIdx) : 0
    const prevEnd = activeIdx > 0 ? startsVh[activeIdx] - prevLead + ENTRANCE_VH : 0
    const nextLead = activeIdx + 1 < journeyChapters.length ? getLeadVhForTransitionTo(activeIdx + 1) : 0
    const nextStart = activeIdx + 1 < journeyChapters.length ? startsVh[activeIdx + 1] - nextLead : totalVh - 100
    const bodySpan = nextStart - prevEnd
    const bodyProg = bodySpan > 0 ? Math.min(1, Math.max(0, (scrollVh - prevEnd) / bodySpan)) : 1

    const j = Math.min(S - 1, Math.floor(bodyProg * S))
    if (j >= S - 1) {
      return { from: list[S - 1], to: list[S - 1], t: 0, stageIndex: S - 1, offsetFrom: off, offsetTo: off }
    }
    const sp = Math.min(1, Math.max(0, bodyProg * S - j))
    const subVh = bodySpan / S
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

  // ─── Phase 7: Degradation Ladder
  // Tier 0 = full quality; each step sacrifices one layer to recover fps.
  // ParticleField drives progression; JourneyCanvas reads dpr.
  const degradeTier = ref(0)
  const ditherEnabled = computed(() => degradeTier.value < 1)

  function advanceDegradeLevel(): void {
    if (degradeTier.value < 3) degradeTier.value++
  }

  // ─── Loader Readiness
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
    projectDeckProgress,
  }
})
