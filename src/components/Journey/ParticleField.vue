<script setup lang="ts">
import { storeToRefs } from 'pinia'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  NormalBlending,
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
import { useEventListener } from '@/composables/useEventListener'
import {
  buildMorphTargets,
  particleCountForViewport,
  createTextMass,
  formationScaleForViewport,
  loadImageAndSample,
  PESO_BILL_INSTANCES,
} from '@/utils/morphTargets'
import type { MorphStateId } from '@/types/journey'
import { journeyChapters } from '@/data/journeyData'
import { useParticleTestMode } from '@/composables/useParticleTestMode'
import { journeyDeckProjects } from '@/data/projectsData'
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
const { current: particlePreset } = useParticleTestMode()
const { prefersReducedMotion } = useReducedMotion()

// Must match the GLSL array size in particles.ts — a mismatch fails silently.
const MAX_EXCLUSION_ZONES = 8

// Fraction of particles that form the centered hero (the face in `portrait`, a
// project in `proj_N`). MUST match the `heroCount` block written first in
// loadImages — `aIsHero` flags exactly these so the crisp-PNG fade/scatter hits
// the face only, not the floating project icons above it.
const FACE_HERO_FRACTION = 0.65

let currentCount = particleCountForViewport(window.innerWidth)
let targets = buildMorphTargets(currentCount)

const geometry = new BufferGeometry()
geometry.setAttribute(
  'position',
  new BufferAttribute(targets.positions[morphFrom.value as MorphStateId].slice(), 3),
)
geometry.setAttribute(
  'aPositionTo',
  new BufferAttribute(targets.positions[morphTo.value as MorphStateId].slice(), 3),
)
geometry.setAttribute(
  'aBonsaiParent',
  new BufferAttribute(targets.bonsaiParents.slice(), 3),
)
geometry.setAttribute(
  'aColorFrom',
  new BufferAttribute(targets.colors[morphFrom.value as MorphStateId].slice(), 3),
)
geometry.setAttribute(
  'aColorTo',
  new BufferAttribute(targets.colors[morphTo.value as MorphStateId].slice(), 3),
)

const initialIsHero = new Float32Array(currentCount)
const initialHeroCount = Math.floor(currentCount * FACE_HERO_FRACTION)
for (let i = 0; i < currentCount; i++) {
  initialIsHero[i] = i < initialHeroCount ? 1.0 : 0.0
}
geometry.setAttribute('aIsHero', new BufferAttribute(initialIsHero, 1))

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
  },
  uDriftMode:  { value: 0 },
  uHoverMode:  { value: 0 },
  uPulse:      { value: 0 },
  uSoftCircle: { value: 0 },
  uFaceCrispProgress: { value: 0 },
}

watch(() => props.repelRadius, (val) => {
  uniforms.uRepelRadius.value = val
})
watch(() => props.repelStrength, (val) => {
  uniforms.uRepelStrength.value = val
})
watch(() => store.faceCrispProgress, (val) => {
  uniforms.uFaceCrispProgress.value = val
})

