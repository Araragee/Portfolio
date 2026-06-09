<script setup lang="ts">
import { useStaggerAnimation } from '@/composables/useScrollAnimation'
import { siteConfig } from '@/data/siteConfig'

const availability = siteConfig.hero.availability
const location = siteConfig.hero.location

const { containerRef } = useStaggerAnimation({ threshold: 0.15 })
</script>

<template>
  <section
    ref="containerRef"
    class="section-padding mb-20 md:mb-40"
    aria-labelledby="hero-heading"
  >
    <div class="flex flex-col gap-4 md:gap-6 mb-10 md:mb-12">
      <span
        data-stagger
        class="font-mono text-label uppercase text-secondary"
      >
        {{ availability }}
      </span>
      <h1
        data-stagger
        id="hero-heading"
        class="font-headline font-bold text-display-xl text-on-surface uppercase"
        v-html="siteConfig.hero.headline"
      >
      </h1>
    </div>

    <div data-stagger class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-end">
      <div class="md:col-span-8">
        <p class="text-subheading max-w-2xl font-normal text-on-surface/80">
          {{ siteConfig.hero.description }}
        </p>
      </div>
      <div class="md:col-span-4 flex justify-start md:justify-end">
        <div class="flex flex-col items-start md:items-end gap-1">
          <span class="font-mono text-label uppercase opacity-50">Location</span>
          <span class="text-lg font-bold font-headline tracking-tight uppercase">{{ location }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
