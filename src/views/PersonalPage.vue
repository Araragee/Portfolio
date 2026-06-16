<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'
import { personalContent } from '@/data/personalData'
import { useScrollAnimation, useStaggerAnimation } from '@/composables/useScrollAnimation'

useSeoMeta({
  title: 'About — Dave Gonzales',
  description:
    'Off-hours: hobbies, personal story, and the values that shape the work.',
})

const { elementRef: heroRef } = useScrollAnimation({ threshold: 0.1 })
const { containerRef: storyRef } = useStaggerAnimation({ staggerDelay: 120 })
const { containerRef: valuesRef } = useStaggerAnimation({ staggerDelay: 100 })
const { containerRef: hobbiesRef } = useStaggerAnimation({ staggerDelay: 100 })
</script>

<template>
  <main class="pt-28 md:pt-32 pb-24 px-5 sm:px-6" id="main-content" tabindex="-1">
    <div class="max-w-[800px] mx-auto">

      <!-- Hero -->
      <section ref="heroRef" class="mb-20 md:mb-24 text-center" aria-labelledby="personal-heading">
        <div
          class="mx-auto mb-8 h-28 w-28 border border-outline bg-outline/10"
          role="img"
          aria-label="Profile photo placeholder"
        ></div>
        <span class="font-mono text-caption uppercase text-secondary mb-6 md:mb-8 block">
          Off-Hours
        </span>
        <h1
          id="personal-heading"
          class="font-headline font-semibold text-heading-xl text-primary mb-10 md:mb-12"
        >
          The Person Behind the Code
        </h1>
        <div class="w-full h-px bg-outline mb-12 md:mb-16"></div>
        <div class="space-y-6 md:space-y-8 text-left">
          <p
            v-for="(para, i) in personalContent.intro"
            :key="`intro-${i}`"
            class="leading-relaxed font-body"
            :class="i === 0 ? 'text-body-lg text-on-surface' : 'text-body text-secondary'"
          >
            {{ para }}
          </p>
        </div>
      </section>

      <!-- Story -->
      <section class="mb-20 md:mb-24" aria-labelledby="story-heading">
        <div class="flex items-center justify-between mb-10 md:mb-12">
          <h2
            id="story-heading"
            class="font-headline text-heading font-semibold tracking-tight uppercase"
          >
            The Story
          </h2>
          <span class="font-mono text-label text-secondary uppercase">
            CS → Dev
          </span>
        </div>
        <div ref="storyRef" class="border-t border-outline">
          <div
            v-for="(para, i) in personalContent.story"
            :key="`story-${i}`"
            data-stagger
            class="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-0 py-6 md:py-8 border-b border-outline"
          >
            <div class="col-span-1 md:col-span-3 font-mono text-caption text-secondary uppercase pt-0.5 md:pt-1">
              Ch. {{ String(i + 1).padStart(2, '0') }}
            </div>
            <div class="col-span-1 md:col-span-9">
              <p class="text-on-surface text-body-sm leading-relaxed font-body">
                {{ para }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Values -->
      <section
        ref="valuesRef"
        class="grid grid-cols-1 md:grid-cols-2 gap-px bg-outline border border-outline mb-20 md:mb-24"
        aria-labelledby="values-heading"
      >
        <h2 id="values-heading" class="sr-only">Personal Values</h2>
        <div
          v-for="(value, i) in personalContent.values"
          :key="value.title"
          data-stagger
          class="bg-surface p-8 md:p-10"
        >
          <span class="font-mono text-caption text-secondary uppercase block mb-4 md:mb-6">
            Value {{ String(i + 1).padStart(2, '0') }}
          </span>
          <h3 class="font-headline text-heading font-semibold mb-3 md:mb-4">{{ value.title }}</h3>
          <p class="text-on-surface-variant text-body-sm leading-relaxed font-body">{{ value.body }}</p>
        </div>
      </section>

      <!-- Hobbies -->
      <section class="mb-20 md:mb-24" aria-labelledby="hobbies-heading">
        <div class="flex items-center justify-between mb-10 md:mb-12">
          <h2
            id="hobbies-heading"
            class="font-headline text-heading font-semibold tracking-tight uppercase"
          >
            Hobbies
          </h2>
          <span class="font-mono text-label text-secondary uppercase">
            Off-Screen
          </span>
        </div>
        <div ref="hobbiesRef" class="border-t border-outline">
          <div
            v-for="(hobby, i) in personalContent.hobbies"
            :key="hobby.name"
            data-stagger
            class="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-0 py-6 md:py-8 border-b border-outline group"
          >
            <div class="col-span-1 md:col-span-2 font-mono text-caption text-secondary uppercase pt-0.5 md:pt-1">
              /{{ String(i + 1).padStart(2, '0') }}
            </div>
            <div class="col-span-1 md:col-span-10">
              <h3 class="font-body text-lg md:text-xl font-bold mb-1 md:mb-2">{{ hobby.name }}</h3>
              <p class="text-on-surface-variant text-body-sm leading-relaxed">{{ hobby.blurb }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer CTA -->
      <section class="bg-primary text-surface p-10 md:p-16 text-center" aria-labelledby="personal-cta-heading">
        <h2
          id="personal-cta-heading"
          class="font-headline text-heading-xl font-semibold tracking-tighter mb-6 md:mb-8 italic uppercase"
        >
          Say Hello
        </h2>
        <a
          href="mailto:davxgonzales@gmail.com"
          class="inline-flex items-center gap-4 border-b border-surface pb-2 font-mono text-caption uppercase hover:opacity-70 transition-opacity no-underline text-surface"
          aria-label="Send an email"
        >
          <span>davxgonzales@gmail.com</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </section>

    </div>
  </main>
</template>
