import type { JourneyChapter } from '@/types/journey'

// Re-exports for backward compatibility
export { journeyChapters } from './journeyChapters'
export { ENTRANCE_VH, TRANSITION_VH } from '@/constants/journeyConstants'

/** World-unit x push that places the field opposite the text column. */
const FIELD_OFFSET_X = 2.1

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
