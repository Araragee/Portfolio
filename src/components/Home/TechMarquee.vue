<script setup lang="ts">
const techs = [
  "VUE3",
  "TYPESCRIPT",
  "VITE",
  "PINIA",
  "REACT",
  "NODE.JS",
  "TAILWIND",
];
</script>

<template>
  <section
    class="border-y border-outline py-12 overflow-hidden bg-surface mb-40"
    aria-label="Technology stack"
  >
    <div class="flex whitespace-nowrap animate-marquee">
      <!-- First set -->
      <div class="flex items-center gap-20 pr-20">
        <span
          v-for="(tech, i) in techs"
          :key="`a-${tech}`"
          class="font-headline font-bold uppercase tracking-tighter"
          style="font-size: clamp(3.5rem, 8vw, 96px)"
          :class="i % 2 === 0 ? 'opacity-10' : 'opacity-100'"
        >
          {{ tech }}
        </span>
      </div>
      <!-- Duplicate for seamless loop -->
      <div class="flex items-center gap-20 pr-20" aria-hidden="true">
        <span
          v-for="(tech, i) in techs"
          :key="`b-${tech}`"
          class="font-headline font-bold uppercase tracking-tighter"
          style="font-size: clamp(3.5rem, 8vw, 96px)"
          :class="i % 2 === 0 ? 'opacity-10' : 'opacity-100'"
        >
          {{ tech }}
        </span>
      </div>
    </div>
  </section>
</template>
