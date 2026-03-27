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
      <h3 class="text-sm font-bold font-mono mb-6 pb-2 border-b border-zinc-200 dark:border-white/5 text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
        // {{ category.label }}
      </h3>

      <!-- Skills Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div
          v-for="skill in skillsByCategory[category.key]"
          :key="skill.name"
          class="flex flex-col items-center justify-center p-5 rounded-2xl glass-effect border dark:border-white/5 hover:scale-110 transition-all duration-300 group cursor-default shadow-sm hover:shadow-xl hover:border-primary-500/30"
        >
          <div class="w-12 h-12 mb-4 rounded-xl flex items-center justify-center transition-all duration-300 bg-zinc-100 dark:bg-zinc-800 group-hover:bg-primary-500/10 shadow-inner">
            <svg class="w-6 h-6 text-zinc-500 dark:text-zinc-400 group-hover:text-primary-500 transition-colors duration-300"
                 fill="currentColor"
                 viewBox="0 0 24 24">
              <path v-if="skill.icon" :d="skill.icon" />
              <path v-else fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <span class="text-xs font-bold text-center leading-tight text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 uppercase tracking-tighter">
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
