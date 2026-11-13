import type { JourneyChapter } from '@/types/journey'

/**
 * Chapter content for "Boring, made interesting".
 * Thesis: permits, statistics, paperwork — dull subjects, made worth looking at.
 * Copy rule: one or two short lines per stage; long-form lives in case studies.
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

export const journeyChapters: JourneyChapter[] = [
  {
    id: 'prologue',
    index: '000',
    title: 'Boring, made interesting',
    era: 'Prologue',
    heightVh: 150,
    morphState: 'daveGonzales',
    paragraphs: [
      'Permits. Statistics. Paperwork. Nobody queues up to look at those.',
      'Dave Gonzales. Frontend developer. I turn uninteresting things into interfaces people want to use.',
    ],
    interactionHint: 'move cursor — the name scatters',
    morphStart: 0.55,
    morphEnd: 0.95,
    cameraZ: 8,
    textSide: 'left',
    layout: 'hero',
    fieldOffset: [-2.2, 0.3],
  },
  {
    id: 'student',
    index: '001',
    title: 'Recursion at 2am',
    era: 'CS student',
    heightVh: 200,
    morphState: 'bonsai',
    paragraphs: [
      'School gave me the vocabulary, not the fluency.',
      'Fluency came from building — static pages, then jQuery, then Vue. Most of it never shipped.',
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
      'Three months of web design: the first time I got paid to care about pixels.',
      'Wireframes, layouts, and shipping something a client actually sees.',
    ],
    interactionHint: 'drag the bill — particles ripple and wave',
    morphStart: 0.55,
    morphEnd: 0.95,
    cameraZ: 8,
    textSide: 'left',
  },
  {
    id: 'psa',
    index: '003',
    title: 'Statistics, made readable',
    era: 'Philippine Statistics Authority, Oct 2023 — Jul 2026',
    heightVh: 300,
    // Opens on the boring "before" (grey spreadsheet), then becomes the portal.
    morphState: 'rawTable',
    extraStages: ['sdgBars', 'phMap'],
    boringFirst: true,
    world: { bg: '#D3ECE6' },
    paragraphs: ['Survey tables. Thousands of rows, read by almost nobody.'],
    stageParagraphs: [
      // Stage 0 — rawTable (before)
      ['Survey tables. Thousands of rows, read by almost nobody.'],
      // Stage 1 — sdgBars
      ['Lead front-end on the CBMS Portal: the same numbers, as live charts anyone can read.'],
      // Stage 2 — phMap
      ['Region to barangay in a click, for the people deciding what communities get.'],
    ],
    stageStat: [
      { value: 'Before', label: 'static PDFs and spreadsheets' }, // rawTable
      { value: '17', label: 'SDG tables, charted' }, // sdgBars
      { value: 'Nationwide', label: 'interactive dashboards' }, // phMap
    ],
    entranceVh: 100,
    interactionHint: 'hover to ripple — scroll to reshape the data',
    morphStart: 0.55,
    morphEnd: 0.92,
    cameraZ: 7.2,
    textSide: 'right',
  },
  {
    id: 'dhsud',
    index: '004',
    title: 'Paperwork, rebuilt',
    era: 'DHSUD, Jul 2026 — now',
    heightVh: 300,
    // Opens on the boring "before" (paper strewn on a desk), then becomes e-Permits.
    morphState: 'paperStack',
    extraStages: ['epermits'],
    boringFirst: true,
    world: { bg: '#D9E4FB' },
    paragraphs: ['Permit applications travelled desk to desk as paper.'],
    stageParagraphs: [
      // Stage 0 — paperStack (before)
      ['Permit applications travelled desk to desk as paper. Nobody could say where a case sat.'],
      // Stage 1 — epermits
      ['Now full-stack on e-Permits: every DHSUD desk on one live case file.'],
    ],
    stageStat: [
      { value: 'Before', label: 'folders walking the hallway' }, // paperStack
      { value: '15 days', label: 'service clock, kept honest' }, // epermits
    ],
    interactionHint: 'hover — the office lifts off the page',
    morphStart: 0.55,
    morphEnd: 0.95,
    cameraZ: 8,
    textSide: 'left',
  },
  {
    id: 'projects',
    index: '005',
    title: 'Side quests',
    era: 'Freelance + personal projects',
    heightVh: 500,
    showProjects: true,
    morphState: 'portrait',
    extraStages: ['proj_6'],
    paragraphs: [
      'Off the clock the building continues.',
      'Each project is a station. Step into one for the case study.',
    ],
    interactionHint: 'scroll to advance — click to enter',
    // Late window keeps DAVXLOPER from forming over this chapter's text
    morphStart: 0.85,
    morphEnd: 0.98,
    cameraZ: 8,
    textSide: 'right',
    fieldOffset: [-2.8, 0],
  },
  {
    id: 'epilogue',
    index: '006',
    title: 'Bring the boring',
    era: 'Epilogue',
    heightVh: 200,
    morphState: 'textMass',
    paragraphs: [
      'Everything you scrolled past collapses into one word.',
      'Have a project, a role, or an argument about who\'s best girl? I read every message.',
    ],
    interactionHint: 'click the name — it explodes, then reforms',
    morphStart: 0.3,
    morphEnd: 0.7,
    cameraZ: 8,
    textSide: 'center',
    fieldOffset: [0, -1.9],
  },
]
