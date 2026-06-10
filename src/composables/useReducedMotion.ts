import { onBeforeUnmount, ref } from 'vue'

/**
 * Reactive prefers-reduced-motion. When true: morphs snap instead of tween,
 * idle drift and cursor repulsion are disabled (uDriftAmp = 0).
 */
export function useReducedMotion() {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  const prefersReducedMotion = ref(query.matches)

  const update = (event: MediaQueryListEvent): void => {
    prefersReducedMotion.value = event.matches
  }
  query.addEventListener('change', update)

  onBeforeUnmount(() => {
    query.removeEventListener('change', update)
  })

  return { prefersReducedMotion }
}
