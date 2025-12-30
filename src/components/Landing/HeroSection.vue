<script setup lang="ts">
import { ref, onMounted } from 'vue'
import anime from 'animejs'
import { useParallax } from '@/composables/useParallax'
import FloatingShapes from './FloatingShapes.vue'
import ScrollIndicator from './ScrollIndicator.vue'

const heroRef = ref<HTMLElement | null>(null)
const nameRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const taglineRef = ref<HTMLElement | null>(null)

// Parallax for background elements
const { elementRef: bgRef, transform: bgTransform } = useParallax({ speed: 0.3 })

onMounted(() => {
  // Animate name with stagger effect
  if (nameRef.value) {
    const text = nameRef.value.textContent || ''
    nameRef.value.innerHTML = ''

    const chars = text.split('').map((char) => {
      const span = document.createElement('span')
      span.textContent = char === ' ' ? '\u00A0' : char
      span.style.display = 'inline-block'
      span.style.opacity = '0'
      return span
    })

    chars.forEach((span) => nameRef.value?.appendChild(span))

    anime({
      targets: chars,
      opacity: [0, 1],
      translateY: [50, 0],
      rotateZ: [10, 0],
      duration: 1000,
      delay: anime.stagger(50, { start: 300 }),
      easing: 'easeOutExpo'
    })
  }

  // Animate title
  if (titleRef.value) {
    anime({
      targets: titleRef.value,
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 1000,
      delay: 800,
      easing: 'easeOutCubic'
    })
  }

  // Animate tagline
  if (taglineRef.value) {
    anime({
      targets: taglineRef.value,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 1000,
      delay: 1200,
      easing: 'easeOutCubic'
    })
  }
})
</script>

<template>
  <section
    ref="heroRef"
    class="section-container flex items-center justify-center relative"
  >
    <!-- Animated Background -->
    <div
      ref="bgRef"
      :style="{ transform: bgTransform }"
      class="absolute inset-0 overflow-hidden"
    >
      <!-- Gradient Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950"></div>

      <!-- Floating Shapes -->
      <FloatingShapes />

      <!-- Gradient Orbs -->
      <div class="absolute top-20 left-20 w-96 h-96 bg-primary-400/30 dark:bg-primary-600/20 rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-20 right-20 w-80 h-80 bg-accent-400/30 dark:bg-accent-600/20 rounded-full blur-3xl animate-float-delayed"></div>
    </div>

    <!-- Content -->
    <div class="container-padding relative z-10">
      <div class="max-w-4xl mx-auto text-center">
        <!-- Name -->
        <h1
          ref="nameRef"
          class="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-6 gradient-text"
        >
          Your Name
        </h1>

        <!-- Title -->
        <h2
          ref="titleRef"
          class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-8 text-gray-700 dark:text-gray-300"
          style="opacity: 0"
        >
          Front-end Developer
        </h2>

        <!-- Tagline -->
        <p
          ref="taglineRef"
          class="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed text-balance"
          style="opacity: 0"
        >
          Crafting beautiful, performant web experiences with modern technologies and creative problem-solving
        </p>

        <!-- CTA Buttons (optional) -->
        <div class="mt-12 flex gap-4 justify-center flex-wrap">
          <a
            href="#projects"
            class="glass-effect px-8 py-4 rounded-full font-semibold text-gray-900 dark:text-white hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            View Projects
          </a>
          <a
            href="#contact"
            class="bg-gradient-to-r from-primary-500 to-accent-500 px-8 py-4 rounded-full font-semibold text-white hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <ScrollIndicator />
  </section>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>
