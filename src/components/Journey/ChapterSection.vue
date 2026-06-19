<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import anime from 'animejs'
import type { JourneyChapter } from '@/types/journey'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { useJourneyStore } from '@/stores/journey'
import { ENTRANCE_VH, journeyChapters, mobileParticlesOnTop } from '@/data/journeyData'
import ProjectDeck from '@/components/Journey/ProjectDeck.vue'

const props = defineProps<{
  chapter: JourneyChapter
}>()

const store = useJourneyStore()
const chapterIdx = journeyChapters.findIndex((c) => c.id === props.chapter.id)

// Copy fades IN across the entrance (with the morph forming the new shape), then
// holds, then fades OUT as the card unpins — decoupled from the morph, which by
// then lives in the NEXT section's entrance.
const smoothstep = (t: number) => {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}
const heights = journeyChapters.map((c) => c.heightVh)
const startsVh: number[] = []
let accVh = 0
for (const h of heights) {
  startsVh.push(accVh)
  accVh += h
}
const totalVh = accVh
const scrollableVh = totalVh - 100

const scrollVh = computed(() => store.scrollProgress * scrollableVh)

const opacity = computed(() => {
  const s = scrollVh.value
  const isLast = chapterIdx === journeyChapters.length - 1
  const startVh = startsVh[chapterIdx]

  const getLeadVhForTransitionTo = (idx: number) => {
    const eVh = journeyChapters[idx]?.entranceVh ?? ENTRANCE_VH
    if (idx === journeyChapters.length - 1) {
      return eVh + 28 + 20
    }
    return eVh + 28
  }

  // 0. Prologue: fade in over first 20vh (done by ~1% scroll)
  if (chapterIdx === 0) {
    if (s < 20) {
      return smoothstep(s / 20) * 0.9
    }
  }

  // 1. Fade in during transition from previous chapter
  if (chapterIdx > 0) {
    const chapterEntrVh = journeyChapters[chapterIdx]?.entranceVh ?? ENTRANCE_VH
    const fadeInLead = getLeadVhForTransitionTo(chapterIdx)
    const fadeInStart = startVh - fadeInLead
    const fadeInEnd = fadeInStart + chapterEntrVh
    if (s < fadeInStart) return 0
    if (s < fadeInEnd) {
      return smoothstep((s - fadeInStart) / chapterEntrVh) * 0.9
    }
  }

  // 2. Fade out during transition to next chapter
  if (!isLast) {
    const nextEntrVh = journeyChapters[chapterIdx + 1]?.entranceVh ?? ENTRANCE_VH
    const fadeOutLead = getLeadVhForTransitionTo(chapterIdx + 1)
    const fadeOutStart = startsVh[chapterIdx + 1] - fadeOutLead
    const fadeOutEnd = fadeOutStart + nextEntrVh
    if (s >= fadeOutEnd) return 0
    if (s >= fadeOutStart) {
      return 0.9 * (1 - smoothstep((s - fadeOutStart) / nextEntrVh))
    }
  }

  return 0.9
})

const { elementRef, isVisible } = useIntersectionObserver({
  threshold: 0,
  once: true,
})
const { prefersReducedMotion } = useReducedMotion()

// Static class lookup so Tailwind can see the literals (no dynamic vh values)
const runwayStyle = computed(
  () =>
    ({
      150: 'h-[150vh]',
      200: 'h-[200vh]',
      300: 'h-[300vh]',
      450: 'h-[450vh]',
      470: 'h-[470vh]',
      500: 'h-[500vh]',
      700: 'h-[700vh]',
    })[props.chapter.heightVh],
)

const activeStat = computed(() => {
  const ss = props.chapter.stageStat
  if (ss?.length) return ss[textStageIndex.value] ?? null
  return props.chapter.stat ?? null
})

const activeTitle = computed(() => {
  const st = props.chapter.stageTitles
  if (st?.length) return st[textStageIndex.value] ?? props.chapter.title
  return props.chapter.title
})

