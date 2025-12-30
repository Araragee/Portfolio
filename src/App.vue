<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useScrollProgress } from '@/composables/useScrollAnimation'
import LoadingScreen from '@/components/LoadingScreen.vue'
import Navigation from '@/components/Navigation.vue'
import HeroSection from '@/components/Landing/HeroSection.vue'
import ProjectsSection from '@/components/Projects/ProjectsSection.vue'
import AboutSection from '@/components/About/AboutSection.vue'

// Loading state
const isLoading = ref(true)
const showContent = ref(false)

// Theme management
const isDark = ref(false)
const { scrollProgress } = useScrollProgress()

// Initialize theme from localStorage or system preference
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Theme toggle with smooth transition
const toggleTheme = () => {
  isDark.value = !isDark.value

  // Add transition class
  document.documentElement.classList.add('theme-transition')

  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }

  // Remove transition class after animation
  setTimeout(() => {
    document.documentElement.classList.remove('theme-transition')
  }, 300)
}

// Handle loading complete
const handleLoadingComplete = () => {
  isLoading.value = false
  showContent.value = true

  // Enable smooth scroll
  document.documentElement.style.scrollBehavior = 'smooth'
}

// Current year for footer
const currentYear = computed(() => new Date().getFullYear())

onMounted(() => {
  initializeTheme()

  // Performance optimization: Add will-change to frequently animated elements
  const style = document.createElement('style')
  style.textContent = `
    .parallax-element { will-change: transform; }
    .animated-element { will-change: opacity, transform; }
    .scroll-progress { will-change: width; }
  `
  document.head.appendChild(style)
})
</script>

<template>
  <!-- Loading Screen -->
  <LoadingScreen v-if="isLoading" :on-complete="handleLoadingComplete" />

  <!-- Main App Content -->
  <Transition
    enter-active-class="transition-opacity duration-500 ease-out"
    enter-from-class="opacity-0"
  >
    <div v-if="showContent" class="relative min-h-screen">
      <!-- Scroll Progress Bar -->
      <div
        class="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50"
        role="progressbar"
        :aria-valuenow="scrollProgress"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label="Page scroll progress"
      >
        <div
          class="scroll-progress h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300"
          :style="{ width: `${scrollProgress}%` }"
        ></div>
      </div>

      <!-- Navigation -->
      <Navigation :is-dark="isDark" @toggle-theme="toggleTheme" />

      <!-- Skip to main content link (Accessibility) -->
      <a
        href="#main-content"
        class="sr-only focus:not-sr-only focus:absolute focus:top-20 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>

      <!-- Main Content -->
      <main id="main-content" class="relative">
        <!-- Hero Section -->
        <HeroSection />

        <!-- Projects Section -->
        <ProjectsSection />

        <!-- About Section -->
        <AboutSection />

        <!-- Contact Section -->
        <section
          id="contact"
          class="section-container py-20 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300"
        >
          <div class="container-padding">
            <div class="text-center max-w-3xl mx-auto">
              <h2 class="text-5xl md:text-6xl font-bold mb-6 gradient-text">
                Let's Work Together
              </h2>
              <p class="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Have a project in mind? Let's create something amazing together.
              </p>

              <div class="flex flex-wrap gap-4 justify-center">
                <a
                  href="mailto:your.email@example.com"
                  class="glass-effect px-8 py-4 rounded-full font-semibold text-gray-900 dark:text-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-label="Send email"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span>Email Me</span>
                </a>

                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="bg-gradient-to-r from-primary-500 to-accent-500 px-8 py-4 rounded-full font-semibold text-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-label="Visit GitHub profile"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path>
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- Footer -->
      <footer class="py-8 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300" role="contentinfo">
        <div class="container-padding">
          <div class="text-center text-gray-600 dark:text-gray-400">
            <p>&copy; {{ currentYear }} Your Name. All rights reserved.</p>
            <p class="text-sm mt-2">Built with Vue 3, TypeScript, and Tailwind CSS</p>
          </div>
        </div>
      </footer>

      <!-- Back to Top Button -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 translate-y-4"
        leave-to-class="opacity-0 translate-y-4"
      >
        <button
          v-if="scrollProgress > 20"
          @click="() => window.scrollTo({ top: 0, behavior: 'smooth' })"
          class="fixed bottom-8 right-8 z-30 p-4 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Scroll to top"
          type="button"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
          </svg>
        </button>
      </Transition>
    </div>
  </Transition>
</template>

<style>
/* Global smooth theme transitions */
.theme-transition,
.theme-transition *,
.theme-transition *::before,
.theme-transition *::after {
  transition: background-color 300ms ease-in-out, border-color 300ms ease-in-out, color 300ms ease-in-out !important;
  transition-delay: 0 !important;
}

/* Screen reader only utility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Performance optimizations */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Focus visible for better keyboard navigation */
:focus-visible {
  outline: 2px solid #0ea5e9;
  outline-offset: 2px;
}
</style>
