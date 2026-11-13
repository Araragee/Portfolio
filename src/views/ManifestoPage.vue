<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import anime from 'animejs'
import { useSeoMeta } from '@unhead/vue'
import { useEventListener } from '@/composables/useEventListener'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { useStaggerAnimation } from '@/composables/useScrollAnimation'
import MacbookStory from '@/components/Manifesto/MacbookStory.vue'

useSeoMeta({
  title: 'How I work — Dave Gonzales',
  description: 'Engineering philosophy, chronology, and technical pillars of Dave Gonzales.',
})

const { containerRef: timelineRef } = useStaggerAnimation({ staggerDelay: 120 })
const { prefersReducedMotion } = useReducedMotion()

// ─── The kit: a stagger grid. Tiles wave in from the centre; click one and the
// ripple spreads from it across the grid (anime.stagger grid mode).
const kit = [
  { name: 'Vue 3', role: 'Interface' },
  { name: 'TypeScript', role: 'Contracts' },
  { name: 'Pinia', role: 'State' },
  { name: 'Tailwind', role: 'Styling' },
  { name: 'ECharts', role: 'Data viz' },
  { name: 'Three.js', role: 'WebGL' },
  { name: 'Vite', role: 'Tooling' },
  { name: 'Laravel', role: 'API' },
  { name: 'FastAPI', role: 'API' },
  { name: 'PostgreSQL', role: 'Database' },
  { name: 'Supabase', role: 'Realtime' },
  { name: 'Docker', role: 'Shipping' },
]
const { elementRef: kitRef, isVisible: kitVisible } = useIntersectionObserver({
  threshold: 0.2,
  once: true,
})

function kitTiles(): NodeListOf<Element> | [] {
  return kitRef.value?.querySelectorAll('[data-tile]') ?? []
}

/** Columns the grid is showing right now (must match grid-cols-2 / md:grid-cols-4). */
function kitGrid(): [number, number] {
  const cols = window.innerWidth >= 768 ? 4 : 2
  return [cols, Math.ceil(kit.length / cols)]
}

function ripple(from: number): void {
  if (prefersReducedMotion.value) return
  const tiles = kitTiles()
  anime.remove(tiles)
  anime({
    targets: tiles,
    scale: [
      { value: 0.84, duration: 110, easing: 'easeOutQuad' },
      { value: 1, easing: 'spring(1, 90, 9, 0)' },
    ],
    delay: anime.stagger(55, { grid: kitGrid(), from }),
  })
}

watch(kitVisible, (visible) => {
  if (!visible || prefersReducedMotion.value) return
  anime({
    targets: kitTiles(),
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 300,
    easing: 'easeOutCubic',
    delay: anime.stagger(40, { grid: kitGrid(), from: 'center' }),
  })
})

// ─── Chronology rail: clock ticks that light up as the scroll passes them
const TICKS = 44
const railRef = ref<HTMLElement | null>(null)
const railProgress = ref(0)

function onRailScroll(): void {
  const el = railRef.value
  if (!el) return
  if (prefersReducedMotion.value) {
    railProgress.value = 1
    return
  }
  const rect = el.getBoundingClientRect()
  railProgress.value = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - rect.top) / rect.height))
}

function tickStyle(i: number): string {
  return i / (TICKS - 1) <= railProgress.value ? 'w-4 bg-primary' : 'w-2 bg-outline'
}

useEventListener(window, 'scroll', onRailScroll, { passive: true })

onMounted(() => {
  onRailScroll()
  // Hidden until the grid scrolls in (reduced motion: shown straight away)
  if (!prefersReducedMotion.value) anime.set(kitTiles(), { opacity: 0 })
})

const timeline = [
  {
    period: "Jul 2026 — PRES.",
    title: "Full-stack Developer",
    company: "Department of Human Settlements and Urban Development — e-Permits",
    description: "Building e-Permits, the system DHSUD uses to receive, review, and approve real estate development permits online.",
    bullets: [
      "Vue 3 + TypeScript + Tailwind v4 frontend on a Laravel 13 / PostgreSQL API.",
      "Rebuilt case routing to follow the official DHSUD procedure, from Intake to Release, under a 15-day service level.",
      "Every permit and license generated on its prescribed DHSUD form; executive dashboards on live figures.",
      "Automated releases with rollback and scheduled backups on DHSUD servers.",
    ]
  },
  {
    period: "Oct 2023 — JUL 2026",
    title: "Front-end Developer",
    company: "Philippine Statistics Authority — Central Office",
    description: "Lead front-end for the CBMS Portal — the analyst-facing surface for Community-Based Monitoring System data across the Philippines.",
    bullets: [
      "Vue 3 + TypeScript + Tailwind, with Vuetify, ECharts, D3, and a Laravel service backing the data layer.",
      "Conducted data analytics using R — trained at national, regional, provincial, and municipal levels.",
      "Supervised data collection and data processing operations for field survey rounds.",
      "Contributed to the development of in-house systems used in the 2024 POPCEN-CBMS.",
      "Attended agency cybersecurity training programs.",
    ]
  },
  {
    period: "Mar 2023 — MAY 2023",
    title: "Web Designer / UI-UX Junior Intern",
    company: "iPhitech",
    description: "Three-month internship focused on web design, UI/UX, and front-end prototyping. Produced marketing pages and interface mockups that informed the production design system."
  },
  {
    period: "2019 — JUL 2023",
    title: "Bachelor of Science in Information Technology Major in Web and Mobile Development",
    company: "Tarlac State University",
    description: "Information Technology degree majoring in Web and Mobile Development at Tarlac State University. Graduated July 2023. Where I learned about theories, algorithms, and built my first project."
  }
]

