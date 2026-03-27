<script setup lang="ts">
import { ref, onMounted } from "vue";
import anime from "animejs";
import { useParallax } from "@/composables/useParallax";
import ScrollIndicator from "./ScrollIndicator.vue";

const heroRef = ref<HTMLElement | null>(null);
const labelRef = ref<HTMLElement | null>(null);
const nameRef = ref<HTMLElement | null>(null);
const subtitleRef = ref<HTMLElement | null>(null);
const ctaRef = ref<HTMLElement | null>(null);
const cardRef = ref<HTMLElement | null>(null);

const { elementRef: bgRef, transform: bgTransform } = useParallax({
  speed: 0.2,
});

const techItems = [
  "Vue.js",
  "React",
  "TypeScript",
  "Node.js",
  "Tailwind CSS",
  "PostgreSQL",
  "GraphQL",
  "Vite",
  "GSAP",
  "Figma",
  "REST APIs",
  "Git",
  "Vue.js",
  "React",
  "TypeScript",
  "Node.js",
  "Tailwind CSS",
  "PostgreSQL",
  "GraphQL",
  "Vite",
  "GSAP",
  "Figma",
  "REST APIs",
  "Git",
];

onMounted(() => {
  if (labelRef.value) {
    anime({
      targets: labelRef.value,
      opacity: [0, 1],
      translateX: [-16, 0],
      duration: 600,
      delay: 200,
      easing: "easeOutCubic",
    });
  }

  if (nameRef.value) {
    const text = nameRef.value.textContent || "";
    nameRef.value.innerHTML = "";
    const chars = text.split("").map((char) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.display = "inline-block";
      span.style.opacity = "0";
      return span;
    });
    chars.forEach((span) => nameRef.value?.appendChild(span));

    anime({
      targets: chars,
      opacity: [0, 1],
      translateY: [50, 0],
      rotateZ: [6, 0],
      duration: 900,
      delay: anime.stagger(45, { start: 350 }),
      easing: "easeOutExpo",
    });
  }

  if (subtitleRef.value) {
    anime({
      targets: subtitleRef.value,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 700,
      delay: 950,
      easing: "easeOutCubic",
    });
  }

  if (ctaRef.value) {
    anime({
      targets: ctaRef.value,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 700,
      delay: 1150,
      easing: "easeOutCubic",
    });
  }

  if (cardRef.value) {
    anime({
      targets: cardRef.value,
      opacity: [0, 1],
      scale: [0.93, 1],
      translateY: [24, 0],
      duration: 900,
      delay: 600,
      easing: "easeOutCubic",
    });
  }
});
</script>

