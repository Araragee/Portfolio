import type { MorphStateId } from '@/types/journey'

const SPREAD_X = 4.5
const SPREAD_Y = 2.5

export type MorphTargetMap = Record<MorphStateId, Float32Array>
export type MorphColorMap = Record<MorphStateId, Float32Array>

export interface MorphTargets {
  positions: MorphTargetMap
  colors: MorphColorMap
  bonsaiParents: Float32Array
}

/** mulberry32 — tiny seeded PRNG, good enough for layout jitter. */
export function createRng(seed: number): () => number {
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

function createDefaultColor(count: number, r = 0.067, g = 0.067, b = 0.067): Float32Array {
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    out[i * 3] = r
    out[i * 3 + 1] = g
    out[i * 3 + 2] = b
  }
  return out
}

/** Organic curved Bonsai tree silhouette with foliage pads. */
export function createBonsai(count: number): { positions: Float32Array; parents: Float32Array } {
  const rng = createRng(42)
  const positions = new Float32Array(count * 3)
  const parents = new Float32Array(count * 3)
  
  // Winding trunk curve
  const trunkX = (y: number) => 0.5 * Math.sin(1.6 * y) - 0.2 * y
  
  const wTrunk = 0.2
  const wBranches = 0.3
  
  const nTrunk = Math.floor(count * wTrunk)
  const nBranches = Math.floor(count * wBranches)
  const nFoliage = count - nTrunk - nBranches
  
  let i = 0
  
  // 1. Trunk
  for (; i < nTrunk; i++) {
    const t = i / nTrunk
    const y = -2.3 + t * 2.5
    const x = trunkX(y)
    positions[i * 3] = x + (rng() - 0.5) * 0.08
    positions[i * 3 + 1] = y + (rng() - 0.5) * 0.08
    positions[i * 3 + 2] = (rng() - 0.5) * 0.15
    
    const prevY = -2.3 + Math.max(0, t - 0.1) * 2.5
    parents[i * 3] = trunkX(prevY)
    parents[i * 3 + 1] = prevY
    parents[i * 3 + 2] = 0
  }
  
  // 2. Main branches
  const branchStarts = [
    { y: -1.3, length: 1.4, angle: Math.PI * 0.85 }, // Low-left
    { y: -0.7, length: 1.2, angle: Math.PI * 0.15 }, // Low-right
    { y: -0.1, length: 1.1, angle: Math.PI * 0.8 },  // Mid-left
    { y: 0.3, length: 0.9, angle: Math.PI * 0.2 },   // Mid-right
    { y: 0.7, length: 0.75, angle: Math.PI * 0.5 }   // Top-center
  ]
  
  const branchCountPerStart = Math.floor(nBranches / branchStarts.length)
  for (let b = 0; b < branchStarts.length; b++) {
    const bs = branchStarts[b]
    const startX = trunkX(bs.y)
    const startY = bs.y
    
    for (let k = 0; k < branchCountPerStart && i < nBranches + nTrunk; k++, i++) {
      const t = k / branchCountPerStart
      const len = bs.length * (0.85 + rng() * 0.3)
      const angle = bs.angle + (rng() - 0.5) * 0.2
      
      const x = startX + Math.cos(angle) * len * t
      const y = startY + Math.sin(angle) * len * t - (1 - t) * t * 0.15
      
      positions[i * 3] = x + (rng() - 0.5) * 0.05
      positions[i * 3 + 1] = y + (rng() - 0.5) * 0.05
      positions[i * 3 + 2] = (rng() - 0.5) * 0.1
      
      const prevT = Math.max(0, t - 0.1)
      parents[i * 3] = startX + Math.cos(angle) * len * prevT
      parents[i * 3 + 1] = startY + Math.sin(angle) * len * prevT
      parents[i * 3 + 2] = 0
    }
  }
  
  // 3. Foliage Pads
  const leafCountPerStart = Math.floor(nFoliage / branchStarts.length)
  for (let b = 0; b < branchStarts.length; b++) {
    const bs = branchStarts[b]
    const startX = trunkX(bs.y)
    const startY = bs.y
    const len = bs.length
    const angle = bs.angle
    
    const tipX = startX + Math.cos(angle) * len
    const tipY = startY + Math.sin(angle) * len
    
    for (let k = 0; k < leafCountPerStart && i < count; k++, i++) {
      const theta = rng() * Math.PI * 2
      const radius = Math.pow(rng(), 0.75) * 0.65
      const px = tipX + Math.cos(theta) * radius
      const py = tipY + Math.sin(theta) * radius * 0.55 + 0.08
      const pz = (rng() - 0.5) * 0.35
      
      positions[i * 3] = px
      positions[i * 3 + 1] = py
      positions[i * 3 + 2] = pz
      
      parents[i * 3] = tipX
      parents[i * 3 + 1] = tipY
      parents[i * 3 + 2] = 0
    }
  }
  
  while (i < count) {
    positions[i * 3] = 0
    positions[i * 3 + 1] = 0.5
    positions[i * 3 + 2] = 0
    parents[i * 3] = 0
    parents[i * 3 + 1] = 0.5
    parents[i * 3 + 2] = 0
    i++
  }
  
  return { positions, parents }
}

