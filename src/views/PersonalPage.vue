<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'
import { personalContent } from '@/data/personalData'

useSeoMeta({
  title: 'Personal — ARCHITECT.VUE',
  description:
    'Off-hours: hobbies, personal story, and the values that shape the work.',
})
</script>

<template>
  <main class="pt-32 pb-24 px-6" id="main-content">
    <div class="max-w-[800px] mx-auto">

      <!-- Hero -->
      <section class="mb-24 text-center" aria-labelledby="personal-heading">
        <span class="font-mono text-[13px] tracking-widest uppercase text-secondary mb-8 block">
          Off-Hours
        </span>
        <h1
          id="personal-heading"
          class="font-headline font-semibold tracking-tighter text-primary mb-12 leading-[1.1]"
          style="font-size: clamp(2.5rem, 8vw, 64px);"
        >
          The Person Behind the Code
        </h1>
        <div class="w-full h-px bg-outline mb-16"></div>
        <div class="space-y-8 text-left">
          <p
            v-for="(para, i) in personalContent.intro"
            :key="`intro-${i}`"
            class="text-[22px] leading-relaxed font-body text-on-surface first:text-on-surface"
            :class="i === 0 ? 'text-on-surface' : 'text-secondary text-[18px]'"
          >
            {{ para }}
          </p>
        </div>
      </section>

      <!-- Story -->
      <section class="mb-24" aria-labelledby="story-heading">
        <div class="flex items-center justify-between mb-12">
          <h2
            id="story-heading"
            class="font-headline text-3xl font-semibold tracking-tight uppercase"
          >
            The Story
          </h2>
          <span class="font-mono text-[11px] tracking-widest text-secondary uppercase">
            CS → Dev
          </span>
        </div>
        <div class="border-t border-outline">
          <div
            v-for="(para, i) in personalContent.story"
            :key="`story-${i}`"
            class="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-0 py-8 border-b border-outline"
          >
            <div class="col-span-1 md:col-span-3 font-mono text-[13px] tracking-widest text-secondary uppercase pt-1">
              Ch. {{ String(i + 1).padStart(2, '0') }}
            </div>
            <div class="col-span-1 md:col-span-9">
              <p class="text-on-surface text-[17px] leading-relaxed font-body">
                {{ para }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Values -->
      <section
        class="grid grid-cols-1 md:grid-cols-2 gap-px bg-outline border border-outline mb-24"
        aria-labelledby="values-heading"
      >
        <h2 id="values-heading" class="sr-only">Personal Values</h2>
        <div
          v-for="(value, i) in personalContent.values"
          :key="value.title"
          class="bg-surface p-10"
        >
          <span class="font-mono text-[13px] tracking-widest text-secondary uppercase block mb-6">
            Value {{ String(i + 1).padStart(2, '0') }}
          </span>
          <h3 class="font-headline text-2xl font-semibold mb-4">{{ value.title }}</h3>
          <p class="text-on-surface-variant leading-relaxed font-body">{{ value.body }}</p>
        </div>
      </section>

      <!-- Hobbies -->
      <section class="mb-24" aria-labelledby="hobbies-heading">
        <div class="flex items-center justify-between mb-12">
          <h2
            id="hobbies-heading"
            class="font-headline text-3xl font-semibold tracking-tight uppercase"
          >
            Hobbies
          </h2>
          <span class="font-mono text-[11px] tracking-widest text-secondary uppercase">
            Off-Screen
          </span>
        </div>
        <div class="border-t border-outline">
          <div
            v-for="(hobby, i) in personalContent.hobbies"
            :key="hobby.name"
            class="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-0 py-8 border-b border-outline group"
          >
            <div class="col-span-1 md:col-span-2 font-mono text-[13px] tracking-widest text-secondary uppercase pt-1">
              /{{ String(i + 1).padStart(2, '0') }}
            </div>
            <div class="col-span-1 md:col-span-10">
              <h3 class="font-body text-xl font-bold mb-2">{{ hobby.name }}</h3>
              <p class="text-on-surface-variant text-[15px] leading-relaxed">{{ hobby.blurb }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer CTA -->
      <section class="bg-primary text-surface p-16 text-center" aria-labelledby="personal-cta-heading">
        <h2
          id="personal-cta-heading"
          class="font-headline text-4xl font-semibold tracking-tighter mb-8 italic uppercase"
        >
          Say Hello
        </h2>
        <a
          href="mailto:davxgonzales@gmail.com"
          class="inline-flex items-center gap-4 border-b border-surface pb-2 font-mono text-[13px] tracking-widest uppercase hover:opacity-70 transition-opacity no-underline text-surface"
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
