<script setup lang="ts">
import { ref, onMounted } from 'vue'

const scrollToNext = () => {
  const nextSection = document.querySelector('#projects')
  if (nextSection) {
    nextSection.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
    <button
      @click="scrollToNext"
      class="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300 group cursor-pointer bg-transparent border-none"
      aria-label="Scroll to next section"
    >
      <span class="text-sm font-medium uppercase tracking-wider">Scroll</span>

      <!-- Mouse Icon -->
      <div class="w-6 h-10 border-2 border-current rounded-full flex items-start justify-center p-2">
        <div class="w-1 h-2 bg-current rounded-full animate-bounce-slow"></div>
      </div>

      <!-- Arrow -->
      <svg
        class="w-6 h-6 animate-bounce-slow"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        ></path>
      </svg>
    </button>
  </div>
</template>

<style scoped>
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(10px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
</style>