/** Flat pixel grid fallback. */
function createGridFallback(count: number): Float32Array {
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

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return [r, g, b]
}

function sampleRoundedBox(rng: () => number, w: number, h: number, r: number): [number, number] {
  while (true) {
    const x = (rng() - 0.5) * w
    const y = (rng() - 0.5) * h
    const borderX = w / 2 - r
    const borderY = h / 2 - r
    if (Math.abs(x) > borderX && Math.abs(y) > borderY) {
      const dx = Math.abs(x) - borderX
      const dy = Math.abs(y) - borderY
      if (dx * dx + dy * dy > r * r) {
        continue
      }
    }
    return [x, y]
  }
}

export function createSdgBentoGrid(count: number): { positions: Float32Array; colors: Float32Array } {
  const rng = createRng(777)
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  
  const numSdgs = 17
  const countPerSdg = Math.floor(count / numSdgs)
  
  const SDG_COLORS = [
    '#EA1D2D', // SDG 1
    '#D19F2A', // SDG 2
    '#2D9A47', // SDG 3
    '#C22033', // SDG 4
    '#EF412A', // SDG 5
    '#00ADD8', // SDG 6
    '#FDB714', // SDG 7
    '#8F1838', // SDG 8
    '#F36E24', // SDG 9
    '#E01A83', // SDG 10
    '#F99D25', // SDG 11
    '#CD8B2A', // SDG 12
    '#48773C', // SDG 13
    '#007DBB', // SDG 14
    '#40AE49', // SDG 15
    '#00558A', // SDG 16
    '#1A3668'  // SDG 17
  ]
  
  // Grid parameters: 5 columns, 4 rows
  const cols = 5
  const colWidth = 0.72
  const rowHeight = 0.60
  
  const boxW = 0.58
  const boxH = 0.46
  const boxR = 0.1
  
  let globalIdx = 0
  for (let g = 0; g < numSdgs; g++) {
    const colorHex = SDG_COLORS[g]
    const [cr, cg, cb] = hexToRgb(colorHex)
    
    const row = Math.floor(g / cols)
    const col = g % cols
    
    // Center the last row (2 items)
    let offsetX = 0
    if (row === 3) {
      offsetX = 1.5 * colWidth
    }
    
    // Center grid in local coordinates
    const gridX = (col - 2.0) * colWidth + offsetX
    const gridY = (1.5 - row) * rowHeight
    
    for (let p = 0; p < countPerSdg; p++) {
      const [bx, by] = sampleRoundedBox(rng, boxW, boxH, boxR)
      
      positions[globalIdx * 3] = gridX + bx
      positions[globalIdx * 3 + 1] = gridY + by
      positions[globalIdx * 3 + 2] = (rng() - 0.5) * 0.05
      
      colors[globalIdx * 3] = cr
      colors[globalIdx * 3 + 1] = cg
      colors[globalIdx * 3 + 2] = cb
      
      globalIdx++
    }
  }
  
  // Hide remainder particles
  while (globalIdx < count) {
    positions[globalIdx * 3] = 999
    positions[globalIdx * 3 + 1] = 999
    positions[globalIdx * 3 + 2] = 0
    
    colors[globalIdx * 3] = 0
    colors[globalIdx * 3 + 1] = 0
    colors[globalIdx * 3 + 2] = 0
    
    globalIdx++
  }
  
  return { positions, colors }
}