<template>
  <section
    ref="heroRef"
    id="home"
    class="relative flex flex-col overflow-hidden section-container"
    style="min-height: 100svh;"
  >
    <!-- Dot grid texture -->
    <div
      class="absolute inset-0 pointer-events-none"
      style="
        background-image: radial-gradient(
          circle,
          rgba(255, 107, 43, 0.1) 1px,
          transparent 1px
        );
        background-size: 32px 32px;
        opacity: 0.7;
      "
    ></div>

    <!-- Parallax blobs -->
    <div
      ref="bgRef"
      :style="{ transform: bgTransform }"
      class="absolute inset-0 pointer-events-none overflow-hidden"
    >
      <div
        class="absolute rounded-full animate-float blur-[100px]"
        style="
          width: 560px;
          height: 560px;
          top: 5%;
          left: -10%;
          background: radial-gradient(
            circle,
            rgba(255, 107, 43, 0.4),
            transparent 70%
          );
          opacity: 0.15;
        "
      ></div>
      <div
        class="absolute rounded-full animate-float-delayed blur-[100px]"
        style="
          width: 440px;
          height: 440px;
          bottom: 10%;
          right: -8%;
          background: radial-gradient(
            circle,
            rgba(15, 118, 110, 0.4),
            transparent 70%
          );
          opacity: 0.15;
        "
      ></div>
    </div>

    <!-- Main content -->
    <div class="container-padding flex-1 flex items-center py-32 relative z-10">
      <div
        class="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 w-full items-center"
      >
        <!-- Left: Text (3 cols) -->
        <div class="lg:col-span-3 space-y-7">
          <!-- Role label -->
          <div
            ref="labelRef"
            style="opacity: 0"
            class="flex items-center gap-3"
          >
            <span class="w-8 h-px bg-primary-500"></span>
            <span class="section-label"
              >Front-End &amp; Full-Stack Developer</span
            >
          </div>

          <!-- Name -->
          <h1
            ref="nameRef"
            class="font-bold leading-none tracking-tight gradient-text select-none"
            style="font-size: clamp(3.5rem, 9vw, 7.5rem); line-height: 0.92"
          >
            Your Name
          </h1>

          <!-- Subtitle + bio -->
          <div ref="subtitleRef" style="opacity: 0" class="space-y-4 max-w-lg">
            <p class="text-xl sm:text-2xl font-semibold text-accent-700 dark:text-accent-400">
              Building digital experiences with purpose.
            </p>
            <p class="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              Mid-level to senior front-end engineer. Front-end Developer.
              Crafting fast, accessible, and beautifully detailed web products.
            </p>
          </div>

          <!-- CTAs -->
          <div
            ref="ctaRef"
            style="opacity: 0"
            class="flex flex-wrap gap-4 pt-1"
          >
            <a href="#projects" class="btn-primary">
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              View Projects
            </a>
            <a href="#contact" class="btn-ghost shadow-sm"> Get in Touch </a>
          </div>
        </div>

        <!-- Right: Code identity card (2 cols, desktop only) -->
        <div class="hidden lg:block lg:col-span-2">
          <div
            ref="cardRef"
            style="opacity: 0"
            class="glass-effect rounded-2xl overflow-hidden shadow-2xl border border-white/20 dark:border-white/10"
          >
            <!-- Terminal bar -->
            <div
              class="flex items-center gap-1.5 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
            >
              <span
                class="w-3 h-3 rounded-full bg-red-400/80"
              ></span>
              <span
                class="w-3 h-3 rounded-full bg-amber-400/80"
              ></span>
              <span
                class="w-3 h-3 rounded-full bg-emerald-400/80"
              ></span>
              <span class="ml-2 font-mono text-xs text-zinc-500"
                >profile.ts</span
              >
            </div>

            <!-- Code content -->
            <div
              class="p-6 font-mono text-sm space-y-1 leading-relaxed"
            >
              <p>
                <span class="text-accent-600 dark:text-accent-400">const</span>
                <span class="text-primary-600 dark:text-primary-500"> developer</span>
                <span class="text-zinc-400 dark:text-zinc-500"> = </span>
                <span class="text-zinc-400 dark:text-zinc-500"> {</span>
              </p>
              <p class="pl-5">
                <span class="text-zinc-500 dark:text-zinc-400">name</span><span class="text-zinc-400">:</span>
                <span class="text-emerald-600 dark:text-emerald-400"> 'Your Name'</span><span class="text-zinc-400">,</span>
              </p>
              <p class="pl-5">
                <span class="text-zinc-500 dark:text-zinc-400">role</span><span class="text-zinc-400">:</span>
                <span class="text-emerald-600 dark:text-emerald-400"> 'Front-end Dev'</span><span class="text-zinc-400">,</span>
              </p>
              <p class="pl-5">
                <span class="text-zinc-500 dark:text-zinc-400">experience</span><span class="text-zinc-400">:</span>
                <span class="text-emerald-600 dark:text-emerald-400"> '3+ years'</span><span class="text-zinc-400">,</span>
              </p>
              <p class="pl-5">
                <span class="text-zinc-500 dark:text-zinc-400">stack</span><span class="text-zinc-400">:</span>
                <span class="text-zinc-400"> [</span>
              </p>
              <p class="pl-10">
                <span class="text-emerald-600 dark:text-emerald-400">'Vue.js'</span><span class="text-zinc-400">,</span>
                <span class="text-emerald-600 dark:text-emerald-400"> 'TypeScript'</span><span class="text-zinc-400">,</span>
              </p>
              <p class="pl-10">
                <span class="text-emerald-600 dark:text-emerald-400">'Node.js'</span><span class="text-zinc-400">,</span>
                <span class="text-emerald-600 dark:text-emerald-400"> 'Tailwind'</span>
              </p>
              <p class="pl-5"><span class="text-zinc-400">],</span></p>
              <p class="pl-5">
                <span class="text-zinc-500 dark:text-zinc-400">available</span><span class="text-zinc-400">:</span>
                <span class="text-indigo-600 dark:text-indigo-400"> true</span><span class="text-zinc-400">,</span>
              </p>
              <p><span class="text-zinc-400">}</span></p>
            </div>

            <!-- Stats strip -->
            <div
              class="grid grid-cols-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30"
            >
              <div
                class="text-center py-4 border-r border-zinc-200 dark:border-zinc-800"
              >
                <p class="text-2xl font-bold text-primary-500">5+</p>
                <p class="text-xs mt-0.5 text-zinc-500">Years</p>
              </div>
              <div
                class="text-center py-4 border-r border-zinc-200 dark:border-zinc-800"
              >
                <p class="text-2xl font-bold text-accent-600 dark:text-accent-400">50+</p>
                <p class="text-xs mt-0.5 text-zinc-500">Projects</p>
              </div>
              <div class="text-center py-4">
                <p class="text-2xl font-bold text-primary-500">15+</p>
                <p class="text-xs mt-0.5 text-zinc-500">
                  Technologies
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tech Stack Marquee -->
    <div
      class="relative z-10 border-t border-zinc-200/50 dark:border-white/5 overflow-hidden py-6 glass-effect"
    >
      <div class="flex animate-marquee whitespace-nowrap">
        <span
          v-for="(tech, i) in techItems"
          :key="i"
          class="section-label shrink-0 mx-8 flex items-center gap-2"
          style="opacity: 0.6"
        >
          <span class="text-primary-500">✦</span>{{ tech }}
        </span>
      </div>
    </div>

    <!-- Scroll indicator -->
    <ScrollIndicator />
  </section>
</template>
