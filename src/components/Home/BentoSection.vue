<script setup lang="ts">
import { useRouter } from "vue-router";
import { useScrollAnimation, useStaggerAnimation } from "@/composables/useScrollAnimation";

const router = useRouter();
const { elementRef: sectionRef } = useScrollAnimation({ threshold: 0.1 });
const { containerRef: expertiseRef } = useStaggerAnimation({ staggerDelay: 100 });

function goManifesto() {
  router.push("/manifesto");
}

const expertise = [
  { label: "Enterprise Vue 3", years: "3+ YRS" },
  { label: "TypeScript Arch", years: "3+ YRS" },
  { label: "Node.js Ecosystem", years: "2+ YRS" },
  { label: "Design Systems", years: "2+ YRS" },
];

const technologies = ["VUE 3", "REACT", "PINIA", "VITE", "NODE"];
</script>

<template>
  <section
    ref="sectionRef"
    class="section-padding mb-20 md:mb-40 grid grid-cols-1 md:grid-cols-2 gap-px bg-outline"
    aria-labelledby="philosophy-heading"
  >
    <!-- Left: Philosophy + CTA -->
    <div
      class="bg-surface p-8 md:p-12 lg:p-20 flex flex-col justify-between min-h-[400px] md:min-h-0"
      style="aspect-ratio: auto"
    >
      <div class="flex flex-col gap-6 md:gap-8">
        <span class="font-mono text-label uppercase text-secondary">
          The Philosophy
        </span>
        <h2
          id="philosophy-heading"
          class="font-headline font-bold text-heading-xl uppercase leading-none"
        >
          Code as<br />Architecture
        </h2>
        <p
          class="text-body font-normal text-on-surface/70 leading-relaxed max-w-md font-body"
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

    <!-- Right: Expertise list + Technologies -->
    <div class="grid grid-cols-1 gap-px bg-outline">
      <!-- Inverted expertise list -->
      <div
        ref="expertiseRef"
        class="bg-primary text-surface p-8 md:p-12 lg:p-20 flex flex-col gap-8 md:gap-12"
      >
        <span class="font-mono text-label uppercase opacity-40">
          Core Expertise
        </span>
        <ul class="flex flex-col gap-4 md:gap-6" role="list">
          <li
            v-for="(item, i) in expertise"
            :key="item.label"
            data-stagger
            class="flex justify-between items-center pb-4 md:pb-6"
            :class="
              i < expertise.length - 1 ? 'border-b border-surface/10' : ''
            "
          >
            <span
              class="text-heading font-headline font-medium uppercase tracking-tight"
            >
              {{ item.label }}
            </span>
            <span class="font-mono text-label opacity-60">
              {{ item.years }}
            </span>
          </li>
        </ul>
      </div>

      <!-- Technologies -->
      <div class="bg-surface p-8 md:p-12 lg:p-16">
        <div class="flex flex-col gap-6 md:gap-8">
          <span class="font-mono text-label uppercase text-secondary">
            Technologies Used
          </span>
          <div class="flex flex-wrap gap-x-4 md:gap-x-8 gap-y-3 items-center">
            <template v-for="(tech, i) in technologies" :key="tech">
              <span
                class="text-heading-lg font-headline font-bold tracking-tighter"
              >
                {{ tech }}
              </span>
              <span v-if="i < technologies.length - 1" class="text-outline-variant">/</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