</script>

<template>
  <main id="main-content" tabindex="-1">
    <!-- Philosophy, told as an exploded laptop (replaces hero + pillars grid) -->
    <MacbookStory />

    <div class="max-w-[800px] mx-auto px-5 sm:px-6 pt-12 pb-24">

      <!-- The kit: stagger grid -->
      <section class="mb-20 md:mb-24" aria-labelledby="kit-heading">
        <div class="mb-10 flex items-center justify-between md:mb-12">
          <h2 id="kit-heading" class="font-headline text-heading font-semibold uppercase tracking-tight">
            The kit
          </h2>
          <span class="font-mono text-label uppercase text-secondary">Tap a tile</span>
        </div>
        <ul ref="kitRef" class="grid grid-cols-2 gap-px border border-outline bg-outline md:grid-cols-4">
          <li v-for="(tool, i) in kit" :key="tool.name" data-tile class="bg-surface will-change-transform">
            <button
              type="button"
              class="flex h-full w-full flex-col items-start gap-6 p-5 text-left transition-colors hover:bg-primary hover:text-surface md:p-6"
              @click="ripple(i)"
            >
              <span class="font-mono text-caption uppercase opacity-60">
                {{ String(i + 1).padStart(2, '0') }} / {{ tool.role }}
              </span>
              <span class="font-headline text-lg font-semibold md:text-xl">{{ tool.name }}</span>
            </button>
          </li>
        </ul>
      </section>

      <!-- Chronology -->
      <section class="mb-20 md:mb-24" aria-labelledby="chronology-heading">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-10 md:mb-12">
          <h2
            id="chronology-heading"
            class="font-headline text-heading font-semibold tracking-tight uppercase"
          >
            Chronology
          </h2>
          <!-- TODO: Phase 2 - Replace coming soon placeholder with actual PDF link or download flow -->
          <span
            class="btn-monolith px-5 py-2.5 opacity-40 cursor-not-allowed select-none"
            title="Resume coming soon"
            aria-disabled="true"
          >
            Resume — Coming Soon
          </span>
        </div>

        <div ref="railRef" class="relative pl-8 md:pl-12">
          <!-- Clockwork rail: ticks light up as you scroll past -->
          <div class="absolute bottom-0 left-0 top-0 flex flex-col justify-between" aria-hidden="true">
            <span
              v-for="i in TICKS"
              :key="i"
              class="block h-px transition-all duration-200"
              :class="tickStyle(i - 1)"
            />
          </div>
        <div ref="timelineRef" class="border-t border-outline">
          <div
            v-for="entry in timeline"
            :key="entry.period"
            data-stagger
            class="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-0 py-6 md:py-8 border-b border-outline group"
          >
            <div class="col-span-1 md:col-span-3 font-mono text-caption text-secondary uppercase pt-0.5 md:pt-1">
              {{ entry.period }}
            </div>
            <div class="col-span-1 md:col-span-9">
              <h3 class="font-body text-lg md:text-xl font-bold mb-1 md:mb-2">{{ entry.title }}</h3>
              <p class="text-secondary font-body text-body-sm mb-3 md:mb-4">{{ entry.company }}</p>
              <p class="text-on-surface-variant text-body-sm leading-relaxed" :class="{ 'mb-3': entry.bullets?.length }">{{ entry.description }}</p>
              <ul v-if="entry.bullets?.length" class="space-y-1.5 mt-2">
                <li
                  v-for="(bullet, bi) in entry.bullets"
                  :key="bi"
                  class="flex items-start gap-2.5 text-on-surface-variant text-body-sm leading-relaxed"
                >
                  <span class="font-mono text-secondary mt-0.5 shrink-0">—</span>
                  <span>{{ bullet }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="bg-primary text-surface p-10 md:p-16 text-center" aria-labelledby="manifesto-cta-heading">
        <h2
          id="manifesto-cta-heading"
          class="font-headline text-heading-xl font-semibold tracking-tighter mb-6 md:mb-8 italic uppercase"
        >
          Want to work together?
        </h2>
        <a
          href="mailto:davxgonzales@gmail.com"
          class="inline-flex items-center gap-4 border-b border-surface pb-2 font-mono text-caption uppercase hover:opacity-70 transition-opacity no-underline text-surface"
          id="manifesto-contact-link"
          aria-label="Contact me"
        >
          <span>Email me</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </section>

    </div>
  </main>
</template>
