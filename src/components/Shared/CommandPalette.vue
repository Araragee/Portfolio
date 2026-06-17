<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { journeyChapters } from '@/data/journeyData'
import { useJourneyStore } from '@/stores/journey'
import { useRoute } from 'vue-router'
import { useEventListener } from '@/composables/useEventListener'

const route = useRoute()
const store = useJourneyStore()

const isOpen = ref(false)
const query = ref('')
const selectedIndex = ref(0)

const isJourney = computed(() => route.name === 'Journey')

const filteredChapters = computed(() => {
  if (!query.value) return journeyChapters
  const q = query.value.toLowerCase()
  return journeyChapters.filter(c =>
    c.title.toLowerCase().includes(q) ||
    c.era.toLowerCase().includes(q)
  )
})

function open() {
  if (isJourney.value) {
    isOpen.value = true
    query.value = ''
    selectedIndex.value = 0
  }
}

function close() {
  isOpen.value = false
}

function selectChapter(index: number) {
  const chapter = filteredChapters.value[index]
  if (chapter) {
    const chapterIndex = journeyChapters.findIndex(c => c.id === chapter.id)
    store.scrollToChapterIndex(chapterIndex)
    close()
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (!isOpen.value) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      open()
    }
  } else {
    if (e.key === 'Escape') {
      close()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      selectedIndex.value = (selectedIndex.value + 1) % filteredChapters.value.length
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      selectedIndex.value = (selectedIndex.value - 1 + filteredChapters.value.length) % filteredChapters.value.length
    } else if (e.key === 'Enter') {
      e.preventDefault()
      selectChapter(selectedIndex.value)
    }
  }
}

watch(isOpen, (open) => {
  if (open) {
    setTimeout(() => {
      const input = document.getElementById('command-input')
      ;(input as HTMLInputElement)?.focus()
    }, 0)
  }
})

useEventListener(window, 'keydown', handleKeydown as EventListener)
</script>

<template>
  <!-- Cmd+K Hint (visible when on journey, hidden when palette open) -->
  <div v-if="isJourney && !isOpen" class="fixed bottom-4 right-4 z-40 hidden sm:block">
    <button
      @click="open"
      class="flex items-center gap-2 px-3 py-1.5 rounded border border-zinc-300 dark:border-zinc-600 text-xs text-secondary hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
    >
      <span class="font-mono">⌘K</span>
      <span>Jump to chapter</span>
    </button>
  </div>

  <!-- Command Palette Modal -->
  <Transition name="cmd-palette">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/30 backdrop-blur-sm">
      <div class="w-full max-w-lg bg-surface dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-300 dark:border-zinc-700 overflow-hidden">
        <!-- Search Input -->
        <div class="border-b border-zinc-300 dark:border-zinc-700 p-4">
          <input
            id="command-input"
            v-model="query"
            type="text"
            placeholder="Jump to chapter..."
            class="w-full bg-transparent text-on-surface placeholder-secondary focus:outline-none text-base"
          />
        </div>

        <!-- Chapter List -->
        <div class="max-h-96 overflow-y-auto">
          <button
            v-for="(chapter, idx) in filteredChapters"
            :key="chapter.id"
            @click="selectChapter(idx)"
            :class="[
              'w-full px-4 py-3 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors',
              idx === selectedIndex ? 'bg-primary text-surface dark:bg-primary dark:text-surface' : 'text-on-surface',
            ]"
          >
            <div class="font-semibold text-sm">{{ chapter.title }}</div>
            <div class="text-xs text-secondary mt-0.5">{{ chapter.era }}</div>
          </button>

          <div v-if="filteredChapters.length === 0" class="px-4 py-8 text-center text-secondary">
            No chapters found
          </div>
        </div>

        <!-- Footer Hint -->
        <div class="border-t border-zinc-300 dark:border-zinc-700 px-4 py-2 text-xs text-secondary flex justify-between">
          <span>↑↓ Navigate</span>
          <span>⏎ Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.cmd-palette-enter-active,
.cmd-palette-leave-active {
  transition: opacity 0.2s ease;
}

.cmd-palette-enter-from,
.cmd-palette-leave-to {
  opacity: 0;
}
</style>
