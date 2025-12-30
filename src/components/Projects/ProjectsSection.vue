<script setup lang="ts">
import { ref, computed } from 'vue'
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import { useParallax } from '@/composables/useParallax'
import ProjectCard from './ProjectCard.vue'
import type { Project, ProjectCategory, ProjectFilter } from '@/types/project'

// Project data with realistic structure
const allProjects = ref<Project[]>([
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'A full-featured e-commerce platform with real-time inventory management, secure payment processing, and responsive design.',
    longDescription: 'Built a complete e-commerce solution handling 10k+ products with advanced filtering, shopping cart, user authentication, and integrated payment gateway. Features include real-time stock updates, order tracking, and an admin dashboard.',
    category: 'web-app',
    tags: ['Vue 3', 'TypeScript', 'Node.js', 'MongoDB', 'Stripe', 'Tailwind CSS'],
    image: {
      alt: 'E-Commerce Platform Dashboard',
      gradient: 'from-blue-500 via-purple-500 to-pink-500'
    },
    links: {
      demo: { url: 'https://demo.ecommerce-example.com', label: 'View Demo' },
      github: { url: 'https://github.com/yourusername/ecommerce-platform', label: 'Source Code' }
    },
    featured: true,
    year: 2024,
    status: 'completed'
  },
  {
    id: 2,
    title: 'Task Management Dashboard',
    description: 'Collaborative task management app with drag-and-drop, real-time updates, and team collaboration features.',
    longDescription: 'Developed a Trello-like task management system with kanban boards, real-time collaboration using WebSockets, team management, and advanced filtering. Supports multiple projects, custom workflows, and detailed analytics.',
    category: 'web-app',
    tags: ['React', 'TypeScript', 'Firebase', 'DnD Kit', 'Zustand', 'Material-UI'],
    image: {
      alt: 'Task Management Dashboard',
      gradient: 'from-cyan-500 via-blue-500 to-indigo-500'
    },
    links: {
      demo: { url: 'https://demo.taskmanager-example.com', label: 'Live Demo' },
      github: { url: 'https://github.com/yourusername/task-manager', label: 'GitHub' },
      case_study: { url: '#', label: 'Case Study' }
    },
    featured: true,
    year: 2024,
    status: 'completed'
  },
  {
    id: 3,
    title: 'Analytics Dashboard',
    description: 'Interactive analytics dashboard with beautiful data visualizations, real-time metrics, and customizable widgets.',
    longDescription: 'Created a comprehensive analytics platform featuring interactive charts, real-time data streams, customizable dashboards, and advanced filtering. Handles large datasets with virtualization and provides export capabilities.',
    category: 'web-app',
    tags: ['Vue 3', 'D3.js', 'Chart.js', 'TypeScript', 'Vite', 'Pinia'],
    image: {
      alt: 'Analytics Dashboard',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500'
    },
    links: {
      demo: { url: 'https://demo.analytics-example.com', label: 'View Demo' },
      github: { url: 'https://github.com/yourusername/analytics-dashboard', label: 'Code' }
    },
    featured: false,
    year: 2023,
    status: 'completed'
  },
  {
    id: 4,
    title: 'Design System Library',
    description: 'Comprehensive UI component library with accessibility-first design, extensive documentation, and theme customization.',
    longDescription: 'Built a production-ready component library with 50+ components, full TypeScript support, accessibility compliance (WCAG 2.1), theme system, and Storybook documentation. Published as NPM package with automated testing.',
    category: 'ui-ux',
    tags: ['Vue 3', 'TypeScript', 'Storybook', 'Vitest', 'Accessibility', 'CSS Variables'],
    image: {
      alt: 'Design System Components',
      gradient: 'from-purple-500 via-pink-500 to-red-500'
    },
    links: {
      demo: { url: 'https://storybook.designsystem-example.com', label: 'Storybook' },
      github: { url: 'https://github.com/yourusername/design-system', label: 'GitHub' }
    },
    featured: true,
    year: 2024,
    status: 'completed'
  },
  {
    id: 5,
    title: 'REST API Framework',
    description: 'Scalable Node.js REST API with authentication, rate limiting, caching, and comprehensive documentation.',
    longDescription: 'Developed a production-grade REST API framework with JWT authentication, role-based access control, Redis caching, rate limiting, request validation, and automatic API documentation generation.',
    category: 'api',
    tags: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'JWT', 'Swagger'],
    image: {
      alt: 'REST API Documentation',
      gradient: 'from-green-500 via-emerald-500 to-teal-500'
    },
    links: {
      github: { url: 'https://github.com/yourusername/api-framework', label: 'Source Code' },
      case_study: { url: '#', label: 'Documentation' }
    },
    featured: false,
    year: 2023,
    status: 'completed'
  },
  {
    id: 6,
    title: 'Developer CLI Tool',
    description: 'Command-line tool for automating development workflows with scaffolding, code generation, and deployment scripts.',
    longDescription: 'Created a CLI tool to streamline development processes including project scaffolding, component generation, database migrations, and deployment automation. Features interactive prompts and plugin system.',
    category: 'tool',
    tags: ['Node.js', 'TypeScript', 'Commander.js', 'Inquirer', 'Chalk'],
    image: {
      alt: 'CLI Tool Interface',
      gradient: 'from-orange-500 via-red-500 to-pink-500'
    },
    links: {
      github: { url: 'https://github.com/yourusername/dev-cli', label: 'GitHub' }
    },
    featured: false,
    year: 2023,
    status: 'completed'
  }
])

