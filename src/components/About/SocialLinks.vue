<script setup lang="ts">
import { ref } from 'vue'
import anime from 'animejs'
import type { SocialLink } from '@/types/about'

interface Props {
  links: SocialLink[]
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  animated: true
})

const hoveredIndex = ref<number | null>(null)

const getSizeClasses = () => {
  switch (props.size) {
    case 'sm':
      return 'w-10 h-10 text-base'
    case 'lg':
      return 'w-16 h-16 text-2xl'
    default:
      return 'w-12 h-12 text-lg'
  }
}

const getIcon = (icon: SocialLink['icon']) => {
  // Return SVG paths for different social icons
  const icons = {
    github: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z',
    linkedin: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z',
    twitter: 'M22.46 6c-.85.38-1.75.64-2.7.76a4.7 4.7 0 0 0 2.07-2.6 9.4 9.4 0 0 1-2.98 1.14 4.7 4.7 0 0 0-8 4.28A13.3 13.3 0 0 1 3.2 4.74a4.7 4.7 0 0 0 1.45 6.27 4.64 4.64 0 0 1-2.13-.59v.06a4.7 4.7 0 0 0 3.77 4.6 4.7 4.7 0 0 1-2.12.08 4.7 4.7 0 0 0 4.39 3.26A9.43 9.43 0 0 1 2 19.54 13.27 13.27 0 0 0 9.2 21.5c8.63 0 13.35-7.15 13.35-13.35 0-.2 0-.4-.02-.6A9.54 9.54 0 0 0 24 5.23a9.33 9.33 0 0 0-2.68.74',
    email: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    dribbble: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z',
    codepen: 'M12 2l10 6.5v7L12 22 2 15.5v-7L12 2zM12 4.28L4.91 8.5l2.25 1.5L12 6.69l4.84 3.31 2.25-1.5L12 4.28zM3.16 10.63v4.72L5.4 13.5l-2.24-2.87zm1.68 6.41L12 21.72l7.16-4.68-2.43-1.62L12 18.31l-4.73-2.89-2.43 1.62zm14.4-1.69l2.24-2.87v-4.72l-2.24 2.87v4.72zM12 13.5L9.57 11.87 12 10.24l2.43 1.63L12 13.5z',
    medium: 'M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z'
  }
  return icons[icon] || icons.github
}

const handleMouseEnter = (index: number, event: MouseEvent) => {
  hoveredIndex.value = index

  if (!props.animated) return

  const target = event.currentTarget as HTMLElement

  anime({
    targets: target,
    scale: 1.15,
    rotate: 5,
    duration: 300,
    easing: 'easeOutCubic'
  })
}

const handleMouseLeave = (index: number, event: MouseEvent) => {
  hoveredIndex.value = null

  if (!props.animated) return

  const target = event.currentTarget as HTMLElement

  anime({
    targets: target,
    scale: 1,
    rotate: 0,
    duration: 300,
    easing: 'easeOutCubic'
  })
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <a
      v-for="(link, index) in links"
      :key="link.platform"
      :href="link.url"
      target="_blank"
      rel="noopener noreferrer"
      @mouseenter="(e) => handleMouseEnter(index, e)"
      @mouseleave="(e) => handleMouseLeave(index, e)"
      :class="[
        getSizeClasses(),
        'relative flex items-center justify-center rounded-full',
        'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
        'transition-all duration-300',
        'hover:shadow-lg',
        link.color || 'hover:text-primary-600 dark:hover:text-primary-400'
      ]"
      :aria-label="link.platform"
    >
      <!-- Icon -->
      <svg
        class="w-1/2 h-1/2"
        :class="{ 'fill-current': link.icon === 'github' || link.icon === 'linkedin' }"
        :fill="link.icon === 'github' || link.icon === 'linkedin' || link.icon === 'dribbble' || link.icon === 'codepen' || link.icon === 'medium' ? 'currentColor' : 'none'"
        :stroke="link.icon === 'email' || link.icon === 'twitter' ? 'currentColor' : 'none'"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        viewBox="0 0 24 24"
      >
        <path :d="getIcon(link.icon)"></path>
      </svg>

      <!-- Tooltip on hover -->
      <div
        v-if="hoveredIndex === index && link.username"
        class="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg whitespace-nowrap pointer-events-none"
      >
        {{ link.username }}
        <div class="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
          <div class="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
        </div>
      </div>
    </a>
  </div>
</template>

<style scoped>
/* Additional styles for smooth animations */
</style>
