<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

interface Props {
  src: string
  alt: string
  placeholder?: string
  width?: number | string
  height?: number | string
  className?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 400 300\'%3E%3Crect fill=\'%23e5e7eb\' width=\'400\' height=\'300\'/%3E%3C/svg%3E',
  objectFit: 'cover'
})

const objectFitClass = computed(() => ({
  'cover': 'object-cover',
  'contain': 'object-contain',
  'fill': 'object-fill',
  'none': 'object-none',
  'scale-down': 'object-scale-down',
}[props.objectFit]))

const imageRef = ref<HTMLImageElement | null>(null)
const isLoaded = ref(false)
const isInView = ref(false)
const currentSrc = ref(props.placeholder)

let observer: IntersectionObserver | null = null

// Load image when in viewport
const loadImage = () => {
  if (isLoaded.value || !isInView.value) return

  const img = new Image()
  img.src = props.src

  img.onload = () => {
    currentSrc.value = props.src
    isLoaded.value = true
  }

  img.onerror = () => {
    console.error(`Failed to load image: ${props.src}`)
    // Keep placeholder on error
  }
}

onMounted(() => {
  if (!imageRef.value) return

  // Create intersection observer
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isInView.value = true
          loadImage()
          // Stop observing once image starts loading
          if (observer && imageRef.value) {
            observer.unobserve(imageRef.value)
          }
        }
      })
    },
    {
      rootMargin: '50px', // Start loading 50px before entering viewport
      threshold: 0.01
    }
  )

  observer.observe(imageRef.value)
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <img
    ref="imageRef"
    :src="currentSrc"
    :alt="alt"
    :width="width"
    :height="height"
    :class="[
      className,
      objectFitClass,
      'transition-opacity duration-500',
      isLoaded ? 'opacity-100' : 'opacity-50'
    ]"
    loading="lazy"
    decoding="async"
  />
</template>

<style scoped>
/* Blur effect while loading */
img:not(.opacity-100) {
  filter: blur(5px);
}
</style>
