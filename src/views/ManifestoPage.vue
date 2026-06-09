<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'
import { useScrollAnimation, useStaggerAnimation } from '@/composables/useScrollAnimation'

useSeoMeta({
  title: 'Manifesto — ARCHITECT.VUE',
  description: 'Engineering philosophy, chronology, and technical pillars of a senior Vue.js & TypeScript architect.',
})

const { elementRef: heroRef } = useScrollAnimation({ threshold: 0.1 })
const { containerRef: timelineRef } = useStaggerAnimation({ staggerDelay: 120 })
const { containerRef: pillarsRef } = useStaggerAnimation({ staggerDelay: 100 })

interface TimelineEntry {
  period: string
  title: string
  company: string
  description: string
}

interface Pillar {
  number: string
  heading: string
  body: string
}

const timeline: TimelineEntry[] = [
  {
    period: 'OCT 2023 — PRES.',
    title: 'Front-end Developer',
    company: 'Philippine Statistics Authority — Central Office',
    description: 'Lead front-end for the CBMS Portal — the analyst-facing surface for Community-Based Monitoring System data across the Philippines. Vue 3, TypeScript, Pinia, Vuetify, ECharts, and D3 on the client; Laravel on the server.'
  },
  {
    period: 'MAR — MAY 2023',
    title: 'Web Designer / UI-UX Junior Intern',
    company: 'iPhitech — Clark, Pampanga',
    description: 'OJT internship focused on web design, UI/UX, and front-end prototyping. Produced responsive marketing pages and translated Figma mockups into production HTML/CSS.'
  },
  {
    period: '2019 — JUL 2023',
    title: 'BS Computer Science',
    company: 'Tarlac State University',
    description: 'Graduated July 2023. Built the foundation in software engineering, algorithms, and web technologies that underpins all production work since.'
  },
]

const pillars: Pillar[] = [
  {
    number: 'Pillar 01',
    heading: 'Structural Integrity',
    body: 'Code should reflect the physical world. Clean abstractions and modular patterns ensure a system that can withstand the weight of expansion without collapse. TypeScript strict mode is non-negotiable.',
  },
  {
    number: 'Pillar 02',
    heading: 'Aggressive Minimalism',
    body: 'Subtract until only the essential remains. If a feature does not clarify the user\'s intent, it is noise. If a line of code does not earn its existence, it is deleted.',
  },
  {
    number: 'Pillar 03',
    heading: 'Performance as Design',
    body: 'A slow interface is a broken interface. Bundle size, render blocking, and layout shift are design decisions — not afterthoughts for the DevOps team.',
  },
  {
    number: 'Pillar 04',
    heading: 'Composable Architecture',
    body: 'The Vue 3 Composition API changed my thinking about software. Logic should be composable, testable, and portable. Components should be declarative. State should have a single owner.',
  },
]
</script>

<template>
  <main class="pt-28 md:pt-32 pb-24 px-5 sm:px-6" id="main-content">
    <div class="max-w-[800px] mx-auto">

      <!-- Hero Manifesto -->
      <section ref="heroRef" class="mb-20 md:mb-24 text-center" aria-labelledby="manifesto-heading">
        <span class="font-mono text-caption uppercase text-secondary mb-6 md:mb-8 block">
          Positioning Statement
        </span>
        <h1
          id="manifesto-heading"
          class="font-headline font-semibold text-heading-xl text-primary mb-10 md:mb-12"
        >
          Engineering Philosophy
        </h1>
        <div class="w-full h-px bg-outline mb-12 md:mb-16"></div>
        <div class="space-y-6 md:space-y-8 text-left">
          <p class="text-body-lg leading-relaxed font-body text-on-surface">
            System design is the poetry of logic. In the digital realm, we often mistake decoration
            for substance. My work is a rejection of the superfluous. I build systems where the
            structure is the interface, and the code is the foundation of the aesthetic.
          </p>
          <p class="text-body leading-relaxed font-body text-secondary">
            Every pixel must earn its right to exist. Every function must serve a singular,
            irreducible purpose. We do not build for the moment — we build for the continuum,
            creating architectural patterns that resist the erosion of shifting trends.
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
          :key="pillar.number"
          data-stagger
          class="bg-surface p-8 md:p-10"
        >
          <span class="font-mono text-caption text-secondary uppercase block mb-4 md:mb-6">
            {{ pillar.number }}
          </span>
          <h3 class="font-headline text-heading font-semibold mb-3 md:mb-4">{{ pillar.heading }}</h3>
          <p class="text-on-surface-variant text-body-sm leading-relaxed font-body">{{ pillar.body }}</p>
        </div>
      </section>

      <!-- Decorative Architecture Image -->
      <figure class="mb-20 md:mb-24 border border-outline p-1.5 md:p-2 bg-white" aria-label="Architectural reference">
        <img
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80"
          alt="Minimalist brutalist architecture — clean geometric forms against a pale sky"
          class="w-full grayscale contrast-125 brightness-95 hover:grayscale-0 transition-all duration-700"
          width="1200"
          height="800"
          loading="lazy"
          decoding="async"
        />
        <figcaption class="mt-3 md:mt-4 font-mono text-label text-secondary uppercase text-center">
          Structural Reference: Brutalist Precision, 2026
        </figcaption>
      </figure>

      <!-- CTA -->
      <section class="bg-primary text-surface p-10 md:p-16 text-center" aria-labelledby="manifesto-cta-heading">
        <h2
          id="manifesto-cta-heading"
          class="font-headline text-heading-xl font-semibold tracking-tighter mb-6 md:mb-8 italic uppercase"
        >
          Build with Precision
        </h2>
        <a
          href="mailto:davxgonzales@gmail.com"
          class="inline-flex items-center gap-4 border-b border-surface pb-2 font-mono text-caption uppercase hover:opacity-70 transition-opacity no-underline text-surface"
          id="manifesto-contact-link"
          aria-label="Contact me"
        >
          <span>Initiate Contact</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </section>

    </div>
  </main>
</template>
