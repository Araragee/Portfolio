import { onBeforeUnmount, toValue, watchEffect, type MaybeRefOrGetter } from 'vue'
import type { WorldTheme } from '@/types/journey'

/**
 * Tint the whole page with a project's world while the caller is mounted:
 * surface tokens take the world's bg, dark worlds flip type via html.world-dark
 * (tokens in main.css). Restores the monochrome defaults on unmount.
 */
export function useWorldTheme(world: MaybeRefOrGetter<WorldTheme>): void {
  const root = document.documentElement

  watchEffect(() => {
    const w = toValue(world)
    const n = parseInt(w.bg.slice(1), 16)
    root.style.setProperty('--surface', w.bg)
    root.style.setProperty('--c-surface', `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`)
    root.classList.toggle('world-dark', w.dark === true)
  })

  onBeforeUnmount(() => {
    root.style.removeProperty('--surface')
    root.style.removeProperty('--c-surface')
    root.classList.remove('world-dark')
  })
}
