<script setup lang="ts">
import { storeToRefs } from 'pinia'
import {
  BufferAttribute,
  BufferGeometry,
  Points,
  ShaderMaterial,
  Vector2,
  Vector3,
  Vector4,
} from 'three'
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useLoop } from '@tresjs/core'
import { useJourneyStore } from '@/stores/journey'
import { useReducedMotion } from '@/composables/useReducedMotion'
import {
  buildMorphTargets,
  particleCountForViewport,
  createTextMass,
  loadImageAndSample,
  PESO_BILL_INSTANCES,
} from '@/utils/morphTargets'
import type { MorphStateId } from '@/types/journey'
import { journeyChapters } from '@/data/journeyData'
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

// Must match the GLSL array size in particles.ts — a mismatch fails silently.
const MAX_EXCLUSION_ZONES = 8

let currentCount = particleCountForViewport(window.innerWidth)
let targets = buildMorphTargets(currentCount)

const geometry = new BufferGeometry()
geometry.setAttribute(
  'position',
  new BufferAttribute(targets.positions[morphFrom.value].slice(), 3),
)
geometry.setAttribute(
  'aPositionTo',
  new BufferAttribute(targets.positions[morphTo.value].slice(), 3),
)
geometry.setAttribute(
  'aBonsaiParent',
  new BufferAttribute(targets.bonsaiParents.slice(), 3),
)
geometry.setAttribute(
  'aColorFrom',
  new BufferAttribute(targets.colors[morphFrom.value].slice(), 3),
)
geometry.setAttribute(
  'aColorTo',
  new BufferAttribute(targets.colors[morphTo.value].slice(), 3),
)

