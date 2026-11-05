import { computed, ref } from 'vue'

export type ParticlePreset = {
  name: string
  driftMode: number
  hoverMode: number
  pulse: number
  softCircle: number
  additive: boolean
  /** Morph start-window spread, 0–0.5 (see uStagger in shaders/particles.ts). */
  stagger: number
  /** Mid-flight arc strength, 0–1 (see uArc). */
  arc: number
}

// Morph choreography shared by the everyday presets; 'Lockstep' keeps the old
// all-at-once mix for comparison, 'Assemble' pushes it for a showier build.
const MORPH = { stagger: 0.3, arc: 0.45 }

const PRESETS: ParticlePreset[] = [
  { name: 'Default',       driftMode: 0, hoverMode: 0, pulse: 0, softCircle: 0, additive: false, ...MORPH },
  { name: 'Curl Flow',     driftMode: 1, hoverMode: 0, pulse: 0, softCircle: 0, additive: false, ...MORPH },
  { name: 'Wave',          driftMode: 2, hoverMode: 0, pulse: 0, softCircle: 0, additive: false, ...MORPH },
  { name: 'Orbit',         driftMode: 3, hoverMode: 0, pulse: 0, softCircle: 0, additive: false, ...MORPH },
  { name: 'Vortex',        driftMode: 0, hoverMode: 1, pulse: 0, softCircle: 0, additive: false, ...MORPH },
  { name: 'Ripple',        driftMode: 0, hoverMode: 2, pulse: 0, softCircle: 0, additive: false, ...MORPH },
  { name: 'Magnet',        driftMode: 0, hoverMode: 3, pulse: 0, softCircle: 0, additive: false, ...MORPH },
  { name: 'Pulse+Circles', driftMode: 3, hoverMode: 1, pulse: 1, softCircle: 1, additive: false, ...MORPH },
  { name: 'Glow',          driftMode: 1, hoverMode: 2, pulse: 1, softCircle: 1, additive: true,  ...MORPH },
  { name: 'Lockstep',      driftMode: 0, hoverMode: 1, pulse: 0, softCircle: 0, additive: false, stagger: 0,    arc: 0 },
  { name: 'Assemble',      driftMode: 0, hoverMode: 1, pulse: 0, softCircle: 0, additive: false, stagger: 0.45, arc: 0.9 },
]

const currentIndex = ref(4) // Vortex preset by default
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
