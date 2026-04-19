<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer
    class="bg-surface border-t border-outline flex flex-col md:flex-row justify-between items-center px-6 md:px-[120px] py-10 w-full font-mono text-[11px] tracking-[0.3em] uppercase"
    role="contentinfo"
  >
    <div class="text-on-surface font-bold mb-6 md:mb-0">
      &copy;{{ currentYear }} ENGINEERED PRECISION
    </div>
    <div class="flex gap-12">
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
