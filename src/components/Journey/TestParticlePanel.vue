<script setup lang="ts">
import { useParticleTestMode } from '@/composables/useParticleTestMode'

const { PRESETS, currentIndex, current, next, prev } = useParticleTestMode()
</script>

<template>
  <div class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-4 border border-primary bg-surface px-5 py-2.5 font-mono text-xs uppercase tracking-widest">
    <button
      @click="prev"
      class="text-secondary hover:text-primary transition-colors"
      aria-label="Previous preset"
    >←</button>

    <span class="text-primary min-w-[160px] text-center">
      {{ currentIndex + 1 }}/{{ PRESETS.length }} — {{ current.name }}
    </span>

    <button
      @click="next"
      class="text-secondary hover:text-primary transition-colors"
      aria-label="Next preset"
    >→</button>
  </div>
</template>
