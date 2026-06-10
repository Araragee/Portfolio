import type { MorphStateId, MorphTargetMap } from '@/types/journey'

/**
 * Generates one Float32Array (count * 3) per morph state.
 * All states must use the SAME particle count so the shader can lerp 1:1.
 *
 * World space assumes the fixed journey camera (z = 8, fov 45):
 * visible area at z = 0 is roughly x ∈ [-5.5, 5.5], y ∈ [-3.3, 3.3] on desktop.
 * Keep formations inside x ±4.5, y ±2.5 to survive narrow viewports.
 *
 * Deterministic: seeded PRNG, so reloads render the same field.
 * NOTE: 'archipelago' is a placeholder (gaussian island clusters) until
 * Phase 6 swaps in real PH geo points.
 */

const SPREAD_X = 4.5
const SPREAD_Y = 2.5

/** mulberry32 — tiny seeded PRNG, good enough for layout jitter. */
function createRng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function createScatter(count: number): Float32Array {
  const rng = createRng(1)
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    out[i * 3] = (rng() * 2 - 1) * SPREAD_X
    out[i * 3 + 1] = (rng() * 2 - 1) * SPREAD_Y
    out[i * 3 + 2] = (rng() * 2 - 1) * 0.8
  }
  return out
}

interface Segment {
  x0: number
  y0: number
  x1: number
  y1: number
  length: number
}

/** Recursive binary tree silhouette, points distributed along branch segments. */
function createTree(count: number): Float32Array {
  const rng = createRng(2)
  const segments: Segment[] = []

  const grow = (x: number, y: number, angle: number, length: number, depth: number): void => {
    if (depth === 0 || length < 0.05) return
    const x1 = x + Math.cos(angle) * length
    const y1 = y + Math.sin(angle) * length
    segments.push({ x0: x, y0: y, x1, y1, length })
    const spread = 0.45 + rng() * 0.25
    grow(x1, y1, angle + spread, length * 0.72, depth - 1)
    grow(x1, y1, angle - spread, length * 0.72, depth - 1)
  }
  grow(0, -2.5, Math.PI / 2, 1.4, 8)

  const totalLength = segments.reduce((sum, s) => sum + s.length, 0)
  const out = new Float32Array(count * 3)
  let i = 0
  for (const s of segments) {
    const quota = Math.round((s.length / totalLength) * count)
    for (let k = 0; k < quota && i < count; k++, i++) {
      const t = rng()
      out[i * 3] = s.x0 + (s.x1 - s.x0) * t + (rng() - 0.5) * 0.04
      out[i * 3 + 1] = s.y0 + (s.y1 - s.y0) * t + (rng() - 0.5) * 0.04
      out[i * 3 + 2] = (rng() - 0.5) * 0.3
    }
  }
  // Fill rounding remainder onto random segments
  while (i < count) {
    const s = segments[Math.floor(rng() * segments.length)]
    const t = rng()
    out[i * 3] = s.x0 + (s.x1 - s.x0) * t
    out[i * 3 + 1] = s.y0 + (s.y1 - s.y0) * t
    out[i * 3 + 2] = (rng() - 0.5) * 0.3
    i++
  }
  return out
}

/** Flat pixel grid with a gentle z-wave — the wireframe era. */
function createGrid(count: number): Float32Array {
  const rng = createRng(3)
  const cols = Math.ceil(Math.sqrt(count * (SPREAD_X / SPREAD_Y)))
  const rows = Math.ceil(count / cols)
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const cx = i % cols
    const cy = Math.floor(i / cols)
    const x = (cx / (cols - 1)) * 2 * SPREAD_X - SPREAD_X
    const y = (cy / (rows - 1)) * 2 * SPREAD_Y - SPREAD_Y
    out[i * 3] = x + (rng() - 0.5) * 0.03
    out[i * 3 + 1] = y + (rng() - 0.5) * 0.03
    out[i * 3 + 2] = Math.sin(x * 1.2) * Math.cos(y * 1.2) * 0.25
  }
  return out
}

/** Detailed PH silhouette using dense bounding circles. */
function createArchipelago(count: number): Float32Array {
  const rng = createRng(4)
  const islands = [
    { x: -1.2, y: 1.8, r: 0.6, weight: 0.2 },   // North Luzon
    { x: -0.6, y: 1.0, r: 0.5, weight: 0.15 },  // Central Luzon
    { x: 0.0,  y: 0.4, r: 0.4, weight: 0.1 },   // Bicol / Samar
    { x: 0.0,  y: -0.2, r: 0.5, weight: 0.15 }, // Visayas
    { x: -1.4, y: 0.0, r: 0.3, weight: 0.05 },  // Palawan
    { x: 0.8,  y: -1.2, r: 0.8, weight: 0.3 },  // Mindanao
    { x: 0.1,  y: -1.5, r: 0.4, weight: 0.05 }, // Zamboanga pen
  ]
  const out = new Float32Array(count * 3)
  let i = 0
  for (const isle of islands) {
    const quota = Math.round(isle.weight * count)
    for (let k = 0; k < quota && i < count; k++, i++) {
      const angle = rng() * Math.PI * 2
      const radius = Math.pow(rng(), 0.5) * isle.r
      out[i * 3] = isle.x + Math.cos(angle) * radius
      out[i * 3 + 1] = isle.y + Math.sin(angle) * radius * 0.8
      out[i * 3 + 2] = (rng() - 0.5) * 0.15
    }
  }
  while (i < count) {
    out[i * 3] = (rng() * 2 - 1) * SPREAD_X
    out[i * 3 + 1] = (rng() * 2 - 1) * SPREAD_Y
    out[i * 3 + 2] = (rng() - 0.5) * 0.15
    i++
  }
  return out
}

