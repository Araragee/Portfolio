<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { journeyChapters } from '@/data/journeyData'
import { useEventListener } from '@/composables/useEventListener'
import { lenis } from '@/composables/useLenis'

const router = useRouter()

const isOpen = ref(false)
const query = ref('')
const selectedIndex = ref(0)

type PaletteItem =
  | { kind: 'chapter'; title: string; subtitle: string; chapterIdx: number }
  | { kind: 'route'; title: string; subtitle: string; path: string }

const allItems = computed<PaletteItem[]>(() => [
  ...journeyChapters.map((c, i) => ({
    kind: 'chapter' as const,
    title: c.title,
    subtitle: c.era,
    chapterIdx: i,
  })),
  { kind: 'route', title: 'Personal', subtitle: 'About Dave', path: '/personal' },
  { kind: 'route', title: 'How I Work', subtitle: 'Manifesto', path: '/manifesto' },
])

const filteredItems = computed(() => {
  if (!query.value) return allItems.value
  const q = query.value.toLowerCase()
  return allItems.value.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q),
  )
})

function open() {
  isOpen.value = true
  query.value = ''
  selectedIndex.value = 0
}

function close() {
  isOpen.value = false
}

function selectItem(index: number) {
  const item = filteredItems.value[index]
  if (!item) return
  if (item.kind === 'chapter') {
    const chapter = journeyChapters[item.chapterIdx]
    const el = document.getElementById(chapter.id)
    if (el) {
      lenis.value?.scrollTo(el, { offset: 0 })
    } else {
      // Not on journey page — navigate there first
      router.push({ path: '/', hash: `#${chapter.id}` })
    }
  } else {
    router.push(item.path)
  }
  close()
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
      selectedIndex.value = (selectedIndex.value + 1) % filteredItems.value.length
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      selectedIndex.value =
        (selectedIndex.value - 1 + filteredItems.value.length) % filteredItems.value.length
    } else if (e.key === 'Enter') {
      e.preventDefault()
      selectItem(selectedIndex.value)
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
  <!-- Cmd+K Hint -->
  <div v-if="!isOpen" class="fixed bottom-4 right-4 z-40 hidden sm:block">
    <button
      @click="open"
      class="flex items-center gap-2 px-3 py-1.5 border border-zinc-300 dark:border-zinc-600 text-xs text-secondary hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
    >
      <span class="font-mono">⌘K</span>
      <span>Jump to</span>
    </button>
  </div>

  <!-- Command Palette Modal -->
  <Transition name="cmd-palette">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/30 backdrop-blur-sm"
      @click.self="close"
    >
      <div
        class="w-full max-w-lg bg-surface dark:bg-zinc-900 shadow-lg border border-zinc-300 dark:border-zinc-700 overflow-hidden"
      >
        <div class="border-b border-zinc-300 dark:border-zinc-700 p-4">
          <input
            id="command-input"
            v-model="query"
            type="text"
            placeholder="Jump to chapter or page..."
            class="w-full bg-transparent text-on-surface placeholder-secondary focus:outline-none text-base"
          />
        </div>

        <div class="max-h-96 overflow-y-auto">
          <button
            v-for="(item, idx) in filteredItems"
            :key="`${item.kind}-${idx}`"
            @click="selectItem(idx)"
            :class="[
              'w-full px-4 py-3 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-3',
              idx === selectedIndex
                ? 'bg-primary text-surface dark:bg-primary dark:text-surface'
                : 'text-on-surface',
            ]"
          >
            <span class="font-mono text-xs opacity-50 w-4">
              {{ item.kind === 'route' ? '→' : '#' }}
            </span>
            <span class="flex-1">
              <span class="block font-semibold text-sm">{{ item.title }}</span>
              <span class="block text-xs mt-0.5 opacity-70">{{ item.subtitle }}</span>
            </span>
          </button>

          <div v-if="filteredItems.length === 0" class="px-4 py-8 text-center text-secondary">
            No results
          </div>
        </div>

        <div
          class="border-t border-zinc-300 dark:border-zinc-700 px-4 py-2 text-xs text-secondary flex justify-between"
        >
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
