<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'
import { useScrollAnimation, useStaggerAnimation } from '@/composables/useScrollAnimation'

useSeoMeta({
  title: 'How I work — Dave Gonzales',
  description: 'Engineering philosophy, chronology, and technical pillars of Dave Gonzales.',
})

const { elementRef: heroRef } = useScrollAnimation({ threshold: 0.1 })
const { containerRef: timelineRef } = useStaggerAnimation({ staggerDelay: 120 })
const { containerRef: pillarsRef } = useStaggerAnimation({ staggerDelay: 100 })

const timeline = [
  {
    period: "Oct 2023 — PRES.",
    title: "Front-end Developer",
    company: "Philippine Statistics Authority — Central Office",
    description: "Lead front-end for the CBMS Portal — the analyst-facing surface for Community-Based Monitoring System data across the Philippines. Vue 3 + TypeScript + Tailwind, with Vuetify, ECharts, D3, and a Laravel service backing the data layer."
  },
  {
    period: "Mar 2023 — MAY 2023",
    title: "Web Designer / UI-UX Junior Intern",
    company: "iPhitech",
    description: "Three-month internship focused on web design, UI/UX, and front-end prototyping. Produced marketing pages and interface mockups that informed the production design system."
  },
  {
    period: "2019 — JUL 2023",
    title: "Bachelor of Science in Computer Science",
    company: "Tarlac State University",
    description: "Computer Science degree at Tarlac State University. Graduated July 2023. Completed OJT at iPhitech (Clark, Pampanga) from March to May 2023 as part of the program."
  }
]

const pillars = [
  {
    heading: 'Strict TypeScript',
    body: 'I use strict mode and explicit types. If the compiler cannot catch it, the runtime will, and I would rather fix it in the editor.',
  },
  {
    heading: 'Deleting code',
    body: 'The best pull requests are the ones that remove lines. If a piece of logic or a component is no longer used, I delete it. Dead code is technical debt.',
  },
  {
    heading: 'Performance budgets',
    body: 'I keep an eye on bundle sizes and render times. A fast interface makes users trust the system. Slow apps usually mean someone got lazy with dependencies.',
  },
  {
    heading: 'Composables',
    body: 'Vue 3 changed how I write front-ends. I prefer to keep state and logic in small, testable composables instead of huge component files.',
  }
]
</script>

<template>
  <main class="pt-28 md:pt-32 pb-24 px-5 sm:px-6" id="main-content">
    <div class="max-w-[800px] mx-auto">

      <!-- Hero Manifesto -->
      <section ref="heroRef" class="mb-20 md:mb-24 text-center" aria-labelledby="manifesto-heading">
        <span class="font-mono text-caption uppercase text-secondary mb-6 md:mb-8 block">
          About the work
        </span>
        <h1
          id="manifesto-heading"
          class="font-headline font-semibold text-heading-xl text-primary mb-10 md:mb-12"
        >
          How I work
        </h1>
        <div class="w-full h-px bg-outline mb-12 md:mb-16"></div>
        <div class="space-y-6 md:space-y-8 text-left">
          <p class="text-body-lg leading-relaxed font-body text-on-surface">
            I write code that is meant to be read, debugged, and eventually replaced. I don't believe in clever tricks
            that save five lines but take an hour to understand. When I build a feature, I assume someone
            else will have to maintain it.
          </p>
          <p class="text-body leading-relaxed font-body text-secondary">
            Over the last few years working on the CBMS Portal, I've learned that consistency is more valuable
            than adopting the latest framework feature. I stick to established patterns, enforce strict TypeScript
            rules, and focus on delivering something that works reliably.
          </p>
        </div>
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
              <p class="text-on-surface-variant text-body-sm leading-relaxed">{{ entry.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Philosophical Pillars -->
      <section
        ref="pillarsRef"
        class="grid grid-cols-1 md:grid-cols-2 gap-px bg-outline border border-outline mb-20 md:mb-24"
        aria-labelledby="pillars-heading"
      >
        <h2 id="pillars-heading" class="sr-only">Engineering Pillars</h2>
        <div
          v-for="pillar in pillars"
          :key="pillar.heading"
          data-stagger
          class="bg-surface p-8 md:p-10"
        >
          <span class="font-mono text-caption text-secondary uppercase block mb-4 md:mb-6">

          </span>
          <h3 class="font-headline text-heading font-semibold mb-3 md:mb-4">{{ pillar.heading }}</h3>
          <p class="text-on-surface-variant text-body-sm leading-relaxed font-body">{{ pillar.body }}</p>
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