/** 3D PSA Logo (Wireframe Globe + 3 Sweeping Arrows) */
function createPsaLogo(count: number): Float32Array {
  const rng = createRng(9)
  const out = new Float32Array(count * 3)
  
  const wGlobe = 0.6
  const globeCount = Math.floor(count * wGlobe)
  const arrowCount = count - globeCount
  
  let i = 0
  const R = 1.3
  
  // Globe Wireframe
  for (; i < globeCount; i++) {
    // 5 latitudes, 12 longitudes
    if (rng() > 0.5) {
      // Latitudes
      const latIndex = Math.floor(rng() * 5) - 2
      const phi = latIndex * (Math.PI / 6) // -pi/3 to pi/3
      const theta = rng() * Math.PI * 2
      
      out[i*3] = Math.cos(theta) * Math.cos(phi) * R + (rng()-0.5)*0.04
      out[i*3+1] = Math.sin(phi) * R + (rng()-0.5)*0.04
      out[i*3+2] = Math.sin(theta) * Math.cos(phi) * R + (rng()-0.5)*0.04
    } else {
      // Longitudes
      const lonIndex = Math.floor(rng() * 12)
      const theta = lonIndex * (Math.PI / 6)
      const phi = (rng() - 0.5) * Math.PI
      
      out[i*3] = Math.cos(theta) * Math.cos(phi) * R + (rng()-0.5)*0.04
      out[i*3+1] = Math.sin(phi) * R + (rng()-0.5)*0.04
      out[i*3+2] = Math.sin(theta) * Math.cos(phi) * R + (rng()-0.5)*0.04
    }
  }
  
  // 3 Sweeping Arrows
  const arrows = [
    { r: R + 0.5, start: Math.PI * 1.3, end: Math.PI * 0.6, width: 0.15 }, // Outer
    { r: R + 0.25, start: Math.PI * 1.2, end: Math.PI * 0.7, width: 0.12 }, // Middle
    { r: R + 0.0, start: Math.PI * 1.1, end: Math.PI * 0.8, width: 0.09 }, // Inner
  ]
  
  for (let k = 0; k < arrowCount; k++, i++) {
    const aIdx = Math.floor((k / arrowCount) * 3)
    const arrow = arrows[aIdx]
    
    let r = arrow.r + (rng()-0.5) * arrow.width
    let theta = arrow.start + rng() * (arrow.end - arrow.start)
    
    // Arrowhead (15% chance)
    if (rng() < 0.15) {
      const ht = rng()
      theta = arrow.end + ht * (-0.15)
      const headWidth = arrow.width * 3 * (1 - ht)
      r = arrow.r + (rng()-0.5) * headWidth
    }
    
    out[i*3] = Math.cos(theta) * r
    out[i*3+1] = Math.sin(theta) * r
    out[i*3+2] = Math.max(0.5, R) + (rng()-0.5)*0.1 // Place arrows on front hemisphere
  }
  
  return out
}

/** Tilted ring with a dense core — the abstract project artifact. */
function createArtifact(count: number): Float32Array {
  const rng = createRng(5)
  const out = new Float32Array(count * 3)
  const ringShare = Math.floor(count * 0.75)
  const tilt = 0.5
  for (let i = 0; i < ringShare; i++) {
    const angle = rng() * Math.PI * 2
    const radius = 2.2 + (rng() - 0.5) * 0.35
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius * 0.45
    out[i * 3] = x
    out[i * 3 + 1] = y * Math.cos(tilt) + 0.1
    out[i * 3 + 2] = y * Math.sin(tilt) + (rng() - 0.5) * 0.1
  }
  for (let i = ringShare; i < count; i++) {
    const angle = rng() * Math.PI * 2
    const radius = Math.pow(rng(), 2) * 0.7
    out[i * 3] = Math.cos(angle) * radius
    out[i * 3 + 1] = Math.sin(angle) * radius
    out[i * 3 + 2] = (rng() - 0.5) * 0.5
  }
  return out
}

/** Samples 2D canvas text into particle positions. Browser-only. */
export function createTextMass(count: number, text: string): Float32Array {
  const rng = createRng(6)
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  if (!ctx) return createScatter(count)

  ctx.fillStyle = '#000'
  ctx.font = '700 96px "Space Grotesk", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
  const filled: number[] = []
  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      if (data[(y * canvas.width + x) * 4 + 3] > 128) filled.push(x, y)
    }
  }
  if (filled.length === 0) return createScatter(count)

  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const p = Math.floor(rng() * (filled.length / 2)) * 2
    const px = filled[p]
    const py = filled[p + 1]
    out[i * 3] = (px / canvas.width - 0.5) * 7.5 + (rng() - 0.5) * 0.05
    out[i * 3 + 1] = (0.5 - py / canvas.height) * 1.9 + (rng() - 0.5) * 0.05
    out[i * 3 + 2] = (rng() - 0.5) * 0.2
  }
  return out
}

/** Build every morph state at the same particle count. Call once, client-side. */
export function buildMorphTargets(count: number): MorphTargetMap {
  return {
    scatter: createScatter(count),
    tree: createTree(count),
    grid: createGrid(count),
    archipelago: createArchipelago(count),
    psaLogo: createPsaLogo(count),
    artifact: createArtifact(count),
    textMass: createTextMass(count, 'TALK'),
  }
}

/** Particle count by viewport — keep mobile GPUs comfortable. */
export function particleCountForViewport(width: number): number {
  return width < 768 ? 7000 : 16000
}

export const MORPH_STATE_IDS: MorphStateId[] = [
  'scatter',
  'tree',
  'grid',
  'archipelago',
  'psaLogo',
  'artifact',
  'textMass',
]