// Which stageParagraphs[] index to show.
// Multi-stage chapters switch every 40vh after entrance
const textStageIndex = computed(() => {
  const sp = props.chapter.stageParagraphs
  if (!sp?.length) return 0
  const N = sp.length
  if (props.chapter.extraStages?.length) {
    if (chapterIdx === store.activeChapterIndex) {
      // psa: drive the card index off the SAME store stage the particle field
      // morphs through, so text and formation change together. Show the
      // from-stage card, swap to the next at the morph midpoint (where
      // deckContainerOpacity dips). Same source ⇒ uniform per-stage scroll.
      if (props.chapter.id === 'psa') {
        const next = store.morphT >= 0.5 ? store.activeStageIndex + 1 : store.activeStageIndex
        return Math.min(N - 1, Math.max(0, next))
      }
      // Use 40vh per stage: calculate which 40vh band we're in
      const s = scrollVh.value
      const startVh = startsVh[chapterIdx]
      const entrVh = props.chapter.entranceVh ?? ENTRANCE_VH
      const vhSincePinned = s - startVh - entrVh
      const stageIndex = Math.min(N - 1, Math.max(0, Math.floor(vhSincePinned / 40)))
      return stageIndex
    }
    const p = store.getChapterProgress(chapterIdx)
    return p < 0.5 ? 0 : N - 1
  }
  const p = store.getChapterProgress(chapterIdx)
  return Math.min(N - 1, Math.floor(p * N))
})

const activeParagraphs = computed(() => {
  const sp = props.chapter.stageParagraphs
  if (sp?.length) return sp[textStageIndex.value] ?? props.chapter.paragraphs
  return props.chapter.paragraphs
})

// Deck card positioning for stage paragraphs — only for multi-stage chapters
const deckCardStyle = computed(() => (stageIdx: number): Record<string, string> => {
  if (!props.chapter.extraStages?.length || prefersReducedMotion.value) return {}
  const current = textStageIndex.value
  const d = stageIdx - current
  const ad = Math.abs(d)

  return {
    transform: `translateY(${d * 100}%) scale(${1 - Math.min(ad, 1) * 0.08})`,
    opacity: String(Math.max(0, 1 - ad * 1.3)),
    pointerEvents: ad < 0.5 ? 'auto' : 'none',
    zIndex: String(100 - Math.round(ad * 10)),
  }
})

// During stage transitions, fade text and show particles
const deckContainerOpacity = computed(() => {
  if (!props.chapter.extraStages?.length) return 1
  if (chapterIdx !== store.activeChapterIndex) return 1

  // psa: tie text fade to the particle morph. Full on holds (morphT 0), dips to
  // ~0.15 at the morph midpoint to mask the card swap — text and formation move
  // as one. Reduced motion: no dip, the card just swaps.
  if (props.chapter.id === 'psa') {
    if (prefersReducedMotion.value) return 1
    return 1 - Math.sin(store.morphT * Math.PI) * 0.85
  }

  const s = scrollVh.value
  const startVh = startsVh[chapterIdx]
  const entrVh = props.chapter.entranceVh ?? ENTRANCE_VH
  const vhSincePinned = s - startVh - entrVh

  // Each 40vh band: 0-30vh show text, 30-40vh morph to particles
  const vhInBand = vhSincePinned % 40
  const morphWindow = vhInBand >= 30 ? (vhInBand - 30) / 10 : 0

  // Fade text during transition (30-40vh of each 40vh band)
  return 1 - morphWindow * 0.7
})

// Deck cards are absolutely stacked, so the container collapses to 0 height and
// the interaction hint below jumps/overlaps as cards change. Reserve the tallest
// card's height (only chapters with stageParagraphs use the stacked deck = psa).
const deckStackMinHeight = computed(() =>
  props.chapter.stageParagraphs?.length ? 'min-h-[13rem] md:min-h-[10rem]' : '',
)

// Crisp face PNG shown over the projects portrait hold: the particle face
// resolves into it, holds, then breaks back into particles (store.faceCrispProgress).
// The background has been removed, so mix-blend-multiply is no longer needed.
// Positioning matches the exact WebGL scaling and offset for perfect alignment.
const faceCrispSrc = import.meta.env.BASE_URL + 'assets/daveno-bg.png'
const faceCrispOpacity = computed(() =>
  prefersReducedMotion.value ? (store.faceCrispProgress > 0.5 ? 1 : 0) : store.faceCrispProgress,
)

