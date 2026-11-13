<script setup lang="ts">
import { ref } from 'vue'
import { useParticleTestMode, type ParticleTuning } from '@/composables/useParticleTestMode'

/**
 * Testing aid: a sticky lower-left button that opens a customizer for the
 * particle field — hover styles, idle drift, particle look, morph feel and the
 * backdrop. "Copy" puts the current values on the clipboard as JSON.
 */

type SliderKey = 'hoverRadius' | 'hoverStrength' | 'pointSize' | 'stir' | 'stagger' | 'drag' | 'bgDrift' | 'bgRipple'

interface Slider {
  key: SliderKey
  label: string
  min: number
  max: number
  step: number
}

const { tuning, reset, HOVER_MODES, DRIFT_MODES } = useParticleTestMode()

const open = ref(false)
const copied = ref(false)

const hoverSliders: Slider[] = [
  { key: 'hoverRadius', label: 'Reach', min: 0.3, max: 3.5, step: 0.1 },
  { key: 'hoverStrength', label: 'Strength', min: 0, max: 2.5, step: 0.05 },
]
const lookSliders: Slider[] = [{ key: 'pointSize', label: 'Size', min: 1.5, max: 6, step: 0.1 }]
const morphSliders: Slider[] = [
  { key: 'stir', label: 'Turbulence', min: 0, max: 2.5, step: 0.05 },
  { key: 'stagger', label: 'Wave spread', min: 0, max: 0.6, step: 0.01 },
  { key: 'drag', label: 'Scroll drag', min: 0, max: 2.5, step: 0.05 },
]
const backdropSliders: Slider[] = [
  { key: 'bgDrift', label: 'Gradient', min: 0, max: 0.08, step: 0.002 },
  { key: 'bgRipple', label: 'Cursor rings', min: 0, max: 0.08, step: 0.002 },
]

const shapes: { value: ParticleTuning['shape']; label: string }[] = [
  { value: 'world', label: 'Per world' },
  { value: 'square', label: 'Squares' },
  { value: 'soft', label: 'Soft dots' },
]
const dithers: { value: ParticleTuning['dither']; label: string }[] = [
  { value: 'world', label: 'Per world' },
  { value: 'on', label: 'Dithered' },
  { value: 'off', label: 'Solid' },
]

/** Static class strings so Tailwind sees them. */
function chipStyle(active: boolean): string {
  return active
    ? 'border-primary bg-primary text-surface'
    : 'border-outline-variant/40 text-secondary hover:border-primary hover:text-primary'
}

