<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface NavItem {
  id: string
  label: string
  href: string
}

interface Props {
  isDark: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'toggle-theme'): void
}>()

const activeSection = ref('home')
const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', href: '#' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'contact', label: 'Contact', href: '#contact' }
]

// Track active section based on scroll position
const updateActiveSection = () => {
  const sections = navItems.map(item => ({
    id: item.id,
    element: item.id === 'home'
      ? document.querySelector('main > section:first-child')
      : document.getElementById(item.id)
  }))

  const scrollPosition = window.scrollY + window.innerHeight / 3

  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i]
    if (section.element) {
      const offsetTop = section.element.offsetTop
      if (scrollPosition >= offsetTop) {
        activeSection.value = section.id
        break
      }
    }
  }

  // Update scrolled state for nav background
  isScrolled.value = window.scrollY > 50
}

// Smooth scroll to section
const scrollToSection = (href: string, id: string) => {
  if (href === '#') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // Account for fixed nav height
      const elementPosition = element.offsetTop - offset
      window.scrollTo({ top: elementPosition, behavior: 'smooth' })
    }
  }
  isMobileMenuOpen.value = false
}

// Keyboard navigation
const handleKeyPress = (event: KeyboardEvent, href: string, id: string) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    scrollToSection(href, id)
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateActiveSection, { passive: true })
  updateActiveSection()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveSection)
})

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <nav
    :class="[
      'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
      isScrolled ? 'mt-0' : 'mt-1'
    ]"
    role="navigation"
    aria-label="Main navigation"
  >
    <div class="container-padding py-4">
      <div
        :class="[
          'glass-effect rounded-full px-6 py-3 flex items-center justify-between shadow-lg transition-all duration-300',
          isScrolled ? 'bg-white/95 dark:bg-gray-900/95' : ''
        ]"
        style="will-change: background-color"
      >
        <!-- Logo/Brand -->
        <a
          href="#"
          @click.prevent="scrollToSection('#', 'home')"
          class="text-xl font-bold gradient-text focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg px-2"
          aria-label="Go to homepage"
          tabindex="0"
        >
          Portfolio
        </a>

        <!-- Desktop Navigation Links -->
        <div class="hidden md:flex items-center gap-8">
          <a
            v-for="item in navItems"
            :key="item.id"
            :href="item.href"
            @click.prevent="scrollToSection(item.href, item.id)"
            @keydown="(e) => handleKeyPress(e, item.href, item.id)"
            :class="[
              'relative py-2 font-medium transition-colors duration-300',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg px-3',
              activeSection === item.id
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400'
            ]"
            :aria-current="activeSection === item.id ? 'page' : undefined"
            tabindex="0"
          >
            {{ item.label }}

            <!-- Active indicator -->
            <span
              v-if="activeSection === item.id"
              class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-primary-500 rounded-full"
              aria-hidden="true"
            ></span>
          </a>
        </div>

        <!-- Mobile Menu Button & Theme Toggle Container -->
        <div class="flex items-center gap-2">
          <!-- Theme Toggle -->
          <button
            @click="emit('toggle-theme')"
            class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            type="button"
          >
            <Transition
              enter-active-class="transition-all duration-300"
              leave-active-class="transition-all duration-300"
              enter-from-class="opacity-0 rotate-180 scale-0"
              leave-to-class="opacity-0 rotate-180 scale-0"
              mode="out-in"
            >
              <!-- Sun Icon (visible in dark mode) -->
              <svg
                v-if="isDark"
                key="sun"
                class="w-6 h-6 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                ></path>
              </svg>

              <!-- Moon Icon (visible in light mode) -->
              <svg
                v-else
                key="moon"
                class="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                ></path>
              </svg>
            </Transition>
          </button>

          <!-- Mobile Menu Toggle -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
            :aria-expanded="isMobileMenuOpen"
            type="button"
          >
            <svg
              class="w-6 h-6 text-gray-700 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                v-if="!isMobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 -translate-y-4"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div
          v-if="isMobileMenuOpen"
          class="md:hidden mt-2 glass-effect rounded-2xl p-4 shadow-lg"
          role="menu"
        >
          <a
            v-for="item in navItems"
            :key="item.id"
            :href="item.href"
            @click.prevent="scrollToSection(item.href, item.id)"
            :class="[
              'block py-3 px-4 rounded-lg font-medium transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              activeSection === item.id
                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            ]"
            role="menuitem"
          >
            {{ item.label }}
          </a>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<style scoped>
/* Additional navigation styles */
</style>