watch(particlePreset, (preset) => {
  uniforms.uDriftMode.value  = preset.driftMode
  uniforms.uHoverMode.value  = preset.hoverMode
  uniforms.uPulse.value      = preset.pulse
  uniforms.uSoftCircle.value = preset.softCircle
  material.blending    = preset.additive ? AdditiveBlending : NormalBlending
  material.needsUpdate = true
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
function resolveAssetPath(path: string): string {
  const clean = path.startsWith('/') ? path.slice(1) : path
  return import.meta.env.BASE_URL + clean
}

function loadImages(): void {
  const activeCount = currentCount
  loadImageAndSample(resolveAssetPath('/assets/peso-1000.png'), activeCount, 1.0, {
    colorScale: true,
    maxBrightness: 215,
    instances: PESO_BILL_INSTANCES,
  }).then(({ positions, colors }) => {
    if (activeCount !== currentCount) return
    targets.positions.peso = positions
    targets.colors.peso = colors
    updateActiveBuffers('peso')
  })
  loadImageAndSample(resolveAssetPath('/assets/cbms.svg'), activeCount, 2.6, {
    colorScale: true,
    maxBrightness: 230,
    maxDim: 192,
  }).then(({ positions, colors }) => {
    if (activeCount !== currentCount) return
    targets.positions.cbmsLogo = positions
    targets.colors.cbmsLogo = colors
    updateActiveBuffers('cbmsLogo')
  })
  // Density follows the hero: the centered formation (face in `portrait`, a
  // project in `proj_N`) always owns the dense 65% block at the SAME particle
  // indices. The center morph is therefore always dense→dense (face⇄project),
  // so each project reads as crisply as the face. Whoever is NOT the hero shrinks
  // into the floating constellation of small tokens above it.
  const heroCount = Math.floor(activeCount * FACE_HERO_FRACTION)
  const slotCount = Math.floor(activeCount * 0.07)
  const lastSlotCount = activeCount - heroCount - 4 * slotCount

  // The five floating small-token placements above the hero.
  const iconSlots = [
    { offset: [-1.6, 1.3] as [number, number], rotation: -0.15, z: 0.2 },
    { offset: [-0.7, 1.9] as [number, number], rotation: -0.05, z: 0.1 },
    { offset: [0.3, 2.1] as [number, number], rotation: 0.05, z: 0.3 },
    { offset: [1.2, 1.7] as [number, number], rotation: 0.1, z: 0.1 },
    { offset: [1.8, 1.0] as [number, number], rotation: 0.2, z: 0.2 },
  ]
  // proj_N hero ↔ deck card N (same order, single source of truth).
  const projectFiles = journeyDeckProjects.map((p) => p.icon)
  const FACE_FILE = '/assets/daveno-bg.png'
  const centerInst = { offset: [0, 0] as [number, number], scale: 1, rotation: 0, z: 0 }

  type Slot = (typeof iconSlots)[number]

  const sampleFaceHero = (c: number) =>
    loadImageAndSample(resolveAssetPath(FACE_FILE), c, 3.2, {
      colorScale: true,
      keyBackground: { tolerance: 30 },
      weightByDarkness: true,
      zRelief: 0.3,
      instances: [centerInst],
    })

  const sampleFaceSlot = (c: number, slot: Slot) =>
    loadImageAndSample(resolveAssetPath(FACE_FILE), c, 0.5, {
      colorScale: true,
      keyBackground: { tolerance: 30 },
      weightByDarkness: true,
      instances: [{ offset: slot.offset, scale: 1, rotation: slot.rotation, z: slot.z }],
    })

  const sampleProjHero = (file: string, c: number) =>
    loadImageAndSample(resolveAssetPath(file), c, 3.2, {
      colorScale: true,
      instances: [centerInst],
    })

  const sampleProjSlot = (file: string, c: number, slot: Slot) =>
    loadImageAndSample(resolveAssetPath(file), c, 0.45, {
      colorScale: true,
      chatBubble: true,
      instances: [{ offset: slot.offset, scale: 1, rotation: slot.rotation, z: slot.z }],
    })

  // activeIndex === -1 → face is the hero (portrait); else projectFiles[activeIndex].
  const buildState = (stateName: MorphStateId, activeIndex: number) => {
    const heroIsFace = activeIndex === -1
    const heroPromise = heroIsFace
      ? sampleFaceHero(heroCount)
      : sampleProjHero(projectFiles[activeIndex], heroCount)

    const slotPromises = iconSlots.map((slot, j) => {
      const c = j === 4 ? lastSlotCount : slotCount
      // The hero vacated slot `activeIndex` → the face takes that slot.
      if (!heroIsFace && j === activeIndex) return sampleFaceSlot(c, slot)
      return sampleProjSlot(projectFiles[j], c, slot)
    })

    Promise.all([heroPromise, ...slotPromises]).then(results => {
      if (activeCount !== currentCount) return
      const positions = new Float32Array(activeCount * 3)
      const colors = new Float32Array(activeCount * 3)
      let floatOffset = 0
      for (const res of results) {
        positions.set(res.positions, floatOffset)
        colors.set(res.colors, floatOffset)
        floatOffset += res.positions.length
      }
      targets.positions[stateName] = positions
      targets.colors[stateName] = colors
      updateActiveBuffers(stateName)
    })
  }

  buildState('portrait', -1)
  buildState('proj_0', 0)
  buildState('proj_1', 1)
  buildState('proj_2', 2)
  buildState('proj_3', 3)
  buildState('proj_4', 4)
  buildState('proj_5', 5)
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
  if (!chapterId || chapterId === 'student') return []
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
  // Phones split the field into the half opposite the text already, so the rect
  // repulsion only domes the formation and flings stray particles to the edges.
  // Skip it — let each formation sit whole in its half.
  if (window.innerWidth < 768) {
    exclusionZones.value = []
    return
  }

  const activeIdx = store.activeChapterIndex
  const activeChapter = journeyChapters[activeIdx]

  // If we are in the prologue or epilogue (where we display large text mass particles),
  // we do not want text avoidance to distort the text particles.
  // Mobile exception: once the prologue morph is underway the name has
  // dissolved, and the incoming formation lands on top of the full-width hero
  // copy — protect it (no side column to slide to on phones).
  const prologueHoldsName =
    activeChapter?.id === 'prologue' &&
    (window.innerWidth >= 768 || store.morphT < 0.3)
  if (prologueHoldsName || activeChapter?.id === 'epilogue') {
    exclusionZones.value = []
    return
  }

  // Active + next chapter: incoming text is protected during cross-chapter morphs.
  const nextIdx = Math.min(activeIdx + 1, journeyChapters.length - 1)
  const rects = collectTextRects(activeChapter?.id)
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
    new BufferAttribute(targets.positions[morphFrom.value as MorphStateId].slice(), 3),
  )
  newGeometry.setAttribute(
    'aPositionTo',
    new BufferAttribute(targets.positions[morphTo.value as MorphStateId].slice(), 3),
  )
  newGeometry.setAttribute(
    'aBonsaiParent',
    new BufferAttribute(targets.bonsaiParents.slice(), 3),
  )
  newGeometry.setAttribute(
    'aColorFrom',
    new BufferAttribute(targets.colors[morphFrom.value as MorphStateId].slice(), 3),
  )
  newGeometry.setAttribute(
    'aColorTo',
    new BufferAttribute(targets.colors[morphTo.value as MorphStateId].slice(), 3),
  )

  const aIsHero = new Float32Array(newCount)
  const heroCount = Math.floor(newCount * FACE_HERO_FRACTION)
  for (let i = 0; i < newCount; i++) {
    aIsHero[i] = i < heroCount ? 1.0 : 0.0
  }
  newGeometry.setAttribute('aIsHero', new BufferAttribute(aIsHero, 1))

  const oldGeometry = points.value.geometry
  points.value.geometry = newGeometry
  oldGeometry.dispose()

  loadImages()
  updateExclusionZones()
}

function onResize(): void {
  store.setIsMobile(window.innerWidth < 768)
  uniforms.uOffsetScale.value.set(window.innerWidth < 768 ? 0 : 1, 1)
  uniforms.uFormationScale.value = formationScaleForViewport()
  const newCount = particleCountForViewport(window.innerWidth)
  if (newCount !== currentCount) {
    updateParticleCount(newCount)
  } else {
    updateExclusionZones()
  }
}

useEventListener(window, 'resize', onResize)

const mouseTarget = new Vector3(999, 999, 0)
let targetInteractState = 0
let explodeProgress = 0
let isExploding = false
const explodeDuration = 1.2 // seconds

function onPointerMove(event: PointerEvent): void {
  const ndcX = (event.clientX / window.innerWidth) * 2 - 1
  const ndcY = -((event.clientY / window.innerHeight) * 2 - 1)
  const aspect = window.innerWidth / window.innerHeight
  mouseTarget.set(ndcX * HALF_HEIGHT * aspect, ndcY * HALF_HEIGHT, 0)
}

function onPointerDown(): void {
  const activeIdx = store.activeChapterIndex
  if (activeIdx === 6) {
    isExploding = true
    explodeProgress = 0
    uniforms.uInteractPos.value.copy(mouseTarget)
  } else {
    targetInteractState = 1
    uniforms.uInteractPos.value.copy(mouseTarget)
  }
}

function onPointerUp(): void {
  const activeIdx = store.activeChapterIndex
  if (activeIdx !== 6) {
    targetInteractState = 0
  }
}

useEventListener(window, 'pointermove', onPointerMove as EventListener, { passive: true })
useEventListener(window, 'pointerdown', onPointerDown as EventListener, { passive: true })
useEventListener(window, 'pointerup', onPointerUp as EventListener, { passive: true })

let slowFrameCount = 0
// Last scrollProgress at which text-avoidance zones were recomputed — the sticky
// text rects move as you scroll, so the zones must follow (not just on resize).
let lastExclScroll = -1
const { onBeforeRender, stop, start } = useLoop()
let hasRenderedFirstFrame = false

function onVisibilityChange(): void {
  if (document.hidden) {
    stop()
  } else {
    start()
  }
}

useEventListener(document, 'visibilitychange', onVisibilityChange)

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
  if (isExploding) {
    explodeProgress += delta / explodeDuration
    if (explodeProgress >= 1) {
      explodeProgress = 0
      isExploding = false
      uniforms.uInteractState.value = 0
    } else {
      // Eased progress for punchy explosion and slow return: sin(t^0.4 * PI)
      const t = explodeProgress
      uniforms.uInteractState.value = Math.sin(Math.pow(t, 0.4) * Math.PI)
    }
  } else {
    uniforms.uInteractState.value += (targetInteractState - uniforms.uInteractState.value) * 0.1
  }

  const [fromX, fromY] = store.fieldOffsetFrom
  const [toX, toY] = store.fieldOffsetTo
  uniforms.uOffsetFrom.value.set(fromX, fromY)
  uniforms.uOffsetTo.value.set(toX, toY)

  // Re-read the chapter's text rects while scrolling so particles keep clearing
  // the copy as it slides past (~1vh of scroll between recomputes; idle = skip).
  if (Math.abs(store.scrollProgress - lastExclScroll) > 0.0005) {
    lastExclScroll = store.scrollProgress
    updateExclusionZones()
  }

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

  // Dim the field to 0 while the crisp face PNG resolves over the portrait hold
  // (projects chapter), then bring it back as the face breaks into particles.
  const targetOpacity = store.particleFieldOpacity
  uniforms.uOpacity.value = prefersReducedMotion.value
    ? targetOpacity
    : uniforms.uOpacity.value + (targetOpacity - uniforms.uOpacity.value) * 0.15
})

