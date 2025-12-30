<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const cursorX = ref(0)
const cursorY = ref(0)
const cursorDotX = ref(0)
const cursorDotY = ref(0)
const isHovering = ref(false)
const isClicking = ref(false)
const prefersReducedMotion = ref(false)

let animationFrameId: number | null = null

// Smooth cursor follow with lerp (linear interpolation)
const lerp = (start: number, end: number, factor: number) => {
  return start + (end - start) * factor
}

// Update cursor position
const updateCursorPosition = (e: MouseEvent) => {
  cursorX.value = e.clientX
  cursorY.value = e.clientY
}

// Animate cursor ring to follow smoothly
const animateCursor = () => {
  cursorDotX.value = lerp(cursorDotX.value, cursorX.value, 0.15)
  cursorDotY.value = lerp(cursorDotY.value, cursorY.value, 0.15)

  animationFrameId = requestAnimationFrame(animateCursor)
}

// Handle hover states
const handleMouseEnter = (e: Event) => {
  const target = e.target as HTMLElement
  if (
    target.tagName === 'A' ||
    target.tagName === 'BUTTON' ||
    target.classList.contains('cursor-pointer') ||
    target.closest('a') ||
    target.closest('button')
  ) {
    isHovering.value = true
  }
}

const handleMouseLeave = () => {
  isHovering.value = false
}

// Handle click state
const handleMouseDown = () => {
  isClicking.value = true
}

const handleMouseUp = () => {
  isClicking.value = false
}

onMounted(() => {
  // Check for reduced motion preference
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = mediaQuery.matches

  // Don't show custom cursor on touch devices or if reduced motion is preferred
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  if (isTouchDevice || prefersReducedMotion.value) {
    return
  }

  // Add event listeners
  document.addEventListener('mousemove', updateCursorPosition, { passive: true })
  document.addEventListener('mouseenter', handleMouseEnter, { capture: true })
  document.addEventListener('mouseleave', handleMouseLeave, { capture: true })
  document.addEventListener('mousedown', handleMouseDown)
  document.addEventListener('mouseup', handleMouseUp)

  // Start animation loop
  animateCursor()

  // Hide default cursor
  document.documentElement.style.cursor = 'none'
  document.body.style.cursor = 'none'
})

onUnmounted(() => {
  // Clean up
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }

  document.removeEventListener('mousemove', updateCursorPosition)
  document.removeEventListener('mouseenter', handleMouseEnter, { capture: true })
  document.removeEventListener('mouseleave', handleMouseLeave, { capture: true })
  document.removeEventListener('mousedown', handleMouseDown)
  document.removeEventListener('mouseup', handleMouseUp)

  // Restore default cursor
  document.documentElement.style.cursor = ''
  document.body.style.cursor = ''
})
</script>

<template>
  <!-- Only show on non-touch devices and when motion is allowed -->
  <div v-if="!prefersReducedMotion" class="cursor-container pointer-events-none fixed inset-0 z-[9999]">
    <!-- Cursor Dot (follows instantly) -->
    <div
      class="cursor-dot fixed w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400 mix-blend-difference transition-transform duration-100"
      :style="{
        left: `${cursorX}px`,
        top: `${cursorY}px`,
        transform: `translate(-50%, -50%) scale(${isClicking ? 0.5 : 1})`
      }"
      style="will-change: transform"
    ></div>

    <!-- Cursor Ring (follows smoothly with delay) -->
    <div
      :class="[
        'cursor-ring fixed w-10 h-10 rounded-full border-2 transition-all duration-200',
        isHovering
          ? 'border-primary-500 dark:border-primary-400 scale-150'
          : 'border-primary-400/50 dark:border-primary-500/50 scale-100',
        isClicking ? 'scale-75' : ''
      ]"
      :style="{
        left: `${cursorDotX}px`,
        top: `${cursorDotY}px`,
        transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`
      }"
      style="will-change: transform"
    ></div>
  </div>
</template>

<style scoped>
/* Additional cursor styles */
.cursor-container * {
  pointer-events: none;
}

/* Hide custom cursor on reduced motion */
@media (prefers-reduced-motion: reduce) {
  .cursor-container {
    display: none !important;
  }
}

/* Hide on mobile/touch devices */
@media (hover: none) {
  .cursor-container {
    display: none !important;
  }
}
</style>
