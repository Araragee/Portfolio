<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer
    class="bg-surface border-t border-outline flex flex-col md:flex-row justify-between items-center section-padding py-8 md:py-10 w-full font-mono text-label uppercase"
    role="contentinfo"
  >
    <div class="text-on-surface font-bold mb-4 md:mb-0">
      &copy;{{ currentYear }} ENGINEERED PRECISION
    </div>
    <div class="flex flex-wrap justify-center gap-6 md:gap-10">
      <a
        href="https://github.com/Araragi"
        target="_blank"
        rel="noopener noreferrer"
        class="text-secondary hover:text-on-surface transition-all duration-300 no-underline"
        id="footer-github-link"
        aria-label="GitHub profile"
      >
        GitHub
      </a>
      <a
        href="https://linkedin.com/in/davxloper"
        target="_blank"
        rel="noopener noreferrer"
        class="text-secondary hover:text-on-surface transition-all duration-300 no-underline"
        id="footer-linkedin-link"
        aria-label="LinkedIn profile"
      >
        LinkedIn
      </a>
      <a
        href="mailto:davxgonzales@gmail.com"
        class="text-secondary hover:text-on-surface transition-all duration-300 no-underline"
        id="footer-email-link"
        aria-label="Send email"
      >
        Contact
      </a>
    </div>
  </footer>
</template>
