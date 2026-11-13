<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import CaseStudyField from './CaseStudyField.vue'

withDefaults(defineProps<{ bg?: string; dark?: boolean }>(), { bg: '#F9F9F8', dark: false })
</script>

<template>
  <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <TresCanvas
      :clear-color="bg"
      :dpr="[1, 1.5]"
      :antialias="false"
      power-preference="default"
    >
      <TresPerspectiveCamera :position="[0, 0, 8]" :fov="45" />
      <CaseStudyField :dark="dark" />
    </TresCanvas>
  </div>
</template>
