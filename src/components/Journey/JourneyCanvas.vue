<script setup lang="ts">
import { computed } from 'vue'
import { TresCanvas } from '@tresjs/core'
import ParticleField from './ParticleField.vue'
import { useJourneyStore } from '@/stores/journey'
import { storeToRefs } from 'pinia'

const store = useJourneyStore()
const { degradeTier } = storeToRefs(store)

// Tier < 2 = full DPR cap; tier >= 2 = clamp to 1 (saves ~50% fill rate)
const dpr = computed<[number, number]>(() =>
  degradeTier.value >= 2 ? [1, 1] : [1, 1.5],
)

// This component lives in the lazy vendor-three chunk — setup running means
// the chunk arrived (loader milestone, docs/TWEAKS/B-loading-splash.md)
store.markAssetsLoaded()
</script>

<template>
  <div class="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
    <!-- antialias off: square points need zero MSAA (docs/TWEAKS/C-performance.md) -->
    <TresCanvas
      clear-color="#F9F9F8"
      :dpr="dpr"
      :antialias="false"
      power-preference="high-performance"
    >
      <TresPerspectiveCamera :position="[0, 0, store.cameraZ]" :fov="45" />
      <ParticleField />
    </TresCanvas>
  </div>
</template>
