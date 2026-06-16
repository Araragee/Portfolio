import type { Project } from '@/types/caseStudy'

export const projects: Project[] = [
  {
    slug: 'cbms-portal',
    index: '01',
    title: 'CBMS Portal',
    categoryLabel: 'Government / Data Visualization',
    description:
      'Data-visualization portal for the Community-Based Monitoring System at the Philippine Statistics Authority — dashboards, geospatial views, and analyst tooling over national survey data.',
    backgroundImage: new URL('@/assets/projects/cbms-hero.png', import.meta.url).href,
    role: 'Lead Front-end Developer — PSA Central Office',
    stack: 'Vue 3, TypeScript, Pinia, Vuetify, ECharts, D3, Babylon.js, Laravel',
    timeline: '2023 — Present',
    liveUrl: 'https://cbmsportal.psa.gov.ph',
    introStatement:
      'A public-sector analytics portal surfacing CBMS indicators for policymakers and researchers. Built inside the PSA Central Office, the frontend is a typed Vue 3 application that renders millions of rows of municipal survey data through interactive dashboards, geographic layers, and exportable reports.',
    heroImage: new URL('@/assets/projects/cbms-hero.png', import.meta.url).href,
    sections: [
      {
        heading: 'The problem with static PDFs',
        body: 'National survey datasets are large, hierarchical, and politically sensitive. The portal had to let analysts drill from region to province to municipality to barangay without stalling the browser, while enforcing strict data-release rules. Legacy reporting at PSA relied on static PDFs. The ask was to replace that workflow with an interactive, typed, auditable web application.',
      },
      {
        heading: 'How the frontend is put together',
        body: 'A Vue 3 and Pinia core feeds a visualization layer built on ECharts, D3, and Observable Plot. Each chart type is wrapped in a composable so instrumentation, legends, and export behavior stay consistent. Vuetify handles dense data-table surfaces and form-heavy admin views, while Babylon.js powers the 3D geographic scene. A Laravel service brokers auth and data access between the client and the PSA data layer.',
        code: {
          filename: 'composables/useIndicator.ts',
          content: `import { storeToRefs } from 'pinia'
import { useIndicatorStore } from '@/stores/indicator'

export function useIndicator(code: string) {
  const store = useIndicatorStore()
  const { series, loading } = storeToRefs(store)

  async function load(level: GeoLevel, id: string) {
    await store.fetchSeries({ code, level, id })
  }

  return { series, loading, load }
}`,
        },
      },
      {
        heading: 'Where it landed',
        body: 'The portal is now the analyst-facing surface for CBMS rounds at PSA. Render-time for large indicator sets dropped from unusable to sub-second through virtualized tables, throttled store updates, and precomputed aggregates. The typed store layer has kept the codebase stable across schema changes.',
      },
    ],
    gallery: [
      {
        src: new URL('@/assets/projects/cbms-01.png', import.meta.url).href,
        alt: 'Indicator dashboard, region drill-down view',
      },
      {
        src: new URL('@/assets/projects/cbms-02.png', import.meta.url).href,
        alt: 'Indicator dashboard, municipality drill-down view',
      },
    ],
  },
  {
    slug: 'lms-ai-platform',
    index: '02',
    title: 'LMS-AI Platform',
    categoryLabel: 'EdTech / AI Integration',
    description:
      'Adaptive learning management system with real-time AI risk scoring, instructor intervention workflows, and student analytics dashboards.',
    backgroundImage: new URL('@/assets/projects/lms-hero.png', import.meta.url).href,
    role: 'Full-stack Developer',
    stack: 'Vue 3, Pinia, TypeScript, FastAPI, PostgreSQL, Docker',
    timeline: '2025 — Present',
    liveUrl: 'https://lms-ai-frontend.onrender.com/',
    introStatement:
      'A full-stack LMS platform where AI risk models surface at-risk students in real time, enabling instructors to intervene before dropout occurs. Built with a strict TypeScript architecture and Vue 3 Composition API.',
    heroImage: new URL('@/assets/projects/lms-hero.png', import.meta.url).href,
    sections: [
      {
        heading: 'Why risk scores arrive too late',
        body: 'Traditional LMS platforms surface student risk data too late, often only after exam failure. The goal was building a predictive layer that updates in real-time as students interact with course content, surfacing those signals to instructors in a usable workflow.',
      },
      {
        heading: 'Architecture',
        body: 'The frontend separates the AI data layer (Pinia stores with typed API contracts) from the presentation layer. Vue 3 Composition API composables encapsulate real-time polling and risk calculation logic, keeping components declarative and testable. The FastAPI backend and PostgreSQL schema ship together via docker-compose.',
        code: {
          filename: 'stores/riskStore.ts',
          content: `import { defineStore } from 'pinia'
import type { StudentRisk, RiskLevel } from '@/types/risk'

export const useRiskStore = defineStore('risk', () => {
  const students = ref<StudentRisk[]>([])

  async function fetchRiskScores(courseId: number) {
    const response = await api.get(\`/courses/\${courseId}/risk-analysis\`)
    students.value = response.data
  }

  const atRiskStudents = computed(() =>
    students.value.filter(s => s.riskLevel === 'high')
  )

  return { students, atRiskStudents, fetchRiskScores }
})`,
        },
      },
      {
        heading: 'What instructors see now',
        body: 'The resulting dashboards strip away noise to surface actionable signals. Each instructor view is context-aware, showing only the students, sections, and risk indicators relevant to their course load.',
      },
    ],
    gallery: [
      {
        src: new URL('@/assets/projects/lms-01.png', import.meta.url).href,
        alt: 'Instructor dashboard analytics view',
      },
      {
        src: new URL('@/assets/projects/lms-02.png', import.meta.url).href,
        alt: 'Student risk scoring interface',
      },
    ],
  },
  {
    slug: 'nutrisipe',
    index: '03',
    title: 'Nutrisipe',
    categoryLabel: 'Social / Recipe Platform',
    description:
      'A food-first social recipe platform with recipe forking, automatic macro calculations, meal planning, and a real-time social feed. Live on Cloudflare Pages.',
    backgroundImage: new URL('@/assets/projects/nutrisipe-hero.png', import.meta.url).href,
    role: 'Front-end Developer',
    stack: 'React 17, Sanity CMS, Socket.io, Google OAuth, Tailwind',
    timeline: '2023',
    liveUrl: 'https://officialnutrisipe.pages.dev/',
    introStatement:
      'Nutrisipe answers one question — what to cook tonight — with a visual, social-first feed instead of text-heavy blog posts. Recipes are treated as social objects: saveable, remixable, and nutritionally transparent. Users can fork existing recipes into their own variations, plan weekly meals on a drag-and-drop calendar, and generate grocery lists automatically.',
    heroImage: new URL('@/assets/projects/nutrisipe-hero.png', import.meta.url).href,
    sections: [
      {
        heading: 'The daily dinner question',
        body: 'Most recipe platforms are built for discovery but not for follow-through. Nutrisipe was designed to answer one question — what to cook tonight — with a visual, social-first feed rather than text-heavy blog posts. The framing treats recipes as social objects: saveable, remixable, and discussable, with food photography as the hero rather than advertising.',
      },
      {
        heading: 'Recipe forking and nutrition math',
        body: "The platform's signature mechanic is recipe forking: users take an existing recipe, swap ingredients, and save a derivative with a credit trail back to the original. Every fork inherits and recalculates the nutrition profile automatically. Macros — calories, protein, fats, carbs — are computed per serving from a managed ingredient database, so no manual entry is required. Users can drag saved recipes into a weekly meal planner and generate a grocery list from it.",
      },
      {
        heading: 'Admin and content layer',
        body: 'An admin suite provides real-time platform analytics, user management, and a database editor for the global ingredient records that power macro calculations. Authentication is federated through Google OAuth. The content layer is managed through Sanity CMS with image assets served from its CDN, absorbing content-model changes without migrations on the client.',
      },
    ],
    gallery: [
      {
        src: new URL('@/assets/projects/nutrisipe-01.png', import.meta.url).href,
        alt: 'Home feed with recipe cards',
      },
      {
        src: new URL('@/assets/projects/nutrisipe-02.png', import.meta.url).href,
        alt: 'Explore recipes view',
      },
      {
        src: new URL('@/assets/projects/nutrisipe-03.png', import.meta.url).href,
        alt: 'Weekly meal planner',
      },
      {
        src: new URL('@/assets/projects/nutrisipe-04.png', import.meta.url).href,
        alt: 'Admin analytics dashboard',
      },
      {
        src: new URL('@/assets/projects/nutrisipe-05.png', import.meta.url).href,
        alt: 'Admin user management',
      },
      {
        src: new URL('@/assets/projects/nutrisipe-06.png', import.meta.url).href,
        alt: 'Ingredient database editor',
      },
    ],
  },
  {
    slug: 'tango',
    index: '04',
    title: 'Tango',
    categoryLabel: 'Personal / Progressive Web App',
    description:
      'A couples-first PWA for shared budgeting, goal tracking, todos, and a shared calendar, with real-time sync via Supabase channels and a demo mode fallback.',
    backgroundImage: new URL('@/assets/projects/tango-hero.png', import.meta.url).href,
    role: 'Solo Developer',
    stack: 'Vue 3, TypeScript, Tailwind v4, Pinia, Supabase, Vite PWA',
    timeline: '2025 — Present',
    liveUrl: 'https://takes22tango.netlify.app/',
    repoUrl: 'https://github.com/Araragee/Tango',
    introStatement:
      'Tango is a couples-first progressive web app built to replace scattered spreadsheets and notes with one shared surface. Budget together, split goal contributions, track todos with handoff logic, and coordinate on a shared calendar, all synced in real time through Supabase channels. A demo mode activates automatically when Supabase is unconfigured, making the app fully presentable without a live backend.',
    heroImage: new URL('@/assets/projects/tango-hero.png', import.meta.url).href,
    sections: [
      {
        heading: 'The scattered surfaces problem',
        body: 'Couples managing money and shared commitments typically split across multiple apps: a budgeting tool here, a shared note there, a calendar somewhere else. None of these surfaces talk to each other, and none of them are designed for two people operating as a unit. Tango was built to be that single surface.',
      },
      {
        heading: 'PWA architecture',
        body: 'The frontend is a strictly typed Vue 3 and Pinia application compiled as a PWA via vite-plugin-pwa. Each domain (budget, goals, todos, calendar) lives in its own Pinia store with typed API contracts against Supabase. Realtime updates are pushed through Supabase channels and merged into store state directly without polling. A composable-level demo mode layer intercepts all store reads and writes when the app is run without credentials, keeping the full UI exercisable in a presentation context.',
        code: {
          filename: 'composables/useDemoMode.ts',
          content: `import { inject } from 'vue'
import type { DemoContext } from '@/types/demo'

export function useDemoMode() {
  const demo = inject<DemoContext>('demo')
  const isDemo = computed(() => demo?.active ?? false)

  function guard<T>(live: () => T, fallback: T): T {
    return isDemo.value ? fallback : live()
  }

  return { isDemo, guard }
}`,
        },
      },
      {
        heading: 'Shipped features',
        body: 'Phase 1–19 of development shipped across 30+ bug fixes and a full feature set: recurring transactions, smart todo handoff, goal contribution splits, and a Vibe Check module. UTC date drift was caught and patched globally via a shared dateUtils composable. The app is installable as a PWA on mobile and desktop.',
      },
    ],
    gallery: [
      {
        src: new URL('@/assets/projects/tango-01.png', import.meta.url).href,
        alt: 'Budget dashboard — desktop',
      },
      {
        src: new URL('@/assets/projects/tango-02.png', import.meta.url).href,
        alt: 'Savings goals and plans — desktop',
      },
      {
        src: new URL('@/assets/projects/tango-03.png', import.meta.url).href,
        alt: 'Shared todos with handoff logic — desktop',
      },
      {
        src: new URL('@/assets/projects/tango-04.png', import.meta.url).href,
        alt: 'Shared calendar — desktop',
      },
      {
        src: new URL('@/assets/projects/tango-05.png', import.meta.url).href,
        alt: 'Budget dashboard — mobile',
      },
      {
        src: new URL('@/assets/projects/tango-06.png', import.meta.url).href,
        alt: 'Plans — mobile',
      },
      {
        src: new URL('@/assets/projects/tango-07.png', import.meta.url).href,
        alt: 'Todos — mobile',
      },
      {
        src: new URL('@/assets/projects/tango-08.png', import.meta.url).href,
        alt: 'Calendar — mobile',
      },
    ],
  },
  {
    slug: 'accomplisher',
    index: '05',
    title: 'Accomplisher',
    categoryLabel: 'Productivity / Desktop App',
    description:
      'A local-first Tauri desktop app for PSA developers to generate semi-monthly payroll accomplishment reports, log WFH output, and track IPCR coverage.',
    backgroundImage: new URL('@/assets/projects/accomplisher-hero.png', import.meta.url).href,
    role: 'Solo Developer — Personal Tool',
    stack: 'Tauri, React, TypeScript, SQLite',
    timeline: '2025 — Present',
    repoUrl: 'https://github.com/Araragee/Accomplisher',
    introStatement:
      'Accomplisher is a local-first desktop app that replaces the twice-a-month scramble of writing payroll accomplishment reports from memory. Built with Tauri and React, it runs entirely on-device with no server or login. Everything lives in a local SQLite database. The interface is designed for a productive person who is caught up, not one who is behind and panicking.',
    heroImage: new URL('@/assets/projects/accomplisher-hero.png', import.meta.url).href,
    sections: [
      {
        heading: 'Fixing the payroll scramble',
        body: 'Government developers at PSA file accomplishment reports every semi-monthly payroll cutoff (11–25 and 26–10). Without tooling, this means reconstructing two weeks of work from memory minutes before the deadline. IPCR target coverage is tracked separately, if at all. WFH logs live in a different place from in-office logs. The accumulation of friction makes every cutoff stressful.',
      },
      {
        heading: 'Paper planner aesthetics',
        body: 'The interface draws from the aesthetic of a well-kept paper planner: generous whitespace, soft sage-tinted neutrals, one warm terracotta accent for actions and current state. Flat surfaces, hairline borders, no glow, no glass. This was a deliberate inversion of the previous dark-navy-neon-glassmorphism build. Anti-references were explicitly written into the product spec to keep the design honest.',
      },
      {
        heading: 'Tauri local-first build',
        body: 'Three modules ship in the first version: the accomplishment maker (generates formatted report text for both cutoffs and custom ranges), the WFH log (daily output logged against IPCR commitment hours), and the Task Thinker (lightweight on-device suggestions reasoned from each person\'s IPCR targets and recent logged work). The Tauri shell gives native file access and OS-level window chrome without a web server dependency.',
      },
    ],
    gallery: [
      {
        src: new URL('@/assets/projects/accomplisher-01.png', import.meta.url).href,
        alt: 'Accomplisher report view',
      },
      {
        src: new URL('@/assets/projects/accomplisher-02.png', import.meta.url).href,
        alt: 'Accomplisher IPCR coverage tracker',
      },
    ],
  },
  {
    slug: 'smc',
    index: '06',
    title: "Sernan's Music Clinic",
    categoryLabel: 'Freelance / Business App',
    description:
      "A full-stack scheduling and enrollment platform for a music school. Three role-scoped surfaces — Admin, Teacher, Student — with a negotiation-based booking engine, HMAC-signed uploads, and Docker-containerized deployment.",
    backgroundImage: new URL('@/assets/projects/smc-hero.png', import.meta.url).href,
    role: 'Full-stack Developer',
    stack: 'Vue 3, TypeScript, Pinia, Tailwind, FastAPI, PostgreSQL, Docker',
    timeline: '2025',
    repoUrl: 'https://github.com/Araragee/SMC',
    introStatement:
      "A bespoke web app built for Sernan's Music Clinic to replace manual scheduling and paper enrollment records. Three distinct role surfaces — Admin, Teacher, and Student — each scoped to their own workflows. The admin manages rosters, schedules, and clinic settings. Teachers view and confirm their sessions. Students browse lesson packages, enroll, and track their history. Backed by a FastAPI service, PostgreSQL, and fully containerized via Docker.",
    heroImage: new URL('@/assets/projects/smc-hero.png', import.meta.url).href,
    sections: [
      {
        heading: 'Moving off spreadsheets',
        body: "The clinic was managing lesson bookings, teacher assignments, and student enrollment across spreadsheets and messaging apps — fragile, manual, and opaque to everyone involved. The ask was a web app that gives the admin a single control surface, teachers visibility into their schedule, and students a self-service layer for enrollment and session history.",
      },
      {
        heading: 'Scheduling negotiation engine',
        body: 'Bookings go through a structured negotiation: students propose a time, teachers can counter-propose, and the system caps counter-proposals at three rounds before escalating deadlocked sessions to an admin. Operating-hours enforcement blocks non-admin users from scheduling outside clinic hours. Admins get a drag-and-drop calendar with day, week, and month views. All participants can self-cancel up to 24 hours before a session.',
      },
      {
        heading: 'Security hardening',
        body: 'HMAC-signed upload URLs expire after one hour, keeping homework submissions and lesson proof files out of unauthorized hands. JWT refresh tokens live in HttpOnly cookies rather than JavaScript storage. A first-login gate forces newly created accounts to change their password immediately. All endpoints enforce strict character limits, range constraints, and password strength requirements. Uploaded images are automatically stripped of EXIF metadata, converted to WebP, and downscaled to a 2000px max edge before storage.',
      },
    ],
    gallery: [
      {
        src: new URL('@/assets/projects/smc-01.png', import.meta.url).href,
        alt: 'Login page',
      },
      {
        src: new URL('@/assets/projects/smc-02.png', import.meta.url).href,
        alt: 'Admin schedule management',
      },
      {
        src: new URL('@/assets/projects/smc-03.png', import.meta.url).href,
        alt: 'Admin student roster',
      },
      {
        src: new URL('@/assets/projects/smc-04.png', import.meta.url).href,
        alt: 'Teacher dashboard',
      },
      {
        src: new URL('@/assets/projects/smc-05.png', import.meta.url).href,
        alt: 'Teacher schedule view',
      },
      {
        src: new URL('@/assets/projects/smc-06.png', import.meta.url).href,
        alt: 'Teacher shop',
      },
      {
        src: new URL('@/assets/projects/smc-07.png', import.meta.url).href,
        alt: 'Student dashboard',
      },
      {
        src: new URL('@/assets/projects/smc-08.png', import.meta.url).href,
        alt: 'Student schedule view',
      },
      {
        src: new URL('@/assets/projects/smc-09.png', import.meta.url).href,
        alt: 'Student shop — lesson packages',
      },
    ],
  },
]

/**
 * Projects that appear as particle-hero "stations" in the journey deck, in
 * scroll order. Single source of truth shared by ProjectDeck (cards),
 * ParticleField (hero formation per project) and the journey store (count) —
 * so the pinned card, its floating token, and the big picture always agree.
 *
 * Accomplisher is intentionally absent: it has no logo asset, so it can't be a
 * particle hero. It still lives in `projects` for its case-study page.
 * Each `icon` must exist under public/assets.
 */
export const journeyDeckProjects = (
  [
    { slug: 'cbms-portal', icon: '/assets/cbmsportal-favicon.svg' },
    { slug: 'lms-ai-platform', icon: '/assets/lms-ai-icon.svg' },
    { slug: 'nutrisipe', icon: '/assets/nutrisipe-logo.svg' },
    { slug: 'tango', icon: '/assets/tango-icon.png' },
    { slug: 'smc', icon: '/assets/smc-logo.png' },
  ] as const
).map((d) => ({ ...projects.find((p) => p.slug === d.slug)!, icon: d.icon }))

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug)
}

export function getNextProject(slug: string): Project | undefined {
  const idx = projects.findIndex(p => p.slug === slug)
  return projects[(idx + 1) % projects.length]
}
