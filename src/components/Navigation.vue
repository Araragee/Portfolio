<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface NavItem {
  id: string
  label: string
  href: string
}

interface Props {
  isDark: boolean
  onLogoClick?: (el: HTMLElement) => void
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
      if (scrollPosition >= (section.element as HTMLElement).offsetTop) {
        activeSection.value = section.id
        break
      }
    }
  }

  isScrolled.value = window.scrollY > 50
}

const scrollToSection = (href: string, id: string) => {
  if (href === '#') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    const element = document.getElementById(id)
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' })
    }
  }
  isMobileMenuOpen.value = false
}

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
</script>

<template>
  <nav
    :class="['fixed top-0 left-0 right-0 z-40 transition-all duration-300', isScrolled ? 'mt-0' : 'mt-2']"
    role="navigation"
    aria-label="Main navigation"
  >
    <div class="container-padding py-3">
      <div
        class="glass-effect rounded-full px-5 py-2.5 flex items-center justify-between shadow-lg transition-all duration-300"
      >
        <!-- Logo -->
        <a
          href="#"
          @click.prevent="(e) => { scrollToSection('#', 'home'); props.onLogoClick?.(e.currentTarget as HTMLElement) }"
          class="font-bold text-lg focus:outline-none focus:ring-2 rounded-lg px-2 py-1 transition-colors duration-200"
          aria-label="Go to homepage"
          tabindex="0"
        >
          <span class="text-primary-500">Dav</span><span class="text-accent-600 dark:text-accent-400">x</span><span class="text-zinc-900 dark:text-zinc-100 opacity-90">loper</span>
        </a>

        <!-- Desktop Nav Links -->
        <div class="hidden md:flex items-center gap-1">
          <a
            v-for="item in navItems"
            :key="item.id"
            :href="item.href"
            @click.prevent="scrollToSection(item.href, item.id)"
            @keydown="(e) => handleKeyPress(e, item.href, item.id)"
            :class="[
              'relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 focus:outline-none',
              activeSection === item.id
                ? 'text-primary-600 dark:text-primary-400 bg-primary-500/10 dark:bg-primary-500/20'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-primary-500 underline-offset-8'
            ]"
            :aria-current="activeSection === item.id ? 'page' : undefined"
            tabindex="0"
          >
            {{ item.label }}
            <span
              v-if="activeSection === item.id"
              class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(255,107,43,0.5)]"
              aria-hidden="true"
            ></span>
          </a>
        </div>

        <!-- Right Controls -->
        <div class="flex items-center gap-2">
          <!-- Theme Toggle -->
          <button
            @click="emit('toggle-theme')"
            class="p-2 rounded-full transition-all duration-300 focus:outline-none hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            type="button"
          >
            <Transition mode="out-in"
              enter-active-class="transition-all duration-300"
              leave-active-class="transition-all duration-200"
              enter-from-class="opacity-0 rotate-90 scale-50"
              leave-to-class="opacity-0 -rotate-90 scale-50"
            >
              <svg v-if="isDark" key="sun" class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else key="moon" class="w-5 h-5 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </Transition>
          </button>

          <!-- Mobile Toggle -->
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden p-2 rounded-full transition-all duration-300 focus:outline-none hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
            :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
            :aria-expanded="isMobileMenuOpen"
            type="button"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 -translate-y-4 scale-95"
        leave-to-class="opacity-0 -translate-y-4 scale-95"
      >
        <div
          v-if="isMobileMenuOpen"
          class="md:hidden mt-3 glass-effect rounded-2xl p-2 shadow-2xl border border-white/20 dark:border-white/10"
          role="menu"
        >
          <a
            v-for="item in navItems"
            :key="item.id"
            :href="item.href"
            @click.prevent="scrollToSection(item.href, item.id)"
            :class="[
              'block py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none mb-1 last:mb-0',
              activeSection === item.id
                ? 'text-primary-600 dark:text-primary-400 bg-primary-500/10 dark:bg-primary-500/20 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-primary-500'
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
