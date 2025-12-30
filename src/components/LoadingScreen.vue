<script setup lang="ts">
import { ref, onMounted } from 'vue'
import anime from 'animejs'

interface Props {
  onComplete?: () => void
}

const props = defineProps<Props>()

const progress = ref(0)
const isComplete = ref(false)

onMounted(() => {
  // Simulate loading progress
  anime({
    targets: progress,
    value: 100,
    duration: 2000,
    easing: 'easeInOutQuad',
    update: () => {
      // Update progress value
    },
    complete: () => {
      isComplete.value = true
      setTimeout(() => {
        props.onComplete?.()
      }, 500)
    }
  })

  // Animate logo
  anime({
    targets: '.loading-logo',
    scale: [0.8, 1],
    opacity: [0, 1],
    duration: 800,
    easing: 'easeOutCubic'
  })

  // Animate text
  anime({
    targets: '.loading-text',
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 800,
    delay: 200,
    easing: 'easeOutCubic'
  })
})
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-500"
    enter-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="!isComplete"
      class="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900"
      style="will-change: opacity"
    >
      <div class="text-center">
        <!-- Logo/Icon -->
        <div class="loading-logo mb-8">
          <div class="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-2xl">
            <svg
              class="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              ></path>
            </svg>
          </div>
        </div>

        <!-- Loading Text -->
        <p class="loading-text text-xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
          Loading Portfolio
        </p>

        <!-- Progress Bar -->
        <div class="w-64 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mx-auto">
          <div
            class="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-300"
            :style="{ width: `${progress.value}%` }"
            style="will-change: width"
          ></div>
        </div>

        <!-- Progress Percentage -->
        <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">
          {{ Math.round(progress.value) }}%
        </p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Additional loading animations */
</style>
