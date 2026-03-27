<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import anime from 'animejs'
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

onMounted(() => {
  if (!cardRef.value) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isVisible.value) {
          isVisible.value = true
          anime({
            targets: entry.target,
            opacity: [0, 1],
            translateY: [48, 0],
            scale: [0.95, 1],
            duration: 700,
            delay: props.index * 80,
            easing: 'easeOutCubic'
          })
          observer?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15, rootMargin: '40px' }
  )

  cardRef.value.style.opacity = '0'
  observer.observe(cardRef.value)
})

onUnmounted(() => { observer?.disconnect() })

const handleMouseEnter = () => {
  isHovered.value = true
  if (cardRef.value) {
    anime({ targets: cardRef.value, scale: 1.02, duration: 300, easing: 'easeOutCubic' })
  }
  if (imageRef.value) {
    anime({ targets: imageRef.value, scale: 1.08, duration: 500, easing: 'easeOutCubic' })
  }
}

const handleMouseLeave = () => {
  isHovered.value = false
  if (cardRef.value) {
    anime({ targets: cardRef.value, scale: 1, rotateY: 0, rotateX: 0, duration: 350, easing: 'easeOutCubic' })
  }
  if (imageRef.value) {
    anime({ targets: imageRef.value, scale: 1, duration: 400, easing: 'easeOutCubic' })
  }
}

const handleMouseMove = (e: MouseEvent) => {
  if (!cardRef.value || !isHovered.value) return
  const rect = cardRef.value.getBoundingClientRect()
  const rotateX = (((e.clientY - rect.top) / rect.height) - 0.5) * -6
  const rotateY = (((e.clientX - rect.left) / rect.width) - 0.5) * 6
  anime({ targets: cardRef.value, rotateX, rotateY, duration: 200, easing: 'easeOutQuad' })
}
</script>

<template>
  <article
    ref="cardRef"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousemove="handleMouseMove"
    class="group relative rounded-2xl overflow-hidden glass-effect border transition-all duration-300 shadow-lg hover:shadow-2xl"
    style="
      transform-style: preserve-3d;
      perspective: 1000px;
    "
  >
    <!-- Featured Badge -->
    <div
      v-if="project.featured"
      class="absolute top-4 right-4 z-20 px-3 py-1 text-white text-[10px] font-bold rounded-lg font-mono tracking-widest shadow-lg"
      style="background: linear-gradient(135deg, #ff6b2b, #e85220);"
    >
      FEATURED
    </div>

    <!-- Image -->
    <div class="relative h-56 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
      <div
        ref="imageRef"
        :class="['absolute inset-0 bg-gradient-to-br transition-all duration-700', project.image.gradient || 'from-primary-500 to-accent-700']"
        style="transform-origin: center;"
      >
        <div
          class="absolute inset-0 transition-opacity duration-300 bg-black"
          :style="{ opacity: isHovered ? 0.35 : 0.2 }"
        ></div>

        <!-- Hover overlay -->
        <div
          class="absolute inset-0 flex items-center justify-center transition-all duration-300"
          :style="{ opacity: isHovered ? 1 : 0, transform: isHovered ? 'scale(1)' : 'scale(0.9)' }"
        >
          <div class="text-white text-center">
            <div class="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center bg-primary-500/90 backdrop-blur-md shadow-xl">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <p class="text-xs font-bold uppercase tracking-widest">Learn More</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6 flex flex-col" style="height: calc(100% - 14rem);">
      <!-- Meta -->
      <div class="flex items-center gap-2 mb-3 text-xs font-mono font-medium">
        <span class="text-accent-600 dark:text-accent-400 capitalize">{{ project.category.replace('-', ' ') }}</span>
        <span class="text-zinc-300 dark:text-zinc-600">·</span>
        <span v-if="project.year" class="text-zinc-500 dark:text-zinc-500">{{ project.year }}</span>
      </div>

      <!-- Title -->
      <h3
        class="text-xl font-bold mb-3 transition-colors duration-300"
        :class="isHovered ? 'text-primary-500' : 'text-zinc-900 dark:text-zinc-100'"
      >
        {{ project.title }}
      </h3>

      <!-- Description -->
      <p class="text-sm leading-relaxed mb-6 flex-grow line-clamp-3 text-zinc-600 dark:text-zinc-400">
        {{ project.description }}
      </p>

      <!-- Tags -->
      <div class="flex flex-wrap gap-2 mb-6 mt-auto">
        <span
          v-for="tag in project.tags.slice(0, 4)"
          :key="tag"
          class="px-2.5 py-1 text-[10px] font-bold rounded-lg font-mono uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/50 hover:border-primary-500/50 transition-colors"
        >
          {{ tag }}
        </span>
        <span
          v-if="project.tags.length > 4"
          class="px-2 py-1 text-[10px] font-bold rounded-lg text-zinc-400 dark:text-zinc-500"
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
          class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 bg-primary-500 shadow-lg shadow-primary-500/20"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {{ project.links.demo.label }}
        </a>

        <a
          v-if="project.links.github"
          :href="project.links.github.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clip-rule="evenodd" />
          </svg>
          {{ project.links.github.label }}
        </a>
      </div>
    </div>

    <!-- Bottom orange accent line on hover -->
    <div
      class="absolute bottom-0 left-0 right-0 h-[3px] transition-all duration-500 translate-y-full group-hover:translate-y-0"
      style="background: linear-gradient(90deg, #ff6b2b, #0f766e);"
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
