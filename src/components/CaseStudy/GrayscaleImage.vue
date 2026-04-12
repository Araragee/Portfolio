<script setup lang="ts">
// Reusable grayscale-to-color image component
defineProps<{
  src: string
  alt: string
  aspectRatio?: string  // e.g. "16/10", "1/1"
  caption?: string
}>()
</script>

<template>
  <figure class="group border border-outline bg-surface overflow-hidden">
    <div
      class="w-full overflow-hidden"
      :style="aspectRatio ? `aspect-ratio: ${aspectRatio}` : ''"
    >
      <img
        :src="src"
        :alt="alt"
        class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.01]"
        loading="lazy"
      />
    </div>
    <figcaption
      v-if="caption"
      class="px-4 py-3 font-mono text-[11px] tracking-widest text-secondary uppercase border-t border-outline"
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>