const faceCrispStyle = computed(() => {
  const baseStyle = {
    opacity: faceCrispOpacity.value,
    height: '48.3vh',
    transform: 'translate(-50%, -50%)',
  }
  
  if (store.isMobile) {
    // WebGL mobile Y offset is 1.2 for the projects chapter (index 4 -> top half).
    // 1.2 units corresponds to 18.1vh offset upwards.
    return {
      ...baseStyle,
      left: '50%',
      top: 'calc(50% - 18.1vh)',
    }
  } else {
    // WebGL desktop X offset is -2.8 for the projects chapter.
    // -2.8 units corresponds to 42.25vh offset to the left.
    return {
      ...baseStyle,
      left: 'calc(50% - 42.25vh)',
      top: '50%',
    }
  }
})

// Text column sits on chapter.textSide; the particle field slides opposite
// (docs/TWEAKS/A-field-offset.md) — no id-based special-casing
const textColumnStyle = computed(
  () =>
    ({
      left: 'md:w-1/2',
      right: 'md:w-1/2 md:ml-auto',
      center: 'md:w-3/5 md:mx-auto md:text-center',
    })[props.chapter.textSide],
)

// Phones split the field and text into opposite halves so they stop colliding:
// particles take the top or bottom half (alternating per chapter, mirrored by
// the field's vertical offset in the store), and the text aligns to the other.
// The hero (prologue) keeps its bespoke centered layout. md+ restores the
// two-column vertical-center layout where field and text slide side-by-side.
const stickyAlignStyle = computed(() => {
  if (props.chapter.layout === 'hero') return 'items-center'
  const mobileAlign = mobileParticlesOnTop(chapterIdx)
    ? 'items-end pb-16' // particles on top → text drops to the bottom half
    : 'items-start pt-24' // particles on bottom → text rises to the top half
  return `${mobileAlign} md:items-center md:pt-0 md:pb-0`
})

onMounted(() => {
  if (elementRef.value && !prefersReducedMotion.value) {
    const targets = elementRef.value.querySelectorAll('.reveal-text')
    targets.forEach((el) => {
      ;(el as HTMLElement).style.opacity = '0'
    })
  }
})

watch(isVisible, (visible) => {
  if (!visible || !elementRef.value) return
  const targets = elementRef.value.querySelectorAll('.reveal-text')
  if (prefersReducedMotion.value) {
    targets.forEach((el) => {
      ;(el as HTMLElement).style.opacity = '1'
    })
    return
  }
  anime({
    targets,
    translateY: [24, 0],
    opacity: [0, 1],
    easing: 'easeOutCubic',
    duration: 150,
    delay: anime.stagger(20),
  })
})
</script>

