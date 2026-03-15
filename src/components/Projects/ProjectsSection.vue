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

const carouselRef = ref<HTMLElement | null>(null)

const scrollCarousel = (direction: 'left' | 'right') => {
  if (carouselRef.value) {
    const scrollAmount = direction === 'left' ? -450 : 450
    carouselRef.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }
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
      <div class="text-center mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="text-left">
          <h2 class="text-5xl md:text-6xl font-bold mb-4 gradient-text">
            Featured Projects
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto md:mx-0">
            A collection of my recent work showcasing modern web development practices
          </p>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex gap-4">
          <button
            @click="scrollCarousel('left')"
            class="w-12 h-12 rounded-full glass-effect flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:scale-110 active:scale-95 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Previous project"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            @click="scrollCarousel('right')"
            class="w-12 h-12 rounded-full glass-effect flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:scale-110 active:scale-95 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Next project"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Projects Carousel -->
      <div ref="carouselRef" class="flex overflow-x-auto gap-8 pb-8 snap-x snap-mandatory hide-scrollbar">
        <ProjectCard
          v-for="(project, index) in allProjects"
          :key="project.id"
          :project="project"
          :index="index"
          class="min-w-[320px] md:min-w-[400px] lg:min-w-[450px] max-w-[450px] snap-center shrink-0"
        />
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
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
