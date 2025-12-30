<script setup lang="ts">
import { ref, onMounted } from 'vue'
import anime from 'animejs'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import type { TimelineItem } from '@/types/about'

interface Props {
  items: TimelineItem[]
  showFilters?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showFilters: true
})

const activeFilter = ref<'all' | 'experience' | 'education' | 'achievement'>('all')
const itemRefs = ref<Array<HTMLElement | null>>([])

const { elementRef: timelineRef, isVisible } = useIntersectionObserver({
  threshold: 0.1,
  once: true
})

const filteredItems = ref(
  activeFilter.value === 'all'
    ? props.items
    : props.items.filter(item => item.type === activeFilter.value)
)

const filters = [
  { key: 'all' as const, label: 'All', icon: '📚' },
  { key: 'experience' as const, label: 'Experience', icon: '💼' },
  { key: 'education' as const, label: 'Education', icon: '🎓' },
  { key: 'achievement' as const, label: 'Achievements', icon: '🏆' }
]

const getTypeIcon = (type: TimelineItem['type']) => {
  switch (type) {
    case 'experience': return '💼'
    case 'education': return '🎓'
    case 'achievement': return '🏆'
    default: return '📌'
  }
}

const getTypeColor = (type: TimelineItem['type']) => {
  switch (type) {
    case 'experience': return 'from-blue-500 to-cyan-500'
    case 'education': return 'from-purple-500 to-pink-500'
    case 'achievement': return 'from-yellow-500 to-orange-500'
    default: return 'from-gray-500 to-gray-600'
  }
}

const animateItems = () => {
  itemRefs.value.forEach((ref, index) => {
    if (ref) {
      anime({
        targets: ref,
        opacity: [0, 1],
        translateX: [index % 2 === 0 ? -50 : 50, 0],
        translateY: [30, 0],
        duration: 800,
        delay: index * 150,
        easing: 'easeOutCubic'
      })
    }
  })
}

onMounted(() => {
  const checkVisibility = setInterval(() => {
    if (isVisible.value) {
      animateItems()
      clearInterval(checkVisibility)
    }
  }, 100)
})

const setFilter = (filter: typeof activeFilter.value) => {
  activeFilter.value = filter
  filteredItems.value = filter === 'all'
    ? props.items
    : props.items.filter(item => item.type === filter)

  setTimeout(() => {
    animateItems()
  }, 50)
}
</script>

<template>
  <div ref="timelineRef" class="w-full">
    <!-- Filters -->
    <div v-if="showFilters" class="flex flex-wrap justify-center gap-3 mb-12">
      <button
        v-for="filter in filters"
        :key="filter.key"
        @click="setFilter(filter.key)"
        :class="[
          'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300',
          'hover:scale-105 active:scale-95 flex items-center gap-2',
          activeFilter === filter.key
            ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
        ]"
      >
        <span>{{ filter.icon }}</span>
        <span>{{ filter.label }}</span>
      </button>
    </div>

    <!-- Timeline -->
    <div class="relative">
      <!-- Center Line -->
      <div class="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary-500 via-accent-500 to-primary-500 hidden lg:block"></div>

      <!-- Timeline Items -->
      <div class="space-y-12">
        <TransitionGroup name="timeline-list" tag="div" class="space-y-12">
          <div
            v-for="(item, index) in filteredItems"
            :key="item.id"
            :ref="el => itemRefs[index] = el as HTMLElement"
            :class="[
              'relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12',
              index % 2 === 0 ? 'lg:text-right' : 'lg:flex-row-reverse'
            ]"
            style="opacity: 0"
          >
            <!-- Content -->
            <div :class="index % 2 === 0 ? 'lg:col-start-1' : 'lg:col-start-2'">
              <div
                class="group relative bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-800"
              >
                <!-- Type Badge -->
                <div
                  :class="[
                    'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-white mb-4',
                    'bg-gradient-to-r',
                    getTypeColor(item.type)
                  ]"
                >
                  <span>{{ getTypeIcon(item.type) }}</span>
                  <span class="capitalize">{{ item.type }}</span>
                </div>

                <!-- Period -->
                <div class="text-sm font-medium text-primary-600 dark:text-primary-400 mb-2">
                  {{ item.period.start }} - {{ item.period.end }}
                </div>

                <!-- Title & Organization -->
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {{ item.title }}
                </h3>
                <p class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  {{ item.organization }}
                  <span v-if="item.location" class="text-sm font-normal text-gray-500 dark:text-gray-400">
                    • {{ item.location }}
                  </span>
                </p>

                <!-- Description -->
                <p class="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  {{ item.description }}
                </p>

                <!-- Highlights -->
                <ul v-if="item.highlights && item.highlights.length" class="space-y-2 mb-4">
                  <li
                    v-for="(highlight, hIndex) in item.highlights"
                    :key="hIndex"
                    class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <span class="text-primary-500 mt-0.5">▸</span>
                    <span>{{ highlight }}</span>
                  </li>
                </ul>

                <!-- Tags -->
                <div v-if="item.tags && item.tags.length" class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in item.tags"
                    :key="tag"
                    class="px-3 py-1 text-xs font-medium rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
                  >
                    {{ tag }}
                  </span>
                </div>

                <!-- Hover Effect Border -->
                <div class="absolute inset-0 rounded-2xl border-2 border-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            <!-- Timeline Dot (Desktop) -->
            <div class="hidden lg:block absolute left-1/2 transform -translate-x-1/2 top-8">
              <div
                :class="[
                  'w-6 h-6 rounded-full border-4 border-white dark:border-gray-900 shadow-lg',
                  'bg-gradient-to-br',
                  getTypeColor(item.type)
                ]"
              ></div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredItems.length === 0"
      class="text-center py-20"
    >
      <p class="text-xl text-gray-500 dark:text-gray-400">
        No items found in this category.
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Timeline transitions */
.timeline-list-move,
.timeline-list-enter-active,
.timeline-list-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.timeline-list-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.timeline-list-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.95);
}

.timeline-list-leave-active {
  position: absolute;
}
</style>