/** CBMS portal ECharts series palette (see cbmsportal dashboards). */
const CHART_SERIES_COLORS = ['#35978F', '#DFC27D', '#FBC800', '#DE786A', '#990000', '#4b9ed1', '#DB8D31']

interface BarSpec {
  cx: number
  cy: number
  w: number
  h: number
  color: [number, number, number]
}

/** Fill bars with area-proportional particle quotas plus a thin baseline axis strip. */
function fillBarSet(
  rng: () => number,
  bars: BarSpec[],
  count: number,
  axisShare = 0.04,
  axisY = -1.32,
  cornerR = 0.02,
): { positions: Float32Array; colors: Float32Array } {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  let minX = Infinity
  let maxX = -Infinity
  let totalArea = 0
  for (const bar of bars) {
    minX = Math.min(minX, bar.cx - bar.w / 2)
    maxX = Math.max(maxX, bar.cx + bar.w / 2)
    totalArea += bar.w * bar.h
  }

  const nAxis = Math.floor(count * axisShare)
  let idx = 0
  for (; idx < nAxis; idx++) {
    positions[idx * 3] = minX - 0.1 + rng() * (maxX - minX + 0.2)
    positions[idx * 3 + 1] = axisY + (rng() - 0.5) * 0.03
    positions[idx * 3 + 2] = (rng() - 0.5) * 0.05
    colors[idx * 3] = 0.067
    colors[idx * 3 + 1] = 0.067
    colors[idx * 3 + 2] = 0.067
  }

  const nBars = count - nAxis
  for (let b = 0; b < bars.length; b++) {
    const bar = bars[b]
    // Last bar absorbs the rounding remainder so the total stays exact.
    const quota =
      b === bars.length - 1 ? count - idx : Math.floor((nBars * bar.w * bar.h) / totalArea)
    const r = Math.min(cornerR, bar.w / 2, bar.h / 2)
    for (let p = 0; p < quota && idx < count; p++, idx++) {
      const [bx, by] = sampleRoundedBox(rng, bar.w, bar.h, r)
      positions[idx * 3] = bar.cx + bx
      positions[idx * 3 + 1] = bar.cy + by
      positions[idx * 3 + 2] = (rng() - 0.5) * 0.05
      colors[idx * 3] = bar.color[0]
      colors[idx * 3 + 1] = bar.color[1]
      colors[idx * 3 + 2] = bar.color[2]
    }
  }
  return { positions, colors }
}

/** Plain teal bar chart — 10 bars, echoes the portal's indicator charts. */
function createSdgBarChart(count: number): { positions: Float32Array; colors: Float32Array } {
  const rng = createRng(778)
  const teal = hexToRgb('#35978F')
  const pcts = [75, 69, 67, 60, 58, 58, 51, 50, 49, 42]
  const bars: BarSpec[] = pcts.map((pct, i) => {
    const h = pct * 0.032
    return { cx: -1.71 + 0.38 * i, cy: -1.3 + h / 2, w: 0.26, h, color: teal }
  })
  return fillBarSet(rng, bars, count)
}

