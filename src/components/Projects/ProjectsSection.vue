<script setup lang="ts">
import { ref } from 'vue'
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import { useParallax } from '@/composables/useParallax'
import ProjectCard from './ProjectCard.vue'
import type { Project } from '@/types/project'

const allProjects = ref<Project[]>([
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'A full-featured e-commerce platform with real-time inventory management, secure payment processing, and responsive design.',
    longDescription: 'Built a complete e-commerce solution handling 10k+ products with advanced filtering, shopping cart, user authentication, and integrated payment gateway.',
    category: 'web-app',
    tags: ['Vue 3', 'TypeScript', 'Node.js', 'MongoDB', 'Stripe', 'Tailwind CSS'],
    image: { alt: 'E-Commerce Platform Dashboard', gradient: 'from-orange-500 via-red-500 to-pink-500' },
    links: {
      demo: { url: 'https://demo.ecommerce-example.com', label: 'Live Demo' },
      github: { url: 'https://github.com/yourusername/ecommerce-platform', label: 'Code' }
    },
    featured: true, year: 2024, status: 'completed'
  },
  {
    id: 2,
    title: 'Task Management Dashboard',
    description: 'Collaborative task management app with drag-and-drop, real-time updates, and team collaboration features.',
    longDescription: 'Developed a Trello-like task management system with kanban boards, real-time collaboration using WebSockets, and advanced filtering.',
    category: 'web-app',
    tags: ['React', 'TypeScript', 'Firebase', 'DnD Kit', 'Zustand'],
    image: { alt: 'Task Management Dashboard', gradient: 'from-teal-500 via-cyan-500 to-blue-500' },
    links: {
      demo: { url: 'https://demo.taskmanager-example.com', label: 'Live Demo' },
      github: { url: 'https://github.com/yourusername/task-manager', label: 'Code' },
      case_study: { url: '#', label: 'Case Study' }
    },
    featured: true, year: 2024, status: 'completed'
  },
  {
    id: 3,
    title: 'Analytics Dashboard',
    description: 'Interactive analytics dashboard with beautiful data visualisations, real-time metrics, and customisable widgets.',
    longDescription: 'Created a comprehensive analytics platform featuring interactive charts, real-time data streams, and advanced filtering.',
    category: 'web-app',
    tags: ['Vue 3', 'D3.js', 'Chart.js', 'TypeScript', 'Pinia'],
    image: { alt: 'Analytics Dashboard', gradient: 'from-emerald-500 via-teal-500 to-cyan-500' },
    links: {
      demo: { url: 'https://demo.analytics-example.com', label: 'Live Demo' },
      github: { url: 'https://github.com/yourusername/analytics-dashboard', label: 'Code' }
    },
    featured: false, year: 2023, status: 'completed'
  },
  {
    id: 4,
    title: 'Design System Library',
    description: 'Comprehensive UI component library with accessibility-first design, extensive documentation, and theme customisation.',
    longDescription: 'Built a production-ready component library with 50+ components, full TypeScript support, and WCAG 2.1 compliance.',
    category: 'ui-ux',
    tags: ['Vue 3', 'TypeScript', 'Storybook', 'Vitest', 'CSS Variables'],
    image: { alt: 'Design System Components', gradient: 'from-violet-500 via-purple-500 to-fuchsia-500' },
    links: {
      demo: { url: 'https://storybook.designsystem-example.com', label: 'Storybook' },
      github: { url: 'https://github.com/yourusername/design-system', label: 'Code' }
    },
    featured: true, year: 2024, status: 'completed'
  },
  {
    id: 5,
    title: 'REST API Framework',
    description: 'Scalable Node.js REST API with authentication, rate limiting, Redis caching, and comprehensive documentation.',
    longDescription: 'Developed a production-grade REST API framework with JWT auth, RBAC, Redis caching, and automatic API docs.',
    category: 'api',
    tags: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Swagger'],
    image: { alt: 'REST API Documentation', gradient: 'from-green-500 via-emerald-500 to-teal-500' },
    links: {
      github: { url: 'https://github.com/yourusername/api-framework', label: 'Code' },
      case_study: { url: '#', label: 'Docs' }
    },
    featured: false, year: 2023, status: 'completed'
  },
  {
    id: 6,
    title: 'Developer CLI Tool',
    description: 'CLI tool for automating development workflows with scaffolding, code generation, and deployment scripts.',
    longDescription: 'Created a CLI tool to streamline development processes including project scaffolding and deployment automation.',
    category: 'tool',
    tags: ['Node.js', 'TypeScript', 'Commander.js', 'Inquirer'],
    image: { alt: 'CLI Tool', gradient: 'from-orange-500 via-amber-500 to-yellow-500' },
    links: { github: { url: 'https://github.com/yourusername/dev-cli', label: 'Code' } },
    featured: false, year: 2023, status: 'completed'
  }
])

const carouselRef = ref<HTMLElement | null>(null)

const scrollCarousel = (direction: 'left' | 'right') => {
  if (carouselRef.value) {
    carouselRef.value.scrollBy({ left: direction === 'left' ? -460 : 460, behavior: 'smooth' })
  }
}

const { elementRef: sectionRef } = useScrollAnimation({ threshold: 0.1 })
const { elementRef: decorRef1, transform: decorTransform1 } = useParallax({ speed: 0.25 })
const { elementRef: decorRef2, transform: decorTransform2 } = useParallax({ speed: -0.15 })
</script>

<template>
  <section
    id="projects"
    ref="sectionRef"
    class="section-container py-24 relative"
  >
    <!-- Background texture -->
    <div
      class="absolute inset-0 pointer-events-none opacity-50"
      style="background-image: radial-gradient(circle, rgba(255,107,43,0.07) 1px, transparent 1px); background-size: 32px 32px;"
    ></div>

    <!-- Parallax blobs -->
    <div ref="decorRef1" :style="{ transform: decorTransform1 }"
         class="absolute top-16 right-0 w-80 h-80 rounded-full pointer-events-none -z-10 blur-3xl opacity-20"
         style="background: radial-gradient(circle, rgba(255,107,43,0.3), transparent 70%);"></div>
    <div ref="decorRef2" :style="{ transform: decorTransform2 }"
         class="absolute bottom-16 left-0 w-80 h-80 rounded-full pointer-events-none -z-10 blur-3xl opacity-20"
         style="background: radial-gradient(circle, rgba(15,118,110,0.3), transparent 70%);"></div>

    <div class="container-padding relative z-10">
      <!-- Header -->
      <div class="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
        <div class="max-w-xl">
          <p class="section-label mb-3">// Selected Work</p>
          <h2 class="text-4xl md:text-5xl font-bold gradient-text">
            Featured Projects
          </h2>
          <p class="mt-4 text-base text-zinc-600 dark:text-zinc-400">
            A collection of recent work showcasing modern full-stack and front-end development.
          </p>
        </div>

        <!-- Nav buttons -->
        <div class="flex gap-3 shrink-0">
          <button
            @click="scrollCarousel('left')"
            class="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none glass-effect border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400"
            aria-label="Previous project"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            @click="scrollCarousel('right')"
            class="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none bg-primary-500 text-white shadow-lg shadow-primary-500/20"
            aria-label="Next project"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Carousel -->
      <div
        ref="carouselRef"
        class="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory hide-scrollbar"
      >
        <ProjectCard
          v-for="(project, index) in allProjects"
          :key="project.id"
          :project="project"
          :index="index"
          class="min-w-[300px] md:min-w-[380px] lg:min-w-[420px] max-w-[420px] snap-center shrink-0"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
