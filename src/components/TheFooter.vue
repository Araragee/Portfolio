<script setup lang="ts">
import { siteConfig } from '@/data/siteConfig'
import { socialLinks } from '@/data/aboutData'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer
    class="bg-surface border-t border-outline flex flex-col md:flex-row justify-between items-center section-padding py-8 md:py-10 w-full font-mono text-label uppercase"
    role="contentinfo"
  >
    <div class="text-on-surface font-bold mb-4 md:mb-0">
      &copy;{{ currentYear }} {{ siteConfig.brandName }}
    </div>
    <div class="flex flex-wrap justify-center gap-6 md:gap-10">
      <a
        v-for="link in socialLinks"
        :key="link.platform"
        :href="link.url"
        :target="link.platform !== 'Email' ? '_blank' : undefined"
        :rel="link.platform !== 'Email' ? 'noopener noreferrer' : undefined"
        class="text-secondary hover:text-on-surface transition-all duration-300 no-underline"
        :id="`footer-${link.platform.toLowerCase()}-link`"
        :aria-label="link.platform === 'Email' ? 'Send email' : `${link.platform} profile`"
      >
        {{ link.platform === 'Email' ? 'Contact' : link.platform }}
      </a>
    </div>
  </footer>
</template>
