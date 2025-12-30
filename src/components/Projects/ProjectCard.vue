<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import anime from 'animejs'
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import type { Project } from '@/types/project'

interface Props {
  project: Project
  index: number
}

const props = defineProps<Props>()

const cardRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLElement | null>(null)
const isHovered = ref(false)
const isVisible = ref(false)

let observer: IntersectionObserver | null = null
let tiltAnimation: anime.AnimeInstance | null = null

// Scroll-triggered animation
onMounted(() => {
  if (!cardRef.value) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isVisible.value) {
          isVisible.value = true

          // Staggered entrance animation
          anime({
            targets: entry.target,
            opacity: [0, 1],
            translateY: [60, 0],
            scale: [0.9, 1],
            rotateX: [10, 0],
            duration: 800,
            delay: props.index * 100,
            easing: 'easeOutCubic'
          })

          observer?.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.2,
      rootMargin: '50px'
    }
  )

  // Set initial state
  cardRef.value.style.opacity = '0'
  observer.observe(cardRef.value)
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
  if (tiltAnimation) {
    tiltAnimation.pause()
  }
})

// Hover animations
const handleMouseEnter = () => {
  isHovered.value = true

  if (cardRef.value) {
    anime({
      targets: cardRef.value,
      scale: 1.05,
      rotateY: 2,
      duration: 400,
      easing: 'easeOutCubic'
    })
  }

  if (imageRef.value) {
    anime({
      targets: imageRef.value,
      scale: 1.1,
      duration: 600,
      easing: 'easeOutCubic'
    })
  }
}

const handleMouseLeave = () => {
  isHovered.value = false

  if (cardRef.value) {
    anime({
      targets: cardRef.value,
      scale: 1,
      rotateY: 0,
      rotateX: 0,
      duration: 400,
      easing: 'easeOutCubic'
    })
  }

  if (imageRef.value) {
    anime({
      targets: imageRef.value,
      scale: 1,
      duration: 600,
      easing: 'easeOutCubic'
    })
  }
}

// Tilt effect on mouse move
const handleMouseMove = (e: MouseEvent) => {
  if (!cardRef.value || !isHovered.value) return

  const rect = cardRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const centerX = rect.width / 2
  const centerY = rect.height / 2

  const rotateX = ((y - centerY) / centerY) * -5
  const rotateY = ((x - centerX) / centerX) * 5

  anime({
    targets: cardRef.value,
    rotateX: rotateX,
    rotateY: rotateY,
    duration: 200,
    easing: 'easeOutQuad'
  })
}
</script>

<template>
  <article
    ref="cardRef"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousemove="handleMouseMove"
    class="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500 border border-gray-200 dark:border-gray-800"
    style="transform-style: preserve-3d; perspective: 1000px;"
  >
    <!-- Featured Badge -->
    <div
      v-if="project.featured"
      class="absolute top-4 right-4 z-20 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full shadow-lg"
    >
      FEATURED
    </div>

    <!-- Project Image -->
    <div class="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-800">
      <div
        ref="imageRef"
        :class="[
          'absolute inset-0 bg-gradient-to-br transition-all duration-600',
          project.image.gradient || 'from-primary-400 to-accent-400'
        ]"
        style="transform-origin: center center;"
      >
        <!-- Overlay on hover -->
        <div
          :class="[
            'absolute inset-0 bg-black transition-opacity duration-300',
            isHovered ? 'opacity-30' : 'opacity-20'
          ]"
        ></div>

        <!-- Icon placeholder -->
        <div class="absolute inset-0 flex items-center justify-center">
          <svg
            :class="[
              'w-24 h-24 text-white transition-all duration-300',
              isHovered ? 'opacity-80 scale-110' : 'opacity-50'
            ]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
        </div>

        <!-- Hover overlay with view project text -->
        <div
          :class="[
            'absolute inset-0 flex items-center justify-center transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-0'
          ]"
        >
          <div class="text-white text-center">
            <p class="text-lg font-bold mb-1">View Project</p>
            <div class="flex gap-2 justify-center">
              <div class="w-8 h-0.5 bg-white"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Badge -->
      <div class="absolute bottom-4 left-4 z-10">
        <span class="glass-effect px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg backdrop-blur-md">
          {{ project.category.replace('-', ' ').toUpperCase() }}
        </span>
      </div>
    </div>

    <!-- Project Content -->
    <div class="p-6 relative">
      <!-- Year/Status -->
      <div class="flex items-center gap-2 mb-3 text-xs text-gray-500 dark:text-gray-400">
        <span v-if="project.year">{{ project.year }}</span>
        <span v-if="project.year && project.status">•</span>
        <span v-if="project.status" class="capitalize">{{ project.status }}</span>
      </div>

      <!-- Title -->
      <h3 class="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {{ project.title }}
      </h3>

      <!-- Description -->
      <p class="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed line-clamp-3">
        {{ project.description }}
      </p>

      <!-- Tech Stack Tags -->
      <div class="flex flex-wrap gap-2 mb-6">
        <span
          v-for="(tag, tagIndex) in project.tags.slice(0, 4)"
          :key="tag"
          :style="{ animationDelay: `${tagIndex * 50}ms` }"
          class="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 hover:scale-105 transition-transform"
        >
          {{ tag }}
        </span>
        <span
          v-if="project.tags.length > 4"
          class="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
        >
          +{{ project.tags.length - 4 }}
        </span>
      </div>

      <!-- Links -->
      <div class="flex flex-wrap gap-3">
        <a
          v-if="project.links.demo"
          :href="project.links.demo.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg font-medium hover:scale-105 hover:shadow-lg transition-all duration-300"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            ></path>
          </svg>
          <span>{{ project.links.demo.label }}</span>
        </a>

        <a
          v-if="project.links.github"
          :href="project.links.github.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105 transition-all duration-300"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              fill-rule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span>{{ project.links.github.label }}</span>
        </a>

        <a
          v-if="project.links.case_study"
          :href="project.links.case_study.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:border-primary-500 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:scale-105 transition-all duration-300"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            ></path>
          </svg>
          <span>{{ project.links.case_study.label }}</span>
        </a>
      </div>
    </div>

    <!-- Decorative element -->
    <div
      :class="[
        'absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300',
        isHovered ? 'opacity-100' : 'opacity-0'
      ]"
    ></div>
  </article>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
