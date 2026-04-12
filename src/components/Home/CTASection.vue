<script setup lang="ts">
// CTA contact links
const contactLinks = [
  { label: 'davxgonzales@gmail.com', href: 'mailto:davxgonzales@gmail.com', id: 'cta-email-link' },
  { label: 'GitHub', href: 'https://github.com/Araragee', id: 'cta-github-link', external: true },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/davxloper', id: 'cta-linkedin-link', external: true },
]
</script>

<template>
  <section
    class="bg-primary text-surface py-40 px-6 md:px-[120px] text-center"
    aria-labelledby="cta-heading"
  >
    <h2
      id="cta-heading"
      class="font-headline font-bold tracking-[-0.03em] mb-16 uppercase leading-[0.85]"
      style="font-size: clamp(3rem, 12vw, 160px);"
    >
      Let's construct<br />the future.
    </h2>

    <div class="flex flex-col md:flex-row justify-center items-center gap-16 font-headline font-semibold text-[11px] tracking-[0.3em] uppercase">
      <a
        v-for="link in contactLinks"
        :key="link.id"
        :href="link.href"
        :id="link.id"
        :target="link.external ? '_blank' : undefined"
        :rel="link.external ? 'noopener noreferrer' : undefined"
        class="hover:opacity-50 transition-opacity duration-200 no-underline text-surface"
        :aria-label="link.label"
      >
        {{ link.label }}
      </a>
    </div>
  </section>
</template>
