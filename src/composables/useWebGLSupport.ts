import { ref } from 'vue'

let cached: boolean | null = null

/**
 * One-time WebGL2 capability probe. When false, JourneyPage renders the
 * static dithered fallback instead of mounting the canvas (and the three
 * chunk never loads).
 */
export function useWebGLSupport() {
  if (cached === null) {
    try {
      const canvas = document.createElement('canvas')
      cached = canvas.getContext('webgl2') !== null
    } catch {
      cached = false
    }
  }
  const webglSupported = ref(cached)
  return { webglSupported }
}
