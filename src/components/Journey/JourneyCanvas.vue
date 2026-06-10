<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import ParticleField from './ParticleField.vue'
import { useJourneyStore } from '@/stores/journey'

const store = useJourneyStore()
</script>

<template>
  <div class="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
    <TresCanvas clear-color="#F9F9F8" :dpr="[1, 1.5]">
      <TresPerspectiveCamera :position="[0, 0, store.cameraZ]" :fov="45" />
      <ParticleField />
    </TresCanvas>
  </div>
</template>
