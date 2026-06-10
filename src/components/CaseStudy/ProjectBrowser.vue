<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  url: string
  title: string
}>()

const isLoading = ref(true)
const isBlocked = ref(false)
const iframeRef = ref<HTMLIFrameElement>()

function handleLoad() {
  isLoading.value = false
  try {
    // Cross-origin check: if X-Frame-Options blocked, contentDocument is null
    const doc = iframeRef.value?.contentDocument
    if (doc === null) isBlocked.value = true
  } catch {
    isBlocked.value = true
  }
}

function refresh() {
  if (iframeRef.value) {
    isLoading.value = true
    isBlocked.value = false
    iframeRef.value.src = props.url
  }
}

function openExternal() {
  window.open(props.url, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div class="border border-outline overflow-hidden">
    <!-- Browser chrome -->
    <div class="bg-surface border-b border-outline px-4 py-3 flex items-center gap-3">
      <!-- Traffic lights -->
      <div class="flex items-center gap-1.5 shrink-0" aria-hidden="true">
        <div class="w-3 h-3 rounded-full bg-outline/60"></div>
        <div class="w-3 h-3 rounded-full bg-outline/60"></div>
        <div class="w-3 h-3 rounded-full bg-outline/60"></div>
      </div>

      <!-- Address bar -->
      <div class="flex-1 flex items-center gap-2 bg-on-surface/[0.04] dark:bg-white/[0.04] border border-outline px-3 py-1.5 min-w-0">
        <svg class="w-3 h-3 text-secondary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 2a10 10 0 100 20A10 10 0 0012 2z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M2 12h20M12 2c-3 4-3 16 0 20M12 2c3 4 3 16 0 20" />
        </svg>
        <span class="font-mono text-secondary truncate" style="font-size: 0.7rem; letter-spacing: 0.03em;">
          {{ url }}
        </span>
      </div>

      <!-- Controls -->
      <div class="flex items-center gap-2 shrink-0">
        <button
          @click="refresh"
          class="p-1.5 text-secondary hover:text-on-surface transition-colors"
          aria-label="Refresh preview"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v6h6M20 20v-6h-6M4 10a8 8 0 0115.4-2M20 14a8 8 0 01-15.4 2" />
          </svg>
        </button>
        <button
          @click="openExternal"
          class="p-1.5 text-secondary hover:text-on-surface transition-colors"
          aria-label="Open in new tab"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Viewport -->
    <div class="relative w-full" style="height: 600px;">
      <!-- Loading state -->
      <div
        v-if="isLoading"
        class="absolute inset-0 bg-surface flex flex-col items-center justify-center gap-4 z-10"
        aria-live="polite"
      >
        <div class="w-5 h-5 border border-outline border-t-on-surface rounded-full animate-spin" aria-hidden="true"></div>
        <span class="font-mono text-secondary uppercase" style="font-size: 0.6875rem; letter-spacing: 0.15em;">Loading preview</span>
      </div>

      <!-- Blocked state -->
      <div
        v-if="isBlocked"
        class="absolute inset-0 bg-surface flex flex-col items-center justify-center gap-6 z-10 px-8 text-center"
        aria-live="polite"
      >
        <div class="w-8 h-px bg-outline mx-auto"></div>
        <div>
          <p class="font-mono text-secondary uppercase mb-1" style="font-size: 0.6875rem; letter-spacing: 0.15em;">Preview blocked</p>
          <p class="font-body text-on-surface/60 text-sm">Site restricts embedding. Open it directly.</p>
        </div>
        <button
          @click="openExternal"
          class="btn-monolith"
        >
          Open {{ title }}
          <svg class="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
        </button>
      </div>

      <!-- iframe -->
      <iframe
        v-if="!isBlocked"
        ref="iframeRef"
        :src="url"
        :title="`Live preview of ${title}`"
        class="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        @load="handleLoad"
        loading="lazy"
      ></iframe>
    </div>
  </div>
</template>
