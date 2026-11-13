import { reactive } from 'vue'

/**
 * Live tuning state for the journey's particle field and backdrop, shared by
 * the customizer panel (TestParticlePanel) and the WebGL components that read
 * it every frame. Testing aid: pick values by eye, then bake them in.
 */
export interface ParticleTuning {
  /** Index into HOVER_MODES (matches uHoverMode in shaders/particles.ts). */
  hoverMode: number
  /** Reach of the hover effect, world units. */
  hoverRadius: number
  hoverStrength: number
  /** Use the chosen hover on every chapter, not just the name. */
  hoverAll: boolean
  /** Index into DRIFT_MODES (uDriftMode). */
  driftMode: number
  pointSize: number
  /** 'world' = each world's own style. */
  shape: 'world' | 'square' | 'soft'
  dither: 'world' | 'on' | 'off'
  pulse: boolean
  glow: boolean
  /** In-flight turbulence multiplier. */
  stir: number
  /** Share of a morph spent on staggered starts (0 = all in sync). */
  stagger: number
  /** Scroll-drag multiplier while particles are in flight. */
  drag: number
  /** Backdrop gradient drift / cursor-ring strength. */
  bgDrift: number
  bgRipple: number
}

export const HOVER_MODES = [
  'Scatter',
  'Vortex',
  'Ripple',
  'Attract',
  'Lens',
  'Dent',
  'Wake only',
  'Comb',
  'Ink reveal',
  'Soft scatter',
] as const

export const DRIFT_MODES = ['Calm', 'Curl', 'Wave', 'Orbit'] as const

const DEFAULTS: ParticleTuning = {
  hoverMode: 0,
  hoverRadius: 2,
  hoverStrength: 1,
  hoverAll: false,
  driftMode: 0,
  pointSize: 3.5,
  shape: 'world',
  dither: 'world',
  pulse: false,
  glow: false,
  stir: 1,
  stagger: 0.35,
  drag: 1,
  bgDrift: 0.022,
  bgRipple: 0.016,
}

const tuning = reactive<ParticleTuning>({ ...DEFAULTS })

export function useParticleTestMode() {
  function reset(): void {
    Object.assign(tuning, DEFAULTS)
  }
  return { tuning, reset, HOVER_MODES, DRIFT_MODES }
}
