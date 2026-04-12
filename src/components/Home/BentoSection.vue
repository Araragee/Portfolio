<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function goManifesto() {
  router.push("/manifesto");
}

const expertise = [
  { label: "Enterprise Vue 3", years: "3+ YRS" },
  { label: "TypeScript Arch", years: "3+ YRS" },
  { label: "Node.js Ecosystem", years: "2+ YRS" },
  { label: "Design Systems", years: "2+ YRS" },
];
</script>

<template>
  <section
    class="px-6 md:px-[120px] mb-40 grid grid-cols-1 md:grid-cols-2 gap-px bg-outline"
    aria-labelledby="philosophy-heading"
  >
    <!-- Left: Philosophy + CTA -->
    <div
      class="bg-surface p-12 md:p-20 flex flex-col justify-between"
      style="aspect-ratio: 1 / 1"
    >
      <div class="flex flex-col gap-8">
        <span
          class="font-mono text-[11px] tracking-[0.3em] uppercase text-secondary"
        >
          The Philosophy
        </span>
        <h2
          id="philosophy-heading"
          class="font-headline font-bold tracking-tighter uppercase leading-none"
          style="font-size: clamp(2rem, 4vw, 48px)"
        >
          Code as<br />Architecture
        </h2>
        <p
          class="text-lg md:text-xl font-normal text-on-surface/70 leading-relaxed max-w-md font-body"
        >
          I believe software should be built with the same longevity and
          structural integrity as physical landmarks. Clean, maintainable
          TypeScript isn't just a preference — it's a requirement for systems
          that intend to last.
        </p>
      </div>
      <button
        class="btn-monolith w-full md:w-max mt-8"
        id="view-manifesto-btn"
        @click="goManifesto"
      >
        View Technical Manifesto
      </button>
    </div>

    <!-- Right: Expertise list + Collaborations -->
    <div class="grid grid-cols-1 gap-px bg-outline">
      <!-- Inverted expertise list -->
      <div class="bg-primary text-surface p-12 md:p-20 flex flex-col gap-12">
        <span
          class="font-mono text-[11px] tracking-[0.3em] uppercase opacity-40"
          >Core Expertise</span
        >
        <ul class="flex flex-col gap-6" role="list">
          <li
            v-for="(item, i) in expertise"
            :key="item.label"
            class="flex justify-between items-center pb-6"
            :class="
              i < expertise.length - 1 ? 'border-b border-surface/10' : ''
            "
          >
            <span
              class="text-2xl font-headline font-medium uppercase tracking-tight"
            >
              {{ item.label }}
            </span>
            <span class="font-mono text-[11px] opacity-60">{{
              item.years
            }}</span>
          </li>
        </ul>
      </div>

      <!-- Collaborations -->
      <div class="bg-surface p-12 md:p-16">
        <div class="flex flex-col gap-8">
          <span
            class="font-mono text-[11px] tracking-[0.3em] uppercase text-secondary"
          >
            Technologies Used
          </span>
          <div class="flex flex-wrap gap-x-8 gap-y-4 items-center">
            <span
              class="text-2xl md:text-3xl font-headline font-bold tracking-tighter"
              >VUE 3</span
            >
            <span class="text-outline-variant">/</span>
            <span
              class="text-2xl md:text-3xl font-headline font-bold tracking-tighter"
              >REACT</span
            >
            <span class="text-outline-variant">/</span>
            <span
              class="text-2xl md:text-3xl font-headline font-bold tracking-tighter"
              >PINIA</span
            >
            <span class="text-outline-variant">/</span>
            <span
              class="text-2xl md:text-3xl font-headline font-bold tracking-tighter"
              >VITE</span
            >
            <span class="text-outline-variant">/</span>
            <span
              class="text-2xl md:text-3xl font-headline font-bold tracking-tighter"
              >REACT</span
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
