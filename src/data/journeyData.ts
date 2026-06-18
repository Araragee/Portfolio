import type { JourneyChapter } from '@/types/journey'

// Re-exports for backward compatibility
export { journeyChapters } from './journeyChapters'
export { ENTRANCE_VH, TRANSITION_VH } from '@/constants/journeyConstants'

/** World-unit x push that places the field opposite the text column. */
const FIELD_OFFSET_X = 2.1

/**
 * World-unit y push that lifts/drops the formation into one screen half on
 * phones. The matching text column is aligned to the opposite half in
 * ChapterSection, so the two never stack (the original mobile collision).
 */
export const MOBILE_FIELD_OFFSET_Y = 1.45

/**
 * On phones the field and text split into opposite halves, alternating per
 * chapter so neighbouring sections don't read the same way. `true` → the
 * particle formation takes the TOP half (text drops to the bottom); `false`
 * → particles sink to the BOTTOM (text rises to the top).
 *
 * The prologue (hero, index 0) opts out — its layout already reserves a band
 * for the name particles between the heading and the copy.
 */
export function mobileParticlesOnTop(chapterIndex: number): boolean {
  return chapterIndex % 2 === 0
}

/**
 * Field offset for a chapter: explicit override wins, otherwise derived from
 * textSide (text left → field right, etc.). Center = no offset.
 */
export function fieldOffsetFor(chapter: JourneyChapter): [number, number] {
  if (chapter.fieldOffset) return chapter.fieldOffset
  if (chapter.textSide === 'left') return [FIELD_OFFSET_X, 0]
  if (chapter.textSide === 'right') return [-FIELD_OFFSET_X, 0]
  return [0, 0]
}
