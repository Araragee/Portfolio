<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import CaseStudyField from './CaseStudyField.vue'
</script>

<template>
  <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <TresCanvas
      clear-color="#F9F9F8"
      :dpr="[1, 1.5]"
      :antialias="false"
      power-preference="default"
    >
      <TresPerspectiveCamera :position="[0, 0, 8]" :fov="45" />
      <CaseStudyField />
    </TresCanvas>
  </div>
</template>
