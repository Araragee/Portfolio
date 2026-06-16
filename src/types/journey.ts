/**
 * Types for "The Long Way Around" — scrollytelling journey.
 * See docs/CONCEPT.md for the full design rationale.
 */

/** Particle formation the field can morph into. One per chapter (plus optional in-chapter stages). */
export type MorphStateId =
  | 'scatter'
  | 'daveGonzales'
  | 'bonsai'
  | 'peso'
  | 'archipelago'
  | 'sdgBars'
  | 'sdgGroupedBars'
  | 'sdgStackedBars'
  | 'phMap'
  | 'cbmsLogo'
  | 'portrait'
  | 'proj_0'
  | 'proj_1'
  | 'proj_2'
  | 'proj_3'
  | 'proj_4'
  | 'proj_5'
  | 'textMass'

/** Allowed scroll-runway heights. Constrained so Tailwind classes stay static. */
export type ChapterHeightVh = number

/** Which side the DOM text column sits on (desktop). Field slides opposite. */
export type TextSide = 'left' | 'right' | 'center'

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
  /**
   * Optional in-chapter formations cycled after morphState; the chapter's
   * runway is split into equal segments and morphStart/morphEnd apply
   * within each segment. Entry formation stays morphState.
   */
  extraStages?: MorphStateId[]
  /** Story copy. Used when stageParagraphs is absent. */
  paragraphs: string[]
  /**
   * Per-stage copy. stageParagraphs[k] is shown while stage k is active.
   * Chapters with extraStages switch by morph-stage index; chapters without
   * switch by scroll-progress bands (equal division).
   */
  stageParagraphs?: string[][]
  /** Mono label describing the chapter interaction, e.g. 'hover branch → extends'. */
  interactionHint: string
  /** Fraction of runway where morph begins (e.g. 0.55) */
  morphStart: number
  /** Fraction of runway where morph ends (e.g. 0.95) */
  morphEnd: number
  /** Camera Z position for this chapter */
  cameraZ: number
  /** Text column side; the particle field offsets to the opposite side. */
  textSide: TextSide
  /** Explicit field offset [x, y] in world units — overrides textSide derivation. */
  fieldOffset?: [number, number]
  /** Layout variant: 'hero' renders the prologue name treatment. */
  layout?: 'hero'
  /** Continuation of the previous chapter — hides the index/era/title block. */
  isContinuation?: boolean
  /** Render the projects list inside this chapter's text column. */
  showProjects?: boolean
  /** Mono stat callout rendered in the text column. */
  stat?: { value: string; label: string }
}

/** Precomputed particle positions per morph state (count * 3 floats each). */
export type MorphTargetMap = Record<MorphStateId, Float32Array>
