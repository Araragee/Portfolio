<script setup lang="ts">
// Hero availability status — update as needed
const availability = 'AVAILABLE FOR OPPORTUNITIES'
const location = 'Philippines — Remote'
</script>

<template>
  <section class="px-6 md:px-[120px] mb-40" aria-labelledby="hero-heading">
    <div class="flex flex-col gap-6 mb-12">
      <span class="font-mono text-[11px] tracking-[0.3em] uppercase text-secondary">
        {{ availability }}
      </span>
      <h1
        id="hero-heading"
        class="font-headline font-bold leading-[0.85] tracking-[-0.03em] text-on-surface uppercase"
        style="font-size: clamp(3.5rem, 10vw, 140px);"
      >
        Senior Vue.js<br />&amp; TS Engineer
      </h1>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
      <div class="md:col-span-8">
        <p class="text-2xl md:text-[32px] max-w-2xl leading-[1.15] font-normal text-on-surface/80">
          Building hyper-efficient, structurally sound web architectures
          with TypeScript and Vue. Focusing on technical precision
          and performance optimization.
        </p>
      </div>
      <div class="md:col-span-4 flex justify-start md:justify-end">
        <div class="flex flex-col items-start md:items-end gap-2">
          <span class="font-mono text-[11px] tracking-[0.3em] uppercase opacity-50">Location</span>
          <span class="text-lg font-bold font-headline tracking-tight uppercase">{{ location }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