onMounted(() => {
  store.setIsMobile(window.innerWidth < 768)
  loadImages()

  // Wait slightly for DOM to settle and reveal-text to render before measuring text boxes
  setTimeout(updateExclusionZones, 200)

  document.fonts.ready.then(() => {
    // Desktop keeps the left bias (sits under the left text column); phones have
    // no side column, so centre the name and drop the right-edge clip.
    targets.positions.daveGonzales = createTextMass(currentCount, ['Dave Gonzales'], {
      fontPx: 115,
      align: window.innerWidth < 768 ? 'center' : 'left',
    })
    targets.positions.textMass = createTextMass(currentCount, 'DAVXLOPER', { fontPx: 115 })
    const currentGeometry = points.value.geometry
    const positionAttr = currentGeometry.getAttribute('position') as BufferAttribute
    const toAttr = currentGeometry.getAttribute('aPositionTo') as BufferAttribute
    
    if (store.morphFrom === 'daveGonzales' && positionAttr) {
      ;(positionAttr.array as Float32Array).set(targets.positions.daveGonzales)
      positionAttr.needsUpdate = true
    }
    if (store.morphTo === 'daveGonzales' && toAttr) {
      ;(toAttr.array as Float32Array).set(targets.positions.daveGonzales)
      toAttr.needsUpdate = true
    }
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
    if (positionAttr.count === targets.positions[from as MorphStateId].length / 3 &&
        toAttr.count === targets.positions[to as MorphStateId].length / 3) {
      ;(positionAttr.array as Float32Array).set(targets.positions[from as MorphStateId])
      ;(toAttr.array as Float32Array).set(targets.positions[to as MorphStateId])
      positionAttr.needsUpdate = true
      toAttr.needsUpdate = true
    }
  }

  if (colorFromAttr && colorToAttr) {
    if (colorFromAttr.count === targets.colors[from as MorphStateId].length / 3 &&
        colorToAttr.count === targets.colors[to as MorphStateId].length / 3) {
      ;(colorFromAttr.array as Float32Array).set(targets.colors[from as MorphStateId])
      ;(colorToAttr.array as Float32Array).set(targets.colors[to as MorphStateId])
      colorFromAttr.needsUpdate = true
      colorToAttr.needsUpdate = true
    }
  }

  // Update text zones for the new chapter
  setTimeout(updateExclusionZones, 50)
})

watch(() => store.activeChapterIndex, () => {
  setTimeout(updateExclusionZones, 50)
  // Reset interaction states to avoid carry-over
  isExploding = false
  explodeProgress = 0
  targetInteractState = 0
  uniforms.uInteractState.value = 0
})

watch(() => store.scrollProgress, () => {
  updateExclusionZones()
})
</script>

<template>
  <primitive :object="points" />
</template>
