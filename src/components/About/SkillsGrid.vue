<script setup lang="ts">
import { computed } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import type { Skill } from '@/types/about'

interface Props {
  skills: Skill[]
  showCategories?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showCategories: true
})

const { elementRef: containerRef, isVisible } = useIntersectionObserver({
  threshold: 0.1,
  once: true
})

// Group skills by category
const skillsByCategory = computed(() => {
  const categories: Record<string, Skill[]> = {}

  props.skills.forEach((skill) => {
    if (!categories[skill.category]) {
      categories[skill.category] = []
    }
    categories[skill.category].push(skill)
  })

  return categories
})

const orderedCategories = computed(() => {
  return [
    { key: 'frontend', label: 'Frontend' },
    { key: 'backend', label: 'Backend' },
    { key: 'tools', label: 'Tools' },
    { key: 'design', label: 'Design' }
  ].filter(cat => skillsByCategory.value[cat.key]?.length > 0)
})

</script>

<template>
  <div ref="containerRef" class="w-full space-y-12">
    <!-- Categories List -->
    <div
      v-for="(category, catIndex) in orderedCategories"
      :key="category.key"
      class="transition-all duration-700 ease-out"
      :class="[isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']"
      :style="{ transitionDelay: `${catIndex * 150}ms` }"
    >
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
        {{ category.label }}
      </h3>

      <!-- Skills Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div
          v-for="skill in skillsByCategory[category.key]"
          :key="skill.name"
          class="flex flex-col items-center justify-center p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 group"
        >
          <!-- Generic Skill Icon Placeholder -->
          <div class="w-12 h-12 mb-3 rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 transition-colors duration-300">
             <svg
              class="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>

          <span class="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
            {{ skill.name }}
          </span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="orderedCategories.length === 0"
      class="text-center py-12"
    >
      <p class="text-gray-500 dark:text-gray-400">
        No skills found.
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Additional custom styles */
</style>
