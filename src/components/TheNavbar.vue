<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isCaseStudy = computed(() => route.name === 'CaseStudy')
const isManifesto = computed(() => route.name === 'Manifesto')

const navLinks = [
  { label: 'Case Studies', to: '/' },
  { label: 'Manifesto', to: '/manifesto' },
]

function goBack() {
  router.push('/')
}
</script>

<template>
  <header
    class="fixed top-0 left-0 w-full z-50 border-b border-outline flex justify-between items-center px-6 md:px-[120px] py-6"
    style="background: rgba(249,249,248,0.92); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);"
  >
    <!-- Case Study variant: back arrow + project label -->
    <template v-if="isCaseStudy">
      <button
        @click="goBack"
        class="flex items-center gap-3 text-on-surface hover:opacity-50 transition-opacity duration-200 bg-transparent border-none cursor-pointer p-0"
        aria-label="Back to index"
        id="back-to-index-btn"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M19 12H5M5 12L12 19M5 12L12 5"/>
        </svg>
        <span class="font-mono text-[11px] tracking-[0.2em] uppercase font-medium">Index</span>
      </button>
      <span class="font-mono text-[11px] tracking-[0.2em] uppercase text-secondary hidden md:block">
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

      <nav class="hidden md:flex items-center gap-12" aria-label="Main navigation">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="font-headline uppercase tracking-[0.2em] text-[11px] font-semibold transition-colors duration-200 no-underline"
          :class="route.path === link.to
            ? 'text-on-surface border-b border-on-surface pb-1'
            : 'text-secondary hover:text-on-surface'"
          :id="`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`"
        >
          {{ link.label }}
        </router-link>
      </nav>

      <div class="font-headline uppercase tracking-[0.2em] text-[11px] font-semibold text-on-surface hidden md:block opacity-50">
        VUE3 / TS / NODE
      </div>

      <!-- Mobile menu placeholder — shows logo only on small screens -->
    </template>
  </header>
</template>