/** Grouped bar chart — 6 groups × 7 series, portal series palette. */
function createSdgGroupedBar(count: number): { positions: Float32Array; colors: Float32Array } {
  const rng = createRng(779)
  const palette = CHART_SERIES_COLORS.map(hexToRgb)
  const bars: BarSpec[] = []
  for (let g = 0; g < 6; g++) {
    const xg = -1.9 + 0.6333 * (g + 0.5)
    for (let s = 0; s < 7; s++) {
      const pct = 8 + rng() * 30
      const h = pct * 0.052
      bars.push({ cx: xg + (s - 3) * 0.082, cy: -1.3 + h / 2, w: 0.07, h, color: palette[s] })
    }
  }
  return fillBarSet(rng, bars, count)
}

/** 100% stacked bar chart — 6 columns × 6 segments summing to 100. */
function createSdgStackedBar(count: number): { positions: Float32Array; colors: Float32Array } {
  const rng = createRng(780)
  const palette = CHART_SERIES_COLORS.slice(0, 6).map(hexToRgb)
  const bars: BarSpec[] = []
  for (let c = 0; c < 6; c++) {
    const cx = -1.9 + 0.6333 * (c + 0.5)
    const weights = Array.from({ length: 6 }, () => rng())
    const sum = weights.reduce((a, b) => a + b, 0)
    let cum = 0
    for (let s = 0; s < 6; s++) {
      const pct = 6 + (64 * weights[s]) / sum // ≥6% each, column sums to 100
      const y0 = -1.2 + cum * 0.024
      bars.push({
        cx,
        cy: y0 + (pct * 0.024) / 2,
        w: 0.42,
        h: pct * 0.024 - 0.015, // shave an inter-segment gap, ECharts look
        color: palette[s],
      })
      cum += pct
    }
  }
  return fillBarSet(rng, bars, count, 0.04, -1.22, 0.012)
}

/** Philippines as elliptical island point-clusters with a choropleth teal ramp. */
function createPhMap(count: number): { positions: Float32Array; colors: Float32Array } {
  const rng = createRng(781)
  // Portal choropleth ramp, light end darkened to read on the #F9F9F8 bg.
  const ramp = ['#8FCFCF', '#5FBBB5', '#35978F', '#1A837E', '#006E6F'].map(hexToRgb)
  // [cx, cy, r, ex, ey, rot, weight]
  const islands: [number, number, number, number, number, number, number][] = [
    [-0.55, 1.8, 0.55, 0.8, 1.1, 0, 0.22], // North Luzon
    [-0.35, 1.0, 0.48, 0.85, 1.05, 0, 0.16], // Central Luzon
    [0.2, 0.4, 0.35, 0.9, 1.0, 0, 0.08], // Bicol / Samar
    [0.15, -0.35, 0.5, 1.05, 0.85, 0, 0.16], // Visayas
    [-1.1, -0.3, 0.32, 0.55, 1.4, -0.6, 0.06], // Palawan
    [-0.2, -1.4, 0.35, 1.1, 0.75, 0, 0.07], // Zamboanga peninsula
    [0.7, -1.4, 0.68, 1.0, 0.9, 0, 0.25], // Mindanao
  ]

  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  let idx = 0
  for (let n = 0; n < islands.length; n++) {
    const [cx, cy, r, ex, ey, rot, weight] = islands[n]
    const [cr, cg, cb] = ramp[Math.floor(rng() * ramp.length)]
    // Last island absorbs the rounding remainder so the total stays exact.
    const quota = n === islands.length - 1 ? count - idx : Math.round(weight * count)
    const cosR = Math.cos(rot)
    const sinR = Math.sin(rot)
    for (let p = 0; p < quota && idx < count; p++, idx++) {
      const theta = rng() * Math.PI * 2
      const rad = Math.sqrt(rng()) * r
      const lx = Math.cos(theta) * rad * ex
      const ly = Math.sin(theta) * rad * ey
      positions[idx * 3] = cx + lx * cosR - ly * sinR
      positions[idx * 3 + 1] = cy + lx * sinR + ly * cosR
      positions[idx * 3 + 2] = (rng() - 0.5) * 0.15
      colors[idx * 3] = cr
      colors[idx * 3 + 1] = cg
      colors[idx * 3 + 2] = cb
    }
  }
  return { positions, colors }
}

