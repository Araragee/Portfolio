import type { JourneyChapter } from '@/types/journey'

/**
 * Chapter content for "The Long Way Around".
 * Source of truth for the story: src/data/personalData.ts.
 *
 * Pacing (docs/TWEAKS/D-pacing.md): chapters hold their own formation through
 * the first 55% of the runway, then morph to the next across 55–95%.
 * Sides alternate so the field always slides opposite the text
 * (docs/TWEAKS/A-field-offset.md).
 */
export const journeyChapters: JourneyChapter[] = [
  {
    id: 'prologue',
    index: '000',
    title: 'The long way around',
    era: 'Prologue',
    heightVh: 200,
    morphState: 'scatter',
    paragraphs: [
      'I came into software the long way around.',
      'Dave Gonzales. Frontend engineer. I build interfaces for the data of 110 million people.',
    ],
    interactionHint: 'move cursor — the field gives way',
    morphStart: 0.55,
    morphEnd: 0.95,
    cameraZ: 8,
    textSide: 'left',
    layout: 'hero',
  },
  {
    id: 'student',
    index: '001',
    title: 'Recursion at 2am',
    era: 'CS student',
    heightVh: 200,
    morphState: 'bonsai',
    paragraphs: [
      'School gave me the vocabulary, but not the fluency. Lectures, theory, late-night study groups trying to make sense of recursion at 2 AM.',
      'Fluency came from building. Small projects, broken projects, projects that never shipped — static pages, then jQuery, then Vue.',
    ],
    interactionHint: 'hover the branches — watch them sway and extend',
    morphStart: 0.55,
    morphEnd: 0.95,
    cameraZ: 8,
    textSide: 'right',
  },
  {
    id: 'internship',
    index: '002',
    title: 'First paid pixels',
    era: 'iPhitech, Clark — Mar–May 2023',
    heightVh: 200,
    morphState: 'peso',
    paragraphs: [
      'A 3-month web-design internship was the first time I got paid to care about pixels.',
      'Wireframes, layouts, the discipline of shipping something a client actually sees.',
    ],
    interactionHint: 'drag the bill — particles ripple and wave',
    morphStart: 0.55,
    morphEnd: 0.95,
    cameraZ: 8,
    textSide: 'left',
  },
  {
    id: 'psa-map',
    index: '003',
    title: 'The portal',
    era: 'Philippine Statistics Authority, Oct 2023 — now',
    heightVh: 300,
    morphState: 'archipelago',
    paragraphs: [
      'By October 2023 I landed at the Philippine Statistics Authority, building the CBMS Portal — community-based monitoring data for the whole country.',
    ],
    interactionHint: 'hover a goal — watch the particles lift',
    morphStart: 0.55,
    morphEnd: 0.95,
    cameraZ: 7.2,
    textSide: 'right',
    stat: { value: '110M+', label: "Citizens' Data Handled" },
  },
  {
    id: 'psa-logo',
    index: '003',
    title: 'The portal',
    era: 'Philippine Statistics Authority, Oct 2023 — now',
    heightVh: 200,
    morphState: 'cbmsLogo',
    paragraphs: [
      'Vue 3, TypeScript, ECharts. Real scale government systems.',
      'I built the thing, and became the developer I wanted to be along the way.',
    ],
    interactionHint: 'scrub to see the CBMS logo rotate',
    morphStart: 0.55,
    morphEnd: 0.95,
    cameraZ: 7.2,
    textSide: 'left',
    isContinuation: true,
    stat: { value: 'Solid', label: 'Responsive. World-Class.' },
  },
  {
    id: 'projects',
    index: '004',
    title: 'Side quests',
    era: 'Freelance + personal projects',
    heightVh: 200,
    morphState: 'portrait',
    paragraphs: [
      'Off the clock the building continues — freelance Vue work, experiments, this site.',
      'Each project is a station on the road. Step into one to see the case study.',
    ],
    interactionHint: 'hover to see a 3D portrait form',
    // Late window keeps DAVXLOPER from forming over this chapter's text
    morphStart: 0.75,
    morphEnd: 0.98,
    cameraZ: 8,
    textSide: 'left',
    showProjects: true,
  },
  {
    id: 'epilogue',
    index: '005',
    title: 'End of the road',
    era: 'Epilogue',
    heightVh: 200,
    morphState: 'textMass',
    paragraphs: [
      'Everything you scrolled past collapses into one word.',
      'Have a project, a role, or an argument about frame rates? I read every message.',
    ],
    interactionHint: 'click the name — it explodes, then reforms',
    morphStart: 0.3,
    morphEnd: 0.7,
    cameraZ: 8,
    textSide: 'center',
    fieldOffset: [0, -1.9],
  },
]

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
