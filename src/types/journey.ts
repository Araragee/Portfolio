/**
 * Types for "The Long Way Around" — scrollytelling journey.
 * See docs/CONCEPT.md for the full design rationale.
 */

/** Particle formation the field can morph into. One per chapter. */
export type MorphStateId =
  | 'scatter'
  | 'tree'
  | 'grid'
  | 'archipelago'
  | 'psaLogo'
  | 'artifact'
  | 'textMass'

/** Allowed scroll-runway heights. Constrained so Tailwind classes stay static. */
export type ChapterHeightVh = 150 | 200 | 300

export interface JourneyChapter {
  /** Stable id, used as v-for key and anchor. */
  id: string
  /** Display index, e.g. '000'. */
  index: string
  title: string
  /** Time/place label, e.g. 'PSA, 2023 — now'. */
  era: string
  /** Scroll runway height in vh. */
  heightVh: ChapterHeightVh
  /** Particle formation this chapter holds. */
  morphState: MorphStateId
  /** Story copy. Draft until Phase 4 (copy polish). */
  paragraphs: string[]
  /** Mono label describing the chapter interaction, e.g. 'hover branch → extends'. */
  interactionHint: string
  /** Fraction of runway where morph begins (e.g. 0.1) */
  morphStart: number
  /** Fraction of runway where morph ends (e.g. 0.5) */
  morphEnd: number
  /** Camera Z position for this chapter */
  cameraZ: number
}

/** Precomputed particle positions per morph state (count * 3 floats each). */
export type MorphTargetMap = Record<MorphStateId, Float32Array>
