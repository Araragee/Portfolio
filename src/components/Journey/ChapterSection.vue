<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import anime from 'animejs'
import type { JourneyChapter } from '@/types/journey'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { useJourneyStore } from '@/stores/journey'
import { ENTRANCE_VH, journeyChapters } from '@/data/journeyData'
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
    if (idx === journeyChapters.length - 1) {
      return ENTRANCE_VH + 28 + 20 // 76 vh
    }
    return ENTRANCE_VH + 28 // 56 vh
  }

  // 0. Prologue delay
  if (chapterIdx === 0) {
    if (s < 30) return 0
    if (s < 30 + ENTRANCE_VH) {
      return smoothstep((s - 30) / ENTRANCE_VH) * 0.9
    }
  }

  // 1. Fade in during transition from previous chapter
  if (chapterIdx > 0) {
    const fadeInLead = getLeadVhForTransitionTo(chapterIdx)
    const fadeInStart = startVh - fadeInLead
    const fadeInEnd = fadeInStart + ENTRANCE_VH
    if (s < fadeInStart) return 0
    if (s < fadeInEnd) {
      return smoothstep((s - fadeInStart) / ENTRANCE_VH) * 0.9
    }
  }

  // 2. Fade out during transition to next chapter
  if (!isLast) {
    const fadeOutLead = getLeadVhForTransitionTo(chapterIdx + 1)
    const fadeOutStart = startsVh[chapterIdx + 1] - fadeOutLead
    const fadeOutEnd = fadeOutStart + ENTRANCE_VH
    if (s >= fadeOutEnd) return 0
    if (s >= fadeOutStart) {
      return 0.9 * (1 - smoothstep((s - fadeOutStart) / ENTRANCE_VH))
    }
  }

  return 0.9
})

const { elementRef, isVisible } = useIntersectionObserver({
  threshold: 0.2,
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
      500: 'h-[500vh]',
    })[props.chapter.heightVh],
)

// Which stageParagraphs[] index to show.
// Chapters with extraStages switch by morph-stage (store.activeStageIndex).
// Chapters without switch by scroll-progress bands.
const textStageIndex = computed(() => {
  const sp = props.chapter.stageParagraphs
  if (!sp?.length) return 0
  const N = sp.length
  if (props.chapter.extraStages?.length) {
    if (chapterIdx === store.activeChapterIndex) {
      return Math.min(N - 1, store.activeStageIndex)
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

// Project-list chapters overflow a phone viewport when vertically centered
// (title clips off the top) — top-align on mobile, center from md up
const stickyAlignStyle = computed(() =>
  ({
    projects: 'items-start pt-20 pb-8 md:items-center md:pt-0 md:pb-0',
    default: 'items-center',
  })[props.chapter.showProjects ? 'projects' : 'default'],
)

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
    duration: 300,
    delay: anime.stagger(40),
  })
})
</script>

<template>
  <section :id="chapter.id" :class="runwayStyle" ref="elementRef" :aria-label="chapter.title">
    <div
      class="sticky top-0 flex h-screen transition-opacity duration-75"
      :class="stickyAlignStyle"
      :style="{ opacity }"
    >
      <div class="mx-auto w-full max-w-5xl px-6">
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
              class="reveal-text mt-4 font-headline text-5xl font-medium uppercase leading-[0.95] tracking-tight text-primary md:text-7xl"
            >
              {{ chapter.title }}
            </h2>
          </template>

          <div v-if="chapter.stat" class="reveal-text mt-10">
            <p class="font-headline text-5xl font-bold tracking-tight text-primary">
              {{ chapter.stat.value }}
            </p>
            <p
              class="mt-2 border-t border-outline-variant/30 pt-2 font-mono text-xs uppercase tracking-widest text-secondary"
            >
              {{ chapter.stat.label }}
            </p>
          </div>

          <div class="relative mt-8">
            <Transition name="stage">
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
  transition: opacity 0.5s ease;
}
.stage-leave-active {
  transition: opacity 0.3s ease;
  position: absolute;
  width: 100%;
}
.stage-enter-from,
.stage-leave-to {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .stage-enter-active,
  .stage-leave-active {
    transition: none;
  }
}
</style>
