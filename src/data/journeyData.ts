import type { JourneyChapter } from '@/types/journey'

/**
 * Chapter content for "The Long Way Around".
 * Source of truth for the story: src/data/personalData.ts.
 *
 * Pacing: each section LOCKS (holds its formation + text) for most of the
 * runway, then runs a full transition to the next across a fixed TRANSITION_VH
 * window of scroll. Single-stage chapters place that window right after the
 * sticky text unpins; multi-stage chapters (e.g. psa-map) at each segment's end.
 * Per-chapter morphStart/morphEnd are no longer consulted — the window is
 * derived from TRANSITION_VH so every transition spans the same scroll distance.
 * Sides alternate so the field always slides opposite the text
 * (docs/TWEAKS/A-field-offset.md).
 */

/**
 * Scroll distance (vh) an INNER-stage morph spans (multi-stage chapters like
 * psa-map). Outside it the stage holds. Fixed so every inner morph feels equal.
 */
export const TRANSITION_VH = 56

/**
 * Scroll distance (vh) of each section's ENTRANCE: the window at the start of a
 * chapter's runway where its card fades in AND the field morphs the previous
 * formation into this one. The morph is timed here — not at the previous
 * section's exit — so shape and text arrive together. Card fade-in matches it.
 */
export const ENTRANCE_VH = 28

export const journeyChapters: JourneyChapter[] = [
  {
    id: 'prologue',
    index: '000',
    title: 'The long way around',
    era: 'Prologue',
    heightVh: 150,
    morphState: 'daveGonzales',
    paragraphs: [
      'I came into software the long way around.',
      'Dave Gonzales. Frontend developer. I build interfaces to turn unintersting things interesting.',
    ],
    interactionHint: 'move cursor — the name scatters',
    morphStart: 0.55,
    morphEnd: 0.95,
    cameraZ: 8,
    textSide: 'left',
    layout: 'hero',
    fieldOffset: [-0.8, 0.3],
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
    id: 'psa-logo',
    index: '003',
    title: 'The portal',
    era: 'Philippine Statistics Authority, Oct 2023 — now',
    heightVh: 200,
    morphState: 'cbmsLogo',
    paragraphs: [
      'Vue 3, TypeScript, ECharts. Real-scale government systems.',
      'I built the thing, and became the developer I wanted to be along the way.',
    ],
    stageParagraphs: [
      [
        'Vue 3, TypeScript, ECharts. Real-scale government systems.',
        'I built the thing, and became the developer I wanted to be along the way.',
      ],
      [
        'College gave me the theory — data structures, algorithms, design patterns. Applying that to a real system that had to actually work was a different problem entirely.',
        'My first capstone shipped before AI assistants existed. Every bug meant reading documentation, tracing source code, earning every fix the hard way. That friction became fluency.',
      ],
    ],
    interactionHint: 'move cursor — the logo ripples',
    morphStart: 0.55,
    morphEnd: 1.92,
    cameraZ: 7.2,
    textSide: 'left',
    isContinuation: true,
    stat: { value: 'Solid', label: 'Responsive. World-Class.' },
  },
  {
    id: 'psa-map',
    index: '003',
    title: 'The portal',
    era: 'Philippine Statistics Authority, Oct 2023 — now',
    heightVh: 500,
    morphState: 'archipelago',
    extraStages: ['sdgBars', 'sdgGroupedBars', 'sdgStackedBars', 'phMap'],
    paragraphs: [
      'By October 2023 I landed at the Philippine Statistics Authority, building the CBMS Portal — community-based monitoring data for the whole country.',
    ],
    stageParagraphs: [
      // Stage 0 — archipelago: intro
      [
        'By October 2023 I landed at the Philippine Statistics Authority, building the CBMS Portal — community-based monitoring data for the whole country.',
      ],
      // Stage 1 — sdgBars: learning Vue / TS from vanilla
      [
        'Coming from vanilla HTML, CSS, and JavaScript, adopting Vue 3 and TypeScript demanded more than learning syntax — it meant rethinking how UI is structured.',
        'Components, reactivity, typed contracts. Each pattern had to be earned through use, not just read.',
      ],
      // Stage 2 — sdgGroupedBars: libraries and best practices
      [
        'Best practices in web development are not abstract rules. They are solutions to problems you eventually encounter anyway — and it is better to know them before the problem arrives.',
        'ECharts, Pinia, composables — building the Portal meant learning when each tool earns its place, and when it does not.',
      ],
      // Stage 3 — sdgStackedBars: CBMS data pipeline grind
      [
        'The CBMS data pipeline runs deep: field surveys, collection protocols, tabulation, encoding — before I could visualize anything, I had to understand the whole chain.',
        'I sat with data scientists. I read documentation I was not supposed to need. I shipped visualizations that had to be analytically correct, not just visually clean.',
      ],
      // Stage 4 — phMap: impact on LGUs and researchers
      [
        'The end users are local government units, researchers, data analysts — people making decisions that affect communities. The interface had to be intuitive without being shallow.',
        'Data at this scale, made legible to non-technical audiences without sacrificing the rigor underneath — that is the hardest design problem I have solved.',
      ],
    ],
    interactionHint: 'hover to lift the data — scroll to redraw it',
    // 5 stages × 100vh each; morphStart 0.67 → 67vh hold per segment
    morphStart: 0.67,
    morphEnd: 0.92,
    cameraZ: 7.2,
    textSide: 'right',
    stat: { value: '110M+', label: "Citizens' Data Handled" },
  },
  {
    id: 'projects',
    index: '004',
    title: 'Side quests',
    era: 'Freelance + personal projects',
    heightVh: 500,
    morphState: 'portrait',
    extraStages: ['proj_5'],
    paragraphs: [
      'Off the clock the building continues — freelance Vue work, experiments, this site.',
      'Each project is a station on the road. Step into one to see the case study.',
    ],
    interactionHint: 'hover to see a 3D portrait form',
    // Late window keeps DAVXLOPER from forming over this chapter's text
    morphStart: 0.85,
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
