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
  anime({
    targets: progress,
    value: 100,
    duration: 2000,
    easing: 'easeInOutQuad',
    complete: () => {
      isComplete.value = true
      setTimeout(() => {
        props.onComplete?.()
      }, 400)
    }
  })

  anime({
    targets: '.loading-logo',
    scale: [0.7, 1],
    opacity: [0, 1],
    duration: 700,
    easing: 'easeOutExpo'
  })

  anime({
    targets: '.loading-text',
    opacity: [0, 1],
    translateY: [16, 0],
    duration: 600,
    delay: 250,
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
      class="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950"
    >
      <!-- Dot pattern -->
      <div class="absolute inset-0 pointer-events-none opacity-40"
           style="background-image: radial-gradient(circle, rgba(255,107,43,0.15) 1px, transparent 1px); background-size: 32px 32px;"></div>

      <div class="text-center relative z-10 scale-110">
        <!-- Logo -->
        <div class="loading-logo mb-12" style="opacity: 0;">
          <div class="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden group"
               style="background: linear-gradient(135deg, #ff6b2b, #0f766e); box-shadow: 0 10px 40px rgba(255,107,43,0.4);">
            <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <svg class="w-10 h-10 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
        </div>

        <!-- Text -->
        <div class="loading-text space-y-2 mb-10" style="opacity: 0;">
          <p class="font-bold text-2xl text-white tracking-tight">
            <span class="text-[#ff6b2b]">Dav</span><span class="text-[#0f766e]">x</span>loper
          </p>
          <div class="flex items-center justify-center gap-2">
            <span class="w-8 h-[1px] bg-zinc-800"></span>
            <p class="text-[10px] font-bold font-mono tracking-[0.3em] uppercase text-zinc-500">
              Initializing Experience
            </p>
            <span class="w-8 h-[1px] bg-zinc-800"></span>
          </div>
        </div>

        <!-- Progress -->
        <div class="w-64 mx-auto relative px-4">
          <div class="h-1 rounded-full overflow-hidden bg-zinc-900 shadow-inner">
            <div
              class="h-full rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(255,107,43,0.6)]"
              style="background: linear-gradient(90deg, #ff6b2b, #0f766e);"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
          <p class="mt-4 text-[10px] font-bold font-mono text-zinc-600 uppercase tracking-widest flex justify-between">
            <span>Progress</span>
            <span>{{ Math.round(progress) }}%</span>
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>