/** Tilted ring with a dense core — the abstract project artifact fallback. */
function createArtifactFallback(count: number): Float32Array {
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
export function createTextMass(count: number, text: string | string[], options: { fontPx?: number, yOffset?: number, maxWidth?: number } = {}): Float32Array {
  const rng = createRng(6)
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (!ctx) return createScatter(count)

  ctx.fillStyle = '#000'
  const fontPx = options.fontPx ?? 115
  ctx.font = `700 ${fontPx}px "Space Grotesk", sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  const lines = Array.isArray(text) ? text : [text]
  const lineHeight = fontPx * 1.1
  const totalHeight = lines.length * lineHeight
  let startY = canvas.height / 2 - totalHeight / 2 + lineHeight / 2
  
  for (const line of lines) {
    ctx.fillText(line, canvas.width / 2, startY)
    startY += lineHeight
  }

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
  const filled: number[] = []
  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      if (data[(y * canvas.width + x) * 4 + 3] > 128) filled.push(x, y)
    }
  }
  if (filled.length === 0) return createScatter(count)

  // Clamp word width to the camera frustum (z=8, fov 45°) so the text fits
  // narrow viewports instead of clipping off both edges.
  const frustumWidth =
    2 * Math.tan(Math.PI / 8) * 8 * (window.innerWidth / window.innerHeight)
  const fitScale = Math.min(1, (frustumWidth * 0.92) / 9.0)

  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const p = Math.floor(rng() * (filled.length / 2)) * 2
    const px = filled[p]
    const py = filled[p + 1]
    out[i * 3] = (px / canvas.width - 0.5) * 9.0 * fitScale + (rng() - 0.5) * 0.05
    out[i * 3 + 1] = (0.5 - py / canvas.height) * 4.4 * fitScale + (rng() - 0.5) * 0.05
    out[i * 3 + 2] = (rng() - 0.5) * 0.2
  }
  return out
}

const imageCache = new Map<string, HTMLImageElement>()

/** One replicated copy of a sampled image formation. */
export interface ImageInstance {
  /** World-space center of this copy. */
  offset: [number, number]
  /** Multiplier on the base sample scale. */
  scale: number
  /** Z-rotation in radians. */
  rotation: number
  /** Depth layer for parallax. */
  z: number
}

export interface ImageSampleOptions {
  /** Take particle colors from the image instead of the default ink. */
  colorScale?: boolean
  /** Drop pixels whose luminance is >= this (0–255). */
  maxBrightness?: number
  /** Drop pixels within RGB distance `tolerance` of the averaged corner color. */
  keyBackground?: { tolerance: number }
  /** Darker pixels get a higher pick probability (legible faces/ink). */
  weightByDarkness?: boolean
  /** Max |z| offset derived from luminance; darker = toward camera. */
  zRelief?: number
  /** Replicate the formation N times; `count` is split across instances. */
  instances?: ImageInstance[]
  /** Rasterization cap for the sampling canvas. */
  maxDim?: number
  /** Seed for the sampling PRNG. */
  seed?: number
}

interface SampledPoint {
  x: number
  y: number
  r: number
  g: number
  b: number
  lum: number
}

/**
 * Bills for the "First paid pixels" chapter — hand-placed so the cluster sits
 * left of center (the chapter's +2.1 field offset pushes it right of the text).
 * Bill world-width ≈ 2.35 × scale; z spread gives parallax under camera drift.
 */
export const PESO_BILL_INSTANCES: ImageInstance[] = [
  { offset: [-2.6, 1.5], scale: 1.05, rotation: 0.3, z: -0.45 },
  { offset: [0.2, 1.8], scale: 0.9, rotation: -0.22, z: -0.25 },
  { offset: [-3.0, -0.2], scale: 1.2, rotation: -0.38, z: 0.1 },
  { offset: [0.6, 0.1], scale: 1.35, rotation: 0.12, z: 0.35 },
  { offset: [-1.2, -1.6], scale: 1.0, rotation: 0.42, z: -0.1 },
  { offset: [1.4, -1.4], scale: 0.85, rotation: -0.3, z: 0.2 },
  { offset: [-1.4, 0.6], scale: 0.95, rotation: 0.18, z: 0.5 },
]

/** Load an image and extract particle coordinates + colors asynchronously in browser. */
export function loadImageAndSample(
  src: string,
  count: number,
  scale: number,
  options: ImageSampleOptions = {}
): Promise<{ positions: Float32Array; colors: Float32Array }> {
  return new Promise((resolve) => {
    const sample = (img: HTMLImageElement) => {
      const canvas = document.createElement('canvas')
      const maxDim = options.maxDim ?? 128
      let w = img.width
      let h = img.height
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w)
          w = maxDim
        } else {
          w = Math.round((w * maxDim) / h)
          h = maxDim
        }
      }
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve({
          positions: createScatter(count),
          colors: createDefaultColor(count)
        })
        return
      }
      ctx.drawImage(img, 0, 0, w, h)
      const data = ctx.getImageData(0, 0, w, h).data

      // Average opaque corner pixels for background keying.
      let bgR = 0
      let bgG = 0
      let bgB = 0
      if (options.keyBackground) {
        const corners = [0, (w - 1) * 4, (h - 1) * w * 4, ((h - 1) * w + w - 1) * 4]
        let n = 0
        for (const idx of corners) {
          if (data[idx + 3] > 40) {
            bgR += data[idx]
            bgG += data[idx + 1]
            bgB += data[idx + 2]
            n++
          }
        }
        if (n > 0) {
          bgR /= n
          bgG /= n
          bgB /= n
        }
      }

      const points: SampledPoint[] = []

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4
          const r = data[idx]
          const g = data[idx + 1]
          const b = data[idx + 2]
          const a = data[idx + 3]
          if (a <= 40) continue
          const lum = (r * 299 + g * 587 + b * 114) / 1000
          if (options.maxBrightness !== undefined && lum >= options.maxBrightness) continue
          if (options.keyBackground) {
            const dr = r - bgR
            const dg = g - bgG
            const db = b - bgB
            if (Math.sqrt(dr * dr + dg * dg + db * db) < options.keyBackground.tolerance) continue
          }
          points.push({ x, y, r, g, b, lum })
        }
      }

      if (points.length === 0) {
        resolve({
          positions: createScatter(count),
          colors: createDefaultColor(count)
        })
        return
      }

      // Optional darkness-weighted pick via prefix sums + binary search.
      let prefix: Float64Array | null = null
      if (options.weightByDarkness) {
        prefix = new Float64Array(points.length)
        let total = 0
        for (let i = 0; i < points.length; i++) {
          total += Math.pow((255 - points[i].lum) / 255, 1.5)
          prefix[i] = total
        }
      }
      const pickPoint = (rng: () => number): SampledPoint => {
        if (!prefix) return points[Math.floor(rng() * points.length)]
        const target = rng() * prefix[prefix.length - 1]
        let lo = 0
        let hi = prefix.length - 1
        while (lo < hi) {
          const mid = (lo + hi) >> 1
          if (prefix[mid] < target) lo = mid + 1
          else hi = mid
        }
        return points[lo]
      }

      const positions = new Float32Array(count * 3)
      const colors = new Float32Array(count * 3)
      const rng = createRng(options.seed ?? 123)
      const aspect = w / h
      const zRelief = options.zRelief ?? 0

      // Single implicit instance preserves the original one-copy behavior.
      const instances: ImageInstance[] = options.instances ?? [
        { offset: [0, 0], scale: 1, rotation: 0, z: 0 },
      ]
      const per = Math.floor(count / instances.length)

      for (let i = 0; i < count; i++) {
        // Remainder particles fold into the last instance so the total stays exact.
        const inst = instances[Math.min(Math.floor(i / per), instances.length - 1)]
        const pt = pickPoint(rng)
        const nx = (pt.x / w - 0.5) * aspect
        const ny = 0.5 - pt.y / h

        const s = scale * inst.scale
        const c = Math.cos(inst.rotation)
        const sn = Math.sin(inst.rotation)
        const rx = nx * s
        const ry = ny * s

        positions[i * 3] = rx * c - ry * sn + inst.offset[0] + (rng() - 0.5) * 0.02
        positions[i * 3 + 1] = rx * sn + ry * c + inst.offset[1] + (rng() - 0.5) * 0.02
        positions[i * 3 + 2] =
          inst.z + (rng() - 0.5) * 0.05 + zRelief * (0.5 - pt.lum / 255) * 2

        if (options.colorScale) {
          colors[i * 3] = pt.r / 255
          colors[i * 3 + 1] = pt.g / 255
          colors[i * 3 + 2] = pt.b / 255
        } else {
          colors[i * 3] = 0.067
          colors[i * 3 + 1] = 0.067
          colors[i * 3 + 2] = 0.067
        }
      }
      resolve({ positions, colors })
    }

    if (imageCache.has(src)) {
      sample(imageCache.get(src)!)
      return
    }

    const img = new Image()
    img.src = src
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      imageCache.set(src, img)
      sample(img)
    }
    img.onerror = () => {
      resolve({
        positions: createScatter(count),
        colors: createDefaultColor(count)
      })
    }
  })
}

/** Build every morph state at the same particle count. Call once, client-side. */
export function buildMorphTargets(count: number): MorphTargets {
  const defaultCol = createDefaultColor(count)
  
  const { positions: bonsaiPos, parents: bonsaiParents } = createBonsai(count)
  const { positions: sdgPos, colors: sdgCol } = createSdgBentoGrid(count)
  const { positions: sdgBarsPos, colors: sdgBarsCol } = createSdgBarChart(count)
  const { positions: sdgGroupPos, colors: sdgGroupCol } = createSdgGroupedBar(count)
  const { positions: sdgStackPos, colors: sdgStackCol } = createSdgStackedBar(count)
  const { positions: phMapPos, colors: phMapCol } = createPhMap(count)

  const positions: MorphTargetMap = {
    scatter: createScatter(count),
    bonsai: bonsaiPos,
    peso: createGridFallback(count), // Temp grid before image load
    archipelago: sdgPos,
    sdgBars: sdgBarsPos,
    sdgGroupedBars: sdgGroupPos,
    sdgStackedBars: sdgStackPos,
    phMap: phMapPos,
    cbmsLogo: createGridFallback(count), // Temp grid before image load
    portrait: createArtifactFallback(count), // Temp artifact before image load
    textMass: createTextMass(count, 'DAVXLOPER'),
  }

  const colors: MorphColorMap = {
    scatter: defaultCol,
    bonsai: createDefaultColor(count, 0.067, 0.12, 0.067), // Dark green hue for bonsai branches/leaves
    peso: defaultCol,
    archipelago: sdgCol,
    sdgBars: sdgBarsCol,
    sdgGroupedBars: sdgGroupCol,
    sdgStackedBars: sdgStackCol,
    phMap: phMapCol,
    cbmsLogo: defaultCol,
    portrait: defaultCol,
    textMass: defaultCol,
  }

  return {
    positions,
    colors,
    bonsaiParents
  }
}

/** Particle count by viewport — keep mobile GPUs comfortable. */
export function particleCountForViewport(width: number): number {
  return width < 768 ? 7000 : 16000
}

export const MORPH_STATE_IDS: MorphStateId[] = [
  'scatter',
  'bonsai',
  'peso',
  'archipelago',
  'sdgBars',
  'sdgGroupedBars',
  'sdgStackedBars',
  'phMap',
  'cbmsLogo',
  'portrait',
  'textMass',
]
