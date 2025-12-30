<script setup lang="ts">
import { ref, onMounted } from 'vue'
import anime from 'animejs'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import { useParallax } from '@/composables/useParallax'
import SkillsGrid from './SkillsGrid.vue'
import Timeline from './Timeline.vue'
import SocialLinks from './SocialLinks.vue'
import { personalInfo, skills, timeline, socialLinks } from '@/data/aboutData'

const bioRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLElement | null>(null)

const { elementRef: sectionRef, isVisible } = useIntersectionObserver({
  threshold: 0.1,
  once: true
})

const { elementRef: parallaxRef1, transform: parallaxTransform1 } = useParallax({ speed: 0.2 })
const { elementRef: parallaxRef2, transform: parallaxTransform2 } = useParallax({ speed: -0.15 })

// Animate bio text
onMounted(() => {
  const checkVisibility = setInterval(() => {
    if (isVisible.value && bioRef.value) {
      const paragraphs = bioRef.value.querySelectorAll('p')

      anime({
        targets: paragraphs,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        delay: anime.stagger(200),
        easing: 'easeOutCubic'
      })

      clearInterval(checkVisibility)
    }
  }, 100)
})

const getAvailabilityColor = () => {
  switch (personalInfo.availability?.status) {
    case 'available':
      return 'bg-green-500'
    case 'busy':
      return 'bg-yellow-500'
    case 'unavailable':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}
</script>

<template>
  <section
    id="about"
    ref="sectionRef"
    class="section-container py-20 relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"
  >
    <!-- Parallax Background Elements -->
    <div
      ref="parallaxRef1"
      :style="{ transform: parallaxTransform1 }"
      class="absolute top-20 -right-20 w-96 h-96 bg-primary-400/10 dark:bg-primary-600/5 rounded-full blur-3xl pointer-events-none"
    ></div>
    <div
      ref="parallaxRef2"
      :style="{ transform: parallaxTransform2 }"
      class="absolute -bottom-20 -left-20 w-96 h-96 bg-accent-400/10 dark:bg-accent-600/5 rounded-full blur-3xl pointer-events-none"
    ></div>

    <!-- Geometric shapes -->
    <div class="absolute top-1/4 left-10 w-24 h-24 border-2 border-primary-300/20 dark:border-primary-700/10 rounded-full opacity-50"></div>
    <div class="absolute bottom-1/4 right-10 w-32 h-32 border-2 border-accent-300/20 dark:border-accent-700/10 rounded-lg rotate-45 opacity-50"></div>

    <div class="container-padding relative z-10">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-5xl md:text-6xl font-bold mb-4 gradient-text">
          About Me
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Get to know more about my journey, skills, and experience
        </p>
      </div>

      <!-- Personal Info Split Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-20">
        <!-- Left: Profile Image/Avatar -->
        <div class="order-2 lg:order-1">
          <div
            ref="imageRef"
            class="relative group"
          >
            <!-- Profile Image Container -->
            <div class="relative aspect-square max-w-md mx-auto">
              <!-- Glass effect card -->
              <div class="absolute inset-0 glass-effect rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500"></div>

              <!-- Image placeholder with gradient -->
              <div class="relative w-full h-full rounded-3xl overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-primary-400 via-accent-400 to-primary-600 flex items-center justify-center">
                  <svg
                    class="w-1/2 h-1/2 text-white/30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                </div>
              </div>

              <!-- Decorative elements -->
              <div class="absolute -top-4 -right-4 w-32 h-32 bg-primary-400/20 dark:bg-primary-600/20 rounded-full blur-2xl -z-10"></div>
              <div class="absolute -bottom-4 -left-4 w-40 h-40 bg-accent-400/20 dark:bg-accent-600/20 rounded-full blur-2xl -z-10"></div>
            </div>

            <!-- Contact Info Card -->
            <div class="mt-8 glass-effect rounded-2xl p-6 space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Email</p>
                  <a :href="`mailto:${personalInfo.contact.email}`" class="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {{ personalInfo.contact.email }}
                  </a>
                </div>
              </div>

              <div v-if="personalInfo.contact.location" class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
                  <svg class="w-5 h-5 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Location</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ personalInfo.contact.location }}
                  </p>
                </div>
              </div>

              <!-- Availability Status -->
              <div v-if="personalInfo.availability" class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-3">
                  <div :class="['w-3 h-3 rounded-full animate-pulse', getAvailabilityColor()]"></div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {{ personalInfo.availability.status }}
                    <span v-if="personalInfo.availability.message" class="text-gray-500 dark:text-gray-400 font-normal">
                      - {{ personalInfo.availability.message }}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <!-- Social Links -->
            <div class="mt-6 flex justify-center lg:justify-start">
              <SocialLinks :links="socialLinks" size="md" :animated="true" />
            </div>
          </div>
        </div>

        <!-- Right: Bio Content -->
        <div class="order-1 lg:order-2">
          <div ref="bioRef" class="space-y-6">
            <div>
              <h3 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {{ personalInfo.name }}
              </h3>
              <p class="text-xl text-primary-600 dark:text-primary-400 font-semibold mb-6">
                {{ personalInfo.title }}
              </p>
            </div>

            <div class="space-y-4">
              <p
                v-for="(paragraph, index) in personalInfo.bio"
                :key="index"
                class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
                style="opacity: 0"
              >
                {{ paragraph }}
              </p>
            </div>

            <!-- Quick Stats -->
            <div class="grid grid-cols-3 gap-4 pt-6">
              <div class="text-center p-4 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border border-primary-200 dark:border-primary-800">
                <p class="text-3xl font-bold text-primary-600 dark:text-primary-400">5+</p>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Years Exp.</p>
              </div>
              <div class="text-center p-4 rounded-xl bg-gradient-to-br from-accent-50 to-primary-50 dark:from-accent-900/20 dark:to-primary-900/20 border border-accent-200 dark:border-accent-800">
                <p class="text-3xl font-bold text-accent-600 dark:text-accent-400">50+</p>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Projects</p>
              </div>
              <div class="text-center p-4 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border border-primary-200 dark:border-primary-800">
                <p class="text-3xl font-bold text-primary-600 dark:text-primary-400">15+</p>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Tech Stack</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Skills Section -->
      <div class="mb-20">
        <div class="text-center mb-12">
          <h3 class="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Skills & Expertise
          </h3>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Technologies and tools I work with
          </p>
        </div>

        <SkillsGrid :skills="skills" :show-categories="true" />
      </div>

      <!-- Timeline Section -->
      <div>
        <div class="text-center mb-12">
          <h3 class="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Experience & Education
          </h3>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            My professional journey and achievements
          </p>
        </div>

        <Timeline :items="timeline" :show-filters="true" />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Additional custom styles */
</style>
