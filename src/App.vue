<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useScrollProgress } from "@/composables/useScrollAnimation";
import { useEasterEgg } from "@/composables/useEasterEgg";
import LoadingScreen from "@/components/LoadingScreen.vue";
import Navigation from "@/components/Navigation.vue";
import SEOHead from "@/components/SEOHead.vue";
import HeroSection from "@/components/Landing/HeroSection.vue";
import ProjectsSection from "@/components/Projects/ProjectsSection.vue";
import AboutSection from "@/components/About/AboutSection.vue";

const isLoading = ref(true);
const showContent = ref(false);

const isDark = ref(true);
const { scrollProgress } = useScrollProgress();

const { triggerEasterEgg, notification } = useEasterEgg();
const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

const initializeTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    isDark.value = false;
    document.documentElement.classList.remove("dark");
  } else {
    isDark.value = true;
    document.documentElement.classList.add("dark");
    if (!savedTheme) localStorage.setItem("theme", "dark");
  }
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.add("theme-transition");
  if (isDark.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
  setTimeout(() => {
    document.documentElement.classList.remove("theme-transition");
  }, 300);
};

const handleLoadingComplete = () => {
  isLoading.value = false;
  showContent.value = true;
  document.documentElement.style.scrollBehavior = "smooth";
};

const currentYear = computed(() => new Date().getFullYear());

onMounted(() => {
  initializeTheme();
});
</script>

<template>
  <SEOHead
    title="Davxloper - Front-End & Full-Stack Developer"
    description="Portfolio of Davxloper — semi full-stack web developer and mid-level to senior front-end engineer specialising in Vue.js, TypeScript, and modern web development."
    :keywords="[
      'web developer',
      'front-end developer',
      'full stack',
      'vue.js',
      'typescript',
      'portfolio',
    ]"
    author="Davxloper"
    url="https://yourportfolio.com"
    image="https://yourportfolio.com/og-image.jpg"
    twitter-handle="@yourusername"
  />

  <LoadingScreen v-if="isLoading" :on-complete="handleLoadingComplete" />

  <!-- Easter Egg Notification -->
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-200 ease-in"
    enter-from-class="opacity-0 translate-y-4"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div
      v-if="notification"
      class="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-full font-semibold text-sm text-white shadow-2xl"
      style="background: linear-gradient(135deg, #ff6b2b, #0f766e)"
      role="alert"
      aria-live="polite"
    >
      {{ notification }}
    </div>
  </Transition>

  <!-- Main Content -->
  <Transition
    enter-active-class="transition-opacity duration-500 ease-out"
    enter-from-class="opacity-0"
  >
    <div v-if="showContent" class="relative min-h-screen">
      <!-- Scroll Progress Bar -->
      <div
        class="fixed top-0 left-0 right-0 h-[3px] z-[100]"
        style="background: var(--surface-glass)"
        role="progressbar"
        :aria-valuenow="scrollProgress"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label="Page scroll progress"
      >
        <div
          class="h-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(255,107,43,0.5)]"
          style="background: linear-gradient(90deg, #ff6b2b, #0f766e)"
          :style="{ width: `${scrollProgress}%` }"
        ></div>
      </div>

      <!-- Navigation -->
      <Navigation
        :is-dark="isDark"
        :on-logo-click="triggerEasterEgg"
        @toggle-theme="toggleTheme"
      />

      <!-- Skip to main content -->
      <a
        href="#main-content"
        class="sr-only focus:not-sr-only focus:fixed focus:top-24 focus:left-4 focus:z-[110] focus:px-6 focus:py-3 focus:rounded-xl focus:text-white focus:shadow-2xl focus:bg-primary-500 font-bold transition-all"
      >
        Skip to main content
      </a>

      <!-- Main Content -->
      <main id="main-content" class="relative">
        <HeroSection />
        <ProjectsSection />
        <AboutSection />

        <!-- Contact Section -->
        <section
          id="contact"
          class="section-container py-32 relative overflow-hidden"
        >
          <!-- Background accents -->
          <div
            class="absolute inset-0 pointer-events-none opacity-50"
            style="
              background-image: radial-gradient(
                circle,
                rgba(255, 107, 43, 0.08) 1px,
                transparent 1px
              );
              background-size: 32px 32px;
            "
          ></div>
          <div
            class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none blur-[120px] opacity-10"
            style="
              background: radial-gradient(circle, #ff6b2b, transparent 70%);
              top: -200px;
            "
          ></div>

          <div class="container-padding relative z-10">
            <div class="max-w-3xl mx-auto text-center space-y-8">
              <p class="section-label mb-4">// Let's build something</p>

              <h2 class="text-5xl md:text-7xl font-bold leading-tight">
                <span class="gradient-text">Work Together</span>
              </h2>

              <p class="text-lg md:text-xl leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Have a project in mind or looking for a developer to join your
                team? I'm currently available for freelance work and full-time
                opportunities.
              </p>

              <div class="flex flex-wrap gap-5 justify-center pt-8">
                <a
                  href="mailto:davxgonzales@gmail.com"
                  class="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary-500 text-white font-bold text-lg shadow-xl shadow-primary-500/20 transition-all hover:scale-105 active:scale-95"
                  aria-label="Send email"
                >
                  <svg
                    class="w-5 h-5 transition-transform group-hover:-rotate-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2.5"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Email Me
                </a>

                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-3 px-8 py-4 rounded-2xl glass-effect border dark:border-white/5 text-zinc-800 dark:text-zinc-100 font-bold text-lg shadow-xl transition-all hover:scale-105 active:scale-95"
                  aria-label="Visit GitHub profile"
                >
                  <svg
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- Footer -->
      <footer
        class="py-12 border-t border-zinc-200 dark:border-white/5"
        role="contentinfo"
      >
        <div class="container-padding">
          <div
            class="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div class="flex flex-col items-center md:items-start gap-2">
              <p class="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                &copy; {{ currentYear }} Davxloper. All rights reserved.
              </p>
              <p class="text-xs font-bold font-mono text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
                Built with Vue 3 · TypeScript · Tailwind CSS
              </p>
            </div>
            <div class="flex items-center gap-6">
              <a href="#" class="text-xs font-bold text-zinc-500 hover:text-primary-500 transition-colors uppercase tracking-widest">Privacy</a>
              <a href="#" class="text-xs font-bold text-zinc-500 hover:text-primary-500 transition-colors uppercase tracking-widest">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      <!-- Back to Top -->
      <Transition
        enter-active-class="transition-all duration-500 ease-out"
        leave-active-class="transition-all duration-300 ease-in"
        enter-from-class="opacity-0 translate-y-10 scale-50"
        leave-to-class="opacity-0 translate-y-10 scale-50"
      >
        <button
          v-if="scrollProgress > 20"
          @click="scrollToTop"
          class="fixed bottom-10 right-10 z-[120] w-14 h-14 rounded-2xl text-white shadow-2xl hover:scale-110 active:scale-90 transition-all duration-300 focus:outline-none flex items-center justify-center bg-primary-500 shadow-primary-500/20"
          aria-label="Scroll to top"
          type="button"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="3"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </Transition>
    </div>
  </Transition>
</template>
