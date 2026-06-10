<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import type { JourneyChapter } from '@/types/journey'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import anime from 'animejs'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { projects } from '@/data/projectsData'

const props = defineProps<{
  chapter: JourneyChapter
}>()

// Static class lookup so Tailwind can see the literals (no dynamic vh values)
const runwayStyle = computed(
  () =>
    ({
      150: 'h-[150vh]',
      200: 'h-[200vh]',
      300: 'h-[300vh]',
    })[props.chapter.heightVh],
)

const { elementRef, isVisible } = useIntersectionObserver({
  threshold: 0.2,
  once: true
})
const { prefersReducedMotion } = useReducedMotion()

watch(isVisible, (visible) => {
  if (visible && elementRef.value && !prefersReducedMotion.value) {
    const targets = elementRef.value.querySelectorAll('.reveal-text')
    anime({
      targets,
      translateY: [30, 0],
      opacity: [0, 1],
      easing: 'easeOutCubic',
      duration: 600,
      delay: anime.stagger(100)
    })
  } else if (visible && prefersReducedMotion.value && elementRef.value) {
    const targets = elementRef.value.querySelectorAll('.reveal-text')
    targets.forEach((el) => {
      ;(el as HTMLElement).style.opacity = '1'
    })
  }
})

onMounted(() => {
  if (elementRef.value && !prefersReducedMotion.value) {
    const targets = elementRef.value.querySelectorAll('.reveal-text')
    targets.forEach((el) => {
      ;(el as HTMLElement).style.opacity = '0'
    })
  }
})

const textContainerClass = computed(() => {
  // Add specific layout offsets to avoid collisions
  if (props.chapter.id === 'epilogue') return 'md:w-1/2 md:mt-[-20vh]'
  if (props.chapter.id.startsWith('psa-')) return 'md:w-1/2 md:ml-auto z-10'
  if (props.chapter.id === 'projects') return 'md:w-[45%]'
  return 'md:w-1/2'
})
</script>

<template>
  <section :id="chapter.id" :class="runwayStyle" ref="elementRef">
    <div class="sticky top-0 flex h-screen items-center">
      <div class="mx-auto w-full max-w-5xl px-6">
        <!-- Custom Prologue Layout -->
        <div v-if="chapter.id === 'prologue'" class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-end w-full">
          <div class="md:col-span-8">
            <span class="reveal-text font-mono text-label uppercase text-secondary block mb-4">
              {{ chapter.index }} / {{ chapter.era }}
            </span>
            <h1 class="reveal-text font-headline font-bold text-display-lg text-primary uppercase leading-[0.85] tracking-tight">
              Dave Gonzales
            </h1>
            <p class="reveal-text font-mono text-label uppercase text-secondary mt-2 tracking-[0.2em]">
              Frontend Engineer
            </p>
            <div class="mt-8 space-y-4 max-w-xl">
              <p
                v-for="(paragraph, i) in chapter.paragraphs"
                :key="i"
                class="reveal-text font-body text-body-lg leading-relaxed text-on-surface"
              >
                {{ paragraph }}
              </p>
            </div>
          </div>
          <div class="md:col-span-4 flex justify-start md:justify-end reveal-text">
            <div class="flex flex-col items-start md:items-end gap-6">
              <div class="flex flex-col items-start md:items-end gap-1">
                <span class="font-mono text-label uppercase opacity-50">Focus</span>
                <span class="text-sm font-bold font-headline tracking-tight uppercase">Vue 3 · TS · WebGL</span>
              </div>
              <div class="flex flex-col items-start md:items-end gap-1">
                <span class="font-mono text-label uppercase opacity-50">Location</span>
                <span class="text-sm font-bold font-headline tracking-tight uppercase">Philippines</span>
              </div>
              <div class="flex flex-col items-start md:items-end gap-1">
                <span class="font-mono text-label uppercase opacity-50">Status</span>
                <span class="text-sm font-bold font-headline tracking-tight uppercase text-secondary">Open to Offers</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Default Layout for other chapters -->
        <div v-else :class="textContainerClass">
          <template v-if="chapter.id === 'psa-map' || !chapter.id.startsWith('psa-')">
            <p class="reveal-text font-mono text-xs uppercase tracking-widest text-secondary">
              {{ chapter.index }} / {{ chapter.era }}
            </p>
            <h2
              class="reveal-text mt-4 font-headline text-5xl font-medium uppercase leading-[0.95] tracking-tight text-primary md:text-7xl"
            >
              {{ chapter.title }}
            </h2>
          </template>
          <div :class="['max-w-xl space-y-4', chapter.id.startsWith('psa-') && chapter.id !== 'psa-map' ? 'mt-32' : 'mt-8']">
            <p
              v-for="(paragraph, i) in chapter.paragraphs"
              :key="i"
              class="reveal-text font-body text-base leading-relaxed text-on-surface"
            >
              {{ paragraph }}
            </p>
          </div>
          <p class="reveal-text mt-10 font-mono text-xs text-outline-variant">
            ↳ {{ chapter.interactionHint }}
          </p>

          <!-- Projects List -->
          <div v-if="chapter.id === 'projects'" class="mt-12 space-y-6">
            <RouterLink
              v-for="project in projects"
              :key="project.slug"
              :to="`/case-study/${project.slug}`"
              class="reveal-text block group border-l border-outline-variant/30 pl-4 transition-colors hover:border-primary"
            >
              <h3 class="font-headline text-xl font-medium tracking-tight text-primary transition-colors group-hover:text-primary">
                {{ project.title }}
              </h3>
              <p class="font-mono text-xs text-secondary mt-1 uppercase tracking-widest">
                {{ project.role }}
              </p>
              <p class="font-body text-sm text-outline-variant mt-2">
                {{ project.stack }}
              </p>
            </RouterLink>
          </div>
        </div>

        <!-- PSA Stats Floating Block -->
        <div 
          v-if="chapter.id.startsWith('psa-')" 
          class="absolute left-6 top-1/2 -translate-y-1/2 md:left-[10%] max-w-[280px] pointer-events-none transition-opacity duration-300"
        >
          <div class="space-y-12">
            <div v-if="chapter.id === 'psa-map'" class="reveal-text">
              <p class="font-headline text-5xl font-bold tracking-tight text-primary">110M+</p>
              <p class="font-mono text-xs text-secondary uppercase tracking-widest mt-2 border-t border-outline-variant/30 pt-2">Citizens' Data Handled</p>
            </div>
            <div v-if="chapter.id === 'psa-logo'" class="reveal-text">
              <p class="font-headline text-5xl font-bold tracking-tight text-primary">Solid</p>
              <p class="font-mono text-xs text-secondary uppercase tracking-widest mt-2 border-t border-outline-variant/30 pt-2">Responsive. World-Class.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
