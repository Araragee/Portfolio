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

      <!-- Projects Carousel -->
      <div class="flex overflow-x-auto gap-8 pb-8 snap-x snap-mandatory hide-scrollbar">
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
