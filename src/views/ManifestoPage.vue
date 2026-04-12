<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'

useSeoMeta({
  title: 'Manifesto — ARCHITECT.VUE',
  description: 'Engineering philosophy, chronology, and technical pillars of a senior Vue.js & TypeScript architect.',
})

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
    period: '2024 — PRES.',
    title: 'Senior Frontend Engineer',
    company: 'Independent / Freelance',
    description: 'Building scalable Vue 3 applications and design systems for clients across EdTech, FinTech, and E-commerce. Defining architectural standards, establishing TypeScript strict-mode patterns, and leading frontend teams.'
  },
  {
    period: '2022 — 2024',
    title: 'Frontend Developer',
    company: 'LMS-AI Project',
    description: 'Led complete frontend architecture for an adaptive LMS platform with AI-driven risk prediction. Vue 3 Composition API, Pinia, and a fully typed API contract layer with FastAPI backend.'
  },
  {
    period: '2021 — 2022',
    title: 'Junior Web Developer',
    company: 'Contract Projects',
    description: 'Built responsive web applications and landing pages with Vue 2 and React. Focused on accessible HTML, CSS architecture, and cross-browser compatibility.'
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
  <main class="pt-32 pb-24 px-6" id="main-content">
    <div class="max-w-[800px] mx-auto">

      <!-- Hero Manifesto -->
      <section class="mb-24 text-center" aria-labelledby="manifesto-heading">
        <span class="font-mono text-[13px] tracking-widest uppercase text-secondary mb-8 block">
          Positioning Statement
        </span>
        <h1
          id="manifesto-heading"
          class="font-headline font-semibold tracking-tighter text-primary mb-12 leading-[1.1]"
          style="font-size: clamp(2.5rem, 8vw, 64px);"
        >
          Engineering Philosophy
        </h1>
        <div class="w-full h-px bg-outline mb-16"></div>
        <div class="space-y-8 text-left">
          <p class="text-[22px] leading-relaxed font-body text-on-surface">
            System design is the poetry of logic. In the digital realm, we often mistake decoration
            for substance. My work is a rejection of the superfluous. I build systems where the
            structure is the interface, and the code is the foundation of the aesthetic.
          </p>
          <p class="text-[18px] leading-relaxed font-body text-secondary">
            Every pixel must earn its right to exist. Every function must serve a singular,
            irreducible purpose. We do not build for the moment — we build for the continuum,
            creating architectural patterns that resist the erosion of shifting trends.
          </p>
        </div>
      </section>

      <!-- Chronology -->
      <section class="mb-24" aria-labelledby="chronology-heading">
        <div class="flex items-center justify-between mb-12">
          <h2
            id="chronology-heading"
            class="font-headline text-3xl font-semibold tracking-tight uppercase"
          >
            Chronology
          </h2>
          <a
            href="/resume.pdf"
            download
            class="btn-monolith px-6 py-3 text-[11px]"
            id="download-resume-btn"
          >
            Download Resume
          </a>
        </div>

        <div class="border-t border-outline">
          <div
            v-for="entry in timeline"
            :key="entry.period"
            class="grid grid-cols-12 py-8 border-b border-outline group"
          >
            <div class="col-span-3 font-mono text-[13px] tracking-widest text-secondary uppercase pt-1">
              {{ entry.period }}
            </div>
            <div class="col-span-9">
              <h3 class="font-body text-xl font-bold mb-2">{{ entry.title }}</h3>
              <p class="text-secondary font-body mb-4">{{ entry.company }}</p>
              <p class="text-on-surface-variant text-[15px] leading-relaxed">{{ entry.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Philosophical Pillars -->
      <section
        class="grid grid-cols-1 md:grid-cols-2 gap-px bg-outline border border-outline mb-24"
        aria-labelledby="pillars-heading"
      >
        <h2 id="pillars-heading" class="sr-only">Engineering Pillars</h2>
        <div
          v-for="pillar in pillars"
          :key="pillar.number"
          class="bg-surface p-10"
        >
          <span class="font-mono text-[13px] tracking-widest text-secondary uppercase block mb-6">
            {{ pillar.number }}
          </span>
          <h3 class="font-headline text-2xl font-semibold mb-4">{{ pillar.heading }}</h3>
          <p class="text-on-surface-variant leading-relaxed font-body">{{ pillar.body }}</p>
        </div>
      </section>

      <!-- Decorative Architecture Image -->
      <figure class="mb-24 border border-outline p-2 bg-white" aria-label="Architectural reference">
        <img
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80"
          alt="Minimalist brutalist architecture — clean geometric forms against a pale sky"
          class="w-full grayscale contrast-125 brightness-95 hover:grayscale-0 transition-all duration-700"
          loading="lazy"
        />
        <figcaption class="mt-4 font-mono text-[11px] tracking-widest text-secondary uppercase text-center">
          Structural Reference: Brutalist Precision, 2026
        </figcaption>
      </figure>

      <!-- CTA -->
      <section class="bg-primary text-surface p-16 text-center" aria-labelledby="manifesto-cta-heading">
        <h2
          id="manifesto-cta-heading"
          class="font-headline text-4xl font-semibold tracking-tighter mb-8 italic uppercase"
        >
          Build with Precision
        </h2>
        <a
          href="mailto:davxgonzales@gmail.com"
          class="inline-flex items-center gap-4 border-b border-surface pb-2 font-mono text-[13px] tracking-widest uppercase hover:opacity-70 transition-opacity no-underline text-surface"
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