const uniforms = {
  uTime: { value: 0 },
  uProgress: { value: 0 },
  uMouse: { value: new Vector3(999, 999, 0) },
  uPointSize: { value: 3.5 },
  uDriftAmp: { value: 1 },
  uOpacity: { value: 0.7 },
  uDither: { value: 1.0 },
  uRepelRadius: { value: props.repelRadius },
  uRepelStrength: { value: props.repelStrength },
  uChapterIndex: { value: 0 },
  uInteractState: { value: 0 },
  uInteractPos: { value: new Vector3() },
  uOffsetFrom: { value: new Vector2() },
  uOffsetTo: { value: new Vector2() },
  // x disables side-slides on mobile; y stays live so explicit vertical
  // offsets (epilogue) keep working on small screens.
  uOffsetScale: { value: new Vector2(window.innerWidth < 768 ? 0 : 1, 1) },
  uFormationScale: { value: formationScaleForViewport() },
  uExclusionCount: { value: 0 },
  uExclusionZones: {
    value: Array.from({ length: MAX_EXCLUSION_ZONES }, () => new Vector4()),
  }
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

// Image loading & sampling
function loadImages(): void {
  const activeCount = currentCount
  loadImageAndSample('/assets/peso-1000.png', activeCount, 1.0, {
    colorScale: true,
    maxBrightness: 215,
    instances: PESO_BILL_INSTANCES,
  }).then(({ positions, colors }) => {
    if (activeCount !== currentCount) return
    targets.positions.peso = positions
    targets.colors.peso = colors
    updateActiveBuffers('peso')
  })
  loadImageAndSample('/assets/cbms.svg', activeCount, 2.6, {
    colorScale: true,
    maxBrightness: 230,
    maxDim: 192,
  }).then(({ positions, colors }) => {
    if (activeCount !== currentCount) return
    targets.positions.cbmsLogo = positions
    targets.colors.cbmsLogo = colors
    updateActiveBuffers('cbmsLogo')
  })
  loadImageAndSample('/assets/dave-face.png', activeCount, 3.2, {
    colorScale: true,
    keyBackground: { tolerance: 30 },
    weightByDarkness: true,
    zRelief: 0.3,
  }).then(({ positions, colors }) => {
    if (activeCount !== currentCount) return
    targets.positions.portrait = positions
    targets.colors.portrait = colors
    updateActiveBuffers('portrait')
  })
}

// Bounding box text avoidance zones
const HALF_HEIGHT = Math.tan((45 / 2) * (Math.PI / 180)) * 8
const exclusionZones = ref<[number, number, number, number][]>([])

interface ScreenRect {
  left: number
  top: number
  right: number
  bottom: number
}

/**
 * Union vertically-adjacent rects (gap < gapPx, x-ranges overlapping) so a
 * title block or paragraph stack costs one zone instead of one per line.
 */
function mergeRects(rects: ScreenRect[], gapPx: number): ScreenRect[] {
  const sorted = [...rects].sort((a, b) => a.top - b.top)
  const groups: ScreenRect[] = []
  for (const r of sorted) {
    const last = groups[groups.length - 1]
    if (
      last &&
      r.left < last.right &&
      r.right > last.left &&
      r.top - last.bottom < gapPx
    ) {
      last.left = Math.min(last.left, r.left)
      last.top = Math.min(last.top, r.top)
      last.right = Math.max(last.right, r.right)
      last.bottom = Math.max(last.bottom, r.bottom)
    } else {
      groups.push({ ...r })
    }
  }
  return groups
}

/** On-screen .reveal-text rects for one chapter container. */
function collectTextRects(chapterId: string | undefined): ScreenRect[] {
  if (!chapterId) return []
  const container = document.getElementById(chapterId)
  if (!container) return []
  const rects: ScreenRect[] = []
  container.querySelectorAll('.reveal-text').forEach((el) => {
    const rect = el.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return
    if (rect.bottom < 0 || rect.top > window.innerHeight) return
    if (rect.right < 0 || rect.left > window.innerWidth) return
    rects.push({ left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom })
  })
  return rects
}

function updateExclusionZones(): void {
  // Active + next chapter: incoming text is protected during cross-chapter morphs.
  const activeIdx = store.activeChapterIndex
  const nextIdx = Math.min(activeIdx + 1, journeyChapters.length - 1)
  const rects = collectTextRects(journeyChapters[activeIdx]?.id)
  if (nextIdx !== activeIdx) {
    rects.push(...collectTextRects(journeyChapters[nextIdx]?.id))
  }

  const halfH = HALF_HEIGHT
  const aspect = window.innerWidth / window.innerHeight
  const halfW = halfH * aspect

  const zones: [number, number, number, number][] = mergeRects(rects, 40).map((r) => {
    const ndcMinX = (r.left / window.innerWidth) * 2 - 1
    const ndcMaxX = (r.right / window.innerWidth) * 2 - 1
    const ndcMinY = -((r.bottom / window.innerHeight) * 2 - 1)
    const ndcMaxY = -((r.top / window.innerHeight) * 2 - 1)
    return [ndcMinX * halfW, ndcMinY * halfH, ndcMaxX * halfW, ndcMaxY * halfH]
  })
  exclusionZones.value = zones.slice(0, MAX_EXCLUSION_ZONES)
}

function updateActiveBuffers(stateId: MorphStateId): void {
  const currentGeometry = points.value.geometry
  const positionAttr = currentGeometry.getAttribute('position') as BufferAttribute
  const toAttr = currentGeometry.getAttribute('aPositionTo') as BufferAttribute
  const colorFromAttr = currentGeometry.getAttribute('aColorFrom') as BufferAttribute
  const colorToAttr = currentGeometry.getAttribute('aColorTo') as BufferAttribute

  if (morphFrom.value === stateId && positionAttr) {
    if (positionAttr.count === targets.positions[stateId].length / 3) {
      ;(positionAttr.array as Float32Array).set(targets.positions[stateId])
      positionAttr.needsUpdate = true
    }
    if (colorFromAttr && colorFromAttr.count === targets.colors[stateId].length / 3) {
      ;(colorFromAttr.array as Float32Array).set(targets.colors[stateId])
      colorFromAttr.needsUpdate = true
    }
  }
  if (morphTo.value === stateId && toAttr) {
    if (toAttr.count === targets.positions[stateId].length / 3) {
      ;(toAttr.array as Float32Array).set(targets.positions[stateId])
      toAttr.needsUpdate = true
    }
    if (colorToAttr && colorToAttr.count === targets.colors[stateId].length / 3) {
      ;(colorToAttr.array as Float32Array).set(targets.colors[stateId])
      colorToAttr.needsUpdate = true
    }
  }
}

// Rebuild targets & geometry when count changes
function updateParticleCount(newCount: number): void {
  currentCount = newCount
  targets = buildMorphTargets(newCount)

  const newGeometry = new BufferGeometry()
  newGeometry.setAttribute(
    'position',
    new BufferAttribute(targets.positions[morphFrom.value].slice(), 3),
  )
  newGeometry.setAttribute(
    'aPositionTo',
    new BufferAttribute(targets.positions[morphTo.value].slice(), 3),
  )
  newGeometry.setAttribute(
    'aBonsaiParent',
    new BufferAttribute(targets.bonsaiParents.slice(), 3),
  )
  newGeometry.setAttribute(
    'aColorFrom',
    new BufferAttribute(targets.colors[morphFrom.value].slice(), 3),
  )
  newGeometry.setAttribute(
    'aColorTo',
    new BufferAttribute(targets.colors[morphTo.value].slice(), 3),
  )

  const oldGeometry = points.value.geometry
  points.value.geometry = newGeometry
  oldGeometry.dispose()

  loadImages()
  updateExclusionZones()
}

function formationScaleForViewport(): number {
  if (window.innerWidth < 768) return 0.85
  const aspect = window.innerWidth / window.innerHeight
  return Math.min(1, Math.max(0.62, aspect / 1.5))
}

function onResize(): void {
  uniforms.uOffsetScale.value.set(window.innerWidth < 768 ? 0 : 1, 1)
  uniforms.uFormationScale.value = formationScaleForViewport()
  const newCount = particleCountForViewport(window.innerWidth)
  if (newCount !== currentCount) {
    updateParticleCount(newCount)
  } else {
    updateExclusionZones()
  }
}
window.addEventListener('resize', onResize)

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
  uniforms.uInteractPos.value.copy(mouseTarget)
}

