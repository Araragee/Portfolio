<script setup lang="ts">
import { Mesh, PlaneGeometry, ShaderMaterial, Vector2, Vector3 } from 'three'
import { onBeforeUnmount, shallowRef } from 'vue'
import { useLoop } from '@tresjs/core'
import { useJourneyStore } from '@/stores/journey'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { useEventListener } from '@/composables/useEventListener'
import { useParticleTestMode } from '@/composables/useParticleTestMode'

/**
 * The page tint as a living surface: a full-screen quad behind the particles
 * (same WebGL context) that paints the active world's colour with a slow,
 * barely-there drifting gradient, plus soft rings that spread from the cursor
 * while it moves. Reduced motion: flat colour, no drift, no rings.
 */

const store = useJourneyStore()
const { prefersReducedMotion } = useReducedMotion()

// Gradient and ring strength come from the customizer (useParticleTestMode):
// how far the colour may stray from the world tint, as a fraction of full scale.
const { tuning } = useParticleTestMode()

const uniforms = {
  uBg: { value: new Vector3(0.976, 0.976, 0.973) },
  uTime: { value: 0 },
  uAspect: { value: window.innerWidth / window.innerHeight },
  uMouse: { value: new Vector2(0.5, 0.5) },
  uRipple: { value: 0 },
  uDrift: { value: tuning.bgDrift },
  uRippleAmp: { value: tuning.bgRipple },
}

const material = new ShaderMaterial({
  uniforms,
  depthTest: false,
  depthWrite: false,
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      // Clip-space quad: ignores the camera, always fills the screen
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 uBg;
    uniform float uTime;
    uniform float uAspect;
    uniform vec2 uMouse;
    uniform float uRipple;
    uniform float uDrift;
    uniform float uRippleAmp;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec2 p = vec2(vUv.x * uAspect, vUv.y);

      // Two slow, large waves crossing each other: -1..1
      float n = sin(p.x * 1.7 + uTime * 0.11) * cos(p.y * 1.3 - uTime * 0.09)
              + 0.5 * sin((p.x + p.y) * 2.3 + uTime * 0.07);
      n /= 1.5;

      // Lightness drift plus a faint warm/cool lean, so it reads as a gradient
      vec3 col = uBg + n * uDrift * vec3(1.0, 0.55, -0.6);

      // Rings spreading from the cursor; uRipple is pointer energy (0 at rest)
      float d = distance(p, vec2(uMouse.x * uAspect, uMouse.y));
      col += sin(d * 34.0 - uTime * 5.0) * exp(-d * 4.5) * uRipple * uRippleAmp;

      // 1-bit of noise hides 8-bit banding on such a shallow gradient
      col += (hash(gl_FragCoord.xy) - 0.5) / 255.0;

      gl_FragColor = vec4(col, 1.0);
    }
  `,
})

const geometry = new PlaneGeometry(2, 2)
const mesh = shallowRef(new Mesh(geometry, material))
mesh.value.frustumCulled = false
mesh.value.renderOrder = -1 // before the particle field

const mouseTarget = new Vector2(0.5, 0.5)
let energy = 0

function onPointerMove(e: PointerEvent): void {
  if (store.isMobile) return
  const x = e.clientX / window.innerWidth
  const y = 1 - e.clientY / window.innerHeight
  // Faster pointer = stronger rings, capped
  energy = Math.min(1, energy + Math.hypot(x - mouseTarget.x, y - mouseTarget.y) * 6)
  mouseTarget.set(x, y)
}

useEventListener(window, 'pointermove', onPointerMove as EventListener, { passive: true })
useEventListener(window, 'resize', () => {
  uniforms.uAspect.value = window.innerWidth / window.innerHeight
})

const { onBeforeRender } = useLoop()

onBeforeRender(({ elapsed, delta }) => {
  const still = prefersReducedMotion.value
  // Raw sRGB numbers straight to the shader (no colour-space conversion), so the
  // quad matches the CSS hex exactly.
  const [r, g, b] = still ? store.activeWorldRgb : store.worldBgRgb
  uniforms.uBg.value.set(r / 255, g / 255, b / 255)
  uniforms.uTime.value = elapsed
  uniforms.uDrift.value = still ? 0 : tuning.bgDrift
  uniforms.uRippleAmp.value = tuning.bgRipple
  uniforms.uMouse.value.lerp(mouseTarget, 0.12)
  energy *= Math.exp(-delta * 1.6) // rings fade ~1.5s after the pointer stops
  uniforms.uRipple.value = still ? 0 : energy
})

onBeforeUnmount(() => {
  geometry.dispose()
  material.dispose()
})
</script>

<template>
  <primitive :object="mesh" />
</template>
