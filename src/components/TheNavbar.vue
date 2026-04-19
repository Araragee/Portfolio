<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const isCaseStudy = computed(() => route.name === "CaseStudy");

const isMenuOpen = ref(false);

const navLinks = [
  { label: "Case Studies", to: "/" },
  { label: "Manifesto", to: "/manifesto" },
  { label: "Personal", to: "/personal" },
];

function goBack() {
  router.push("/");
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}
</script>

<template>
  <header
    class="fixed top-0 left-0 w-full z-50 border-b border-outline flex justify-between items-center px-6 md:px-[120px] py-6"
    style="
      background: rgba(249, 249, 248, 0.92);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    "
  >
    <!-- Case Study variant: back arrow + project label -->
    <template v-if="isCaseStudy">
      <button
        @click="goBack"
        class="flex items-center gap-3 text-on-surface hover:opacity-50 transition-opacity duration-200 bg-transparent border-none cursor-pointer p-0"
        aria-label="Back to index"
        id="back-to-index-btn"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5M5 12L12 19M5 12L12 5" />
        </svg>
        <span
          class="font-mono text-[11px] tracking-[0.2em] uppercase font-medium"
          >Index</span
        >
      </button>
      <span
        class="font-mono text-[11px] tracking-[0.2em] uppercase text-secondary hidden md:block"
      >
        Case Study
      </span>
    </template>

    <!-- Default navbar -->
    <template v-else>
      <router-link
        to="/"
        class="text-xl font-black tracking-tighter text-on-surface font-headline no-underline hover:opacity-70 transition-opacity duration-200"
        id="site-logo-link"
        aria-label="Home"
      >
        ARCHITECT.VUE
      </router-link>

      <nav
        class="hidden md:flex items-center gap-12"
        aria-label="Main navigation"
      >
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="font-headline uppercase tracking-[0.2em] text-[11px] font-semibold transition-colors duration-200 no-underline"
          :class="
            route.path === link.to
              ? 'text-on-surface border-b border-on-surface pb-1'
              : 'text-secondary hover:text-on-surface'
          "
          :id="`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`"
        >
          {{ link.label }}
        </router-link>
      </nav>

      <div
        class="font-headline uppercase tracking-[0.2em] text-[11px] font-semibold text-on-surface hidden md:block opacity-50"
      >
        VUE3 / TS / NODE
      </div>

      <!-- Mobile menu button -->
      <button
        class="md:hidden flex flex-col justify-center items-center w-8 h-8 z-[60] bg-transparent border-none p-0 cursor-pointer text-on-surface"
        @click="toggleMenu"
        aria-label="Toggle menu"
      >
        <span
          class="block w-6 h-[2px] bg-current transition-transform duration-300 origin-center"
          :class="isMenuOpen ? 'translate-y-[6px] rotate-45' : ''"
        ></span>
        <span
          class="block w-6 h-[2px] bg-current mt-1 transition-opacity duration-300"
          :class="isMenuOpen ? 'opacity-0' : ''"
        ></span>
        <span
          class="block w-6 h-[2px] bg-current mt-1 transition-transform duration-300 origin-center"
          :class="isMenuOpen ? '-translate-y-[6px] -rotate-45' : ''"
        ></span>
      </button>
    </template>
  </header>

  <!-- Mobile Menu Overlay -->
  <div
    v-show="isMenuOpen"
    class="fixed inset-0 z-40 flex flex-col items-center justify-center gap-12 md:hidden"
    style="
      background: rgba(249, 249, 248, 0.98);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    "
  >
    <router-link
      v-for="link in navLinks"
      :key="link.to"
      :to="link.to"
      class="font-headline uppercase tracking-[0.2em] text-2xl font-semibold transition-colors duration-200 no-underline"
      :class="
        route.path === link.to
          ? 'text-on-surface border-b-2 border-on-surface pb-1'
          : 'text-secondary hover:text-on-surface'
      "
      @click="isMenuOpen = false"
    >
      {{ link.label }}
    </router-link>
  </div>
</template>
