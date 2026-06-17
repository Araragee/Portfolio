<script setup lang="ts">
import { shallowRef } from 'vue'
import { TresCanvas } from '@tresjs/core'
import DuckParticleScene from './DuckParticleScene.vue'

const containerRef = shallowRef<HTMLElement | null>(null)
</script>

<template>
  <div 
    ref="containerRef" 
    class="w-full h-full relative"
  >
    <TresCanvas clear-color="transparent" alpha>
      <DuckParticleScene :container="containerRef" />
    </TresCanvas>
  </div>
</template>
