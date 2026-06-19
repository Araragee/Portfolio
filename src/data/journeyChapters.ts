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
      'Dave Gonzales. Frontend developer. I build interfaces to turn uninteresting  things interesting.',
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
    id: 'psa',
    index: '003',
    title: 'The portal',
    era: 'Philippine Statistics Authority, Oct 2023 — now',
    heightVh: 700,
    morphState: 'cbmsLogo',
    extraStages: ['archipelago', 'sdgBars', 'sdgGroupedBars', 'sdgStackedBars', 'phMap'],
    paragraphs: [
      'By October 2023 I landed at the Philippine Statistics Authority, building the CBMS Portal — community-based monitoring data for the whole country.',
    ],
    stageParagraphs: [
      // Stage 0 — cbmsLogo
      [
        'Vue 3, TypeScript, ECharts. Real-scale government systems.',
        'I built the thing, and became the developer I wanted to be along the way.',
      ],
      // Stage 1 — archipelago
      [
        'By October 2023 I landed at the Philippine Statistics Authority, building the CBMS Portal — community-based monitoring data for the whole country.',
      ],
      // Stage 2 — sdgBars
      [
        'Coming from vanilla HTML, CSS, and JavaScript, adopting Vue 3 and TypeScript demanded more than learning syntax — it meant rethinking how UI is structured.',
        'Components, reactivity, typed contracts. Each pattern had to be earned through use, not just read.',
      ],
      // Stage 3 — sdgGroupedBars
      [
        'Best practices in web development are not abstract rules. They are solutions to problems you eventually encounter anyway — and it is better to know them before the problem arrives.',
        'ECharts, Pinia, composables — building the Portal meant learning when each tool earns its place, and when it does not.',
      ],
      // Stage 4 — sdgStackedBars
      [
        'The CBMS data pipeline runs deep: field surveys, collection protocols, tabulation, encoding — before I could visualize anything, I had to understand the whole chain.',
        'I sat with data scientists. I read documentation I was not supposed to need. I shipped visualizations that had to be analytically correct, not just visually clean.',
      ],
      // Stage 5 — phMap
      [
        'The end users are local government units, researchers, data analysts — people making decisions that affect communities. The interface had to be intuitive without being shallow.',
        'Data at this scale, made legible to non-technical audiences without sacrificing the rigor underneath — that is the hardest design problem I have solved.',
      ],
    ],
    stageStat: [
      { value: 'Philippine Statistics Authority', label: 'Solid. Responsive. World-Class.' }, // cbmsLogo
      null,                                                    // archipelago
      { value: '17', label: 'SDG tables' },                    // sdgBars
      { value: 'Custom', label: 'Dashboard Makers' },          // sdgGroupedBars
      null,                                                    // sdgStackedBars
      { value: 'Interactive', label: 'dashboards for data visualization' }, // phMap
    ],
    stageTitles: [null, 'CBMS Portal', null, 'Lead\nFront-end\nDeveloper', null, null],
    entranceVh: 100,
    interactionHint: 'hover to ripple — scroll to reshape the data',
    morphStart: 0.55,
    morphEnd: 0.92,
    cameraZ: 7.2,
    textSide: 'right',
  },
  {
    id: 'projects',
    index: '004',
    title: 'Side quests',
    era: 'Freelance + personal projects',
    heightVh: 450,
    showProjects: true,
    morphState: 'portrait',
    extraStages: ['proj_5'],
    paragraphs: [
      'Off the clock the building continues — freelance Vue work, experiments, this site.',
      'Each project is a station on the road. Step into one to see the case study.',
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
    index: '005',
    title: 'End of the road',
    era: 'Epilogue',
    heightVh: 200,
    morphState: 'textMass',
    paragraphs: [
      'Everything you scrolled past collapses into one word.',
      'Have a project, a role, or an argument about who\'\s best girl? I read every message.',
    ],
    interactionHint: 'click the name — it explodes, then reforms',
    morphStart: 0.3,
    morphEnd: 0.7,
    cameraZ: 8,
    textSide: 'center',
    fieldOffset: [0, -1.9],
  },
]
