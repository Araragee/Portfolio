<script setup lang="ts">
import { ref, onMounted } from "vue";
import anime from "animejs";
import { useIntersectionObserver } from "@/composables/useIntersectionObserver";
import { useParallax } from "@/composables/useParallax";
import SkillsGrid from "./SkillsGrid.vue";
import Timeline from "./Timeline.vue";
import SocialLinks from "./SocialLinks.vue";
import { personalInfo, skills, timeline, socialLinks } from "@/data/aboutData";

const bioRef = ref<HTMLElement | null>(null);

const { elementRef: sectionRef, isVisible } = useIntersectionObserver({
  threshold: 0.1,
  once: true,
});

const { elementRef: parallaxRef1, transform: parallaxTransform1 } = useParallax({ speed: 0.2 });
const { elementRef: parallaxRef2, transform: parallaxTransform2 } = useParallax({ speed: -0.15 });

onMounted(() => {
  const checkVisibility = setInterval(() => {
    if (isVisible.value && bioRef.value) {
      const paragraphs = bioRef.value.querySelectorAll("p");
      anime({
        targets: paragraphs,
        opacity: [0, 1],
        translateY: [24, 0],
        duration: 700,
        delay: anime.stagger(150),
        easing: "easeOutCubic",
      });
      clearInterval(checkVisibility);
    }
  }, 100);
});

const getAvailabilityColor = () => {
  switch (personalInfo.availability?.status) {
    case "available": return "#22C55E";
    case "busy": return "#F59E0B";
    case "unavailable": return "#EF4444";
    default: return "#71717A";
  }
};
</script>

