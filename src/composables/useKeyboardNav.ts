import { useRouter } from 'vue-router'
import { useJourneyStore } from '@/stores/journey'
import { journeyChapters } from '@/data/journeyData'
import { useEventListener } from './useEventListener'

export function useKeyboardNav() {
  const router = useRouter()
  const store = useJourneyStore()

  function navigateToChapter(index: number) {
    const clamped = Math.max(0, Math.min(index, journeyChapters.length - 1))
    const chapter = journeyChapters[clamped]
    if (chapter && router.currentRoute.value.name === 'Journey') {
      store.scrollToChapterIndex(clamped)
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }

    const current = store.activeChapterIndex

    if (e.key === 'ArrowRight' || e.key === 'j') {
      e.preventDefault()
      navigateToChapter(current + 1)
    } else if (e.key === 'ArrowLeft' || e.key === 'k') {
      e.preventDefault()
      navigateToChapter(current - 1)
    }
  }

  useEventListener(window, 'keydown', handleKeydown as EventListener)
}
