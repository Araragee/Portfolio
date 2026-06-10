<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import ParticleField from './ParticleField.vue'
import { useJourneyStore } from '@/stores/journey'

const store = useJourneyStore()

// This component lives in the lazy vendor-three chunk — setup running means
// the chunk arrived (loader milestone, docs/TWEAKS/B-loading-splash.md)
store.markAssetsLoaded()
</script>

<template>
  <div class="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
    <!-- antialias off: square points need zero MSAA (docs/TWEAKS/C-performance.md) -->
    <TresCanvas
      clear-color="#F9F9F8"
      :dpr="[1, 1.5]"
      :antialias="false"
      power-preference="high-performance"
    >
      <TresPerspectiveCamera :position="[0, 0, store.cameraZ]" :fov="45" />
      <ParticleField />
    </TresCanvas>
  </div>
</template>
