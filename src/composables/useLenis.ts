import Lenis from 'lenis'
import { onBeforeUnmount, onMounted, shallowRef } from 'vue'

/**
 * Owns a Lenis smooth-scroll instance for the lifetime of the calling
 * component (create on mount, destroy on unmount). Journey uses it as the
 * single scroll source — subscribe with `onScroll` instead of window events.
 */
export function useLenis() {
  const lenis = shallowRef<Lenis | null>(null)
  let rafId = 0

  onMounted(() => {
    lenis.value = new Lenis({
      // Scrub feel: short lerp keeps the canvas tight to the scrollbar
      lerp: 0.12,
    })
    const raf = (time: number): void => {
      lenis.value?.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(rafId)
    lenis.value?.destroy()
    lenis.value = null
  })

  function onScroll(handler: () => void): void {
    onMounted(() => {
      lenis.value?.on('scroll', handler)
    })
  }

  return { lenis, onScroll }
}