<template>
  <section :id="chapter.id" :class="runwayStyle" :style="{ height: chapter.heightVh + 'vh' }" ref="elementRef" :aria-label="chapter.title">
    <div
      class="sticky top-0 flex h-screen transition-opacity duration-75"
      :class="stickyAlignStyle"
      :style="{ opacity }"
    >
      <!-- Crisp face: particle portrait resolves into this PNG, holds, then breaks back -->
      <img
        v-if="chapter.id === 'projects'"
        :src="faceCrispSrc"
        alt=""
        aria-hidden="true"
        class="pointer-events-none absolute w-auto object-contain"
        :style="faceCrispStyle"
      />
      <div class="mx-auto w-full max-w-[80%] px-6">
        <!-- Hero layout (prologue) -->
        <div
          v-if="chapter.layout === 'hero'"
          class="grid w-full grid-cols-1 items-end gap-8 md:grid-cols-12 md:gap-12"
        >
          <div class="md:col-span-8">
            <span class="reveal-text mb-4 block font-mono text-label uppercase text-secondary">
              {{ chapter.index }} / {{ chapter.era }}
            </span>
            <h1
              class="reveal-text font-headline text-display-lg font-bold uppercase leading-[0.85] tracking-tight text-primary sr-only"
            >
              Dave Gonzales
            </h1>
            <p
              class="reveal-text mt-2 font-mono text-label uppercase tracking-[0.2em] text-secondary"
            >
              Frontend Engineer
            </p>
            
            <!-- Spacer for the "Dave Gonzales" particles -->
            <div class="h-60 md:h-[18rem] my-4"></div>

            <div class="mt-8 max-w-xl space-y-4">
              <p
                v-for="(paragraph, i) in chapter.paragraphs"
                :key="i"
                class="reveal-text font-body text-body-lg leading-relaxed text-on-surface"
              >
                {{ paragraph }}
              </p>
            </div>
          </div>
          <div class="reveal-text flex justify-start md:col-span-4 md:justify-end">
            <div class="flex flex-col items-start gap-6 md:items-end">
              <div class="flex flex-col items-start gap-1 md:items-end">
                <span class="font-mono text-label uppercase opacity-50">Focus</span>
                <span class="font-headline text-sm font-bold uppercase tracking-tight">Vue 3 · TS · WebGL</span>
              </div>
              <div class="flex flex-col items-start gap-1 md:items-end">
                <span class="font-mono text-label uppercase opacity-50">Location</span>
                <span class="font-headline text-sm font-bold uppercase tracking-tight">Philippines</span>
              </div>
              <div class="flex flex-col items-start gap-1 md:items-end">
                <span class="font-mono text-label uppercase opacity-50">Status</span>
                <span class="font-headline text-sm font-bold uppercase tracking-tight text-secondary">Open to Offers</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Default chapter layout -->
        <div v-else :class="textColumnStyle">
          <template v-if="!chapter.isContinuation">
            <p class="reveal-text font-mono text-xs uppercase tracking-widest text-secondary">
              {{ chapter.index }} / {{ chapter.era }}
            </p>
            <h2
              class="reveal-text mt-4 font-headline text-5xl font-medium uppercase leading-[0.95] tracking-tight text-primary md:text-7xl whitespace-pre-wrap"
            >
              {{ activeTitle }}
            </h2>
          </template>

          <div v-if="activeStat" class="reveal-text mt-10">
            <p class="font-headline text-3xl md:text-5xl font-bold tracking-tight text-primary">
              {{ activeStat.value }}
            </p>
            <p
              class="mt-2 border-t border-outline-variant/30 pt-2 font-mono text-xs uppercase tracking-widest text-secondary"
            >
              {{ activeStat.label }}
            </p>
          </div>

          <div class="relative mt-8">
            <!-- Multi-stage chapters: deck-stacked cards -->
            <div
              v-if="chapter.extraStages?.length"
              class="relative transition-opacity duration-200"
              :class="deckStackMinHeight"
              :style="{ opacity: deckContainerOpacity }"
            >
              <div
                v-for="(stageParas, stageIdx) in chapter.stageParagraphs"
                :key="stageIdx"
                class="max-w-xl space-y-4 will-change-transform transition-all duration-300"
                :class="{ 'md:mx-auto': chapter.textSide === 'center', 'absolute inset-x-0': !prefersReducedMotion }"
                :style="prefersReducedMotion ? {} : deckCardStyle(stageIdx)"
              >
                <p
                  v-for="(paragraph, i) in stageParas"
                  :key="i"
                  class="reveal-text font-body text-base leading-relaxed text-on-surface"
                >
                  {{ paragraph }}
                </p>
              </div>
            </div>

            <!-- Single-stage chapters: simple fade transition -->
            <Transition v-else name="stage">
              <div
                :key="textStageIndex"
                class="max-w-xl space-y-4"
                :class="{ 'md:mx-auto': chapter.textSide === 'center' }"
              >
                <p
                  v-for="(paragraph, i) in activeParagraphs"
                  :key="i"
                  class="reveal-text font-body text-base leading-relaxed text-on-surface"
                >
                  {{ paragraph }}
                </p>
              </div>
            </Transition>
          </div>

          <p class="reveal-text mt-6 md:mt-10 font-mono text-xs text-outline-variant">
            ↳ {{ chapter.interactionHint }}
          </p>

          <div v-if="chapter.showProjects" class="reveal-text mt-6 md:mt-12">
            <ProjectDeck />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stage-enter-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.stage-leave-active {
  transition: all 0.4s ease-out;
  position: absolute;
  width: 100%;
}
.stage-enter-from {
  opacity: 0;
  transform: translateY(32px) scale(0.95);
}
.stage-leave-to {
  opacity: 0;
  transform: translateY(-24px) scale(0.98);
}
@media (prefers-reduced-motion: reduce) {
  .stage-enter-active,
  .stage-leave-active {
    transition: opacity 0.2s ease;
    transform: none !important;
  }
  .stage-enter-from,
  .stage-leave-to {
    opacity: 0;
    transform: none;
  }
}
</style>
