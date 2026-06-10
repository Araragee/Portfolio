<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSeoMeta } from '@unhead/vue'
import { getProjectBySlug, getNextProject } from '@/data/projectsData'
import GrayscaleImage from '@/components/CaseStudy/GrayscaleImage.vue'
import NextProjectFooter from '@/components/CaseStudy/NextProjectFooter.vue'
import ProjectBrowser from '@/components/CaseStudy/ProjectBrowser.vue'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const project = computed(() => getProjectBySlug(slug.value))
const nextProject = computed(() => getNextProject(slug.value))

const { elementRef: introRef } = useScrollAnimation({ threshold: 0.1 })

// SEO
useSeoMeta({
  title: computed(() => project.value ? project.value.title + ' — Dave Gonzales' : 'Case Study — Dave Gonzales'),
  description: computed(() => project.value?.introStatement ?? ''),
})
</script>

<template>
  <main class="min-h-screen" id="main-content">
    <!-- 404 state -->
    <div
      v-if="!project"
      class="flex flex-col items-center justify-center min-h-[60vh] px-5 sm:px-6 text-center"
    >
      <span class="font-mono text-label uppercase text-secondary mb-8">
        404 — Not Found
      </span>
      <h1 class="font-headline text-display font-bold uppercase mb-8">
        Project not found
      </h1>
      <router-link to="/" class="btn-monolith" id="back-home-btn">Back to Index</router-link>
    </div>

    <!-- Case study content -->
    <template v-else>
      <div class="flex flex-col lg:flex-row min-h-screen relative">
        <!-- Left Panel: Sticky Metadata (30%) -->
        <aside
          class="w-full lg:w-[30%] lg:h-screen lg:sticky top-0 p-5 sm:p-6 md:p-12 lg:p-[60px] pt-24 md:pt-[120px] lg:pt-[180px] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-outline overflow-y-auto"
          aria-label="Project metadata"
        >
          <div class="mb-12 lg:mb-20">
            <h1
              class="font-headline font-semibold leading-[1.1] tracking-tight mb-3 md:mb-4 text-heading-xl"
            >
              {{ project.title }}
            </h1>
            <p class="font-mono text-label uppercase text-secondary">
              {{ project.categoryLabel }}
            </p>
          </div>

          <div class="space-y-6 md:space-y-8 font-mono uppercase pb-6 lg:pb-0" style="font-size: clamp(0.6875rem, 0.8vw, 0.75rem); letter-spacing: 0.15em;">
            <div class="grid grid-cols-1 border-t border-outline pt-4 md:pt-5">
              <span class="text-secondary mb-1.5 md:mb-2">Role</span>
              <span class="text-on-surface">{{ project.role }}</span>
            </div>
            <div class="grid grid-cols-1 border-t border-outline pt-4 md:pt-5">
              <span class="text-secondary mb-1.5 md:mb-2">Stack</span>
              <span class="text-on-surface">{{ project.stack }}</span>
            </div>
            <div class="grid grid-cols-1 border-t border-outline pt-4 md:pt-5">
              <span class="text-secondary mb-1.5 md:mb-2">Timeline</span>
              <span class="text-on-surface">{{ project.timeline }}</span>
            </div>
            <div v-if="project.liveUrl" class="grid grid-cols-1 border-t border-outline pt-4 md:pt-5">
              <span class="text-secondary mb-1.5 md:mb-2">Live</span>
              <a
                :href="project.liveUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-on-surface underline decoration-outline underline-offset-4 hover:decoration-on-surface transition-colors inline-flex items-center gap-2"
                id="case-study-live-link"
              >
                Live Link
                <svg
                  class="w-3 h-3 opacity-40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </a>
            </div>
            <div v-if="project.repoUrl" class="grid grid-cols-1 border-t border-outline pt-4 md:pt-5">
              <span class="text-secondary mb-1.5 md:mb-2">Source</span>
              <a
                :href="project.repoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-on-surface underline decoration-outline underline-offset-4 hover:decoration-on-surface transition-colors inline-flex items-center gap-2"
              >
                GitHub
                <svg
                  class="w-3 h-3 opacity-40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </a>
            </div>
          </div>
        </aside>

        <!-- Right Panel: Scrolling Narrative (70%) -->
        <article class="w-full lg:w-[70%] p-5 sm:p-6 md:p-12 lg:p-[60px] pt-8 md:pt-12 lg:pt-[180px]">
          <!-- Intro statement -->
          <p
            ref="introRef"
            class="font-body text-subheading font-medium leading-[1.35] text-on-surface mb-16 md:mb-24 max-w-4xl"
          >
            {{ project.introStatement }}
          </p>

          <!-- Hero visual -->
          <div class="mb-16 md:mb-24">
            <GrayscaleImage
              :src="project.heroImage"
              :alt="`${project.title} hero image`"
              aspect-ratio="16/10"
            />
          </div>

          <!-- Case study sections -->
          <div class="max-w-3xl mb-16 md:mb-24 space-y-14 md:space-y-20">
            <section
              v-for="section in project.sections"
              :key="section.heading"
              :aria-label="section.heading"
            >
              <h2 class="font-headline text-heading-lg font-medium mb-6 md:mb-8">{{ section.heading }}</h2>
              <p class="font-body text-body leading-[1.6] text-on-surface/80 mb-4 md:mb-6">
                {{ section.body }}
              </p>

              <!-- Code snippet -->
              <div v-if="section.code" class="my-8 md:my-12 bg-surface p-5 md:p-8 border border-outline overflow-hidden">
                <div class="flex justify-between items-center mb-4 md:mb-6 pb-3 md:pb-4 border-b border-outline/30">
                  <span class="font-mono text-label uppercase text-secondary">
                    {{ section.code.filename }}
                  </span>
                  <div class="flex gap-1.5" aria-hidden="true">
                    <div class="w-2 h-2 bg-outline"></div>
                    <div class="w-2 h-2 bg-outline"></div>
                    <div class="w-2 h-2 bg-outline"></div>
                  </div>
                </div>
                <pre class="font-mono text-on-surface leading-relaxed overflow-x-auto" style="font-size: clamp(0.75rem, 0.9vw, 0.8125rem);"><code>{{ section.code.content }}</code></pre>
              </div>
            </section>
          </div>

          <!-- Gallery grid -->
          <div v-if="project.gallery.length" class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-16 md:mb-24">
            <GrayscaleImage
              v-for="img in project.gallery"
              :key="img.src"
              :src="img.src"
              :alt="img.alt"
              aspect-ratio="1/1"
            />
          </div>

          <!-- Live preview -->
          <div v-if="project.liveUrl" class="mb-16 md:mb-24">
            <h2 class="font-headline text-heading-lg font-medium mb-6 md:mb-8">Live Preview</h2>
            <ProjectBrowser :url="project.liveUrl" :title="project.title" />
          </div>
        </article>
      </div>

      <!-- Next project footer -->
      <NextProjectFooter v-if="nextProject" :next-project="nextProject" />
    </template>
  </main>
</template>