async function copySettings(): Promise<void> {
  await navigator.clipboard.writeText(JSON.stringify(tuning, null, 2))
  copied.value = true
  window.setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <!-- data-lenis-prevent: wheel inside the panel scrolls the panel, not the journey -->
  <div class="fixed bottom-4 left-4 z-50 font-mono text-xs uppercase tracking-widest" data-lenis-prevent>
    <div
      v-if="open"
      id="particle-customizer"
      class="mb-2 max-h-[70vh] w-72 space-y-5 overflow-y-auto border border-primary bg-surface p-4 text-primary"
    >
      <section>
        <h2 class="mb-2 text-secondary">Hover style</h2>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="(name, i) in HOVER_MODES"
            :key="name"
            type="button"
            class="border px-2 py-1 transition-colors"
            :class="chipStyle(tuning.hoverMode === i)"
            :aria-pressed="tuning.hoverMode === i"
            @click="tuning.hoverMode = i"
          >
            {{ name }}
          </button>
        </div>
        <label v-for="s in hoverSliders" :key="s.key" class="mt-3 block">
          <span class="flex justify-between text-secondary">
            <span>{{ s.label }}</span><span class="tabular-nums">{{ tuning[s.key] }}</span>
          </span>
          <input v-model.number="tuning[s.key]" type="range" :min="s.min" :max="s.max" :step="s.step" class="w-full accent-primary" />
        </label>
        <label class="mt-3 flex items-center gap-2 text-secondary">
          <input v-model="tuning.hoverAll" type="checkbox" class="accent-primary" />
          Use on every chapter
        </label>
      </section>

      <section>
        <h2 class="mb-2 text-secondary">Idle drift</h2>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="(name, i) in DRIFT_MODES"
            :key="name"
            type="button"
            class="border px-2 py-1 transition-colors"
            :class="chipStyle(tuning.driftMode === i)"
            :aria-pressed="tuning.driftMode === i"
            @click="tuning.driftMode = i"
          >
            {{ name }}
          </button>
        </div>
      </section>

      <section>
        <h2 class="mb-2 text-secondary">Particle look</h2>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="o in shapes"
            :key="o.value"
            type="button"
            class="border px-2 py-1 transition-colors"
            :class="chipStyle(tuning.shape === o.value)"
            :aria-pressed="tuning.shape === o.value"
            @click="tuning.shape = o.value"
          >
            {{ o.label }}
          </button>
        </div>
        <div class="mt-1.5 flex flex-wrap gap-1.5">
          <button
            v-for="o in dithers"
            :key="o.value"
            type="button"
            class="border px-2 py-1 transition-colors"
            :class="chipStyle(tuning.dither === o.value)"
            :aria-pressed="tuning.dither === o.value"
            @click="tuning.dither = o.value"
          >
            {{ o.label }}
          </button>
        </div>
        <label v-for="s in lookSliders" :key="s.key" class="mt-3 block">
          <span class="flex justify-between text-secondary">
            <span>{{ s.label }}</span><span class="tabular-nums">{{ tuning[s.key] }}</span>
          </span>
          <input v-model.number="tuning[s.key]" type="range" :min="s.min" :max="s.max" :step="s.step" class="w-full accent-primary" />
        </label>
        <label class="mt-2 flex items-center gap-2 text-secondary">
          <input v-model="tuning.pulse" type="checkbox" class="accent-primary" />
          Pulse
        </label>
        <label class="mt-1 flex items-center gap-2 text-secondary">
          <input v-model="tuning.glow" type="checkbox" class="accent-primary" />
          Glow (additive)
        </label>
      </section>

      <section>
        <h2 class="mb-2 text-secondary">Morph feel</h2>
        <label v-for="s in morphSliders" :key="s.key" class="mt-2 block">
          <span class="flex justify-between text-secondary">
            <span>{{ s.label }}</span><span class="tabular-nums">{{ tuning[s.key] }}</span>
          </span>
          <input v-model.number="tuning[s.key]" type="range" :min="s.min" :max="s.max" :step="s.step" class="w-full accent-primary" />
        </label>
      </section>

      <section>
        <h2 class="mb-2 text-secondary">Backdrop</h2>
        <label v-for="s in backdropSliders" :key="s.key" class="mt-2 block">
          <span class="flex justify-between text-secondary">
            <span>{{ s.label }}</span><span class="tabular-nums">{{ tuning[s.key] }}</span>
          </span>
          <input v-model.number="tuning[s.key]" type="range" :min="s.min" :max="s.max" :step="s.step" class="w-full accent-primary" />
        </label>
      </section>

      <div class="flex gap-2 border-t border-outline-variant/40 pt-3">
        <button type="button" class="flex-1 border border-primary px-2 py-1.5 hover:bg-primary hover:text-surface" @click="copySettings">
          {{ copied ? 'Copied' : 'Copy settings' }}
        </button>
        <button type="button" class="border border-outline-variant/40 px-2 py-1.5 text-secondary hover:border-primary hover:text-primary" @click="reset">
          Reset
        </button>
      </div>
    </div>

    <button
      type="button"
      class="border border-primary bg-surface px-3 py-2 text-primary transition-colors hover:bg-primary hover:text-surface"
      :aria-expanded="open"
      aria-controls="particle-customizer"
      @click="open = !open"
    >
      {{ open ? 'Close' : 'Customize' }}
    </button>
  </div>
</template>
