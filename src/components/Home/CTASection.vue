<script setup lang="ts">
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import { socialLinks } from '@/data/aboutData'

const { elementRef } = useScrollAnimation({ threshold: 0.1 })

// CTA contact links mapped dynamically from centralized aboutData socials
const contactLinks = socialLinks.map(link => {
  if (link.platform === 'Email') {
    return {
      label: link.url.replace('mailto:', ''),
      href: link.url,
      id: 'cta-email-link',
      external: false
    }
  } else {
    return {
      label: link.platform,
      href: link.url,
      id: `cta-${link.platform.toLowerCase()}-link`,
      external: true
    }
  }
})
</script>

<template>
  <section
    ref="elementRef"
    class="bg-primary text-surface py-20 md:py-40 section-padding text-center"
    aria-labelledby="cta-heading"
  >
    <h2
      id="cta-heading"
      class="font-headline font-bold text-display-xl mb-10 md:mb-16 uppercase"
    >
      Let's construct<br />the future.
    </h2>

    <div class="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-8 md:gap-16 font-headline font-semibold text-label uppercase">
      <a
        v-for="link in contactLinks"
        :key="link.id"
        :href="link.href"
        :id="link.id"
        :target="link.external ? '_blank' : undefined"
        :rel="link.external ? 'noopener noreferrer' : undefined"
        class="hover:opacity-50 transition-opacity duration-200 no-underline text-surface inline-flex items-center gap-2"
        :aria-label="link.label"
      >
        {{ link.label }}
        <svg
          v-if="link.external"
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
  </section>
</template>