<template>
  <section
    id="about"
    ref="sectionRef"
    class="section-container py-24 relative overflow-hidden"
  >
    <!-- Texture -->
    <div class="absolute inset-0 pointer-events-none opacity-50"
         style="background-image: radial-gradient(circle, rgba(255,107,43,0.08) 1px, transparent 1px); background-size: 32px 32px;"></div>

    <!-- Parallax blobs -->
    <div ref="parallaxRef1" :style="{ transform: parallaxTransform1 }"
         class="absolute top-20 -right-20 w-96 h-96 rounded-full pointer-events-none blur-3xl opacity-10"
         style="background: radial-gradient(circle, rgba(255,107,43,0.3), transparent 70%);"></div>
    <div ref="parallaxRef2" :style="{ transform: parallaxTransform2 }"
         class="absolute -bottom-20 -left-20 w-96 h-96 rounded-full pointer-events-none blur-3xl opacity-10"
         style="background: radial-gradient(circle, rgba(15,118,110,0.3), transparent 70%);"></div>

    <div class="container-padding relative z-10">
      <!-- Header -->
      <div class="mb-16">
        <p class="section-label mb-3">// Who I Am</p>
        <h2 class="text-4xl md:text-5xl font-bold gradient-text">About Me</h2>
        <p class="mt-4 text-base max-w-lg text-zinc-600 dark:text-zinc-400">
          A little about my journey, skill set, and what drives me.
        </p>
      </div>

      <!-- Split layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-20">

        <!-- Left: Profile -->
        <div class="order-2 lg:order-1">
          <div class="relative">
            <!-- Profile image container -->
            <div class="relative aspect-square max-w-sm mx-auto lg:mx-0 group">
              <div class="w-full h-full rounded-2xl overflow-hidden border glass-effect shadow-2xl transition-all duration-500 group-hover:scale-[1.02]">
                <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-500/10 to-accent-600/10 dark:from-primary-500/20 dark:to-accent-600/20">
                  <svg class="w-1/3 h-1/3 text-primary-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <!-- Decorative corners -->
              <div class="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl border-b-2 border-r-2 border-primary-500/30"></div>
              <div class="absolute -top-4 -left-4 w-16 h-16 rounded-2xl border-t-2 border-l-2 border-accent-600/30"></div>
            </div>

            <!-- Contact card -->
            <div class="mt-12 rounded-2xl p-6 space-y-5 glass-effect border border-white/20 dark:border-white/10 shadow-xl">

              <!-- Email -->
              <div class="flex items-center gap-4 group/item">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-primary-500/10 dark:bg-primary-500/20 group-hover/item:scale-110 transition-transform">
                  <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-bold font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Email</p>
                  <a :href="`mailto:${personalInfo.contact.email}`"
                     class="text-sm font-semibold transition-colors duration-200 text-zinc-800 dark:text-zinc-100 hover:text-primary-500">
                    {{ personalInfo.contact.email }}
                  </a>
                </div>
              </div>

              <!-- Location -->
              <div v-if="personalInfo.contact.location" class="flex items-center gap-4 group/item">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-accent-600/10 dark:bg-accent-600/20 group-hover/item:scale-110 transition-transform">
                  <svg class="w-5 h-5 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-bold font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Location</p>
                  <p class="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                    {{ personalInfo.contact.location }}
                  </p>
                </div>
              </div>

              <!-- Availability -->
              <div v-if="personalInfo.availability" class="pt-4 border-t border-zinc-200 dark:border-white/5 flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full animate-pulse shrink-0"
                     :style="{ background: getAvailabilityColor() }"></div>
                <span class="text-sm font-medium capitalize text-zinc-600 dark:text-zinc-400">
                  {{ personalInfo.availability.status }}
                  <span v-if="personalInfo.availability.message" class="text-zinc-400 dark:text-zinc-600 ml-1">
                    — {{ personalInfo.availability.message }}
                  </span>
                </span>
              </div>
            </div>

            <!-- Social links -->
            <div class="mt-6">
              <SocialLinks :links="socialLinks" size="md" :animated="true" />
            </div>
          </div>
        </div>

        <!-- Right: Bio -->
        <div class="order-1 lg:order-2">
          <div ref="bioRef" class="space-y-6">
            <div>
              <h3 class="text-3xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">
                {{ personalInfo.name }}
              </h3>
              <p class="text-base font-bold font-mono text-accent-700 dark:text-accent-400">
                {{ personalInfo.title }}
              </p>
            </div>

            <div class="space-y-5">
              <p
                v-for="(paragraph, index) in personalInfo.bio"
                :key="index"
                class="text-base leading-relaxed text-zinc-600 dark:text-zinc-400 opacity-0"
              >
                {{ paragraph }}
              </p>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-4 pt-6">
              <div class="px-4 py-5 rounded-2xl glass-effect border dark:border-white/5 text-center shadow-lg transition-transform hover:scale-105">
                <p class="text-3xl font-bold text-primary-500">5+</p>
                <p class="text-[10px] mt-1 font-bold font-mono text-zinc-500 uppercase tracking-tighter">Years Exp.</p>
              </div>
              <div class="px-4 py-5 rounded-2xl glass-effect border dark:border-white/5 text-center shadow-lg transition-transform hover:scale-105">
                <p class="text-3xl font-bold text-accent-600 dark:text-accent-400">50+</p>
                <p class="text-[10px] mt-1 font-bold font-mono text-zinc-500 uppercase tracking-tighter">Projects</p>
              </div>
              <div class="px-4 py-5 rounded-2xl glass-effect border dark:border-white/5 text-center shadow-lg transition-transform hover:scale-105">
                <p class="text-3xl font-bold text-primary-500">15+</p>
                <p class="text-[10px] mt-1 font-bold font-mono text-zinc-500 uppercase tracking-tighter">Tech Stack</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Skills -->
      <div class="mb-24">
        <div class="mb-10">
          <p class="section-label mb-2">// Expertise</p>
          <h3 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Skills &amp; Tools</h3>
        </div>
        <SkillsGrid :skills="skills" :show-categories="true" />
      </div>

      <!-- Timeline -->
      <div>
        <Timeline :items="timeline" />
      </div>
    </div>
  </section>
</template>
