<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { TimelineItem } from "@/types/about";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

interface Props {
  items: TimelineItem[];
}

const props = defineProps<Props>();

const sectionRef = ref<HTMLElement | null>(null);
const headerRef = ref<HTMLElement | null>(null);
const timelineLineRef = ref<HTMLElement | null>(null);
const cardRefs = ref<HTMLElement[]>([]);
const dotRefs = ref<HTMLElement[]>([]);

let ctx: gsap.Context;

const getTypeIcon = (type: TimelineItem["type"]) => {
  switch (type) {
    case "experience":
      return "💼";
    case "education":
      return "🎓";
    case "achievement":
      return "🏆";
    default:
      return "📌";
  }
};

const getTypeColor = (type: TimelineItem["type"]) => {
  switch (type) {
    case "experience":
      return "from-blue-500 to-cyan-500";
    case "education":
      return "from-purple-500 to-pink-500";
    case "achievement":
      return "from-yellow-500 to-orange-500";
    default:
      return "from-gray-500 to-gray-600";
  }
};

onMounted(() => {
  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) return;

  ctx = gsap.context(() => {
    // 1. Pin the header
    // The header will stay fixed at the top while the cards scroll.
    // We use a separate ScrollTrigger for pinning.
    ScrollTrigger.create({
      trigger: sectionRef.value,
      start: "top top", // Pin right at the top
      end: "bottom bottom",
      pin: headerRef.value,
      pinSpacing: false,
    });

    // 2. Animate the center line
    if (timelineLineRef.value) {
      gsap.fromTo(
        timelineLineRef.value,
        { scaleY: 0, transformOrigin: "top" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.value,
            start: "top 20%",
            end: "bottom 80%",
            scrub: true,
          },
        },
      );
    }

    // 3. Animate each card and dot
    cardRefs.value.forEach((card, index) => {
      const isEven = index % 2 === 0;
      const dot = dotRefs.value[index];

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          end: "top 50%",
          toggleActions: "play none none reverse",
          // scrub: false, // animate once when entered
        },
      });

      // Card animation
      tl.fromTo(
        card,
        {
          opacity: 0,
          y: 50,
          x: isEven ? -50 : 50,
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.8,
          ease: "back.out(1.2)",
        },
      );

      // Dot animation
      if (dot) {
        tl.fromTo(
          dot,
          { scale: 0 },
          { scale: 1, duration: 0.4, ease: "back.out(2)" },
          "-=0.6", // overlapping dots popping in as card slides
        );
      }

      // 4. Refined exit animation (fading/scaling/blurring into header)
      if (!prefersReducedMotion) {
        gsap.to(card, {
          opacity: 0,
          scale: 0.92,
          filter: "blur(4px)",
          ease: "none",
          scrollTrigger: {
            trigger: card,
            // Starts as it approaches the header area, ends as the bottom hits title bottom
            start: () => `bottom top+=${(headerRef.value?.offsetHeight || 160) + 150}`,
            end: () => `bottom top+=${headerRef.value?.offsetHeight || 160}`,
            scrub: 1, // Smooth scrub for reversible animations
            invalidateOnRefresh: true,
          },
        });

        // Also fade the dot
        if (dot) {
          gsap.to(dot, {
            opacity: 0,
            scale: 0.5,
            scrollTrigger: {
              trigger: card,
              start: () => `bottom top+=${(headerRef.value?.offsetHeight || 160) + 150}`,
              end: () => `bottom top+=${headerRef.value?.offsetHeight || 160}`,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
        }
      }
    });
  }, sectionRef.value as HTMLElement);
});

onUnmounted(() => {
  if (ctx) ctx.revert();
});
</script>

<template>
  <div ref="sectionRef" class="w-full relative py-20">
    <!-- Header to be pinned -->
    <div ref="headerRef" class="z-30 w-full flex justify-center mb-16">
      <div
        class="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-gray-800/40 px-10 py-6 md:px-16 md:py-10 rounded-3xl shadow-2xl text-center max-w-3xl mx-auto transform transition-all duration-300"
      >
        <h3
          class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight"
        >
          Experience & Education
        </h3>
        <p class="text-lg text-gray-600 dark:text-gray-400 font-medium">
          My professional journey and achievements
        </p>
      </div>
    </div>

    <!-- Timeline Content -->
    <div class="relative mt-20">
      <!-- Center Line -->
      <div
        ref="timelineLineRef"
        class="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary-500 via-accent-500 to-primary-500 hidden lg:block"
      ></div>

      <!-- Timeline Items -->
      <div class="space-y-24">
        <div
          v-for="(item, index) in items"
          :key="item.id"
          class="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
        >
          <!-- Content -->
          <div
            :ref="
              (el) => {
                if (el) cardRefs[index] = el as HTMLElement;
              }
            "
            :class="
              index % 2 === 0
                ? 'lg:col-start-1 lg:text-right'
                : 'lg:col-start-2'
            "
          >
            <div
              class="group relative bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-800"
            >
              <!-- Type Badge -->
              <div
                :class="[
                  'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-white mb-4',
                  'bg-gradient-to-r',
                  getTypeColor(item.type),
                ]"
              >
                <span>{{ getTypeIcon(item.type) }}</span>
                <span class="capitalize">{{ item.type }}</span>
              </div>

              <!-- Period -->
              <div
                class="text-sm font-medium text-primary-600 dark:text-primary-400 mb-2"
              >
                {{ item.period.start }} - {{ item.period.end }}
              </div>

              <!-- Title & Organization -->
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {{ item.title }}
              </h3>
              <p
                class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3"
              >
                {{ item.organization }}
                <span
                  v-if="item.location"
                  class="text-sm font-normal text-gray-500 dark:text-gray-400"
                >
                  • {{ item.location }}
                </span>
              </p>

              <!-- Description -->
              <p class="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                {{ item.description }}
              </p>

              <!-- Highlights -->
              <ul
                v-if="item.highlights && item.highlights.length"
                class="space-y-2 mb-4"
              >
                <li
                  v-for="(highlight, hIndex) in item.highlights"
                  :key="hIndex"
                  :class="[
                    'flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400',
                    index % 2 === 0
                      ? 'lg:flex-row-reverse text-right'
                      : 'text-left',
                  ]"
                >
                  <span
                    class="text-primary-500 mt-0.5"
                    :class="index % 2 === 0 ? 'ml-2 rotate-180' : 'mr-2'"
                    >▸</span
                  >
                  <span>{{ highlight }}</span>
                </li>
              </ul>

              <!-- Tags -->
              <div
                v-if="item.tags && item.tags.length"
                :class="[
                  'flex flex-wrap gap-2',
                  index % 2 === 0 ? 'lg:justify-end' : 'lg:justify-start',
                ]"
              >
                <span
                  v-for="tag in item.tags"
                  :key="tag"
                  class="px-3 py-1 text-xs font-medium rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
                >
                  {{ tag }}
                </span>
              </div>

              <!-- Hover Effect Border -->
              <div
                class="absolute inset-0 rounded-2xl border-2 border-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              ></div>
            </div>
          </div>

          <!-- Timeline Dot (Desktop) -->
          <div
            :ref="
              (el) => {
                if (el) dotRefs[index] = el as HTMLElement;
              }
            "
            class="hidden lg:block absolute left-1/2 transform -translate-x-1/2"
          >
            <div
              :class="[
                'w-6 h-6 rounded-full border-4 border-white dark:border-gray-900 shadow-lg',
                'bg-gradient-to-br',
                getTypeColor(item.type),
              ]"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* No longer need complex TransitionGroup styles as we use GSAP */
</style>
