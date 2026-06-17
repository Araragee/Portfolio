<script setup lang="ts">

const currentYear = new Date().getFullYear()

const socialLinks = [
  {
    platform: "GitHub",
    url: "https://github.com/Araragee",
  },
  {
    platform: "LinkedIn",
    url: "https://linkedin.com/in/davxloper",
  },
  {
    platform: "Email",
    url: "mailto:davxgonzales@gmail.com",
  },
];
</script>

<template>
  <footer
    class="bg-surface border-t border-outline flex flex-col md:flex-row justify-between items-center section-padding py-8 md:py-10 w-full font-mono text-label uppercase"
    role="contentinfo"
  >
    <div class="text-on-surface font-bold mb-4 md:mb-0">
      &copy; {{ currentYear }} Dave Gonzales
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
