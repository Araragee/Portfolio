<script setup lang="ts">
import { storeToRefs } from 'pinia'
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Points,
  ShaderMaterial,
  Vector2,
  Vector3,
} from 'three'
import { onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import { useLoop } from '@tresjs/core'
import { useJourneyStore } from '@/stores/journey'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { buildMorphTargets, particleCountForViewport, createTextMass } from '@/utils/morphTargets'
import { particleFragmentShader, particleVertexShader } from '@/shaders/particles'

const props = withDefaults(
  defineProps<{
    repelRadius?: number
    repelStrength?: number
  }>(),
  {
    repelRadius: 1.2,
    repelStrength: 0.35,
  },
)

const store = useJourneyStore()
const { morphFrom, morphTo, morphT, ditherEnabled } = storeToRefs(store)
const { prefersReducedMotion } = useReducedMotion()

let currentCount = particleCountForViewport(window.innerWidth)
let targets = buildMorphTargets(currentCount)

const geometry = new BufferGeometry()
geometry.setAttribute(
  'position',
  new BufferAttribute(targets[morphFrom.value].slice(), 3),
)
geometry.setAttribute(
  'aPositionTo',
  new BufferAttribute(targets[morphTo.value].slice(), 3),
)

const uniforms = {
  uTime: { value: 0 },
  uProgress: { value: 0 },
  uMouse: { value: new Vector3(999, 999, 0) },
  uPointSize: { value: 3.5 },
  uDriftAmp: { value: 1 },
  uColor: { value: new Color('#111111') },
  uOpacity: { value: 0.7 },
  uDither: { value: 1.0 },
  uRepelRadius: { value: props.repelRadius },
  uRepelStrength: { value: props.repelStrength },
  uChapterIndex: { value: 0 },
  uInteractState: { value: 0 },
  uInteractPos: { value: new Vector3() },
  uOffsetFrom: { value: new Vector2() },
  uOffsetTo: { value: new Vector2() },
  // Mobile keeps the field centered behind the text — no counter-side slide
  uOffsetScale: { value: window.innerWidth < 768 ? 0 : 1 },
  uFormationScale: { value: formationScaleForViewport() },
}

watch(() => props.repelRadius, (val) => {
  uniforms.uRepelRadius.value = val
})
watch(() => props.repelStrength, (val) => {
  uniforms.uRepelStrength.value = val
})

const material = new ShaderMaterial({
  vertexShader: particleVertexShader,
  fragmentShader: particleFragmentShader,
  uniforms,
  transparent: true,
  depthWrite: false,
})

const points = shallowRef(new Points(geometry, material))
points.value.frustumCulled = false

// Rebuild targets & geometry when count changes (resize or FPS guard)
function updateParticleCount(newCount: number): void {
  currentCount = newCount
  targets = buildMorphTargets(newCount)

  const newGeometry = new BufferGeometry()
  newGeometry.setAttribute(
    'position',
    new BufferAttribute(targets[morphFrom.value].slice(), 3),
  )
  newGeometry.setAttribute(
    'aPositionTo',
    new BufferAttribute(targets[morphTo.value].slice(), 3),
  )

  const oldGeometry = points.value.geometry
  points.value.geometry = newGeometry
  oldGeometry.dispose()
}

// Narrow viewports: shrink the formation so it fits the half-screen it owns
// (offset pushes it opposite the text — docs/TWEAKS/A-field-offset.md)
function formationScaleForViewport(): number {
  if (window.innerWidth < 768) return 0.85
  const aspect = window.innerWidth / window.innerHeight
  return Math.min(1, Math.max(0.62, aspect / 1.5))
}

// Window resize handler: rebuild targets when crossing the 768px count breakpoint
function onResize(): void {
  uniforms.uOffsetScale.value = window.innerWidth < 768 ? 0 : 1
  uniforms.uFormationScale.value = formationScaleForViewport()
  const newCount = particleCountForViewport(window.innerWidth)
  if (newCount !== currentCount) {
    updateParticleCount(newCount)
  }
}
window.addEventListener('resize', onResize)

// Pointer → world xy on the z=0 plane. Camera is fixed (z=8, fov 45), so the
// projection is a constant — no raycaster needed for plain repulsion.
const HALF_HEIGHT = Math.tan((45 / 2) * (Math.PI / 180)) * 8
const mouseTarget = new Vector3(999, 999, 0)

let targetInteractState = 0

function onPointerMove(event: PointerEvent): void {
  const ndcX = (event.clientX / window.innerWidth) * 2 - 1
  const ndcY = -((event.clientY / window.innerHeight) * 2 - 1)
  const aspect = window.innerWidth / window.innerHeight
  mouseTarget.set(ndcX * HALF_HEIGHT * aspect, ndcY * HALF_HEIGHT, 0)
}

function onPointerDown(): void {
  targetInteractState = 1
  // Capture where interaction started
  uniforms.uInteractPos.value.copy(mouseTarget)
}

function onPointerUp(): void {
  targetInteractState = 0
}

window.addEventListener('pointermove', onPointerMove, { passive: true })
window.addEventListener('pointerdown', onPointerDown, { passive: true })
window.addEventListener('pointerup', onPointerUp, { passive: true })

let slowFrameCount = 0
// Degrade ladder uses the store tier; each FPS violation advances one step.
// Tier 0 → 1: dither off (fill-rate win)
// Tier 1 → 2: DPR 1 (handled by JourneyCanvas reading store.degradeTier)
// Tier 2 → 3: halve particles

const { onBeforeRender, stop, start } = useLoop()

let hasRenderedFirstFrame = false

// No idle timeout: the field's drift is intentional ambient motion — freezing
// it while the visitor reads looks broken. Only a hidden tab stops the loop.
function onVisibilityChange(): void {
  if (document.hidden) {
    stop()
  } else {
    start()
  }
}

document.addEventListener('visibilitychange', onVisibilityChange)

onBeforeRender(({ elapsed, delta }) => {
  if (!hasRenderedFirstFrame) {
    hasRenderedFirstFrame = true
    store.markFirstFrame()
  }
  uniforms.uTime.value = elapsed
  const t = morphT.value
  // Reduced motion: snap between formations instead of tweening
  uniforms.uProgress.value = prefersReducedMotion.value ? (t > 0.5 ? 1 : 0) : t
  uniforms.uDriftAmp.value = prefersReducedMotion.value ? 0 : 1
  uniforms.uMouse.value.lerp(mouseTarget, 0.08)
  
  uniforms.uChapterIndex.value = store.activeChapterIndex
  uniforms.uInteractState.value += (targetInteractState - uniforms.uInteractState.value) * 0.1

  // Counter-side offsets: field slides away from the text column
  const [fromX, fromY] = store.fieldOffsetFrom
  const [toX, toY] = store.fieldOffsetTo
  uniforms.uOffsetFrom.value.set(fromX, fromY)
  uniforms.uOffsetTo.value.set(toX, toY)

  // Adaptive degrade ladder — advances store tier after 60 sustained slow frames
  if (store.degradeTier < 3 && elapsed > 2) {
    if (delta > 0.034) { // < ~30fps
      slowFrameCount++
      if (slowFrameCount > 60) {
        slowFrameCount = 0
        store.advanceDegradeLevel()
        if (store.degradeTier === 3) {
          const halvedCount = Math.round(currentCount / 2)
          updateParticleCount(halvedCount)
        }
      }
    } else {
      slowFrameCount = Math.max(0, slowFrameCount - 1)
    }
  }
  uniforms.uDither.value = ditherEnabled.value ? 1.0 : 0.0
})

onMounted(() => {
  document.fonts.ready.then(() => {
    // Re-sample textMass target with current font and re-upload active buffer
    targets.textMass = createTextMass(currentCount, 'TALK')
    const currentGeometry = points.value.geometry
    const positionAttr = currentGeometry.getAttribute('position') as BufferAttribute
    const toAttr = currentGeometry.getAttribute('aPositionTo') as BufferAttribute
    if (store.morphFrom === 'textMass' && positionAttr) {
      ;(positionAttr.array as Float32Array).set(targets.textMass)
      positionAttr.needsUpdate = true
    }
    if (store.morphTo === 'textMass' && toAttr) {
      ;(toAttr.array as Float32Array).set(targets.textMass)
      toAttr.needsUpdate = true
    }
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerdown', onPointerDown)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('resize', onResize)
  document.removeEventListener('visibilitychange', onVisibilityChange)
  points.value.geometry.dispose()
  material.dispose()
})

// Chapter boundary crossed: swap FROM/TO buffers; the GPU lerps everything else
watch([morphFrom, morphTo], ([from, to]) => {
  const currentGeometry = points.value.geometry
  const positionAttr = currentGeometry.getAttribute('position') as BufferAttribute
  const toAttr = currentGeometry.getAttribute('aPositionTo') as BufferAttribute
  if (positionAttr && toAttr) {
    ;(positionAttr.array as Float32Array).set(targets[from])
    ;(toAttr.array as Float32Array).set(targets[to])
    positionAttr.needsUpdate = true
    toAttr.needsUpdate = true
  }
})
</script>

<template>
  <primitive :object="points" />
</template>
