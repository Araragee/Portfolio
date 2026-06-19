import { computed, ref } from 'vue'

export type ParticlePreset = {
  name: string
  driftMode: number
  hoverMode: number
  pulse: number
  softCircle: number
  additive: boolean
}

const PRESETS: ParticlePreset[] = [
  { name: 'Default',       driftMode: 0, hoverMode: 0, pulse: 0, softCircle: 0, additive: false },
  { name: 'Curl Flow',     driftMode: 1, hoverMode: 0, pulse: 0, softCircle: 0, additive: false },
  { name: 'Wave',          driftMode: 2, hoverMode: 0, pulse: 0, softCircle: 0, additive: false },
  { name: 'Orbit',         driftMode: 3, hoverMode: 0, pulse: 0, softCircle: 0, additive: false },
  { name: 'Vortex',        driftMode: 0, hoverMode: 1, pulse: 0, softCircle: 0, additive: false },
  { name: 'Ripple',        driftMode: 0, hoverMode: 2, pulse: 0, softCircle: 0, additive: false },
  { name: 'Magnet',        driftMode: 0, hoverMode: 3, pulse: 0, softCircle: 0, additive: false },
  { name: 'Pulse+Circles', driftMode: 3, hoverMode: 1, pulse: 1, softCircle: 1, additive: false },
  { name: 'Glow',          driftMode: 1, hoverMode: 2, pulse: 1, softCircle: 1, additive: true  },
]

const currentIndex = ref(0)
const current = computed(() => PRESETS[currentIndex.value])

export function useParticleTestMode() {
  function next() {
    currentIndex.value = (currentIndex.value + 1) % PRESETS.length
  }
  function prev() {
    currentIndex.value = (currentIndex.value - 1 + PRESETS.length) % PRESETS.length
  }
  return { PRESETS, currentIndex, current, next, prev }
}
