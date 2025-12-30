<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import anime from 'animejs'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import type { Skill } from '@/types/about'

interface Props {
  skills: Skill[]
  showCategories?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showCategories: true
})

const activeCategory = ref<string>('all')
const skillRefs = ref<Array<HTMLElement | null>>([])

const { elementRef: containerRef, isVisible } = useIntersectionObserver({
  threshold: 0.2,
  once: true
})

// Group skills by category
const skillsByCategory = computed(() => {
  const categories: Record<string, Skill[]> = {
    all: props.skills
  }

  props.skills.forEach((skill) => {
    if (!categories[skill.category]) {
      categories[skill.category] = []
    }
    categories[skill.category].push(skill)
  })

  return categories
})

const filteredSkills = computed(() => {
  return skillsByCategory.value[activeCategory.value] || []
})

const categories = computed(() => {
  return [
    { key: 'all', label: 'All Skills', count: props.skills.length },
    { key: 'frontend', label: 'Frontend', count: skillsByCategory.value.frontend?.length || 0 },
    { key: 'backend', label: 'Backend', count: skillsByCategory.value.backend?.length || 0 },
    { key: 'tools', label: 'Tools', count: skillsByCategory.value.tools?.length || 0 },
    { key: 'design', label: 'Design', count: skillsByCategory.value.design?.length || 0 }
  ].filter(cat => cat.count > 0)
})

// Animate progress bars when visible
const animateProgressBars = () => {
  filteredSkills.value.forEach((skill, index) => {
    const progressBar = document.getElementById(`skill-progress-${skill.name.replace(/\s+/g, '-')}`)
    if (progressBar) {
      anime({
        targets: progressBar,
        width: `${skill.level}%`,
        duration: 1500,
        delay: index * 100,
        easing: 'easeOutExpo'
      })
    }
  })
}

// Watch for visibility and animate
onMounted(() => {
  const checkVisibility = setInterval(() => {
    if (isVisible.value) {
      animateProgressBars()
      clearInterval(checkVisibility)
    }
  }, 100)
})

const setCategory = (category: string) => {
  activeCategory.value = category
  setTimeout(() => {
    animateProgressBars()
  }, 50)
}
</script>

<template>
  <div ref="containerRef" class="w-full">
    <!-- Category Filter -->
    <div v-if="showCategories" class="flex flex-wrap justify-center gap-3 mb-8">
      <button
        v-for="category in categories"
        :key="category.key"
        @click="setCategory(category.key)"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
          'hover:scale-105 active:scale-95',
          activeCategory === category.key
            ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
        ]"
      >
        {{ category.label }}
        <span class="ml-1.5 text-xs opacity-75">({{ category.count }})</span>
      </button>
    </div>

    <!-- Skills Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TransitionGroup name="skill-list" tag="div" class="contents">
        <div
          v-for="(skill, index) in filteredSkills"
          :key="skill.name"
          :ref="el => skillRefs[index] = el as HTMLElement"
          class="skill-item"
        >
          <!-- Skill Header -->
          <div class="flex justify-between items-center mb-2">
            <h4 class="font-semibold text-gray-900 dark:text-white">
              {{ skill.name }}
            </h4>
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
              {{ skill.level }}%
            </span>
          </div>

          <!-- Progress Bar -->
          <div class="relative h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <!-- Background gradient -->
            <div
              :id="`skill-progress-${skill.name.replace(/\s+/g, '-')}`"
              :class="[
                'absolute top-0 left-0 h-full bg-gradient-to-r rounded-full transition-all duration-300',
                skill.color || 'from-primary-400 to-accent-400'
              ]"
              style="width: 0%"
            >
              <!-- Shine effect -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"></div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredSkills.length === 0"
      class="text-center py-12"
    >
      <p class="text-gray-500 dark:text-gray-400">
        No skills found in this category.
      </p>
    </div>
  </div>
</template>

<style scoped>
.skill-item {
  opacity: 1;
  transition: all 0.3s ease;
}

/* Transition animations */
.skill-list-move,
.skill-list-enter-active,
.skill-list-leave-active {
  transition: all 0.4s cubic-bezier(0.55, 0, 0.1, 1);
}

.skill-list-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.skill-list-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.skill-list-leave-active {
  position: absolute;
}

/* Shine animation */
@keyframes shine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shine {
  animation: shine 2s ease-in-out infinite;
}
</style>