function onPointerUp(): void {
  targetInteractState = 0
}

window.addEventListener('pointermove', onPointerMove, { passive: true })
window.addEventListener('pointerdown', onPointerDown, { passive: true })
window.addEventListener('pointerup', onPointerUp, { passive: true })

let slowFrameCount = 0
const { onBeforeRender, stop, start } = useLoop()
let hasRenderedFirstFrame = false

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
  uniforms.uProgress.value = prefersReducedMotion.value ? (t > 0.5 ? 1 : 0) : t
  uniforms.uDriftAmp.value = prefersReducedMotion.value ? 0 : 1
  uniforms.uMouse.value.lerp(mouseTarget, 0.08)
  
  uniforms.uChapterIndex.value = store.activeChapterIndex
  uniforms.uInteractState.value += (targetInteractState - uniforms.uInteractState.value) * 0.1

  const [fromX, fromY] = store.fieldOffsetFrom
  const [toX, toY] = store.fieldOffsetTo
  uniforms.uOffsetFrom.value.set(fromX, fromY)
  uniforms.uOffsetTo.value.set(toX, toY)

  // Update text avoidance zones
  const zones = exclusionZones.value
  uniforms.uExclusionCount.value = zones.length
  for (let j = 0; j < MAX_EXCLUSION_ZONES; j++) {
    if (j < zones.length) {
      uniforms.uExclusionZones.value[j].set(
        zones[j][0],
        zones[j][1],
        zones[j][2],
        zones[j][3]
      )
    } else {
      uniforms.uExclusionZones.value[j].set(0, 0, 0, 0)
    }
  }

  if (store.degradeTier < 3 && elapsed > 2) {
    if (delta > 0.034) {
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
  loadImages()
  
  // Wait slightly for DOM to settle and reveal-text to render before measuring text boxes
  setTimeout(updateExclusionZones, 200)

  document.fonts.ready.then(() => {
    targets.positions.textMass = createTextMass(currentCount, 'DAVXLOPER')
    const currentGeometry = points.value.geometry
    const positionAttr = currentGeometry.getAttribute('position') as BufferAttribute
    const toAttr = currentGeometry.getAttribute('aPositionTo') as BufferAttribute
    if (store.morphFrom === 'textMass' && positionAttr) {
      ;(positionAttr.array as Float32Array).set(targets.positions.textMass)
      positionAttr.needsUpdate = true
    }
    if (store.morphTo === 'textMass' && toAttr) {
      ;(toAttr.array as Float32Array).set(targets.positions.textMass)
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

watch([morphFrom, morphTo], ([from, to]) => {
  const currentGeometry = points.value.geometry
  const positionAttr = currentGeometry.getAttribute('position') as BufferAttribute
  const toAttr = currentGeometry.getAttribute('aPositionTo') as BufferAttribute
  const colorFromAttr = currentGeometry.getAttribute('aColorFrom') as BufferAttribute
  const colorToAttr = currentGeometry.getAttribute('aColorTo') as BufferAttribute

  if (positionAttr && toAttr) {
    if (positionAttr.count === targets.positions[from].length / 3 &&
        toAttr.count === targets.positions[to].length / 3) {
      ;(positionAttr.array as Float32Array).set(targets.positions[from])
      ;(toAttr.array as Float32Array).set(targets.positions[to])
      positionAttr.needsUpdate = true
      toAttr.needsUpdate = true
    }
  }

  if (colorFromAttr && colorToAttr) {
    if (colorFromAttr.count === targets.colors[from].length / 3 &&
        colorToAttr.count === targets.colors[to].length / 3) {
      ;(colorFromAttr.array as Float32Array).set(targets.colors[from])
      ;(colorToAttr.array as Float32Array).set(targets.colors[to])
      colorFromAttr.needsUpdate = true
      colorToAttr.needsUpdate = true
    }
  }

  // Update text zones for the new chapter
  setTimeout(updateExclusionZones, 50)
})

watch(() => store.activeChapterIndex, () => {
  setTimeout(updateExclusionZones, 50)
})

watch(() => store.scrollProgress, () => {
  updateExclusionZones()
})
</script>

<template>
  <primitive :object="points" />
</template>