// Filter categories
const filters = ref<ProjectFilter[]>([
  { category: 'all', label: 'All Projects' },
  { category: 'web-app', label: 'Web Apps' },
  { category: 'ui-ux', label: 'UI/UX' },
  { category: 'api', label: 'APIs' },
  { category: 'tool', label: 'Tools' }
])

// Active filter
const activeFilter = ref<ProjectCategory>('all')

// Filtered projects
const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') {
    return allProjects.value
  }
  return allProjects.value.filter(project => project.category === activeFilter.value)
})

// Update filter counts
const updateFilterCounts = () => {
  filters.value.forEach(filter => {
    if (filter.category === 'all') {
      filter.count = allProjects.value.length
    } else {
      filter.count = allProjects.value.filter(p => p.category === filter.category).length
    }
  })
}

updateFilterCounts()

const setFilter = (category: ProjectCategory) => {
  activeFilter.value = category
}

const { elementRef: sectionRef } = useScrollAnimation({ threshold: 0.1 })
const { elementRef: decorRef1, transform: decorTransform1 } = useParallax({ speed: 0.3 })
const { elementRef: decorRef2, transform: decorTransform2 } = useParallax({ speed: -0.2 })
</script>

<template>
  <section
    id="projects"
    ref="sectionRef"
    class="section-container py-20 relative"
  >
    <div class="container-padding relative z-10">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-5xl md:text-6xl font-bold mb-4 gradient-text">
          Featured Projects
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          A collection of my recent work showcasing modern web development practices
        </p>
      </div>

      <!-- Filter Buttons -->
      <div class="flex flex-wrap justify-center gap-3 mb-12">
        <button
          v-for="filter in filters"
          :key="filter.category"
          @click="setFilter(filter.category)"
          :class="[
            'px-6 py-3 rounded-full font-medium transition-all duration-300',
            'hover:scale-105 active:scale-95',
            activeFilter === filter.category
              ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
              : 'glass-effect text-gray-700 dark:text-gray-300 hover:shadow-md'
          ]"
        >
          {{ filter.label }}
          <span
            v-if="filter.count !== undefined"
            :class="[
              'ml-2 px-2 py-0.5 rounded-full text-xs',
              activeFilter === filter.category
                ? 'bg-white/20'
                : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
            ]"
          >
            {{ filter.count }}
          </span>
        </button>
      </div>

      <!-- Projects Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <TransitionGroup
          name="project-list"
          tag="div"
          class="contents"
        >
          <ProjectCard
            v-for="(project, index) in filteredProjects"
            :key="project.id"
            :project="project"
            :index="index"
          />
        </TransitionGroup>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredProjects.length === 0"
        class="text-center py-20"
      >
        <p class="text-xl text-gray-500 dark:text-gray-400">
          No projects found in this category.
        </p>
      </div>
    </div>

    <!-- Parallax Background Decorations -->
    <div
      ref="decorRef1"
      :style="{ transform: decorTransform1 }"
      class="absolute top-20 right-0 w-96 h-96 bg-primary-400/10 dark:bg-primary-600/5 rounded-full blur-3xl -z-10 pointer-events-none"
    ></div>
    <div
      ref="decorRef2"
      :style="{ transform: decorTransform2 }"
      class="absolute bottom-20 left-0 w-96 h-96 bg-accent-400/10 dark:bg-accent-600/5 rounded-full blur-3xl -z-10 pointer-events-none"
    ></div>

    <!-- Geometric Shapes -->
    <div class="absolute top-40 left-10 w-20 h-20 border-2 border-primary-300/20 dark:border-primary-700/20 rounded-lg rotate-12 -z-10"></div>
    <div class="absolute bottom-40 right-20 w-16 h-16 border-2 border-accent-300/20 dark:border-accent-700/20 rounded-full -z-10"></div>
  </section>
</template>

<style scoped>
/* Transition animations for filter */
.project-list-move,
.project-list-enter-active,
.project-list-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.project-list-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(30px);
}

.project-list-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(-30px);
}

.project-list-leave-active {
  position: absolute;
}
</style>
