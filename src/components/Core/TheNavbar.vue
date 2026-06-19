<script setup lang="ts">
import { computed, ref, watch, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEventListener } from "@/composables/useEventListener";

const route = useRoute();
const router = useRouter();

const isCaseStudy = computed(() => route.name === "CaseStudy");
const isJourney = computed(() => route.name === "Journey");

const isMenuOpen = ref(false);
const isScrolled = ref(false);
const isHidden = ref(false);
let lastScrollY = 0;
const menuRef = ref<HTMLElement | null>(null);
const menuTriggerRef = ref<HTMLButtonElement | null>(null);

// On journey: drop "Case Studies" — you're already on it.
// On other pages: full list, pointing back to '/'.
const navLinks = computed(() =>
  isJourney.value
    ? [
        { label: "How I work", to: "/manifesto" },
        { label: "Personal", to: "/personal" },
      ]
    : [
        { label: "Case Studies", to: "/" },
        { label: "How I work", to: "/manifesto" },
        { label: "Personal", to: "/personal" },
      ],
);

function goBack() {
  router.push("/");
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

function closeMenu() {
  isMenuOpen.value = false;
  nextTick(() => menuTriggerRef.value?.focus());
}

// Lock body scroll when menu is open
watch(isMenuOpen, (open) => {
  if (open) {
    document.body.classList.add("menu-open");
    nextTick(() => {
      // Focus the first link in the menu
      const firstLink = menuRef.value?.querySelector("a");
      firstLink?.focus();
    });
  } else {
    document.body.classList.remove("menu-open");
  }
});

// Close menu on route change
watch(() => route.path, () => {
  closeMenu();
});

// Navbar scroll detection
function onScroll() {
  const currentScrollY = window.scrollY;
  isScrolled.value = currentScrollY > 20;
  
  if (currentScrollY > 60 && currentScrollY > lastScrollY && !isMenuOpen.value) {
    isHidden.value = true;
  } else {
    isHidden.value = false;
  }
  lastScrollY = currentScrollY;
}

// Keyboard handling for menu
function onMenuKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") {
    closeMenu();
  }
  // Focus trap
  if (e.key === "Tab" && menuRef.value) {
    const focusableEls = menuRef.value.querySelectorAll<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];
    if (e.shiftKey && document.activeElement === firstEl) {
      e.preventDefault();
      lastEl?.focus();
    } else if (!e.shiftKey && document.activeElement === lastEl) {
      e.preventDefault();
      firstEl?.focus();
    }
  }
}

useEventListener(window, "scroll", onScroll, { passive: true });

onMounted(() => {
  onScroll();
});
</script>

<template>
  <!-- Skip to main content — visible on focus only (keyboard users) -->
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:uppercase focus:text-surface"
  >
    Skip to content
  </a>

  <header
    v-if="!isJourney"
    class="fixed top-0 left-0 w-full z-50 border-b flex justify-between items-center section-padding py-5 md:py-6 transition-all duration-300"
    :style="{
      background: isJourney
        ? (isScrolled ? 'rgba(249,249,248,0.75)' : 'transparent')
        : (isScrolled ? 'rgba(249,249,248,0.96)' : 'rgba(249,249,248,0.88)'),
      backdropFilter: isJourney && !isScrolled ? 'none' : 'blur(12px)',
      WebkitBackdropFilter: isJourney && !isScrolled ? 'none' : 'blur(12px)',
      borderColor: isScrolled && !isJourney ? '#e5e5e5' : 'transparent',
      transform: isHidden ? 'translateY(-100%)' : 'translateY(0)',
    }"
  >
    <!-- Case Study variant: back arrow + project label -->
    <template v-if="isCaseStudy">
      <button
        @click="goBack"
        class="flex items-center gap-3 text-on-surface hover:opacity-50 active:opacity-30 transition-opacity duration-200 bg-transparent border-none cursor-pointer p-0"
        aria-label="Back to index"
        id="back-to-index-btn"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5M5 12L12 19M5 12L12 5" />
        </svg>
        <span class="font-mono text-label uppercase font-medium">Index</span>
      </button>
      <span class="font-mono text-label uppercase text-secondary hidden md:block">
        Case Study
      </span>
    </template>

    <!-- Default navbar -->
    <template v-else>
      <router-link
        to="/"
        class="text-xl font-black tracking-tighter text-on-surface font-headline no-underline hover:opacity-70 active:opacity-50 transition-opacity duration-200"
        id="site-logo-link"
        aria-label="Home"
      >
        DAVE GONZALES
      </router-link>

      <nav
        class="hidden md:flex items-center gap-10 lg:gap-12"
        aria-label="Main navigation"
      >
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="font-headline uppercase text-label font-semibold transition-all duration-300 no-underline relative active:opacity-60"
          :class="
            route.path === link.to
              ? 'text-on-surface'
              : 'text-secondary hover:text-on-surface'
          "
          :id="`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`"
        >
          {{ link.label }}
          <!-- Animated underline indicator -->
          <span
            class="absolute left-0 -bottom-1 h-px bg-on-surface transition-all duration-300"
            :class="route.path === link.to ? 'w-full' : 'w-0'"
          ></span>
        </router-link>
      </nav>

      <div
        class="font-headline uppercase text-label font-semibold text-on-surface hidden lg:block opacity-50"
      >
        VUE3 / TS / CSS
      </div>

      <!-- Mobile menu button -->
      <button
        ref="menuTriggerRef"
        class="md:hidden flex flex-col justify-center items-center w-10 h-10 z-[60] bg-transparent border-none p-0 cursor-pointer text-on-surface -mr-1 active:scale-[0.9] transition-transform duration-100"
        @click="toggleMenu"
        :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-menu"
      >
        <span
          class="block w-6 h-[2px] bg-current transition-transform duration-300 origin-center"
          :class="isMenuOpen ? 'translate-y-[6px] rotate-45' : ''"
        ></span>
        <span
          class="block w-6 h-[2px] bg-current mt-1 transition-opacity duration-300"
          :class="isMenuOpen ? 'opacity-0' : ''"
        ></span>
        <span
          class="block w-6 h-[2px] bg-current mt-1 transition-transform duration-300 origin-center"
          :class="isMenuOpen ? '-translate-y-[6px] -rotate-45' : ''"
        ></span>
      </button>
    </template>
  </header>

  <!-- Mobile Menu Overlay -->
  <Transition name="mobile-menu">
    <div
      v-if="isMenuOpen"
      ref="menuRef"
      id="mobile-menu"
      class="fixed inset-0 z-40 flex flex-col items-center justify-center gap-10 md:hidden"
      style="
        background: rgba(249, 249, 248, 0.98);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
      "
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      @keydown="onMenuKeydown"
    >
      <router-link
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="font-headline uppercase tracking-[0.15em] text-2xl font-semibold transition-all duration-300 no-underline active:opacity-60"
        :class="
          route.path === link.to
            ? 'text-on-surface'
            : 'text-secondary hover:text-on-surface'
        "
        @click="closeMenu"
      >
        {{ link.label }}
      </router-link>

      <!-- Tech stack label in mobile menu -->
      <span class="font-mono text-label uppercase text-secondary opacity-40 mt-8">
        VUE3 / TS / CSS
      </span>
    </div>
  </Transition>
</template>

<style scoped>
/* Mobile menu transition — entrance ease-out, exit ease-in (12 principles) */
.mobile-menu-enter-active {
  transition: opacity 0.25s ease-out, transform 0.25s ease-out;
}
.mobile-menu-leave-active {
  transition: opacity 0.2s ease-in, transform 0.2s ease-in;
}
.mobile-menu-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
